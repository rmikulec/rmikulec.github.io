import { Github, Mail } from "lucide-react";
import ParallaxHero from "@/components/ParallaxHero";
import ProjectCard from "@/components/ProjectCard";
import ProjectExplorer from "@/components/ProjectExplorer";
import { projects, featuredProjects, allTags } from "@/lib/projects";

export default function Home() {
  const hasProjects = projects.length > 0;

  return (
    <main className="relative">
      <ParallaxHero />

      <div id="projects" className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        {!hasProjects ? (
          <p className="text-center text-slate-400">
            No projects yet — drop a <code className="text-sky-300">.portfolio</code> file
            into a repo and they’ll show up here.
          </p>
        ) : (
          <>
            {/* Featured */}
            <section className="mb-24">
              <SectionHeading
                eyebrow="Featured"
                title="Selected work"
                subtitle="A few projects I'm most proud of."
              />
              <div className="grid gap-6 md:grid-cols-2">
                {featuredProjects.map((project) => (
                  <ProjectCard key={project.slug} project={project} variant="featured" />
                ))}
              </div>
            </section>

            {/* All projects + tag filter */}
            <section>
              <SectionHeading
                eyebrow="Everything"
                title="All projects"
                subtitle="Filter by tech. Open any card for details, or visit the repo."
              />
              <ProjectExplorer projects={projects} tags={allTags} />
            </section>
          </>
        )}
      </div>

      <Footer />
    </main>
  );
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-10">
      <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-sky-400">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-bold text-white sm:text-4xl">{title}</h2>
      <p className="mt-2 text-slate-400">{subtitle}</p>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 sm:flex-row">
        <p className="text-sm text-slate-400">
          © Ryan Mikulec — built from{" "}
          <code className="text-slate-300">.portfolio</code> files across my repos.
        </p>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/rmikulec"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-slate-300 hover:text-white"
          >
            <Github className="size-4" /> GitHub
          </a>
          <a
            href="mailto:rmikulec.dev@gmail.com"
            className="inline-flex items-center gap-1.5 text-sm text-slate-300 hover:text-white"
          >
            <Mail className="size-4" /> Email
          </a>
        </div>
      </div>
    </footer>
  );
}
