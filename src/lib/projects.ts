import data from "@/data/projects.json";
import type { PortfolioProject } from "./portfolio";

/** All projects, already sorted (featured-first) by the build-time script. */
export const projects = data as PortfolioProject[];

/**
 * Projects highlighted in the "Featured" section: those with an explicit
 * `featured` weight, or — if none are marked — the top few after sorting so the
 * section is never empty.
 */
export const featuredProjects: PortfolioProject[] = (() => {
  // Archived projects are never featured in the carousel (they still appear in
  // the full grid with an "Archived" badge).
  const active = projects.filter((p) => p.status !== "archived");
  const explicit = active.filter((p) => p.featured != null);
  if (explicit.length > 0) return explicit;
  return active.slice(0, Math.min(3, active.length));
})();

/** Unique tags across all projects, sorted by frequency then name. */
export const allTags: string[] = (() => {
  const counts = new Map<string, number>();
  for (const p of projects) {
    for (const t of p.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([t]) => t);
})();

export function getProject(slug: string): PortfolioProject | undefined {
  return projects.find((p) => p.slug === slug);
}
