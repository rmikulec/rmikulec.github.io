import { ChevronDown, Github, Mail } from "lucide-react";
import ParallaxHero from "@/components/ParallaxHero";
import FeaturedCarousel from "@/components/FeaturedCarousel";
import ProjectExplorer from "@/components/ProjectExplorer";
import { projects, featuredProjects, allTags } from "@/lib/projects";

export default function Home() {
  const hasProjects = projects.length > 0;

  if (!hasProjects) {
    return (
      <main className="relative">
        <ParallaxHero />
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="text-center text-slate-400">
            No projects yet — drop a <code className="text-sky-300">.portfolio</code> file
            into a repo and they’ll show up here.
          </p>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="relative">
      <ParallaxHero />

      {/* Featured — full-bleed, immersive */}
      <section id="projects" className="relative pt-16 sm:pt-20">
        <FeaturedCarousel projects={featuredProjects} />

        {/* down-arrow cue into the full project list */}
        <div className="mt-10 flex justify-center">
          <a
            href="#all"
            aria-label="Jump to all projects"
            className="group flex flex-col items-center gap-1 text-slate-400 transition-colors hover:text-white"
          >
            <span className="text-xs font-medium uppercase tracking-[0.2em]">All projects</span>
            <ChevronDown className="size-6 animate-bounce group-hover:text-white" />
          </a>
        </div>
      </section>

      {/* All projects */}
      <div id="all" className="mx-auto max-w-6xl scroll-mt-8 px-6 py-16 sm:py-20">
        <ProjectExplorer projects={projects} tags={allTags} />
      </div>

      <Footer />
    </main>
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
