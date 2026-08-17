"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Github, Linkedin, Mail, ExternalLink, Download, Star, Code2, Server,
  Palette, Globe, Users, Briefcase, ChevronDown, Menu, X, Zap,
  ArrowRight, GitBranch, CheckCircle2, Sparkles, Terminal, Cpu, Coffee, Settings,
  Volume2, VolumeX, Search, Copy, Check, MessageSquare, Phone, Calendar,
  Layers, ShieldCheck, Clock, Send, Award, MapPin
} from "lucide-react"
import Image from "next/image"
import { ThemeToggle } from "@/components/theme-toggle"
import { DevTerminal } from "@/components/dev-terminal"
import { CommandPalette } from "@/components/command-palette"
import { ProjectModal, ProjectDetail } from "@/components/project-modal"
import { CostEstimator } from "@/components/cost-estimator"
import {
  playClickSound,
  playHoverSound,
  playSuccessSound,
  isSoundEnabled,
  setSoundEnabled,
} from "@/lib/sound-effects"

// Icon maps
const SKILL_ICONS: Record<string, React.ElementType> = {
  Frontend: Code2, Backend: Server, Design: Palette,
  "Database & Cloud": Globe, "Tools & Deploy": GitBranch,
  "Design & Tools": Palette, default: Code2,
}
const SERVICE_ICONS: Record<string, React.ElementType> = {
  "Full-Stack Web Development": Code2, "API Development": Server,
  "UI/UX Development": Palette, "Deployment & Optimization": Globe,
}
const PROJECT_ICONS: Record<string, React.ElementType> = {
  ThinkBoard: Terminal, "GeoSpatial Urbanization": Cpu,
  "Dev Portfolio": Sparkles, default: Code2,
}

// Brand color mapping for technology tags
const TECH_TAG_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "React.js": { bg: "rgba(6,182,212,0.1)", text: "#06b6d4", border: "rgba(6,182,212,0.3)" },
  "React": { bg: "rgba(6,182,212,0.1)", text: "#06b6d4", border: "rgba(6,182,212,0.3)" },
  "Next.js 15": { bg: "rgba(255,255,255,0.1)", text: "#f8fafc", border: "rgba(255,255,255,0.25)" },
  "Next.js": { bg: "rgba(255,255,255,0.1)", text: "#f8fafc", border: "rgba(255,255,255,0.25)" },
  "TypeScript": { bg: "rgba(59,130,246,0.1)", text: "#60a5fa", border: "rgba(59,130,246,0.3)" },
  "JavaScript": { bg: "rgba(245,158,11,0.1)", text: "#fbbf24", border: "rgba(245,158,11,0.3)" },
  "Tailwind CSS": { bg: "rgba(14,165,233,0.1)", text: "#38bdf8", border: "rgba(14,165,233,0.3)" },
  "Node.js": { bg: "rgba(16,185,129,0.1)", text: "#34d399", border: "rgba(16,185,129,0.3)" },
  "Express.js": { bg: "rgba(139,92,246,0.1)", text: "#a78bfa", border: "rgba(139,92,246,0.3)" },
  "MongoDB": { bg: "rgba(16,185,129,0.12)", text: "#10b981", border: "rgba(16,185,129,0.35)" },
  "Firebase": { bg: "rgba(249,115,22,0.1)", text: "#fb923c", border: "rgba(249,115,22,0.3)" },
  "Flutter": { bg: "rgba(2,132,199,0.1)", text: "#38bdf8", border: "rgba(2,132,199,0.3)" },
  "TensorFlow Lite": { bg: "rgba(245,158,11,0.12)", text: "#f59e0b", border: "rgba(245,158,11,0.35)" },
  "Figma to Code": { bg: "rgba(236,72,153,0.1)", text: "#f472b6", border: "rgba(236,72,153,0.3)" },
  "JWT": { bg: "rgba(236,72,153,0.1)", text: "#f472b6", border: "rgba(236,72,153,0.3)" },
}

function TechBadge({ label }: { label: string }) {
  const brand = TECH_TAG_COLORS[label]
  if (brand) {
    return (
      <span
        className="text-[11px] font-medium px-2.5 py-0.5 rounded-full transition-all duration-200 hover:scale-105"
        style={{ background: brand.bg, color: brand.text, border: `1px solid ${brand.border}` }}
      >
        {label}
      </span>
    )
  }
  return <span className="tech-badge">{label}</span>
}

// ================================================================
// DEFAULT DATA
// ================================================================
const ROLES = [
  "Full-Stack Developer",
  "MERN Stack Specialist",
  "Fiverr Level-1 Freelancer",
  "UI/UX Engineering Enthusiast",
  "Next.js & React Architect",
]

const STATS = [
  { label: "Projects Built",    icon: Code2,     color: "#f59e0b", num: 12,  suffix: "+"         },
  { label: "Happy Clients",     icon: Users,     color: "#0ea5e9", num: 15,  suffix: "+"         },
  { label: "Fiverr Rating",     icon: Star,      color: "#fbbf24", num: 5.0, suffix: "★", isFloat: true },
  { label: "On-Time Delivery",  icon: Award,     color: "#10b981", num: 100, suffix: "%"         },
]

const DEFAULT_SKILLS = [
  { id:"1", category:"Frontend",         items:["React.js","Next.js 15","TypeScript","JavaScript","Tailwind CSS","Redux","HTML5/CSS3"], color:"#06b6d4", level:92 },
  { id:"2", category:"Backend",          items:["Node.js","Express.js","REST APIs","JWT Authentication","WebSockets","Middleware"],      color:"#10b981", level:88 },
  { id:"3", category:"Database & Cloud", items:["MongoDB","Mongoose","Firebase","PostgreSQL","Vercel","Railway","Render"],              color:"#f59e0b", level:85 },
  { id:"4", category:"Design & Tools",   items:["Figma to Code","Git & GitHub","VS Code","Postman","Responsive UI","Glassmorphism"],      color:"#ec4899", level:90 },
]

const DEFAULT_SERVICES = [
  { id:"1", title:"Full-Stack Web Development", description:"End-to-end web applications using the MERN stack with clean architecture, secure authentication, and modern UI/UX.",        points:["MERN Stack Web Apps","SSR & Next.js 15","State Management & Redux"], color:"#f59e0b" },
  { id:"2", title:"API Development",            description:"Production-grade RESTful APIs with Express.js, JWT authentication, rate limiting, error handling, and documentation.",  points:["REST API Design","JWT & OAuth 2.0","Rate Limiting & Security"],     color:"#10b981" },
  { id:"3", title:"UI/UX Development",          description:"Pixel-perfect, responsive interfaces converting Figma designs into high-performance React & Tailwind code.",              points:["Responsive Mobile-First","Figma to React Code","Micro-animations & 3D"], color:"#ec4899" },
  { id:"4", title:"Deployment & Optimization",  description:"Seamless deployment on Vercel, Railway, and Render with CI/CD workflows, performance tuning, and SEO best practices.",   points:["Vercel / Railway / Render","Speed & Performance Tuning","SEO & Accessibility"], color:"#0ea5e9" },
]

const DEFAULT_PROJECTS: ProjectDetail[] = [
  {
    id: "1",
    title: "ThinkBoard",
    subtitle: "MERN Notes App",
    category: "Full-Stack MERN",
    description: "A modern collaborative note-taking and knowledge base app with markdown support, user authentication, and rate-limited APIs.",
    tech: ["MongoDB", "Express.js", "React", "Node.js", "Tailwind CSS", "JWT"],
    github: "https://github.com/mani78979/mern-thinkboard",
    live: "https://mern-thinkboard-production-56fc.up.railway.app/",
    accentColor: "#f59e0b",
  },
  {
    id: "2",
    title: "GeoSpatial Urbanization",
    subtitle: "Flutter + AI Sprawl Analysis",
    category: "Mobile & AI",
    description: "Cross-platform mobile application analyzing urban growth and satellite imagery using TensorFlow Lite and GeoJSON mapping.",
    tech: ["Flutter", "Dart", "Firebase", "TensorFlow Lite", "GIS Data"],
    github: "https://github.com/mani78979/GeoSpatial-Analysis-for-Better-Urbanization-of-Faisalabad-City",
    live: "",
    accentColor: "#0ea5e9",
  },
  {
    id: "3",
    title: "Dev Portfolio",
    subtitle: "Next.js 15 Portfolio",
    category: "Next.js / Frontend",
    description: "High-performance portfolio built with Next.js 15, TypeScript, Tailwind CSS, custom CLI terminal, and Web Audio synth sound effects.",
    tech: ["Next.js 15", "TypeScript", "Tailwind CSS", "Web Audio API", "Mongoose"],
    github: "https://github.com/musman079/my-portfolio",
    live: "",
    accentColor: "#10b981",
  },
]

