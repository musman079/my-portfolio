"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Code2,
  Server,
  Palette,
  Globe,
  GitBranch,
} from "lucide-react";
import { TechBadge } from "@/components/ui-helpers";
import {
  ScrollReveal,
  StaggerContainer,
  staggerItem,
  MotionTiltCard,
} from "@/components/motion-primitives";

const SKILL_ICONS: Record<string, any> = {
  Frontend: Code2,
  Backend: Server,
  Design: Palette,
  "Database & Cloud": Globe,
  "Tools & Deploy": GitBranch,
  "Design & Tools": Palette,
  default: Code2,
};

interface SkillItem {
  id: string;
  category: string;
  items: string[];
  color: string;
  level: number;
}

interface SkillsSectionProps {
  skills: SkillItem[];
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  return (
    <section id="skills" className="py-28 relative overflow-hidden">
      <span className="section-number" aria-hidden>
        03
      </span>
      <div className="container px-6 mx-auto max-w-5xl relative z-10">
        <ScrollReveal className="text-center mb-16">
          <span
            className="section-label"
            style={{ color: "#06b6d4", borderColor: "rgba(6,182,212,0.3)" }}
          >
            Tech Arsenal
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold mt-2 tracking-tight text-foreground">
            Skills & Capabilities
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            Frameworks, databases, and development tools I build production applications with.
          </p>
        </ScrollReveal>

        <StaggerContainer className="grid gap-5 md:grid-cols-2 lg:grid-cols-4" stagger={0.12}>
          {skills.map((sk, i) => {
            const Icon = SKILL_ICONS[sk.category] ?? SKILL_ICONS.default;
            return (
              <motion.div key={sk.id} variants={staggerItem}>
                <MotionTiltCard className="rounded-2xl p-6 glass-card h-full">
                  <motion.div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{
                      background: `${sk.color}14`,
                      border: `1px solid ${sk.color}30`,
                      boxShadow: `0 0 16px ${sk.color}20`,
                    }}
                    whileHover={{ scale: 1.2, rotate: 15 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Icon style={{ color: sk.color }} className="h-6 w-6" />
                  </motion.div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-base text-foreground">
                      {sk.category}
                    </h3>
                    <motion.span
                      className="text-xs font-mono font-semibold"
                      style={{ color: sk.color }}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                    >
                      {sk.level}%
                    </motion.span>
                  </div>
                  <div className="skill-bar mb-4">
                    <motion.div
                      className="skill-bar-fill"
                      style={{
                        background: `linear-gradient(90deg,${sk.color},${
                          sk.color === "#f59e0b" ? "#0ea5e9" : "#f59e0b"
                        })`,
                        transformOrigin: "left",
                      }}
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: sk.level / 100 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {sk.items.map((s, j) => (
                      <motion.span
                        key={s}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 + j * 0.04 }}
                        whileHover={{ scale: 1.12, y: -2 }}
                      >
                        <TechBadge label={s} />
                      </motion.span>
                    ))}
                  </div>
                </MotionTiltCard>
              </motion.div>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
