"use client";

import React from "react";
import {
  Code2,
  Server,
  Palette,
  Globe,
  GitBranch,
} from "lucide-react";
import { SpotlightCard, TechBadge } from "@/components/ui-helpers";

const SKILL_ICONS: Record<string, React.ElementType> = {
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
        <div className="text-center mb-16 reveal">
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
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {skills.map((sk, i) => {
            const Icon = SKILL_ICONS[sk.category] ?? SKILL_ICONS.default;
            return (
              <SpotlightCard
                key={sk.id}
                className="rounded-2xl p-6 glass-card"
                style={{ transitionDelay: `${i * 0.08}s` }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{
                    background: `${sk.color}14`,
                    border: `1px solid ${sk.color}30`,
                    boxShadow: `0 0 16px ${sk.color}20`,
                  }}
                >
                  <Icon style={{ color: sk.color }} className="h-6 w-6" />
                </div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-base text-foreground">
                    {sk.category}
                  </h3>
                  <span
                    className="text-xs font-mono font-semibold"
                    style={{ color: sk.color }}
                  >
                    {sk.level}%
                  </span>
                </div>
                <div className="skill-bar mb-4">
                  <div
                    className="skill-bar-fill"
                    style={{
                      width: `${sk.level}%`,
                      background: `linear-gradient(90deg,${sk.color},${
                        sk.color === "#f59e0b" ? "#0ea5e9" : "#f59e0b"
                      })`,
                    }}
                  />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {sk.items.map((s) => (
                    <TechBadge key={s} label={s} />
                  ))}
                </div>
              </SpotlightCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
