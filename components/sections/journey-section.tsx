"use client";

import React from "react";
import { SpotlightCard } from "@/components/ui-helpers";

interface JourneyItem {
  year: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  color: string;
}

interface JourneySectionProps {
  journeyList: JourneyItem[];
}

export function JourneySection({ journeyList }: JourneySectionProps) {
  return (
    <section
      id="journey"
      className="py-28 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg,rgba(14,165,233,0.02) 0%,transparent 100%)",
      }}
    >
      <span className="section-number" aria-hidden>
        02
      </span>
      <div className="container px-6 mx-auto max-w-4xl relative z-10">
        <div className="text-center mb-16 reveal">
          <span
            className="section-label"
            style={{ color: "#0ea5e9", borderColor: "rgba(14,165,233,0.3)" }}
          >
            Milestones
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold mt-2 tracking-tight text-foreground">
            Experience & Education
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            My professional evolution as a software developer and computer scientist.
          </p>
        </div>

        <div className="relative pl-6 sm:pl-8 space-y-10 reveal">
          <div className="timeline-line" />
          {journeyList.map((step, idx) => (
            <div key={idx} className="timeline-item relative">
              <div
                className="timeline-dot"
                style={{
                  background: step.color,
                  boxShadow: `0 0 16px ${step.color}`,
                }}
              />
              <SpotlightCard className="rounded-2xl p-6 sm:p-7 ml-4 glass-card border border-border">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span
                    className="font-mono text-xs font-bold"
                    style={{ color: step.color }}
                  >
                    {step.year}
                  </span>
                  <span
                    className="text-[11px] px-2.5 py-0.5 rounded-full font-semibold"
                    style={{
                      background: `${step.color}15`,
                      color: step.color,
                      border: `1px solid ${step.color}30`,
                    }}
                  >
                    {step.badge}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-1">
                  {step.title}
                </h3>
                <div className="text-xs font-mono text-muted-foreground mb-3">
                  {step.subtitle}
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  {step.description}
                </p>
              </SpotlightCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