const DEFAULT_REVIEWS = [
  { id:"1", name:"john_d***",  country:"🇺🇸 United States", rating:5, review:"Exceptional work! Usman built our full-stack web app ahead of schedule with very clean code. Great communication throughout.",   date:"2 weeks ago",  project:"MERN Stack Web App"      },
  { id:"2", name:"sarah_m***", country:"🇬🇧 United Kingdom", rating:5, review:"Outstanding developer! Delivered exactly what we needed for our React dashboard. Professional attitude and top-quality code.",    date:"1 month ago",  project:"React Dashboard"          },
  { id:"3", name:"ahmed_k***", country:"🇸🇦 Saudi Arabia", rating:5, review:"Very professional and talented. Fixed our Node.js app bugs quickly and improved performance significantly. 5 stars!",            date:"1 month ago",  project:"Node.js Bug Fix"          },
  { id:"4", name:"lucas_b***", country:"🇩🇪 Germany",        rating:5, review:"Top-tier developer. Built our MongoDB API integration flawlessly with proper documentation. Will definitely hire again.",        date:"2 months ago", project:"MongoDB API Integration"  },
  { id:"5", name:"priya_s***", country:"🇮🇳 India",          rating:5, review:"Excellent experience! Responsive, talented, and delivers quality work every time. Built our company website perfectly.",         date:"2 months ago", project:"Company Website"          },
  { id:"6", name:"mike_r***",  country:"🇺🇸 United States", rating:5, review:"Usman is a rockstar developer. Understood requirements immediately and delivered a polished product. Best freelancer on Fiverr.", date:"3 months ago", project:"Full Stack E-commerce"     },
]

const JOURNEY_STEPS = [
  {
    year: "2024 — Present",
    title: "Freelance Full-Stack Developer",
    subtitle: "Fiverr Level-1 Seller (5.0★ Rating)",
    description: "Delivering end-to-end full-stack web applications for global clients with 100% on-time completion, specializing in MERN stack and Next.js.",
    badge: "Active",
    color: "#f59e0b",
  },
  {
    year: "2023 — 2024",
    title: "Full-Stack Web Specialization",
    subtitle: "MERN Stack & Next.js Ecosystem",
    description: "Deep dive into scalable RESTful API design, JWT authentication, MongoDB optimization, and modern React 19 / Next.js architecture.",
    badge: "Milestone",
    color: "#0ea5e9",
  },
  {
    year: "2022 — 2023",
    title: "Mobile & Machine Learning Research",
    subtitle: "Satellite Imagery & Urban Sprawl Analysis",
    description: "Engineered cross-platform mobile apps using Flutter and integrated offline-capable TensorFlow Lite machine learning models for satellite image analysis.",
    badge: "Research",
    color: "#10b981",
  },
  {
    year: "2021 — 2025",
    title: "BS Computer Science",
    subtitle: "Undergraduate Degree",
    description: "Comprehensive computer science education focusing on Data Structures, Algorithms, Database Management Systems, and Software Architecture.",
    badge: "Degree",
    color: "#8b5cf6",
  },
]

const TECH_STACK = [
  "React", "Next.js 15", "TypeScript", "Node.js", "Express.js", "MongoDB", "Tailwind CSS",
  "Firebase", "REST APIs", "JWT Auth", "Git & GitHub", "Vercel", "Figma", "Redux Toolkit",
  "WebSockets", "Docker", "PostgreSQL", "Railway", "Render", "VS Code",
]

const NAV_LINKS = [
  { label:"About",      id:"about"     },
  { label:"Journey",    id:"journey"   },
  { label:"Skills",     id:"skills"    },
  { label:"Services",   id:"services"  },
  { label:"Projects",   id:"projects"  },
  { label:"Estimator",  id:"estimator" },
  { label:"Reviews",    id:"reviews"   },
  { label:"Contact",    id:"contact"   },
]

// ================================================================
// HIGH PERFORMANCE CUSTOM CURSOR (Hardware-Accelerated Lerp)
// ================================================================
function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let mx = -100, my = -100, rx = -100, ry = -100
    let rafId: number

    const onMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mx - 4}px, ${my - 4}px, 0)`
      }
    }

    const tick = () => {
      rx += (mx - rx) * 0.22
      ry += (my - ry) * 0.22
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${rx - 18}px, ${ry - 18}px, 0)`
      }
      rafId = requestAnimationFrame(tick)
    }

    const onEnter = () => {
      dotRef.current?.classList.add("cursor-hover")
      ringRef.current?.classList.add("cursor-hover")
      playHoverSound()
    }
    const onLeave = () => {
      dotRef.current?.classList.remove("cursor-hover")
      ringRef.current?.classList.remove("cursor-hover")
    }

    window.addEventListener("mousemove", onMove, { passive: true })
    rafId = requestAnimationFrame(tick)

    const interactiveElements = document.querySelectorAll("a, button, input, textarea, [role='button']")
    interactiveElements.forEach(el => {
      el.addEventListener("mouseenter", onEnter)
      el.addEventListener("mouseleave", onLeave)
    })

    return () => {
      window.removeEventListener("mousemove", onMove)
      cancelAnimationFrame(rafId)
      interactiveElements.forEach(el => {
        el.removeEventListener("mouseenter", onEnter)
        el.removeEventListener("mouseleave", onLeave)
      })
    }
  }, [])

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  aria-hidden />
      <div ref={ringRef} className="cursor-ring" aria-hidden />
    </>
  )
}

// ================================================================
// HIGH PERFORMANCE INTERACTIVE CONSTELLATION CANVAS (120 FPS)
// ================================================================
function InteractiveConstellationCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    interface Node {
      x: number
      y: number
      vx: number
      vy: number
      radius: number
      color: string
    }

    const COLORS = ["#f59e0b", "#06b6d4", "#10b981", "#ec4899", "#8b5cf6", "#38bdf8"]
    let nodes: Node[] = []
    let mouse = { x: -1000, y: -1000, radiusSq: 14400 }
    let isVisible = true

    const initNodes = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      const count = window.innerWidth < 768 ? 20 : 45
      nodes = []
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 1.5 + 0.8,
          color: COLORS[i % COLORS.length],
        })
      }
    }

    initNodes()
    window.addEventListener("resize", initNodes, { passive: true })

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }
    window.addEventListener("mousemove", handleMouseMove, { passive: true })

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting
    }, { threshold: 0.1 })
    observer.observe(canvas)

    let rafId: number
    const maxDistSq = 12100

    const draw = () => {
      if (isVisible) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        for (let i = 0; i < nodes.length; i++) {
          const ni = nodes[i]
          for (let j = i + 1; j < nodes.length; j++) {
            const nj = nodes[j]
            const dx = ni.x - nj.x
            const dy = ni.y - nj.y
            const distSq = dx * dx + dy * dy
            if (distSq < maxDistSq) {
              const alpha = (1 - distSq / maxDistSq) * 0.22
              ctx.beginPath()
              ctx.moveTo(ni.x, ni.y)
              ctx.lineTo(nj.x, nj.y)
              ctx.strokeStyle = `rgba(245, 158, 11, ${alpha})`
              ctx.lineWidth = 0.6
              ctx.stroke()
            }
          }
        }

        for (let i = 0; i < nodes.length; i++) {
          const n = nodes[i]

          const mdx = n.x - mouse.x
          const mdy = n.y - mouse.y
          const mDistSq = mdx * mdx + mdy * mdy
          if (mDistSq < mouse.radiusSq && mDistSq > 0) {
            const mDist = Math.sqrt(mDistSq)
            const force = (1 - mDist / 120) * 1.2
            n.x += (mdx / mDist) * force
            n.y += (mdy / mDist) * force
          }

          n.x += n.vx
          n.y += n.vy

          if (n.x < 0) n.x = canvas.width
          if (n.x > canvas.width) n.x = 0
          if (n.y < 0) n.y = canvas.height
          if (n.y > canvas.height) n.y = 0

          ctx.beginPath()
          ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2)
          ctx.fillStyle = n.color
          ctx.fill()
        }
      }

      rafId = requestAnimationFrame(draw)
    }

    rafId = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener("resize", initNodes)
      window.removeEventListener("mousemove", handleMouseMove)
      observer.disconnect()
      cancelAnimationFrame(rafId)
    }
  }, [])

  return <canvas ref={canvasRef} className="stars-canvas" />
}

