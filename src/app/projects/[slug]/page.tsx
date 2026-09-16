import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { projects, getProject } from "@/lib/projects";
import { rgba } from "@/lib/color";
import Markdown from "@/components/Markdown";
import StatusBadge from "@/components/StatusBadge";
import ProjectLinks from "@/components/ProjectLinks";
import ImageGallery from "@/components/ImageGallery";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Project not found" };
  return {
    title: `${project.name} — Ryan Mikulec`,
    description: project.tagline,
    openGraph: { title: project.name, description: project.tagline, type: "article" },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <main className="relative min-h-screen">
      {/* accent header */}
      <div
        className="absolute inset-x-0 top-0 h-64"
        style={{
          background: `linear-gradient(180deg, ${rgba(project.color, 0.28)}, transparent)`,
        }}
      />

      <article className="relative mx-auto max-w-3xl px-6 py-16">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="size-4" /> Back to projects
        </Link>

        <header className="mt-8">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-4xl font-bold text-white">{project.name}</h1>
            <StatusBadge status={project.status} />
          </div>
          <p className="mt-3 text-lg text-slate-300">{project.tagline}</p>

          {project.tags.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full px-2.5 py-0.5 text-xs font-medium text-slate-200 ring-1 ring-inset ring-white/15"
                  style={{ background: rgba(project.color, 0.14) }}
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-6 flex flex-wrap gap-2">
            <ProjectLinks project={project} />
          </div>
        </header>

        {project.images.length > 0 && (
          <div className="mt-10">
            <ImageGallery images={project.images} />
          </div>
        )}

        <div className="mt-10 border-t border-white/10 pt-8">
          {project.description ? (
            <Markdown>{project.description}</Markdown>
          ) : (
            <p className="text-slate-400">No description provided yet.</p>
          )}
        </div>
      </article>
    </main>
  );
}
