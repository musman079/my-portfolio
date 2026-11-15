"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollReveal } from "@/components/motion-primitives";

const FAQS = [
  {
    q: "How do you structure pricing and payment milestones?",
    a: "For fixed-scope projects, we agree on clear milestones upfront (typically 40% kickoff, 30% core build demo, 30% final deployment & handover). Projects can be contracted directly or through Fiverr Escrow for 100% buyer protection.",
  },
  {
    q: "Do I receive full source code ownership and deployment support?",
    a: "Yes — 100% of the GitHub repository, documentation, environment setup guide, and production deployment (Vercel, Railway, or your VPS/cloud) are handed over upon completion.",
  },
  {
    q: "What is your typical turnaround time for a full-stack app?",
    a: "Landing pages & portfolios take 2–4 days, REST APIs take 3–5 days, and full-stack MERN / Next.js applications typically ship in 1–2 weeks with daily progress updates.",
  },
  {
    q: "Are revisions and post-launch bug fixes included?",
    a: "Every project includes iterative UI/UX feedback rounds during development plus a complimentary post-launch bug-fix warranty to ensure everything runs smoothly in production.",
  },
  {
    q: "Can you sign an NDA or work with an existing codebase?",
    a: "Absolutely. I regularly sign NDAs for client IP protection and can audit, refactor, optimize, or extend existing React, Next.js, or Node.js/MongoDB codebases.",
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="py-24 relative overflow-hidden">
      <div className="container px-6 mx-auto max-w-3xl relative z-10">
        <ScrollReveal className="text-center mb-12">
          <span
            className="section-label"
            style={{ color: "#8b5cf6", borderColor: "rgba(139,92,246,0.3)" }}
          >
            Clarity First
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-2 tracking-tight text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground mt-3 text-sm sm:text-base max-w-xl mx-auto">
            Quick answers on workflow, ownership, timelines, and support.
          </p>
        </ScrollReveal>

        <ScrollReveal>
          <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-border">
            <Accordion type="single" collapsible className="w-full">
              {FAQS.map((item, idx) => (
                <AccordionItem
                  key={idx}
                  value={`faq-${idx}`}
                  className="border-border last:border-b-0"
                >
                  <AccordionTrigger className="text-left text-sm sm:text-base font-semibold text-foreground hover:text-amber-500 hover:no-underline py-4">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed pb-4">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

