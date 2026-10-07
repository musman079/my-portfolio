"use client";

import React from "react";
import { motion } from "framer-motion";
import { Code2, Server, Palette, Globe, CheckCircle2 } from "lucide-react";
import {
  ScrollReveal,
  StaggerContainer,
  staggerItem,
  MotionTiltCard,
} from "@/components/motion-primitives";

const SERVICE_ICONS: Record<string, any> = {
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
        <ScrollReveal className="text-center mb-16">
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
        </ScrollReveal>

        <StaggerContainer className="grid gap-5 md:grid-cols-2" stagger={0.15}>
          {services.map((svc, i) => {
            const Icon = SERVICE_ICONS[svc.title] ?? Globe;
            return (
              <motion.div key={svc.id} variants={staggerItem}>
                <MotionTiltCard className="glass-card rounded-2xl p-8 group h-full">
                  <motion.div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                    style={{
                      background: `${svc.color}14`,
                      border: `1px solid ${svc.color}28`,
                      boxShadow: `0 0 20px ${svc.color}20`,
                    }}
                    whileHover={{ scale: 1.15, rotate: 8 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Icon style={{ color: svc.color }} className="h-7 w-7" />
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">
                    {svc.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-5 text-sm">
                    {svc.description}
                  </p>
                  <ul className="space-y-2">
                    {svc.points.map((pt, j) => (
                      <motion.li
                        key={pt}
                        className="flex items-center gap-2 text-sm text-foreground/90"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 + j * 0.06 }}
                      >
                        <motion.div
                          whileHover={{ scale: 1.3, rotate: 360 }}
                          transition={{ type: "spring" }}
                        >
                          <CheckCircle2
                            className="h-4 w-4 flex-shrink-0"
                            style={{ color: svc.color }}
                          />
                        </motion.div>
                        {pt}
                      </motion.li>
                    ))}
                  </ul>
                </MotionTiltCard>
              </motion.div>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
