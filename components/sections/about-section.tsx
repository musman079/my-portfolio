"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  MapPin,
  ArrowRight,
  Star,
  Code2,
} from "lucide-react";
import {
  TiltCard,
  AnimatedCounter,
  TechMarquee,
  TechBadge,
} from "@/components/ui-helpers";

interface AboutSectionProps {
  profile: any;
  stats: any[];
  onScrollTo: (id: string) => void;
}

export function AboutSection({ profile, stats, onScrollTo }: AboutSectionProps) {
  return (
    <>
      {/* ====== STATS SECTION ====== */}
      <section className="py-16 relative overflow-hidden border-y border-border">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-amber-500/5 via-sky-500/5 to-emerald-500/5" />
        <div className="container px-6 mx-auto max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 text-center">
            {stats.map(({ label, color, num, suffix, isFloat }, i) => (
              <TiltCard
                key={label}
                className="rounded-2xl p-6 flex flex-col items-center gap-3 reveal glass-card"
                style={{ transitionDelay: `${i * 0.08}s` }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{
                    background: `${color}14`,
                    border: `1px solid ${color}28`,
                    boxShadow: `0 0 22px ${color}18`,
                  }}
                >
                  <Code2 className="h-6 w-6" style={{ color }} />
                </div>
                <div
                  className="text-3xl font-bold"
                  style={{ color, textShadow: `0 0 18px ${color}55` }}
                >
                  <AnimatedCounter num={num} suffix={suffix} isFloat={isFloat} />
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground font-medium">
                  {label}
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ====== TECH MARQUEE ====== */}
      <section className="py-6 border-b border-border">
        <TechMarquee />
      </section>

      {/* ====== ABOUT ME ====== */}
      <section id="about" className="py-28 relative overflow-hidden">
        <span className="section-number" aria-hidden>
          01
        </span>
        <div className="container px-6 mx-auto max-w-5xl relative z-10">
          <div className="text-center mb-16 reveal">
            <span
              className="section-label"
              style={{ color: "#f59e0b", borderColor: "rgba(245,158,11,0.3)" }}
            >
              Who I Am
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold mt-2 tracking-tight text-foreground">
              {profile.aboutHeading || "About Me"}
            </h2>
          </div>
          <div className="grid gap-14 md:grid-cols-2 items-center">
            <div className="space-y-5 reveal-left">
              <p className="text-foreground text-lg leading-relaxed font-medium">
                {profile.aboutParagraph1}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {profile.aboutParagraph2}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {profile.aboutParagraph3}
              </p>

              {/* Location Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono text-muted-foreground bg-card border border-border">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                <span>
                  {profile.location ||
                    "Faisalabad, Pakistan • Working with Global Clients"}
                </span>
              </div>

              {/* Info cards grid */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                {(profile.aboutBadges || []).map(({ label, color }: any) => (
                  <div
                    key={label}
                    className="info-card flex items-center gap-2.5"
                  >
                    <Sparkles
                      className="h-4 w-4 flex-shrink-0"
                      style={{ color }}
                    />
                    <span className="text-xs font-medium text-foreground">
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {[
                  "React.js",
                  "Next.js 15",
                  "Node.js",
                  "Express.js",
                  "MongoDB",
                  "TypeScript",
                  "Tailwind CSS",
                ].map((sk) => (
                  <TechBadge key={sk} label={sk} />
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 group mt-2 border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/5 hover:bg-amber-500/10"
                onClick={() => onScrollTo("contact")}
              >
                Let&apos;s Work Together
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <div className="flex justify-center reveal-right">
              <TiltCard className="relative">
                <div
                  className="absolute inset-0 rounded-full opacity-35 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(245,158,11,0.3) 0%, rgba(14,165,233,0.2) 45%, transparent 70%)",
                  }}
                />
                <div
                  className="relative w-72 h-72 rounded-full overflow-hidden animate-glow-amber"
                  style={{ border: "2px solid rgba(245,158,11,0.35)" }}
                >
                  <img
                    src={profile.avatarUrl || "/placeholder.jpg"}
                    alt={profile.name || "Muhammad Usman"}
                    className="object-cover w-full h-full"
                  />
                </div>
                {profile.available && (
                  <div
                    className="absolute -bottom-3 -right-3 glass px-4 py-2 rounded-2xl shadow-2xl"
                    style={{ border: "1px solid rgba(245,158,11,0.22)" }}
                  >
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-dot" />
                      Available Now
                    </div>
                  </div>
                )}
                <div
                  className="absolute -top-3 -left-3 glass px-3 py-1.5 rounded-2xl shadow-2xl"
                  style={{
                    border: "1px solid rgba(29,191,115,0.3)",
                    background: "rgba(29,191,115,0.09)",
                  }}
                >
                  <div
                    className="flex items-center gap-1.5 text-xs font-semibold"
                    style={{ color: "#1dbf73" }}
                  >
                    <Star className="h-3 w-3 fill-current" />{" "}
                    {profile.fiverrRating || "5.0"} on Fiverr
                  </div>
                </div>
              </TiltCard>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
