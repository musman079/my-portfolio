"use client"

import React, { useEffect } from "react"
import { X, ExternalLink, Github, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { playClickSound } from "@/lib/sound-effects"

export interface ProjectDetail {
  id: string
  title: string
  subtitle: string
  category?: string
  description: string
  longDescription?: string
  features?: string[]
  tech: string[]
  github: string
  live: string
  accentColor: string
  highlights?: string[]
}

const PROJECT_EXTENDED_INFO: Record<string, { longDescription: string; features: string[]; category: string }> = {
  ThinkBoard: {
    category: "Full-Stack MERN",
    longDescription:
      "ThinkBoard is a feature-rich, collaborative note-taking and markdown knowledge base web application. Built with a robust Express.js backend and React frontend, it features secure JWT-based authentication, custom rate limiting to mitigate API abuse, and full responsive design.",
    features: [
      "Full CRUD note management with tags and search indexing",
      "Markdown editor with live rendered preview and syntax highlighting",
      "Secure JWT authentication with bcrypt password hashing",
      "Custom express-rate-limit middleware to guard against brute-force attacks",
      "MongoDB database optimized with Mongoose schemas and indexes",
    ],
  },
  "GeoSpatial Urbanization": {
    category: "Mobile & AI",
    longDescription:
      "An innovative mobile and machine learning solution designed to detect and monitor urban sprawl patterns in Faisalabad City using satellite imagery. Combines Flutter for cross-platform mobile delivery with offline-capable TensorFlow Lite models.",
    features: [
      "Convolutional Neural Network (CNN) integration via TensorFlow Lite",
      "Satellite map integration with interactive GeoJSON boundary layers",
      "Real-time urban growth metrics and change detection statistics",
      "Firebase Cloud Firestore integration for community reporting",
      "Fast, fluid cross-platform UI built with Dart & Flutter",
    ],
  },
  "Dev Portfolio": {
    category: "Next.js / Frontend",
    longDescription:
      "A cutting-edge developer portfolio engineered with Next.js 15, React 19, TypeScript, and Tailwind CSS. Features interactive Web Audio synth sounds, interactive particle constellation physics, full CLI developer console, and dynamic MongoDB CMS integration.",
    features: [
      "Interactive Dev CLI Terminal with Matrix rain and custom command system",
      "Spotlight and 3D gyroscope card physics with hardware acceleration",
      "Next.js App Router with Server & Client components for optimal performance",
      "Custom MongoDB CRUD Admin dashboard at /admin for dynamic portfolio management",
      "Full accessibility and SEO meta tags with responsive glassmorphism UI",
    ],
  },
}

export function ProjectModal({
  project,
  onClose,
}: {
  project: ProjectDetail | null
  onClose: () => void
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (project) {
      window.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden"
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "auto"
    }
  }, [project, onClose])

  if (!project) return null

  const extra = PROJECT_EXTENDED_INFO[project.title] || {
    category: project.category || "Full-Stack Web App",
    longDescription: project.description,
    features: [
      "Clean architecture with modular code structure",
      "Responsive layout optimized for mobile and desktop screens",
      "Performance-tuned API endpoints and rendering",
      "Secure data handling and state management",
    ],
  }

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] bg-card text-card-foreground border rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-fade-in-up"
        style={{
          borderColor: `${project.accentColor}40`,
          boxShadow: `0 25px 60px -15px rgba(0,0,0,0.9), 0 0 35px ${project.accentColor}25`,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Top Accent Line */}
        <div
          className="h-1.5 w-full"
          style={{
            background: `linear-gradient(90deg, transparent, ${project.accentColor}, transparent)`,
          }}
        />

        {/* Modal Header */}
        <div className="relative p-6 sm:p-8 bg-slate-50 dark:bg-[#111422] border-b border-border flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span
                className="px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider"
                style={{
                  background: `${project.accentColor}18`,
                  color: project.accentColor,
                  border: `1px solid ${project.accentColor}40`,
                }}
              >
                {extra.category}
              </span>
              <span className="text-xs text-muted-foreground font-mono">{project.subtitle}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              {project.title}
            </h2>
          </div>

          <button
            onClick={() => {
              playClickSound()
              onClose()
            }}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground bg-slate-200 dark:bg-white/5 hover:bg-slate-300 dark:hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-foreground">
          {/* Overview */}
          <div>
            <h4 className="text-xs uppercase font-mono tracking-widest text-muted-foreground mb-2 font-bold">
              Overview & Objectives
            </h4>
            <p className="text-sm sm:text-base leading-relaxed text-foreground/90">
              {extra.longDescription}
            </p>
          </div>

          {/* Key Features */}
          <div>
            <h4 className="text-xs uppercase font-mono tracking-widest text-muted-foreground mb-3 font-bold">
              Key Features & Architectural Highlights
            </h4>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {extra.features.map((feat, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-100 dark:bg-white/[0.03] border border-border text-xs sm:text-sm"
                >
                  <CheckCircle2
                    className="w-4 h-4 flex-shrink-0 mt-0.5"
                    style={{ color: project.accentColor }}
                  />
                  <span className="text-foreground">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack Matrix */}
          <div>
            <h4 className="text-xs uppercase font-mono tracking-widest text-muted-foreground mb-3 font-bold">
              Technologies & Libraries Used
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.tech.map(t => (
                <span
                  key={t}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-[#161926] text-foreground border border-border"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="p-5 sm:p-6 bg-slate-50 dark:bg-[#0a0c14] border-t border-border flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-muted-foreground font-mono">
            Developed by Muhammad Usman • Production Ready
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-2 text-xs border-border text-foreground hover:bg-slate-200 dark:hover:bg-white/10"
                >
                  <Github className="w-4 h-4" /> View Source Code
                </Button>
              </a>
            )}
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial"
              >
                <Button
                  size="sm"
                  className="w-full gap-2 text-xs font-bold"
                  style={{
                    background: project.accentColor,
                    color: "#000",
                    boxShadow: `0 4px 20px ${project.accentColor}50`,
                  }}
                >
                  <ExternalLink className="w-4 h-4" /> Open Live Application
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