// ================================================================
// ANIMATED COUNTER
// ================================================================
function AnimatedCounter({ num, suffix, isFloat }: { num:number; suffix:string; isFloat?:boolean }) {
  const [display, setDisplay] = useState("0")
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true
        const STEPS = 40, DUR = 1400
        let step = 0
        const id = setInterval(() => {
          step++
          const p = 1 - Math.pow(1 - step / STEPS, 3)
          setDisplay((isFloat ? (num * p).toFixed(1) : Math.floor(num * p).toString()) + suffix)
          if (step >= STEPS) clearInterval(id)
        }, DUR / STEPS)
      }
    }, { threshold: 0.5 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [num, suffix, isFloat])

  return <span ref={ref} className="counter-value">{display}</span>
}

// ================================================================
// TECH MARQUEE
// ================================================================
function TechMarquee() {
  const doubled = [...TECH_STACK, ...TECH_STACK]
  return (
    <div className="marquee-outer py-2">
      <div className="marquee-track animate-marquee">
        {doubled.map((t, i) => (
          <span key={i} className="marquee-item">
            <span className="marquee-dot" />{t}
          </span>
        ))}
      </div>
    </div>
  )
}

// ================================================================
// SPOTLIGHT CARD (Lightweight CSS Variable Update)
// ================================================================
function SpotlightCard({ children, className, style, onClick }: { children:React.ReactNode; className?:string; style?:React.CSSProperties; onClick?: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current; if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`)
    el.style.setProperty("--my", `${((e.clientY - r.top)  / r.height) * 100}%`)
  }, [])
  return (
    <div ref={ref} className={`glass-card spotlight-card ${className ?? ""}`} style={style} onMouseMove={handleMouseMove} onClick={onClick}>
      {children}
    </div>
  )
}

// ================================================================
// 3D TILT CARD
// ================================================================
function TiltCard({ children, className, style }: { children:React.ReactNode; className?:string; style?:React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null)
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current; if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width  - 0.5
    const y = (e.clientY - r.top)  / r.height - 0.5
    el.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`
  }, [])
  const handleMouseLeave = useCallback(() => {
    const el = ref.current; if (!el) return
    el.style.transition = "transform .4s cubic-bezier(.22,1,.36,1)"
    el.style.transform  = "perspective(900px) rotateY(0) rotateX(0) translateY(0)"
    setTimeout(() => { if (ref.current) ref.current.style.transition = "" }, 420)
  }, [])
  return (
    <div ref={ref} className={`card-3d ${className ?? ""}`} style={{ transformStyle:"preserve-3d", willChange:"transform", ...style }}
      onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      {children}
    </div>
  )
}

// ================================================================
// CODE WINDOW (Hero decoration with CLI trigger)
// ================================================================
function CodeWindow({ onOpenTerminal }: { onOpenTerminal: () => void }) {
  return (
    <div className="code-window animate-float cursor-pointer group" style={{ animationDuration:"6s" }} onClick={onOpenTerminal}>
      <div className="code-window-header flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="code-dot red"    />
          <div className="code-dot yellow" />
          <div className="code-dot green"  />
          <span className="code-filename">developer.config.ts</span>
        </div>
        <span className="text-[10px] font-mono text-amber-400 opacity-80 group-hover:opacity-100 flex items-center gap-1">
          <Terminal className="w-3 h-3" /> Click to open CLI
        </span>
      </div>
      <div className="code-body" style={{ color:"rgba(255,255,255,0.85)" }}>
        <span className="code-line"><span className="cm">// Full-Stack Architect Profile</span></span>
        <span className="code-line"><span className="ck">export const</span> <span className="cv">developer</span> <span className="cp">= {"{"}</span></span>
        <span className="code-line">{"  "}<span className="cv">name</span><span className="cp">:</span> <span className="cs">&quot;Muhammad Usman&quot;</span><span className="cp">,</span></span>
        <span className="code-line">{"  "}<span className="cv">stack</span><span className="cp">: [</span><span className="cs">&quot;MERN&quot;</span><span className="cp">,</span> <span className="cs">&quot;Next.js 15&quot;</span><span className="cp">,</span> <span className="cs">&quot;TypeScript&quot;</span><span className="cp">],</span></span>
        <span className="code-line">{"  "}<span className="cv">rating</span><span className="cp">:</span> <span className="cs">&quot;5.0 ★ on Fiverr&quot;</span><span className="cp">,</span></span>
        <span className="code-line">{"  "}<span className="cv">status</span><span className="cp">:</span> <span className="cs">&quot;Available for Hire&quot;</span><span className="cp">,</span></span>
        <span className="code-line">{"  "}<span className="cv">launchCLI</span><span className="cp">:</span> <span className="cb">() =&gt;</span> <span className="cs">&quot;Type 'help' in console&quot;</span></span>
        <span className="code-line"><span className="cp">{"}"}</span><span className="cp">;</span></span>
      </div>
    </div>
  )
}

