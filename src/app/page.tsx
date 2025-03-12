// pages/index.jsx (or your corresponding page file)
"use client";
import React, { useRef, useEffect, useState } from 'react';
import { motion } from "framer-motion";
import ProjectCard from "@/components/ProjectCard";
import { Parallax, Background } from 'react-parallax';
import ScrollBasedBlueBackground  from '@/components/ParallaxEffect'
import { Project, getPortfolioProjects } from './github';

// Example list of projects
// Reusable variants for section transitions
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function Home() {
  // Always call hooks at the top of the component.
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const scrollContainerRef = useRef(null); // Always call useRef here.

  useEffect(() => {
    const username = "rmikulec"; // Replace with your GitHub username
    getPortfolioProjects(username)
      .then((projects) => {
        setProjects(projects);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching portfolio projects:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading projects...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  console.log(projects);
  return (
    <ScrollBasedBlueBackground containerRef={scrollContainerRef}>
      <main
        ref={scrollContainerRef}
        className="relative h-screen overflow-y-scroll snap-y snap-mandatory"
      >
        {/* ABOUT SECTION */}
        <motion.section
          className="h-screen snap-start flex items-center justify-center px-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
        >
          <div className="max-w-3xl text-center space-y-4">
          <h3 className="text-5xl text-red-700 font-bold tracking-tight">
            Under Development, please come back later!

            </h3>
            <h1 className="text-5xl text-gray-300 font-bold tracking-tight">
              Ryan Mikulec
            </h1>

            <p className="text-lg text-gray-200">
              LLM-backed Open Source projects designed to be help anyone, with the only requirement being an OpenAI API Key.
            </p>
          </div>
        </motion.section>

        {/* PROJECT SECTIONS */}
        {projects.map((project, idx) => (
          <motion.section
            key={project.name}
            className="h-screen snap-start flex items-center justify-center px-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.7 }}
            variants={sectionVariants}
            transition={{ delay: idx * 0.1 }}
          >
            <ProjectCard
              name={project.name}
              description={project.description}
              url={project.url}
              orientation={idx % 2 === 0 ? "left" : "right"}
            />
          </motion.section>
        ))}
      </main>
    </ScrollBasedBlueBackground>
  );
}