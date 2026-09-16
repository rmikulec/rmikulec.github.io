"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Github, ExternalLink, ArrowUpRight } from "lucide-react";
import type { PortfolioProject } from "@/lib/portfolio";
import { rgba } from "@/lib/color";
import StatusBadge from "./StatusBadge";

export default function FeaturedCarousel({ projects }: { projects: PortfolioProject[] }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = projects.length;

  const go = (i: number) => setCurrent(((i % count) + count) % count);

  useEffect(() => {
    if (paused || count <= 1) return;
    const id = setInterval(() => setCurrent((c) => (c + 1) % count), 6500);
    return () => clearInterval(id);
  }, [paused, count]);

  if (count === 0) return null;
  const project = projects[current];

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={project.slug}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <FeaturedSlide project={project} />
        </motion.div>
      </AnimatePresence>

      {count > 1 && (
        <>
          <NavButton side="left" onClick={() => go(current - 1)} />
          <NavButton side="right" onClick={() => go(current + 1)} />
          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {projects.map((p, i) => (
              <button
                key={p.slug}
                aria-label={`Show ${p.name}`}
                onClick={() => go(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === current ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function FeaturedSlide({ project }: { project: PortfolioProject }) {
  const [img, setImg] = useState(0);
  const images = project.images ?? [];
  const hasImages = images.length > 0;

  return (
    <div className="relative h-[70vh] min-h-[480px] w-full sm:h-[78vh]">
      {/* media */}
      {hasImages ? (
        <img
          src={images[img]}
          alt={`${project.name} screenshot`}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background:
              `radial-gradient(120% 120% at 80% 0%, ${rgba(project.color, 0.55)}, transparent 60%),` +
              `linear-gradient(135deg, ${rgba(project.color, 0.35)}, #020617)`,
          }}
        />
      )}
      {/* legibility gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-1"
        style={{ background: `linear-gradient(90deg, ${project.color}, ${rgba(project.color, 0)})` }}
      />

      {/* content */}
      <div className="absolute inset-x-0 bottom-0 z-10 mx-auto w-full max-w-6xl px-6 pb-10 sm:px-10 sm:pb-14">
        <div className="flex items-center gap-3">
          <StatusBadge status={project.status} />
          {project.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-full px-2.5 py-0.5 text-xs font-medium text-slate-100 ring-1 ring-inset ring-white/20"
              style={{ background: rgba(project.color, 0.25) }}
            >
              {tag}
            </span>
          ))}
        </div>
        <Link
          href={`/projects/${project.slug}`}
          className="group mt-4 inline-flex items-center gap-2 text-4xl font-bold text-white sm:text-6xl"
        >
          {project.name}
          <ArrowUpRight className="size-7 opacity-0 transition-opacity group-hover:opacity-80" />
        </Link>
        <p className="mt-3 max-w-2xl text-lg text-slate-200 sm:text-xl">{project.tagline}</p>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <Link
            href={`/projects/${project.slug}`}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-white"
            style={{ background: rgba(project.color, 0.95) }}
          >
            View project
          </Link>
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-slate-100 ring-1 ring-inset ring-white/25 backdrop-blur-sm hover:bg-white/10"
          >
            <Github className="size-4" /> Code
          </a>
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-slate-100 ring-1 ring-inset ring-white/25 backdrop-blur-sm hover:bg-white/10"
            >
              <ExternalLink className="size-4" /> Demo
            </a>
          )}
        </div>

        {/* image thumbnails when a project has more than one */}
        {images.length > 1 && (
          <div className="mt-5 flex gap-2">
            {images.map((src, i) => (
              <button
                key={src}
                onClick={() => setImg(i)}
                aria-label={`Show image ${i + 1}`}
                className={`h-12 w-16 overflow-hidden rounded-md ring-2 transition ${
                  i === img ? "ring-white" : "ring-white/20 hover:ring-white/50"
                }`}
              >
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function NavButton({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Previous" : "Next"}
      className={`absolute top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition hover:bg-black/60 ${
        side === "left" ? "left-4" : "right-4"
      }`}
    >
      <Icon className="size-5" />
    </button>
  );
}
