"use client";

import React from "react";
import { Code2, Server, Palette, Globe, CheckCircle2 } from "lucide-react";
import { TiltCard } from "@/components/ui-helpers";

const SERVICE_ICONS: Record<string, React.ElementType> = {
  "Full-Stack Web Development": Code2,
  "API Development": Server,
  "UI/UX Development": Palette,
  "Deployment & Optimization": Globe,
};

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  points: string[];
  color: string;
}

interface ServicesSectionProps {
  services: ServiceItem[];
}

export function ServicesSection({ services }: ServicesSectionProps) {
  return (
    <section id="services" className="py-28 relative overflow-hidden">
      <span className="section-number" aria-hidden>
        04
      </span>
      <div className="container px-6 mx-auto max-w-5xl relative z-10">
        <div className="text-center mb-16 reveal">
          <span
            className="section-label"
            style={{ color: "#10b981", borderColor: "rgba(16,185,129,0.3)" }}
          >
            What I Offer
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold mt-2 tracking-tight text-foreground">
            Services
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            From concept to deployment — engineering complete digital products.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {services.map((svc, i) => {
            const Icon = SERVICE_ICONS[svc.title] ?? Globe;
            return (
              <TiltCard
                key={svc.id}
                className="glass-card rounded-2xl p-8 reveal group"
                style={{ transitionDelay: `${i * 0.08}s` }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                  style={{
                    background: `${svc.color}14`,
                    border: `1px solid ${svc.color}28`,
                    boxShadow: `0 0 20px ${svc.color}20`,
                  }}
                >
                  <Icon style={{ color: svc.color }} className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">
                  {svc.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-5 text-sm">
                  {svc.description}
                </p>
                <ul className="space-y-2">
                  {svc.points.map((pt) => (
                    <li
                      key={pt}
                      className="flex items-center gap-2 text-sm text-foreground/90"
                    >
                      <CheckCircle2
                        className="h-4 w-4 flex-shrink-0 group-hover:scale-110 transition-transform"
                        style={{ color: svc.color }}
                      />
                      {pt}
                    </li>
                  ))}
                </ul>
              </TiltCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
