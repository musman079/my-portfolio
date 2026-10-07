"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Github,
  ExternalLink,
  Layers,
  ArrowRight,
  Terminal,
  Cpu,
  Sparkles,
  Code2,
} from "lucide-react";
import { TechBadge } from "@/components/ui-helpers";
import { playClickSound } from "@/lib/sound-effects";
import type { ProjectDetail } from "@/components/project-modal";
import {
  ScrollReveal,
  StaggerContainer,
  staggerItem,
  MagneticButton,
} from "@/components/motion-primitives";

const PROJECT_ICONS: Record<string, any> = {
  ThinkBoard: Terminal,
  "GeoSpatial Urbanization": Cpu,
  "Dev Portfolio": Sparkles,
  default: Code2,
};

interface ProjectsSectionProps {
  projects: ProjectDetail[];
  onSelectProject: (project: ProjectDetail) => void;
  githubUrl?: string;
}

export function ProjectsSection({
  projects,
  onSelectProject,
  githubUrl = "https://github.com/mani78979",
}: ProjectsSectionProps) {
  const [projectFilter, setProjectFilter] = useState<string>("All");

  const filteredProjects = projects.filter((p) => {
    if (projectFilter === "All") return true;
    if (projectFilter === "Full-Stack MERN")
      return (
        p.category?.includes("MERN") ||
        p.tech.includes("MongoDB") ||
        p.tech.includes("Express.js")
      );
    if (projectFilter === "Next.js / Frontend")
      return (
        p.tech.includes("Next.js") ||
        p.tech.includes("React") ||
        p.tech.includes("Tailwind CSS")
      );
    if (projectFilter === "Mobile & AI")
      return (
        p.tech.includes("Flutter") ||
        p.tech.includes("TensorFlow Lite") ||
        p.category?.includes("AI")
      );
    return true;
  });

  return (
    <section
      id="projects"
      className="py-28 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg,rgba(14,165,233,0.02) 0%,transparent 100%)",
      }}
    >
      <span className="section-number" aria-hidden>
        05
      </span>
      <div className="container px-6 mx-auto max-w-5xl relative z-10">
        <ScrollReveal className="text-center mb-10">
          <span
            className="section-label"
            style={{ color: "#f59e0b", borderColor: "rgba(245,158,11,0.3)" }}
          >
            Portfolio
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold mt-2 tracking-tight text-foreground">
            Featured Projects
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            Explore my web applications and software engineering projects.
          </p>
        </ScrollReveal>

        {/* Project Filter Tabs */}
        <ScrollReveal className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {["All", "Full-Stack MERN", "Next.js / Frontend", "Mobile & AI"].map(
            (tab) => {
              const active = projectFilter === tab;
              return (
                <motion.button
                  key={tab}
                  onClick={() => {
                    playClickSound();
                    setProjectFilter(tab);
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                    active
                      ? "bg-amber-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.4)]"
                      : "bg-card text-muted-foreground border border-border hover:border-amber-500/30 hover:text-foreground"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  layout
                >
                  {tab}
                </motion.button>
              );
            }
          )}
        </ScrollReveal>

        {/* Projects Grid */}
        <LayoutGroup>
          <motion.div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" layout>
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((proj, i) => {
                const ProjIcon = PROJECT_ICONS[proj.title] ?? PROJECT_ICONS.default;
                return (
                  <motion.div
                    key={proj.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -20 }}
                    transition={{ duration: 0.4, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <motion.div
                      className="rounded-2xl overflow-hidden group flex flex-col justify-between glass-card spotlight-card cursor-pointer h-full"
                      onClick={() => {
                        playClickSound();
                        onSelectProject(proj);
                      }}
                      whileHover={{ y: -8, scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <div>
                        <motion.div
                          className="h-[2px] w-full"
                          style={{
                            background: `linear-gradient(90deg,transparent,${proj.accentColor},transparent)`,
                          }}
                          initial={{ scaleX: 0 }}
                          whileInView={{ scaleX: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: i * 0.1 }}
                        />
                        <div className="p-6 relative z-10">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <motion.div
                                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                style={{
                                  background: `${proj.accentColor}12`,
                                  border: `1px solid ${proj.accentColor}25`,
                                }}
                                whileHover={{ rotate: 360, scale: 1.15 }}
                                transition={{ duration: 0.5 }}
                              >
                                <ProjIcon
                                  className="h-5 w-5"
                                  style={{ color: proj.accentColor }}
                                />
                              </motion.div>
                              <div>
                                <h3 className="text-lg font-bold leading-tight text-foreground group-hover:text-amber-500 transition-colors">
                                  {proj.title}
                                </h3>
                                <p
                                  className="text-xs font-mono mt-0.5 font-semibold"
                                  style={{ color: proj.accentColor }}
                                >
                                  {proj.subtitle}
                                </p>
                              </div>
                            </div>
                            <div
                              className="flex gap-1.5 ml-2"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {proj.github && (
                                <motion.a
                                  href={proj.github}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors bg-slate-100 dark:bg-white/5"
                                  title="View Source Code"
                                  whileHover={{ scale: 1.2, rotate: 10 }}
                                >
                                  <Github className="h-4 w-4" />
                                </motion.a>
                              )}
                              {proj.live && (
                                <motion.a
                                  href={proj.live}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors bg-slate-100 dark:bg-white/5"
                                  title="Open Live Demo"
                                  whileHover={{ scale: 1.2, rotate: -10 }}
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </motion.a>
                              )}
                            </div>
                          </div>
                          <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                            {proj.description}
                          </p>
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            {proj.tech.map((t, j) => (
                              <motion.span
                                key={t}
                                initial={{ opacity: 0, scale: 0.7 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 + j * 0.03 }}
                                whileHover={{ scale: 1.1 }}
                              >
                                <TechBadge label={t} />
                              </motion.span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div
                        className="p-6 pt-0 relative z-10"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex gap-2 pt-4 border-t border-border">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              playClickSound();
                              onSelectProject(proj);
                            }}
                            className="flex-1 text-xs gap-1 border-border text-foreground hover:border-amber-500/40"
                          >
                            <Layers className="w-3.5 h-3.5" /> Details
                          </Button>
                          {proj.live && (
                            <a
                              href={proj.live}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1"
                            >
                              <Button
                                size="sm"
                                className="w-full gap-1.5 text-xs font-bold"
                                style={{
                                  background: proj.accentColor,
                                  color: "#000",
                                  border: "none",
                                  boxShadow: `0 4px 18px ${proj.accentColor}40`,
                                }}
                              >
                                <ExternalLink className="h-3.5 w-3.5" /> Live
                              </Button>
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>

        <ScrollReveal className="text-center mt-10">
          <MagneticButton>
            <a href={githubUrl} target="_blank" rel="noopener noreferrer">
              <Button
                variant="outline"
                className="gap-2 group border-sky-500/30 text-sky-600 dark:text-sky-400 bg-sky-500/5 hover:bg-sky-500/10"
              >
                <Github className="h-4 w-4" /> View Complete GitHub Portfolio
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
          </MagneticButton>
        </ScrollReveal>
      </div>
    </section>
  );
}
