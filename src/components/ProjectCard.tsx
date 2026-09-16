"use client";

import Link from "next/link";
import { Github, ExternalLink, ArrowUpRight } from "lucide-react";
import type { PortfolioProject } from "@/lib/portfolio";
import { rgba } from "@/lib/color";
import StatusBadge from "./StatusBadge";

type Props = {
  project: PortfolioProject;
  variant?: "featured" | "compact";
  onQuickView?: (project: PortfolioProject) => void;
};

export default function ProjectCard({ project, variant = "compact", onQuickView }: Props) {
  const featured = variant === "featured";
  const { color } = project;

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-white/20 ${
        featured ? "p-7 sm:p-8" : "p-6"
      }`}
      style={{
        boxShadow: `0 1px 0 0 ${rgba(color, 0.15)} inset`,
      }}
    >
      {/* accent glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full opacity-40 blur-3xl transition-opacity duration-300 group-hover:opacity-70"
        style={{ background: rgba(color, 0.6) }}
      />
      {/* accent top bar */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-1"
        style={{ background: `linear-gradient(90deg, ${color}, ${rgba(color, 0)})` }}
      />

      <div className="relative flex items-start justify-between gap-3">
        <Link
          href={`/projects/${project.slug}`}
          className="flex items-center gap-1.5 font-semibold text-white hover:text-sky-300"
        >
          <h3 className={featured ? "text-2xl" : "text-lg"}>{project.name}</h3>
          <ArrowUpRight className="size-4 opacity-0 transition-opacity group-hover:opacity-70" />
        </Link>
        <StatusBadge status={project.status} />
      </div>

      <p className={`relative mt-2 text-slate-300 ${featured ? "text-base" : "text-sm"}`}>
        {project.tagline}
      </p>

      {project.tags.length > 0 && (
        <ul className="relative mt-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full px-2.5 py-0.5 text-xs font-medium text-slate-200 ring-1 ring-inset ring-white/15"
              style={{ background: rgba(color, 0.14) }}
            >
              {tag}
            </li>
          ))}
        </ul>
      )}

      <div className="relative mt-5 flex flex-wrap items-center gap-2 pt-1">
        {onQuickView && (
          <button
            type="button"
            onClick={() => onQuickView(project)}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-white transition-colors"
            style={{ background: rgba(color, 0.9) }}
          >
            Details
          </button>
        )}
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-200 ring-1 ring-inset ring-white/15 transition-colors hover:bg-white/5"
        >
          <Github className="size-4" /> Code
        </a>
        {project.demo && (
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-200 ring-1 ring-inset ring-white/15 transition-colors hover:bg-white/5"
          >
            <ExternalLink className="size-4" /> Demo
          </a>
        )}
      </div>
    </article>
  );
}