// ================================================================
// MAIN PORTFOLIO COMPONENT
// ================================================================
export default function Portfolio() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [typingText, setTypingText] = useState("")
  const [roleIndex, setRoleIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [navScrolled, setNavScrolled] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [soundActive, setSoundActive] = useState(false)
  const [activeSection, setActiveSection] = useState("about")

  // Refs for GPU transforms (zero React re-renders on mousemove or scroll)
  const heroRef = useRef<HTMLElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)

  // Modals & Tools
  const [terminalOpen, setTerminalOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<ProjectDetail | null>(null)
  const [projectFilter, setProjectFilter] = useState<string>("All")
  const [copiedEmail, setCopiedEmail] = useState(false)

  // Contact Form State
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    projectType: "Full-Stack MERN App",
    message: "",
  })
  const [contactStatus, setContactStatus] = useState<"idle" | "sent">("idle")

  // Dynamic data
  const [dynProjects, setDynProjects] = useState<ProjectDetail[]>(DEFAULT_PROJECTS)
  const [dynReviews, setDynReviews] = useState(DEFAULT_REVIEWS)
  const [dynSkills, setDynSkills] = useState(DEFAULT_SKILLS)
  const [dynServices, setDynServices] = useState(DEFAULT_SERVICES)
  const [dynProfile, setDynProfile] = useState({
    avatarUrl: "/placeholder.jpg",
    name: "Muhammad Usman",
    title: "Full-Stack Developer",
    bio: "Dedicated Full-Stack Developer with a focus on the MERN stack — MongoDB, Express.js, React, and Node.js.",
    resumeUrl: "https://drive.google.com/file/d/1L8iT_FWQeu5zaE9CWjt7kEoik7iMzb51/view?usp=sharing",
    available: true,
  })

  // Keyboard shortcut for Command Palette (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        setPaletteOpen(prev => !prev)
      }
    }
    window.addEventListener("keydown", handleGlobalKey)
    return () => window.removeEventListener("keydown", handleGlobalKey)
  }, [])

  useEffect(() => {
    setIsMounted(true)
    setSoundActive(isSoundEnabled())

    // Fetch dynamic data from MongoDB APIs
    Promise.all([
      fetch('/api/projects').then(r => r.json()).catch(() => DEFAULT_PROJECTS),
      fetch('/api/reviews').then(r => r.json()).catch(() => DEFAULT_REVIEWS),
      fetch('/api/skills').then(r => r.json()).catch(() => DEFAULT_SKILLS),
      fetch('/api/services').then(r => r.json()).catch(() => DEFAULT_SERVICES),
      fetch('/api/profile').then(r => r.json()).catch(() => null)
    ]).then(([projects, reviews, skills, services, profile]) => {
      if (Array.isArray(projects) && projects.length) setDynProjects(projects)
      if (Array.isArray(reviews) && reviews.length) setDynReviews(reviews)
      if (Array.isArray(skills) && skills.length) setDynSkills(skills)
      if (Array.isArray(services) && services.length) setDynServices(services)
      if (profile && profile.avatarUrl) setDynProfile(profile)
    })
  }, [])

  // Typing animation
  useEffect(() => {
    const role = ROLES[roleIndex]
    const speed = isDeleting ? 35 : 95
    const t = setTimeout(() => {
      if (!isDeleting) {
        if (typingText.length < role.length) setTypingText(role.slice(0, typingText.length + 1))
        else setTimeout(() => setIsDeleting(true), 2400)
      } else {
        if (typingText.length > 0) setTypingText(role.slice(0, typingText.length - 1))
        else { setIsDeleting(false); setRoleIndex(p => (p + 1) % ROLES.length) }
      }
    }, speed)
    return () => clearTimeout(t)
  }, [typingText, roleIndex, isDeleting])

  // 120 FPS Scroll Handler & Progress Bar
  useEffect(() => {
    let prevScrolled = false
    const handleScroll = () => {
      const isScrolled = window.scrollY > 60
      if (isScrolled !== prevScrolled) {
        prevScrolled = isScrolled
        setNavScrolled(isScrolled)
      }

      if (progressBarRef.current) {
        const docH = document.documentElement.scrollHeight - window.innerHeight
        const pct = docH > 0 ? (window.scrollY / docH) * 100 : 0
        progressBarRef.current.style.width = `${pct}%`
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // 120 FPS Mouse Parallax
  useEffect(() => {
    let ticking = false
    const handleMouseMove = (e: MouseEvent) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (heroRef.current) {
            const x = (e.clientX / window.innerWidth - 0.5) * 2
            const y = (e.clientY / window.innerHeight - 0.5) * 2
            heroRef.current.style.setProperty("--mouse-x", `${x}`)
            heroRef.current.style.setProperty("--mouse-y", `${y}`)
          }
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // High Performance Active Section Spy via IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.3 }
    )

    NAV_LINKS.forEach(l => {
      const el = document.getElementById(l.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  // Scroll reveal observer
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("revealed") }),
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    )
    const t = setTimeout(() => {
      document.querySelectorAll(".reveal,.reveal-left,.reveal-right").forEach(el => obs.observe(el))
    }, 100)
    return () => { clearTimeout(t); obs.disconnect() }
  }, [projectFilter])

  const scrollTo = (id: string) => {
    playClickSound()
    document.getElementById(id)?.scrollIntoView({ behavior:"smooth" })
    setIsMenuOpen(false)
  }

  const toggleSound = () => {
    const next = !soundActive
    setSoundEnabled(next)
    setSoundActive(next)
    if (next) playSuccessSound()
  }

  const handleCopyEmail = () => {
    playSuccessSound()
    navigator.clipboard.writeText("usmankousar772@gmail.com")
    setCopiedEmail(true)
    setTimeout(() => setCopiedEmail(false), 2500)
  }

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    playSuccessSound()
    setContactStatus("sent")
    setTimeout(() => {
      setContactStatus("idle")
      setContactForm({ name: "", email: "", projectType: "Full-Stack MERN App", message: "" })
    }, 4000)
  }

  // Filter projects
  const filteredProjects = dynProjects.filter(p => {
    if (projectFilter === "All") return true
    if (projectFilter === "Full-Stack MERN") return p.category?.includes("MERN") || p.tech.includes("MongoDB") || p.tech.includes("Express.js")
    if (projectFilter === "Next.js / Frontend") return p.tech.includes("Next.js") || p.tech.includes("React") || p.tech.includes("Tailwind CSS")
    if (projectFilter === "Mobile & AI") return p.tech.includes("Flutter") || p.tech.includes("TensorFlow Lite") || p.category?.includes("AI")
    return true
  })

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-amber-500/30 selection:text-amber-500">
      <div className="noise-overlay" aria-hidden />
      {isMounted && <CustomCursor />}
      <div ref={progressBarRef} className="scroll-progress" style={{ width: "0%" }} aria-hidden />

      {/* ====== MODALS & TOOLS ====== */}
      <DevTerminal isOpen={terminalOpen} onClose={() => setTerminalOpen(false)} />
      <CommandPalette
        isOpen={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onOpenTerminal={() => setTerminalOpen(true)}
        onCopyEmail={handleCopyEmail}
      />
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      {/* ====== FLOATING ACTION SHORTCUTS ====== */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2.5">
        <button
          onClick={() => {
            playClickSound()
            setTerminalOpen(true)
          }}
          className="p-3.5 rounded-full bg-[#111420] text-amber-400 border border-amber-500/40 shadow-xl hover:scale-110 hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all duration-200"
          aria-label="Open CLI Terminal"
          title="Open Developer Console (CLI)"
        >
          <Terminal className="w-5 h-5" />
        </button>
        <button
          onClick={() => {
            playClickSound()
            setPaletteOpen(true)
          }}
          className="p-3.5 rounded-full bg-[#111420] text-sky-400 border border-sky-500/40 shadow-xl hover:scale-110 hover:shadow-[0_0_25px_rgba(14,165,233,0.4)] transition-all duration-200"
          aria-label="Command Palette"
          title="Command Palette (Ctrl+K)"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* ====== NAVBAR ====== */}
      <nav className={`fixed z-50 w-full px-4 transition-all duration-500 ${navScrolled ? "top-0" : "top-2"}`}>
        <div className={`flex h-14 items-center justify-between px-6 max-w-6xl mx-auto rounded-2xl transition-all duration-400 ${navScrolled ? "glass shadow-2xl" : "bg-transparent"}`}
          style={navScrolled ? { borderColor:"rgba(245,158,11,0.18)" } : {}}>
          <a href="/" onClick={() => playClickSound()}>
            <span className="text-xl font-bold tracking-tight gradient-text-animated glitch-text font-mono" data-text="<M.Usman />">
              {"<M.Usman />"}
            </span>
          </a>
          <div className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map(({ label, id }) => (
              <button
                key={id}
                id={`nav-${id}`}
                onClick={() => scrollTo(id)}
                className={`nav-link text-xs uppercase tracking-wider font-mono ${activeSection === id ? "active text-amber-500 font-bold" : ""}`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Command Palette Trigger */}
            <button
              onClick={() => {
                playClickSound()
                setPaletteOpen(true)
              }}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono text-muted-foreground hover:text-foreground bg-slate-100 dark:bg-white/5 border border-border hover:border-amber-500/30 transition-all"
              title="Command Palette (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-amber-500" />
              <span>Search</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[10px] text-foreground">⌘K</kbd>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className={`p-2 rounded-xl border transition-all ${
                soundActive
                  ? "text-amber-500 bg-amber-500/10 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                  : "text-muted-foreground bg-slate-100 dark:bg-white/5 border-border hover:text-foreground"
              }`}
              aria-label={soundActive ? "Mute Sound" : "Enable Sound"}
              title={soundActive ? "Sound Effects ON" : "Sound Effects OFF"}
            >
              {soundActive ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Admin Link */}
            <a href="/admin" aria-label="Admin Dashboard" className="p-2 rounded-xl text-muted-foreground hover:text-amber-500 transition-colors"
              style={{ border:"1px solid rgba(245,158,11,0.2)", background:"rgba(245,158,11,0.06)" }}>
              <Settings className="h-4 w-4" />
            </a>

            {/* Hire Me CTA */}
            <Button id="hire-me-btn" size="sm" onClick={() => scrollTo("contact")}
              className="hidden md:flex gap-1.5 text-xs px-4 btn-primary-glow font-bold"
              style={{ background:"linear-gradient(135deg,#f59e0b,#0ea5e9)", color:"#000", border:"none" }}>
              <Zap className="h-3.5 w-3.5" />Hire Me
            </Button>

            {/* Mobile menu toggle */}
            <button id="mobile-menu-toggle" className="lg:hidden p-1.5 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => {
                playClickSound()
                setIsMenuOpen(!isMenuOpen)
              }} aria-label="Toggle menu">
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMenuOpen && (
          <div className="lg:hidden glass mx-4 mt-2 rounded-2xl animate-fade-in shadow-2xl" style={{ borderColor:"rgba(245,158,11,0.2)" }}>
            <div className="flex flex-col px-6 py-4 gap-1">
              {NAV_LINKS.map(({ label, id }) => (
                <button key={id} onClick={() => scrollTo(id)}
                  className={`text-left py-2.5 text-sm font-medium border-b border-border ${activeSection === id ? "text-amber-500 font-bold" : "text-muted-foreground hover:text-foreground"}`}>
                  {label}
                </button>
              ))}
              <div className="flex gap-2 pt-3">
                <Button size="sm" onClick={() => {
                  setTerminalOpen(true)
                  setIsMenuOpen(false)
                }} variant="outline" className="flex-1 text-xs gap-1.5 border-amber-500/30 text-amber-500">
                  <Terminal className="h-3.5 w-3.5" /> Dev CLI
                </Button>
                <Button size="sm" onClick={() => scrollTo("contact")} className="flex-1 gap-1.5 text-xs font-bold"
                  style={{ background:"linear-gradient(135deg,#f59e0b,#0ea5e9)", color:"#000", border:"none" }}>
                  <Zap className="h-3.5 w-3.5" /> Hire Me
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ====== HERO SECTION ====== */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-28 pb-16">
        {isMounted && <InteractiveConstellationCanvas />}
        <div className="aurora-bg" aria-hidden />

        {/* Orbs with GPU Hardware Acceleration */}
        <div className="hero-orb-1 will-change-transform" style={{ transform:`translate3d(calc(var(--mouse-x, 0) * 18px), calc(var(--mouse-y, 0) * 12px), 0)` }} aria-hidden />
        <div className="hero-orb-2 will-change-transform" style={{ transform:`translate3d(calc(var(--mouse-x, 0) * -16px), calc(var(--mouse-y, 0) * -10px), 0)` }} aria-hidden />
        <div className="hero-orb-3 will-change-transform" aria-hidden />

        {/* Grid Background */}
        <div className="absolute inset-0 -z-10" style={{
          backgroundImage:"linear-gradient(rgba(245,158,11,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(245,158,11,.03) 1px,transparent 1px)",
          backgroundSize:"72px 72px",
          maskImage:"radial-gradient(ellipse 85% 85% at 50% 50%,black 30%,transparent 100%)",
        }} aria-hidden />

        <div className="container px-6 mx-auto max-w-6xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Hero Details */}
            <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left will-change-transform"
              style={{ transform:`translate3d(calc(var(--mouse-x, 0) * -5px), calc(var(--mouse-y, 0) * -3px), 0)` }}>

              {/* Available for freelance badge */}
              <div id="availability-badge" className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in shadow-[0_0_20px_rgba(34,197,94,0.15)]"
                style={{ border:"1px solid rgba(34,197,94,0.4)", background:"rgba(34,197,94,0.09)", color:"#4ade80" }}>
                <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse-dot" />
                Available for Freelance & Full-Stack Roles
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-[1.15] tracking-tight animate-fade-in text-foreground"
                style={{ animationDelay:".15s" }}>
                Hi, I&apos;m{" "}
                <span className="gradient-text-animated">Muhammad Usman</span>
              </h1>

              <div className="flex items-center justify-center lg:justify-start gap-2 text-xl sm:text-2xl lg:text-3xl font-semibold mb-6 h-10 animate-fade-in"
                style={{ animationDelay:".3s" }}>
                <span className="text-muted-foreground">I&apos;m a&nbsp;</span>
                <span style={{ color:"#f59e0b" }} className="animate-neon">
                  {typingText}<span className="typing-cursor" />
                </span>
              </div>

              <p className="text-base sm:text-lg text-foreground/80 max-w-xl mb-8 leading-relaxed animate-fade-in"
                style={{ animationDelay:".45s" }}>
                Full-Stack MERN & Next.js Engineer crafting scalable, ultra-fast web applications with clean code, secure APIs, and responsive, interactive interfaces.
              </p>

              <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-10 animate-fade-in"
                style={{ animationDelay:".6s" }}>
                <a href={dynProfile.resumeUrl || "https://drive.google.com/file/d/1L8iT_FWQeu5zaE9CWjt7kEoik7iMzb51/view?usp=sharing"} target="_blank" rel="noopener noreferrer">
                  <Button id="download-resume-btn" size="lg" className="gap-2 px-7 font-bold btn-primary-glow"
                    style={{ background:"linear-gradient(135deg,#f59e0b,#0ea5e9)", color:"#000", border:"none" }}>
                    <Download className="h-4 w-4" />Download Resume
                  </Button>
                </a>
                <Button id="get-in-touch-btn" variant="outline" size="lg" className="gap-2 px-7 social-icon border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/5 hover:bg-amber-500/10"
                  onClick={() => scrollTo("contact")}>
                  <Mail className="h-4 w-4" />Get In Touch
                </Button>
              </div>

              {/* Social Channels */}
              <div className="flex items-center justify-center lg:justify-start gap-3 animate-fade-in" style={{ animationDelay:".75s" }}>
                {[
                  { href:"http://github.com/mani78979",         icon:<Github   className="h-[18px] w-[18px]" />, label:"GitHub"   },
                  { href:"http://www.linkedin.com/in/musman78", icon:<Linkedin className="h-[18px] w-[18px]" />, label:"LinkedIn" },
                  { href:"mailto:usmankousar772@gmail.com",     icon:<Mail     className="h-[18px] w-[18px]" />, label:"Email"    },
                ].map(({ href, icon, label }) => (
                  <a key={label} href={href} target={href.startsWith("mailto") ? "_self" : "_blank"} rel="noopener noreferrer"
                    aria-label={label} className="p-3 rounded-xl text-muted-foreground hover:text-foreground transition-all duration-200 social-icon border border-border bg-card"
                  >
                    {icon}
                  </a>
                ))}
                {/* Fiverr */}
                <a href="https://www.fiverr.com/musman079" target="_blank" rel="noopener noreferrer" aria-label="Fiverr"
                  className="p-3 rounded-xl text-muted-foreground hover:text-green-500 transition-all duration-200 social-icon border border-border bg-card"
                >
                  <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.004 15.588a.995.995 0 1 0 .002-1.99.995.995 0 0 0-.002 1.99zm-.996-3.705h-1.33c-.57 0-.995.424-.995.992v4.46H18.38v-4.46c0-.568-.424-.992-.995-.992h-.568v-1.184h.568c.57 0 .995-.424.995-.992V8.58c0-1.756.997-2.752 2.752-2.752h.994v1.313h-.994c-.854 0-1.38.525-1.38 1.38v1.185h1.38v1.184h-1.38v4.46h1.38v-4.46c0-.568.428-.992.996-.992h1.33v1.185zm-8.507-6.59a.89.89 0 0 1 .891.89.89.89 0 0 1-.891.892.89.89 0 0 1-.89-.891.89.89 0 0 1 .89-.891zm.532 3.704h-.532v7.337h-1.33V9.001h-.568V7.817h.568v-.568c0-.568.424-.992.995-.992h.867v1.23zm-5.325 2.752c.284 0 .568.142.71.427L10.85 13.7a2.36 2.36 0 0 0-.427-.284 2.68 2.68 0 0 0-.71-.142c-.854 0-1.523.71-1.523 1.563 0 .855.67 1.563 1.523 1.563.284 0 .568-.142.71-.284l1.186 1.17a2.978 2.978 0 0 1-1.896.71c-1.614 0-2.894-1.28-2.894-2.895 0-1.613 1.28-2.893 2.894-2.893.284 0 .568.142.71.142zM6.254 7.108c.568 0 .995.142 1.38.284l-.142 1.186a2.683 2.683 0 0 0-.995-.284c-.71 0-1.28.568-1.28 1.28v1.043h2.276v1.185H5.217v4.46H3.888v-4.46H3.32V10.617h.568V9.574c0-1.33 1.043-2.466 2.366-2.466z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Right Column: Interactive Code Window */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end mt-4 lg:mt-0 relative z-10 will-change-transform"
              style={{ transform:`translate3d(calc(var(--mouse-x, 0) * -10px), calc(var(--mouse-y, 0) * 6px), 0)` }}>
              <div className="relative w-full flex justify-center lg:justify-end">
                <CodeWindow onOpenTerminal={() => setTerminalOpen(true)} />

                {/* Floating Badges */}
                <div className="absolute -bottom-3 -left-3 glass px-3.5 py-2 rounded-2xl shadow-xl hidden sm:flex items-center gap-2 text-xs font-semibold"
                  style={{ border:"1px solid rgba(245,158,11,0.3)" }}>
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                  <span>5.0 Rating on Fiverr</span>
                </div>
                <div className="absolute -top-3 -right-3 glass px-3.5 py-2 rounded-2xl shadow-xl hidden sm:flex items-center gap-2 text-xs font-semibold"
                  style={{ border:"1px solid rgba(14,165,233,0.3)" }}>
                  <Code2 className="h-4 w-4 text-sky-500" />
                  <span>MERN & Next.js Expert</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <button onClick={() => scrollTo("about")}
              className="inline-flex flex-col items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors mx-auto animate-fade-in group"
              style={{ animationDelay:".9s" }}>
              <span className="text-xs tracking-widest uppercase font-mono group-hover:text-amber-500 transition-colors">Explore Portfolio</span>
              <ChevronDown className="h-4 w-4 animate-bounce" />
            </button>
          </div>
        </div>
      </section>

      {/* ====== STATS SECTION ====== */}
      <section className="py-16 relative overflow-hidden border-y border-border">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-amber-500/5 via-sky-500/5 to-emerald-500/5" />
        <div className="container px-6 mx-auto max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 text-center">
            {STATS.map(({ label, icon:Icon, color, num, suffix, isFloat }, i) => (
              <TiltCard key={label} className="rounded-2xl p-6 flex flex-col items-center gap-3 reveal glass-card"
                style={{ transitionDelay:`${i * 0.08}s` }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ background:`${color}14`, border:`1px solid ${color}28`, boxShadow:`0 0 22px ${color}18` }}>
                  <Icon className="h-6 w-6" style={{ color }} />
                </div>
                <div className="text-3xl font-bold" style={{ color, textShadow:`0 0 18px ${color}55` }}>
                  <AnimatedCounter num={num} suffix={suffix} isFloat={isFloat} />
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground font-medium">{label}</div>
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
        <span className="section-number" aria-hidden>01</span>
        <div className="container px-6 mx-auto max-w-5xl relative z-10">
          <div className="text-center mb-16 reveal">
            <span className="section-label" style={{ color:"#f59e0b", borderColor:"rgba(245,158,11,0.3)" }}>Who I Am</span>
            <h2 className="text-4xl sm:text-5xl font-bold mt-2 tracking-tight text-foreground">About Me</h2>
          </div>
          <div className="grid gap-14 md:grid-cols-2 items-center">
            <div className="space-y-5 reveal-left">
              <p className="text-foreground text-lg leading-relaxed font-medium">
                I&apos;m a dedicated{" "}
                <span style={{ color:"#f59e0b" }} className="font-semibold neon-text">Full-Stack MERN Engineer</span>{" "}
                who specializes in designing scalable, secure web architectures and highly-responsive user interfaces.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                From developing complex multi-tier full stack applications to optimizing REST APIs and crafting Figma-accurate React/Next.js interfaces, I take pride in delivering software that performs flawlessly.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                As a Level-1 freelancer on <span style={{ color:"#1dbf73" }} className="font-semibold">Fiverr</span> with a consistent <span style={{ color:"#fbbf24" }}>5.0★ rating</span>, I have successfully collaborated with businesses and founders across the USA, UK, Germany, and beyond.
              </p>

              {/* Location Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono text-muted-foreground bg-card border border-border">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                <span>Faisalabad, Pakistan • Working with Global Clients</span>
              </div>

              {/* Info cards grid */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                {[
                  { icon:Coffee,   label:"MERN Architecture",    color:"#f59e0b" },
                  { icon:Sparkles, label:"Figma to Pixel-Code",  color:"#06b6d4" },
                  { icon:Terminal, label:"REST API & JWT Auth",  color:"#10b981" },
                  { icon:Globe,    label:"Fiverr Level-1 Pro",   color:"#ec4899" },
                ].map(({ icon:Icon, label, color }) => (
                  <div key={label} className="info-card flex items-center gap-2.5">
                    <Icon className="h-4 w-4 flex-shrink-0" style={{ color }} />
                    <span className="text-xs font-medium text-foreground">{label}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {["React.js","Next.js 15","Node.js","Express.js","MongoDB","TypeScript","Tailwind CSS"].map(sk => (
                  <TechBadge key={sk} label={sk} />
                ))}
              </div>
              <Button variant="outline" size="sm" className="gap-2 group mt-2 border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/5 hover:bg-amber-500/10"
                onClick={() => scrollTo("contact")}>
                Let&apos;s Work Together
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <div className="flex justify-center reveal-right">
              <TiltCard className="relative">
                <div className="absolute inset-0 rounded-full blur-3xl opacity-25"
                  style={{ background:"radial-gradient(circle,#f59e0b,#0ea5e9)" }} />
                <div className="relative w-72 h-72 rounded-full overflow-hidden animate-glow-amber"
                  style={{ border:"2px solid rgba(245,158,11,0.35)" }}>
                  <img src={dynProfile.avatarUrl || "/placeholder.jpg"} alt={dynProfile.name || "Muhammad Usman"} className="object-cover w-full h-full" />
                </div>
                <div className="absolute -bottom-3 -right-3 glass px-4 py-2 rounded-2xl shadow-2xl"
                  style={{ border:"1px solid rgba(245,158,11,0.22)" }}>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-dot" />Available Now
                  </div>
                </div>
                <div className="absolute -top-3 -left-3 glass px-3 py-1.5 rounded-2xl shadow-2xl"
                  style={{ border:"1px solid rgba(29,191,115,0.3)", background:"rgba(29,191,115,0.09)" }}>
                  <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color:"#1dbf73" }}>
                    <Star className="h-3 w-3 fill-current" /> 5.0 on Fiverr
                  </div>
                </div>
              </TiltCard>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider max-w-5xl" />

      {/* ====== JOURNEY & EXPERIENCE TIMELINE ====== */}
      <section id="journey" className="py-28 relative overflow-hidden"
        style={{ background:"linear-gradient(180deg,rgba(14,165,233,0.02) 0%,transparent 100%)" }}>
        <span className="section-number" aria-hidden>02</span>
        <div className="container px-6 mx-auto max-w-4xl relative z-10">
          <div className="text-center mb-16 reveal">
            <span className="section-label" style={{ color:"#0ea5e9", borderColor:"rgba(14,165,233,0.3)" }}>Milestones</span>
            <h2 className="text-4xl sm:text-5xl font-bold mt-2 tracking-tight text-foreground">Experience & Education</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">My professional evolution as a software developer and computer scientist.</p>
          </div>

          <div className="relative pl-6 sm:pl-8 space-y-10 reveal">
            <div className="timeline-line" />
            {JOURNEY_STEPS.map((step, idx) => (
              <div key={idx} className="timeline-item relative">
                <div className="timeline-dot" style={{ background: step.color, boxShadow: `0 0 16px ${step.color}` }} />
                <SpotlightCard className="rounded-2xl p-6 sm:p-7 ml-4 glass-card border border-border">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-bold" style={{ color: step.color }}>
                      {step.year}
                    </span>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full font-semibold"
                      style={{ background: `${step.color}15`, color: step.color, border: `1px solid ${step.color}30` }}>
                      {step.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-1">{step.title}</h3>
                  <div className="text-xs font-mono text-muted-foreground mb-3">{step.subtitle}</div>
                  <p className="text-sm text-foreground/80 leading-relaxed">{step.description}</p>
                </SpotlightCard>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider max-w-5xl" />

      {/* ====== SKILLS ====== */}
      <section id="skills" className="py-28 relative overflow-hidden">
        <span className="section-number" aria-hidden>03</span>
        <div className="container px-6 mx-auto max-w-5xl relative z-10">
          <div className="text-center mb-16 reveal">
            <span className="section-label" style={{ color:"#06b6d4", borderColor:"rgba(6,182,212,0.3)" }}>Tech Arsenal</span>
            <h2 className="text-4xl sm:text-5xl font-bold mt-2 tracking-tight text-foreground">Skills & Capabilities</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">Frameworks, databases, and development tools I build production applications with.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {dynSkills.map((sk, i) => {
              const Icon = SKILL_ICONS[sk.category] ?? SKILL_ICONS.default
              return (
              <SpotlightCard key={sk.id} className="rounded-2xl p-6 reveal glass-card" style={{ transitionDelay:`${i * 0.08}s` }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background:`${sk.color}14`, border:`1px solid ${sk.color}30`, boxShadow:`0 0 16px ${sk.color}20` }}>
                  <Icon style={{ color:sk.color }} className="h-6 w-6" />
                </div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-base text-foreground">{sk.category}</h3>
                  <span className="text-xs font-mono text-muted-foreground font-semibold" style={{ color: sk.color }}>{sk.level}%</span>
                </div>
                <div className="skill-bar mb-4">
                  <div className="skill-bar-fill" style={{ width:`${sk.level}%`, background:`linear-gradient(90deg,${sk.color},${sk.color==="#f59e0b"?"#0ea5e9":"#f59e0b"})` }} />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {sk.items.map(s => <TechBadge key={s} label={s} />)}
                </div>
              </SpotlightCard>
            )})}
          </div>
        </div>
      </section>

      <div className="section-divider max-w-5xl" />

      {/* ====== SERVICES ====== */}
      <section id="services" className="py-28 relative overflow-hidden">
        <span className="section-number" aria-hidden>04</span>
        <div className="container px-6 mx-auto max-w-5xl relative z-10">
          <div className="text-center mb-16 reveal">
            <span className="section-label" style={{ color:"#10b981", borderColor:"rgba(16,185,129,0.3)" }}>What I Offer</span>
            <h2 className="text-4xl sm:text-5xl font-bold mt-2 tracking-tight text-foreground">Services</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">From concept to deployment — engineering complete digital products.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {dynServices.map((svc, i) => {
              const Icon = SERVICE_ICONS[svc.title] ?? Globe
              return (
              <TiltCard key={svc.id} className="glass-card rounded-2xl p-8 reveal group" style={{ transitionDelay:`${i * 0.08}s` }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                  style={{ background:`${svc.color}14`, border:`1px solid ${svc.color}28`, boxShadow:`0 0 20px ${svc.color}20` }}>
                  <Icon style={{ color:svc.color }} className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">{svc.title}</h3>
                <p className="text-muted-foreground leading-relaxed mb-5 text-sm">{svc.description}</p>
                <ul className="space-y-2">
                  {svc.points.map(pt => (
                    <li key={pt} className="flex items-center gap-2 text-sm text-foreground/90">
                      <CheckCircle2 className="h-4 w-4 flex-shrink-0 group-hover:scale-110 transition-transform" style={{ color:svc.color }} />
                      {pt}
                    </li>
                  ))}
                </ul>
              </TiltCard>
            )})}
          </div>
        </div>
      </section>

      <div className="section-divider max-w-5xl" />

      {/* ====== FEATURED PROJECTS WITH FILTER TABS ====== */}
      <section id="projects" className="py-28 relative overflow-hidden"
        style={{ background:"linear-gradient(180deg,rgba(14,165,233,0.02) 0%,transparent 100%)" }}>
        <span className="section-number" aria-hidden>05</span>
        <div className="container px-6 mx-auto max-w-5xl relative z-10">
          <div className="text-center mb-10 reveal">
            <span className="section-label" style={{ color:"#f59e0b", borderColor:"rgba(245,158,11,0.3)" }}>Portfolio</span>
            <h2 className="text-4xl sm:text-5xl font-bold mt-2 tracking-tight text-foreground">Featured Projects</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">Explore my web applications and software engineering projects.</p>
          </div>

          {/* Project Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12 reveal">
            {["All", "Full-Stack MERN", "Next.js / Frontend", "Mobile & AI"].map(tab => {
              const active = projectFilter === tab
              return (
                <button
                  key={tab}
                  onClick={() => {
                    playClickSound()
                    setProjectFilter(tab)
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                    active
                      ? "bg-amber-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.4)]"
                      : "bg-card text-muted-foreground border border-border hover:border-amber-500/30 hover:text-foreground"
                  }`}
                >
                  {tab}
                </button>
              )
            })}
          </div>

          {/* Projects Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((proj, i) => {
              const ProjIcon = PROJECT_ICONS[proj.title] ?? PROJECT_ICONS.default
              return (
              <SpotlightCard
                key={proj.id}
                className="rounded-2xl overflow-hidden reveal group flex flex-col justify-between glass-card"
                style={{ transitionDelay:`${i * 0.08}s` }}
                onClick={() => {
                  playClickSound()
                  setSelectedProject(proj)
                }}
              >
                <div>
                  <div className="h-[2px] w-full"
                    style={{ background:`linear-gradient(90deg,transparent,${proj.accentColor},transparent)`, boxShadow:`0 0 14px ${proj.accentColor}` }} />
                  <div className="p-6 relative z-10">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background:`${proj.accentColor}12`, border:`1px solid ${proj.accentColor}25` }}>
                          <ProjIcon className="h-5 w-5" style={{ color:proj.accentColor }} />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold leading-tight text-foreground group-hover:text-amber-500 transition-colors">{proj.title}</h3>
                          <p className="text-xs font-mono mt-0.5 font-semibold" style={{ color:proj.accentColor }}>{proj.subtitle}</p>
                        </div>
                      </div>
                      <div className="flex gap-1.5 ml-2" onClick={e => e.stopPropagation()}>
                        {proj.github && (
                          <a href={proj.github} target="_blank" rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors bg-slate-100 dark:bg-white/5" title="View Source Code">
                            <Github className="h-4 w-4" />
                          </a>
                        )}
                        {proj.live && (
                          <a href={proj.live} target="_blank" rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors bg-slate-100 dark:bg-white/5" title="Open Live Demo">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">{proj.description}</p>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {proj.tech.map(t => <TechBadge key={t} label={t} />)}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 relative z-10" onClick={e => e.stopPropagation()}>
                  <div className="flex gap-2 pt-4 border-t border-border">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        playClickSound()
                        setSelectedProject(proj)
                      }}
                      className="flex-1 text-xs gap-1 border-border text-foreground hover:border-amber-500/40"
                    >
                      <Layers className="w-3.5 h-3.5" /> Details
                    </Button>
                    {proj.live && (
                      <a href={proj.live} target="_blank" rel="noopener noreferrer" className="flex-1">
                        <Button size="sm" className="w-full gap-1.5 text-xs font-bold"
                          style={{ background:proj.accentColor, color:"#000", border:"none", boxShadow:`0 4px 18px ${proj.accentColor}40` }}>
                          <ExternalLink className="h-3.5 w-3.5" /> Live
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </SpotlightCard>
            )})}
          </div>

          <div className="text-center mt-10 reveal">
            <a href="https://github.com/mani78979" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="gap-2 group border-sky-500/30 text-sky-600 dark:text-sky-400 bg-sky-500/5 hover:bg-sky-500/10">
                <Github className="h-4 w-4" /> View Complete GitHub Portfolio
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      <div className="section-divider max-w-5xl" />

      {/* ====== INTERACTIVE COST ESTIMATOR ====== */}
      <section id="estimator" className="py-28 relative overflow-hidden">
        <span className="section-number" aria-hidden>06</span>
        <div className="container px-6 mx-auto max-w-5xl relative z-10">
          <div className="text-center mb-16 reveal">
            <span className="section-label" style={{ color:"#10b981", borderColor:"rgba(16,185,129,0.3)" }}>Interactive Calculator</span>
            <h2 className="text-4xl sm:text-5xl font-bold mt-2 tracking-tight text-foreground">Project Cost Estimator</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">Select your project type and features for an instant budget and timeline estimation.</p>
          </div>

          <div className="reveal">
            <CostEstimator
              onSelectQuote={details => {
                setContactForm(prev => ({
                  ...prev,
                  message: `Hello Usman, I'd like to get started on this project:\n${details}`,
                }))
                const el = document.getElementById("contact")
                el?.scrollIntoView({ behavior: "smooth" })
              }}
            />
          </div>
        </div>
      </section>

      <div className="section-divider max-w-5xl" />

      {/* ====== REVIEWS ====== */}
      <section id="reviews" className="py-28 relative overflow-hidden"
        style={{ background:"linear-gradient(180deg,rgba(245,158,11,0.02) 0%,transparent 100%)" }}>
        <span className="section-number" aria-hidden>07</span>
        <div className="container px-6 mx-auto max-w-5xl relative z-10">
          <div className="text-center mb-6 reveal">
            <span className="section-label" style={{ color:"#10b981", borderColor:"rgba(16,185,129,0.3)" }}>Client Feedback</span>
            <h2 className="text-4xl sm:text-5xl font-bold mt-2 tracking-tight text-foreground">Fiverr Testimonials</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">100% verified 5-star ratings from international clients.</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-5 mb-12 glass-card rounded-2xl px-8 py-5 max-w-xl mx-auto reveal">
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">{[1,2,3,4,5].map(s => <Star key={s} className="h-5 w-5 fill-yellow-400 star-gold" />)}</div>
              <span className="font-bold text-xl text-foreground">5.0</span>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">Level 1</span> Fiverr Seller</div>
            <div className="w-px h-8 bg-border" />
            <a href="https://www.fiverr.com/musman079" target="_blank" rel="noopener noreferrer">
              <Button size="sm" className="gap-1.5 text-xs btn-fiverr">View Profile <ExternalLink className="h-3 w-3" /></Button>
            </a>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {dynReviews.map(({ name, country, rating, review, date, project }, i) => (
              <SpotlightCard key={i} className="rounded-2xl p-6 reveal relative review-quote glass-card"
                style={{ transitionDelay:`${i * 0.08}s` }}>
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                      style={{ background:"linear-gradient(135deg,rgba(245,158,11,0.15),rgba(14,165,233,0.15))", border:"1px solid rgba(245,158,11,0.28)", color:"#f59e0b" }}>
                      {name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-sm text-foreground">{name}</div>
                      <div className="text-xs text-muted-foreground">{country}</div>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length:rating }).map((_,j) => <Star key={j} className="h-4 w-4 fill-yellow-400 star-gold" />)}
                  </div>
                </div>
                <p className="text-foreground/90 text-sm leading-relaxed mb-4 relative z-10">&quot;{review}&quot;</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 relative z-10 border-t border-border">
                  <span className="font-mono opacity-80 text-amber-500 font-semibold">{project}</span>
                  <span>{date}</span>
                </div>
              </SpotlightCard>
            ))}
          </div>
          <div className="text-center mt-10 reveal">
            <a href="https://www.fiverr.com/musman079" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="gap-2 px-8 btn-fiverr">See All Reviews on Fiverr <ExternalLink className="h-4 w-4" /></Button>
            </a>
          </div>
        </div>
      </section>

      <div className="section-divider max-w-5xl" />

      {/* ====== CONTACT & INQUIRY HUB ====== */}
      <section id="contact" className="py-28 relative overflow-hidden">
        <span className="section-number" aria-hidden>08</span>
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full -z-10"
          style={{ background:"radial-gradient(circle,rgba(245,158,11,0.07) 0%,transparent 70%)", filter:"blur(70px)" }} />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full -z-10"
          style={{ background:"radial-gradient(circle,rgba(14,165,233,0.07) 0%,transparent 70%)", filter:"blur(70px)" }} />

        <div className="container px-6 mx-auto max-w-4xl relative z-10">
          <div className="text-center mb-16 reveal">
            <span className="section-label" style={{ color:"#f59e0b", borderColor:"rgba(245,158,11,0.3)" }}>Get In Touch</span>
            <h2 className="text-4xl sm:text-5xl font-bold mt-2 tracking-tight text-foreground">Let&apos;s Build Together</h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">Have a project, idea, or freelance opportunity? Drop me a message or connect directly.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-12 reveal">
            {/* Quick Action Info Cards */}
            <div className="md:col-span-5 space-y-4">
              {/* One-Click Copy Email */}
              <div
                onClick={handleCopyEmail}
                className="glass-card rounded-2xl p-5 cursor-pointer hover:border-amber-500/50 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-mono text-muted-foreground">Direct Email</div>
                      <div className="text-sm font-semibold text-foreground">usmankousar772@gmail.com</div>
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 text-muted-foreground group-hover:text-amber-500 transition-colors">
                    {copiedEmail ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </div>
                </div>
                {copiedEmail && (
                  <p className="text-[11px] text-emerald-500 mt-2 font-mono">✓ Copied to clipboard!</p>
                )}
              </div>

              {/* WhatsApp / Direct Chat */}
              <a
                href="https://wa.me/923286596772"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card rounded-2xl p-5 block hover:border-emerald-500/50 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-mono text-muted-foreground">WhatsApp Chat</div>
                      <div className="text-sm font-semibold text-foreground">+92 328 6596772</div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-emerald-500 transition-colors" />
                </div>
              </a>

              {/* Fiverr Profile Direct */}
              <a
                href="https://www.fiverr.com/musman079"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card rounded-2xl p-5 block hover:border-emerald-500/50 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1dbf73]/15 border border-[#1dbf73]/30 flex items-center justify-center text-[#1dbf73]">
                      <Star className="w-5 h-5 fill-current" />
                    </div>
                    <div>
                      <div className="text-xs font-mono text-muted-foreground">Fiverr Seller</div>
                      <div className="text-sm font-semibold text-foreground">fiverr.com/musman079</div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-[#1dbf73] transition-colors" />
                </div>
              </a>
            </div>

            {/* Interactive Contact Form */}
            <div className="md:col-span-7">
              <form onSubmit={handleContactSubmit} className="glass-card rounded-3xl p-7 sm:p-8 space-y-4">
                <div>
                  <label className="text-xs font-mono uppercase text-muted-foreground font-bold block mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder="e.g. Alex Johnson"
                    className="admin-input"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-mono uppercase text-muted-foreground font-bold block mb-1.5">
                      Your Email
                    </label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="alex@company.com"
                      className="admin-input"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono uppercase text-muted-foreground font-bold block mb-1.5">
                      Project Type
                    </label>
                    <select
                      value={contactForm.projectType}
                      onChange={e => setContactForm({ ...contactForm, projectType: e.target.value })}
                      className="admin-input bg-slate-100 dark:bg-[#161924]"
                    >
                      <option value="Full-Stack MERN App">Full-Stack MERN App</option>
                      <option value="Next.js / Frontend App">Next.js / Frontend App</option>
                      <option value="REST API Architecture">REST API Architecture</option>
                      <option value="UI/UX Figma Conversion">UI/UX Figma Conversion</option>
                      <option value="Bug Fix / Optimization">Bug Fix / Optimization</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-muted-foreground font-bold block mb-1.5">
                    Project Details / Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={contactForm.message}
                    onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Tell me about your goals, features, or timeline..."
                    className="admin-input resize-none"
                  />
                </div>

                {contactStatus === "sent" ? (
                  <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-sm flex items-center gap-2 font-medium">
                    <CheckCircle2 className="w-4 h-4" /> Message sent successfully! Usman will reply within 24 hours.
                  </div>
                ) : (
                  <Button
                    type="submit"
                    className="w-full gap-2 text-xs font-bold py-5 btn-primary-glow"
                    style={{
                      background: "linear-gradient(135deg,#f59e0b,#0ea5e9)",
                      color: "#000",
                      border: "none",
                    }}
                  >
                    <Send className="w-4 h-4" /> Send Direct Message
                  </Button>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ====== FOOTER ====== */}
      <footer className="py-12 relative border-t border-border">
        <div className="container px-6 mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xl font-bold gradient-text-animated glitch-text font-mono" data-text="<M.Usman />">
                {"<M.Usman />"}
              </span>
              <p className="text-xs text-muted-foreground mt-1">Full-Stack MERN Developer • Available for Global Freelance Work</p>
            </div>

            <p className="text-xs text-muted-foreground text-center">&copy; {new Date().getFullYear()} Muhammad Usman. Built with Next.js 15 & Tailwind CSS.</p>

            <div className="flex items-center gap-3">
              {[
                { href:"https://github.com/mani78979",         icon:<Github   className="h-4 w-4" />, label:"GitHub"   },
                { href:"https://www.linkedin.com/in/musman78", icon:<Linkedin className="h-4 w-4" />, label:"LinkedIn" },
                { href:"mailto:usmankousar772@gmail.com",      icon:<Mail     className="h-4 w-4" />, label:"Email"    },
              ].map(({ href, icon, label }) => (
                <a key={label} href={href} target={href.startsWith("mailto") ? "_self" : "_blank"} rel="noopener noreferrer"
                  aria-label={label} className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground transition-colors social-icon border border-border bg-card"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
