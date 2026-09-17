import { Github, ExternalLink, Lock, Mail } from "lucide-react";
import type { PortfolioProject } from "@/lib/portfolio";

const CONTACT_EMAIL = "rmikulec.dev@gmail.com";

const btn =
  "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-200 ring-1 ring-inset ring-white/15 transition-colors hover:bg-white/5";

/** A mailto: link pre-filled to request a demo of a specific project. */
function demoMailto(projectName: string): string {
  const subject = `Demo request: ${projectName}`;
  const body =
    `Hi Ryan,\n\n` +
    `I'd like to request a demo of ${projectName}. Here's a bit about me and what I'm interested in:\n\n\n` +
    `Thanks!`;
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Renders a project's action links as a row of buttons: the repo ("Code") for
 * public projects, or a "Request demo" mailto for private ones, plus an optional
 * demo and any custom `links`. Dropped into a card / carousel / modal / detail
 * alongside a primary action.
 */
export default function ProjectLinks({ project }: { project: PortfolioProject }) {
  const links = project.links ?? [];
  return (
    <>
      {project.private ? (
        <>
          <span
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-400 ring-1 ring-inset ring-white/10"
            title="Source is private"
          >
            <Lock className="size-4" /> Private
          </span>
          <a href={demoMailto(project.name)} className={btn}>
            <Mail className="size-4" /> Request demo
          </a>
        </>
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
