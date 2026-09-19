"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Star, ExternalLink } from "lucide-react";
import { SpotlightCard } from "@/components/ui-helpers";

interface ReviewItem {
  id: string;
  name: string;
  country: string;
  rating: number;
  review: string;
  date: string;
  project: string;
}

interface ReviewsSectionProps {
  reviews: ReviewItem[];
  fiverrRating?: string;
  fiverrLevel?: string;
  fiverrUrl?: string;
}

export function ReviewsSection({
  reviews,
  fiverrRating = "5.0",
  fiverrLevel = "Level 1",
  fiverrUrl = "https://www.fiverr.com/musman079",
}: ReviewsSectionProps) {
  return (
    <section
      id="reviews"
      className="py-28 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg,rgba(245,158,11,0.02) 0%,transparent 100%)",
      }}
    >
      <span className="section-number" aria-hidden>
        07
      </span>
      <div className="container px-6 mx-auto max-w-5xl relative z-10">
        <div className="text-center mb-6 reveal">
          <span
            className="section-label"
            style={{ color: "#10b981", borderColor: "rgba(16,185,129,0.3)" }}
          >
            Client Feedback
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold mt-2 tracking-tight text-foreground">
            Fiverr Testimonials
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            100% verified 5-star ratings from international clients across the globe.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-5 mb-12 glass-card rounded-2xl px-8 py-5 max-w-xl mx-auto reveal">
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="h-5 w-5 fill-yellow-400 star-gold" />
              ))}
            </div>
            <span className="font-bold text-xl text-foreground">{fiverrRating}</span>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{fiverrLevel}</span> Fiverr
            Seller
          </div>
          <div className="w-px h-8 bg-border" />
          <a href={fiverrUrl} target="_blank" rel="noopener noreferrer">
            <Button size="sm" className="gap-1.5 text-xs btn-fiverr">
              View Profile <ExternalLink className="h-3 w-3" />
            </Button>
          </a>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-12 px-6 rounded-2xl glass-card border border-border border-dashed max-w-md mx-auto reveal">
            <p className="text-sm font-medium text-muted-foreground">
              New client reviews are coming soon! Check back later or view live
              feedback on Fiverr.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map(
              ({ name, country, rating, review, date, project }, i) => (
                <SpotlightCard
                  key={i}
                  className="rounded-2xl p-6 relative review-quote glass-card"
                  style={{ transitionDelay: `${i * 0.08}s` }}
                >
                  <div className="flex items-center justify-between mb-4 relative z-10">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{
                          background:
                            "linear-gradient(135deg,rgba(245,158,11,0.15),rgba(14,165,233,0.15))",
                          border: "1px solid rgba(245,158,11,0.28)",
                          color: "#f59e0b",
                        }}
                      >
                        {name?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-sm text-foreground">
                          {name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {country}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: rating }).map((_, j) => (
                        <Star
                          key={j}
                          className="h-4 w-4 fill-yellow-400 star-gold"
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-foreground/90 text-sm leading-relaxed mb-4 relative z-10">
                    &quot;{review}&quot;
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 relative z-10 border-t border-border">
                    <span className="font-mono opacity-80 text-amber-500 font-semibold">
                      {project}
                    </span>
                    <span>{date}</span>
                  </div>
                </SpotlightCard>
              )
            )}
          </div>
        )}

        <div className="text-center mt-10 reveal">
          <a href={fiverrUrl} target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="gap-2 px-8 btn-fiverr">
              See All Reviews on Fiverr <ExternalLink className="h-4 w-4" />
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
