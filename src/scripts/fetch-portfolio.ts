/**
 * Build-time collector for the portfolio.
 *
 * Lists the configured user's GitHub repos (public, and private too when a token
 * is provided), reads each repo's root `.portfolio` file, validates it against
 * ProjectSchema, and writes the sorted result to `src/data/projects.json`.
 *
 * Run via the npm `predev`/`prebuild` hooks, or directly:
 *   GITHUB_TOKEN=... npx tsx scripts/fetch-portfolio.ts
 *
 * Never called from the browser — the deployed site is fully static.
 */
import { writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import {
  ProjectSchema,
  normalizeProject,
  sortProjects,
  type PortfolioProject,
} from "../lib/portfolio";

const USERNAME = process.env.GITHUB_USERNAME || "rmikulec";
const TOKEN = process.env.GITHUB_TOKEN || process.env.GH_PORTFOLIO_TOKEN || "";
const OUT_FILE = join(process.cwd(), "data", "projects.json");

const headers: Record<string, string> = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
};

interface Repo {
  full_name: string;
  private: boolean;
}

/** Fetch every page of a paginated list endpoint. */
async function paginate<T>(baseUrl: string): Promise<T[]> {
  const out: T[] = [];
  for (let page = 1; ; page++) {
    const sep = baseUrl.includes("?") ? "&" : "?";
    const res = await fetch(`${baseUrl}${sep}per_page=100&page=${page}`, { headers });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const batch = (await res.json()) as T[];
    out.push(...batch);
    if (batch.length < 100) break;
  }
  return out;
}

async function listRepos(): Promise<Repo[]> {
  // Unauthenticated: just the user's public repos.
  if (!TOKEN) {
    return paginate<Repo>(`https://api.github.com/users/${USERNAME}/repos?sort=updated`);
  }

  const byName = new Map<string, Repo>();
  const add = (r: Repo) => byName.set(r.full_name, r);

  // 1) Everything the token is directly affiliated with (owner, collaborator,
  //    and repos in orgs the token can see).
  (
    await paginate<Repo>(
      "https://api.github.com/user/repos?affiliation=owner,collaborator,organization_member&sort=updated",
    )
  ).forEach(add);

  // 2) Also enumerate each org the user belongs to and list its repos directly.
  //    This is a second path to org repos (e.g. ARRM-Studios) in case they were
  //    missed above. A 403 here is the tell-tale sign the token lacks org access.
  try {
    const orgs = await paginate<{ login: string }>("https://api.github.com/user/orgs");
    for (const org of orgs) {
      try {
        (
          await paginate<Repo>(`https://api.github.com/orgs/${org.login}/repos?type=all`)
        ).forEach(add);
      } catch (e) {
        console.warn(
          `  ! could not list repos for org "${org.login}" (${(e as Error).message}) — the token may not have access to this org`,
        );
      }
    }
  } catch (e) {
    console.warn(`  ! could not list your orgs (${(e as Error).message})`);
  }

  return [...byName.values()];
}

async function fetchPortfolio(fullName: string): Promise<PortfolioProject | null> {
  const url = `https://api.github.com/repos/${fullName}/contents/.portfolio`;
  const res = await fetch(url, { headers });
  if (res.status === 404) return null; // no .portfolio file — normal, skip
  if (!res.ok) {
    console.warn(`  ! ${fullName}: ${res.status} ${res.statusText} — skipped`);
    return null;
  }

  const data = (await res.json()) as { content?: string };
  if (!data.content) return null;

  const decoded = Buffer.from(data.content, "base64").toString("utf-8");

  let raw: unknown;
  try {
    raw = JSON.parse(decoded);
  } catch {
    console.warn(`  ! ${fullName}: .portfolio is not valid JSON — skipped`);
    return null;
  }

  const parsed = ProjectSchema.safeParse(raw);
  if (!parsed.success) {
    console.warn(
      `  ! ${fullName}: .portfolio failed validation — skipped\n    ${parsed.error.issues
        .map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`)
        .join("\n    ")}`,
    );
    return null;
  }

  return normalizeProject(parsed.data);
}

async function main() {
  console.log(
    `Collecting .portfolio files for "${USERNAME}"${TOKEN ? " (authenticated, incl. private)" : " (public only — no token)"}…`,
  );

  const repos = await listRepos();
  console.log(`  found ${repos.length} repos`);

  const results = await Promise.all(
    repos.map((r) => fetchPortfolio(r.full_name)),
  );

  const projects = sortProjects(
    results.filter((p): p is PortfolioProject => p !== null),
  );

  // De-dupe slugs so detail routes stay unique.
  const seen = new Set<string>();
  for (const p of projects) {
    let slug = p.slug;
    let n = 2;
    while (seen.has(slug)) slug = `${p.slug}-${n++}`;
    seen.add(slug);
    p.slug = slug;
  }

  await mkdir(join(process.cwd(), "data"), { recursive: true });
  await writeFile(OUT_FILE, JSON.stringify(projects, null, 2) + "\n", "utf-8");
  console.log(`✓ wrote ${projects.length} projects → data/projects.json`);
}

main().catch(async (err) => {
  // Non-fatal: don't block dev/build on a network hiccup or missing token.
  // Fall back to whatever data/projects.json is already committed; only seed an
  // empty list if the file doesn't exist yet.
  console.warn(`⚠ Could not refresh portfolio data (${err.message}).`);
  console.warn("  Keeping the existing data/projects.json.");
  if (!existsSync(OUT_FILE)) {
    await mkdir(join(process.cwd(), "data"), { recursive: true });
    await writeFile(OUT_FILE, "[]\n", "utf-8");
    console.warn("  (none found — wrote an empty list)");
  }
  process.exit(0);
});
