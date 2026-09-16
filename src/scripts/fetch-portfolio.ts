/**
 * Build-time collector for the portfolio.
 *
 * Lists the configured user's GitHub repos (public, and private too when a token
 * is provided), reads each repo's root `.portfolio` file, validates it against
 * ProjectSchema, and writes the sorted result to `src/data/projects.json`.
 *
 * Run via the npm `predev`/`prebuild` hooks, or directly:
 *   GH_PORTFOLIO_TOKEN=... npx tsx scripts/fetch-portfolio.ts
 *
 * GH_PORTFOLIO_TOKEN may be a comma-separated list of tokens — useful because a
 * fine-grained token is scoped to a single owner, so covering both your account
 * and an org can need two tokens. Each repo is fetched with a token proven able
 * to list it.
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
// One OR MANY tokens (comma-separated). Fine-grained tokens are scoped to a
// single owner, so covering both your account and an org (e.g. ARRM-Studios)
// can require two tokens: set GH_PORTFOLIO_TOKEN="personalTok,orgTok".
const TOKENS = (process.env.GH_PORTFOLIO_TOKEN || process.env.GITHUB_TOKEN || "")
  .split(",")
  .map((t) => t.trim())
  .filter(Boolean);
const OUT_FILE = join(process.cwd(), "data", "projects.json");

function headersFor(token?: string): Record<string, string> {
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

interface Repo {
  full_name: string;
  private: boolean;
}

/** A repo paired with a token known to be able to read it. */
interface RepoRef {
  full_name: string;
  token?: string;
}

/** Fetch every page of a paginated list endpoint with a given token. */
async function paginate<T>(baseUrl: string, token?: string): Promise<T[]> {
  const out: T[] = [];
  for (let page = 1; ; page++) {
    const sep = baseUrl.includes("?") ? "&" : "?";
    const res = await fetch(`${baseUrl}${sep}per_page=100&page=${page}`, {
      headers: headersFor(token),
    });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const batch = (await res.json()) as T[];
    out.push(...batch);
    if (batch.length < 100) break;
  }
  return out;
}

/** Collect repos reachable by a single token (its account + orgs it can see). */
async function listReposForToken(token: string, into: Map<string, RepoRef>) {
  const add = (r: Repo) => {
    if (!into.has(r.full_name)) into.set(r.full_name, { full_name: r.full_name, token });
  };

  // 1) Everything the token is directly affiliated with.
  (
    await paginate<Repo>(
      "https://api.github.com/user/repos?affiliation=owner,collaborator,organization_member&sort=updated",
      token,
    )
  ).forEach(add);

  // 2) Also enumerate each org the token can see and list its repos directly.
  try {
    const orgs = await paginate<{ login: string }>("https://api.github.com/user/orgs", token);
    for (const org of orgs) {
      try {
        (
          await paginate<Repo>(`https://api.github.com/orgs/${org.login}/repos?type=all`, token)
        ).forEach(add);
      } catch (e) {
        console.warn(
          `  ! token can't list repos for org "${org.login}" (${(e as Error).message})`,
        );
      }
    }
  } catch (e) {
    console.warn(`  ! could not list orgs for a token (${(e as Error).message})`);
  }
}

async function listRepos(): Promise<RepoRef[]> {
  // Unauthenticated: just the user's public repos.
  if (TOKENS.length === 0) {
    const repos = await paginate<Repo>(
      `https://api.github.com/users/${USERNAME}/repos?sort=updated`,
    );
    return repos.map((r) => ({ full_name: r.full_name }));
  }

  const byName = new Map<string, RepoRef>();
  for (const token of TOKENS) {
    await listReposForToken(token, byName);
  }
  return [...byName.values()];
}

async function fetchPortfolio(ref: RepoRef): Promise<PortfolioProject | null> {
  const { full_name: fullName, token } = ref;
  const url = `https://api.github.com/repos/${fullName}/contents/.portfolio`;
  const res = await fetch(url, { headers: headersFor(token) });
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
    `Collecting .portfolio files for "${USERNAME}"` +
      (TOKENS.length === 0
        ? " (public only — no token)…"
        : ` (${TOKENS.length} token${TOKENS.length > 1 ? "s" : ""}, incl. private)…`),
  );

  const repos = await listRepos();
  console.log(`  found ${repos.length} repos`);

  const results = await Promise.all(repos.map((r) => fetchPortfolio(r)));

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
