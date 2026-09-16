"use client";

import { useMemo, useState } from "react";
import type { PortfolioProject } from "@/lib/portfolio";
import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";

export default function ProjectExplorer({
  projects,
  tags,
}: {
  projects: PortfolioProject[];
  tags: string[];
}) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [selected, setSelected] = useState<PortfolioProject | null>(null);

  const filtered = useMemo(
    () => (activeTag ? projects.filter((p) => p.tags.includes(activeTag)) : projects),
    [projects, activeTag],
  );

  return (
    <>
      {tags.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <FilterChip label="All" active={activeTag === null} onClick={() => setActiveTag(null)} />
          {tags.map((tag) => (
            <FilterChip
              key={tag}
              label={tag}
              active={activeTag === tag}
              onClick={() => setActiveTag((t) => (t === tag ? null : tag))}
            />
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-slate-400">No projects match “{activeTag}”.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <ProjectCard key={project.slug} project={project} onQuickView={setSelected} />
          ))}
        </div>
      )}

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "bg-sky-500 text-white"
          : "text-slate-300 ring-1 ring-inset ring-white/15 hover:bg-white/5"
      }`}
    >
      {label}
    </button>
  );
}
