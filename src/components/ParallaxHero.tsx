"use client";

import { ParallaxProvider, ParallaxBanner } from "react-scroll-parallax";
import { motion } from "framer-motion";
import { ChevronDown, Github, Mail } from "lucide-react";

export default function ParallaxHero() {
  return (
    <ParallaxProvider>
      <header className="relative h-screen w-full overflow-hidden">
        {/* Background layer — kept out of normal flow so it can't push content down */}
        <div className="absolute inset-0 z-0">
          <ParallaxBanner
            className="h-full w-full"
            layers={[
              { image: "/bg-1.jpg", speed: -20 },
              { image: "/bg-2.png", speed: -12 },
              { image: "/bg-3.png", speed: -6 },
              { image: "/bg-4.png", speed: 4 },
              { image: "/bg-5.png", speed: 10 },
            ]}
          />
        </div>
        {/* darkening gradient so text is legible and the hero blends into content */}
        <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-slate-950/60 via-slate-950/40 to-slate-950" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center [text-shadow:0_2px_20px_rgba(2,6,23,0.7)]">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-5xl font-bold leading-tight text-white sm:text-7xl"
          >
            Ryan Mikulec
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-5 max-w-2xl text-lg text-slate-200 sm:text-xl"
          >
            Software engineer building full-stack applications, backend systems,
            and LLM-powered tools.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <a
              href="#projects"
              className="rounded-lg bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky-400"
            >
              View projects
            </a>
            <a
              href="https://github.com/rmikulec"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-inset ring-white/25 transition-colors hover:bg-white/10"
            >
              <Github className="size-4" /> GitHub
            </a>
            <a
              href="mailto:rmikulec.dev@gmail.com"
              className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-inset ring-white/25 transition-colors hover:bg-white/10"
            >
              <Mail className="size-4" /> Contact
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        >
          <ChevronDown className="size-7 animate-bounce text-white/70" />
        </motion.div>
      </header>
    </ParallaxProvider>
  );
}
