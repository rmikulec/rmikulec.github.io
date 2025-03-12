"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Example: list of projects
const PROJECTS = [
  {
    name: "Next.js",
    description: "A React framework for production, by Vercel.",
    url: "https://github.com/vercel/next.js",
  },
  {
    name: "React",
    description: "A JavaScript library for building user interfaces.",
    url: "https://github.com/facebook/react",
  },
  {
    name: "Tailwind CSS",
    description: "A utility-first CSS framework for rapid UI development.",
    url: "https://github.com/tailwindlabs/tailwindcss",
  },
];

// Reusable variants for section transitions
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

export default function Home() {
  return (
    <>
      {/* 
        The main container:
         - h-screen: full viewport height
         - overflow-y-scroll: vertical scrolling
         - snap-y snap-mandatory: enforces vertical snapping
      */}
      <main className="h-screen overflow-y-scroll snap-y snap-mandatory">
        
        {/* ABOUT SECTION */}
        <motion.section
          // full-screen section, snapping at the start
          className="h-screen snap-start flex items-center justify-center px-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
        >
          <div className="max-w-3xl text-center space-y-4">
            <h1 className="text-5xl font-bold tracking-tight">
              About This Page
            </h1>
            <p className="text-lg text-gray-600">
              Scroll down to see how each section morphs into view.
              We’ll showcase some great open source projects along the way.
            </p>
          </div>
        </motion.section>

        {/* PROJECT SECTIONS */}
        {PROJECTS.map((project, idx) => (
          <motion.section
            key={project.name}
            className="h-screen snap-start flex items-center justify-center px-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.7 }}
            variants={sectionVariants}
            // Stagger each project a bit more:
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>{project.name}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="default"
                  onClick={() => window.open(project.url, "_blank")}
                >
                  View on GitHub
                </Button>
              </CardContent>
            </Card>
          </motion.section>
        ))}
      </main>
    </>
  );
}
