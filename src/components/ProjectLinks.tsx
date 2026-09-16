import { Github, ExternalLink, Lock } from "lucide-react";
import type { PortfolioProject } from "@/lib/portfolio";

const btn =
  "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-200 ring-1 ring-inset ring-white/15 transition-colors hover:bg-white/5";

/**
 * Renders a project's external links as a row of buttons: the repo ("Code")
 * unless it's private, an optional demo, and any custom `links`. Meant to be
 * dropped into a card / carousel / modal / detail alongside a primary action.
 */
export default function ProjectLinks({ project }: { project: PortfolioProject }) {
  const links = project.links ?? [];
  return (
    <>
      {project.private ? (
        <span
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-400 ring-1 ring-inset ring-white/10"
          title="Source is private"
        >
          <Lock className="size-4" /> Private
        </span>
      ) : (
        <a href={project.url} target="_blank" rel="noopener noreferrer" className={btn}>
          <Github className="size-4" /> Code
        </a>
      )}
      {project.demo && (
        <a href={project.demo} target="_blank" rel="noopener noreferrer" className={btn}>
          <ExternalLink className="size-4" /> Demo
        </a>
      )}
      {links.map((l) => (
        <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className={btn}>
          <ExternalLink className="size-4" /> {l.label}
        </a>
      ))}
    </>
  );
}
