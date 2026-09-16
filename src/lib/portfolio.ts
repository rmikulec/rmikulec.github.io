import { z } from "zod";

/**
 * Schema for a `.portfolio` file. Any repo (public or private) that contains a
 * `.portfolio` JSON file at its root is surfaced as a project on the site.
 *
 * See docs/portfolio-example.json for a reference file.
 */
export const ProjectSchema = z.object({
  /** Project title. */
  name: z.string().min(1),
  /**
   * One-liner shown on the card. Optional for backward-compatibility with older
   * `.portfolio` files — falls back to the first line of `description`, then the
   * name (see deriveTagline / normalizeProject).
   */
  tagline: z.string().min(1).optional(),
  /** Markdown body shown on the project detail view. */
  description: z.string().default(""),
  /** Repo / canonical link. */
  url: z.string().url(),
  /** Optional live-demo URL. */
  demo: z.string().url().nullish(),
  /** Tech tags, e.g. ["python", "nextjs"]. */
  tags: z.array(z.string()).default([]),
  /** Hex accent color for the card & detail page. */
  color: z
    .string()
    .regex(/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "color must be a hex value")
    .default("#0066cc"),
  /** Sort weight — lower shows first; omit to leave un-featured. */
  featured: z.number().nullish(),
  /** Lifecycle badge. */
  status: z.enum(["active", "wip", "archived"]).default("active"),
});

export type Project = z.infer<typeof ProjectSchema>;

/**
 * A project enriched with a URL-safe slug derived from its name, used for the
 * static per-project detail routes (`/projects/[slug]`).
 */
export type PortfolioProject = Project & { slug: string; tagline: string };

/** First meaningful line of a markdown string, stripped of `#`/list markers. */
export function deriveTagline(description: string): string {
  const line = description
    .split("\n")
    .map((l) => l.replace(/^[#>\-*\s]+/, "").trim())
    .find((l) => l.length > 0);
  if (!line) return "";
  return line.length > 120 ? line.slice(0, 117).trimEnd() + "…" : line;
}

/**
 * Fill in a guaranteed `tagline` and `slug` so the rest of the app can rely on
 * them. Keeps older `.portfolio` files (name/description/url only) working.
 */
export function normalizeProject(project: Project): PortfolioProject {
  const tagline =
    project.tagline?.trim() ||
    deriveTagline(project.description) ||
    project.name;
  return { ...project, tagline, slug: slugify(project.name) };
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Sort projects: featured first (ascending weight), then the rest
 * alphabetically. Un-featured projects are treated as +Infinity.
 */
export function sortProjects(projects: PortfolioProject[]): PortfolioProject[] {
  return [...projects].sort((a, b) => {
    const fa = a.featured ?? Number.POSITIVE_INFINITY;
    const fb = b.featured ?? Number.POSITIVE_INFINITY;
    if (fa !== fb) return fa - fb;
    return a.name.localeCompare(b.name);
  });
}
