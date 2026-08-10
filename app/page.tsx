"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Github, Linkedin, Mail, ExternalLink, Download, Star, Code2, Server,
  Palette, Globe, Users, Briefcase, ChevronDown, Menu, X, Zap,
  ArrowRight, GitBranch, CheckCircle2, Sparkles, Terminal, Cpu, Coffee, Settings,
} from "lucide-react"
import Image from "next/image"
import { ThemeToggle } from "@/components/theme-toggle"

// ================================================================
// LOCALSTORAGE KEYS (shared with admin panel)
// ================================================================
const LS_KEYS = {
  projects: "portfolio_projects",
  reviews:  "portfolio_reviews",
  skills:   "portfolio_skills",
  services: "portfolio_services",
}

function loadLS<T>(key: string, fallback: T[]): T[] {
  try {
    if (typeof window === "undefined") return fallback
    const d = localStorage.getItem(key)
    return d ? JSON.parse(d) : fallback
  } catch { return fallback }
}

// Icon map for skill categories (admin saves category names)
const SKILL_ICONS: Record<string, React.ElementType> = {
  Frontend: Code2, Backend: Server, Design: Palette,
  "Tools & Deploy": GitBranch, default: Code2,
}
// Icon map for services
const SERVICE_ICONS: Record<string, React.ElementType> = {
  "Full-Stack Web Development": Code2, "API Development": Server,
  "UI/UX Development": Palette, "Deployment & Optimization": Globe,
}
// Icon map for projects
const PROJECT_ICONS: Record<string, React.ElementType> = {
  ThinkBoard: Terminal, "GeoSpatial Urbanization": Cpu,
  "Dev Portfolio": Sparkles, default: Code2,
}

// ================================================================
// DEFAULT DATA (used as fallback if admin hasn't changed anything)
// ================================================================
const ROLES = [
  "Full-Stack Developer",
  "MERN Stack Expert",
  "Freelancer on Fiverr",
  "UI/UX Enthusiast",
  "Problem Solver",
]

const STATS = [
  { label: "Projects Built",    icon: Code2,     color: "#f59e0b", num: 10,  suffix: "+"         },
  { label: "Happy Clients",     icon: Users,     color: "#0ea5e9", num: 15,  suffix: "+"         },
  { label: "Fiverr Rating",     icon: Star,      color: "#fbbf24", num: 5.0, suffix: "★", isFloat: true },
  { label: "Years Freelancing", icon: Briefcase, color: "#10b981", num: 1,   suffix: "+"         },
]

const DEFAULT_SKILLS = [
  { id:"1", category:"Frontend",       items:["React","Next.js","JavaScript","TypeScript","Tailwind CSS","HTML5","CSS3"],    color:"#f59e0b", level:90 },
  { id:"2", category:"Backend",        items:["Node.js","Express.js","MongoDB","Firebase","REST APIs","JWT Auth"],           color:"#0ea5e9", level:85 },
  { id:"3", category:"Design",         items:["Figma","UI/UX Design","Responsive Design","Wireframing","Glassmorphism"],    color:"#f59e0b", level:80 },
  { id:"4", category:"Tools & Deploy", items:["Git","GitHub","Vercel","Railway","Render","VS Code"],                        color:"#0ea5e9", level:88 },
]

const DEFAULT_SERVICES = [
  { id:"1", title:"Full-Stack Web Development", description:"End-to-end web apps using the MERN stack — clean architecture, secure auth, and modern UI/UX.",        points:["MERN Stack Apps","SPA & SSR","Authentication"],              color:"#f59e0b" },
  { id:"2", title:"API Development",            description:"RESTful APIs with Express.js, JWT authentication, rate limiting, error handling, and documentation.",   points:["REST API Design","JWT & OAuth","Rate Limiting"],              color:"#0ea5e9" },
  { id:"3", title:"UI/UX Development",          description:"Pixel-perfect, responsive interfaces using React and Tailwind CSS — turning Figma designs into code.",  points:["Responsive Design","Figma to Code","Micro-animations"],      color:"#f59e0b" },
  { id:"4", title:"Deployment & Optimization",  description:"Deploy on Vercel, Railway, and Render with CI/CD, performance tuning, and SEO best practices.",        points:["Vercel / Railway","Performance Tuning","SEO Optimization"],  color:"#0ea5e9" },
]

const DEFAULT_PROJECTS = [
  { id:"1", title:"ThinkBoard",              subtitle:"MERN Notes App",       description:"A modern note-taking app with markdown support, user authentication, and rate-limited APIs.",               tech:["MongoDB","Express.js","React","Node.js","Tailwind CSS"],   github:"https://github.com/mani78979/mern-thinkboard",                                                 live:"https://mern-thinkboard-production-56fc.up.railway.app/", accentColor:"#f59e0b" },
  { id:"2", title:"GeoSpatial Urbanization", subtitle:"Flutter + AI",          description:"Flutter mobile app analyzing urban sprawl using satellite imagery with TensorFlow Lite.",                 tech:["Flutter","Firebase","TensorFlow Lite","Dart"],             github:"https://github.com/mani78979/GeoSpatial-Analysis-for-Better-Urbanization-of-Faisalabad-City",  live:"",                                                        accentColor:"#0ea5e9" },
  { id:"3", title:"Dev Portfolio",           subtitle:"Next.js 15 Portfolio",  description:"This portfolio — built with Next.js 15, TypeScript, Tailwind CSS, glassmorphism design and advanced animations.", tech:["Next.js 15","TypeScript","Tailwind CSS"],                github:"https://github.com/musman079/my-portfolio",                                                    live:"",                                                        accentColor:"#10b981" },
]

const DEFAULT_REVIEWS = [
  { id:"1", name:"john_d***",  country:"🇺🇸", rating:5, review:"Exceptional work! Usman built our full-stack web app ahead of schedule with very clean code. Great communication throughout.",   date:"2 weeks ago",  project:"MERN Stack Web App"      },
  { id:"2", name:"sarah_m***", country:"🇬🇧", rating:5, review:"Outstanding developer! Delivered exactly what we needed for our React dashboard. Professional attitude and top-quality code.",    date:"1 month ago",  project:"React Dashboard"          },
  { id:"3", name:"ahmed_k***", country:"🇸🇦", rating:5, review:"Very professional and talented. Fixed our Node.js app bugs quickly and improved performance significantly. 5 stars!",            date:"1 month ago",  project:"Node.js Bug Fix"          },
  { id:"4", name:"lucas_b***", country:"🇩🇪", rating:5, review:"Top-tier developer. Built our MongoDB API integration flawlessly with proper documentation. Will definitely hire again.",        date:"2 months ago", project:"MongoDB API Integration"  },
  { id:"5", name:"priya_s***", country:"🇮🇳", rating:5, review:"Excellent experience! Responsive, talented, and delivers quality work every time. Built our company website perfectly.",         date:"2 months ago", project:"Company Website"          },
  { id:"6", name:"mike_r***",  country:"🇺🇸", rating:5, review:"Usman is a rockstar developer. Understood requirements immediately and delivered a polished product. Best freelancer on Fiverr.", date:"3 months ago", project:"Full Stack E-commerce"     },
]

const TECH_STACK = [
  "React","Next.js","TypeScript","Node.js","Express.js","MongoDB","Tailwind CSS",
  "Firebase","REST APIs","JWT Auth","Git","Vercel","Figma","Redux","GraphQL",
  "Flutter","Docker","PostgreSQL","Prisma","Railway","Render","VS Code",
]

const NAV_LINKS = [
  { label:"About",    id:"about"    },
  { label:"Skills",   id:"skills"   },
  { label:"Services", id:"services" },
  { label:"Projects", id:"projects" },
  { label:"Reviews",  id:"reviews"  },
  { label:"Contact",  id:"contact"  },
]

// ================================================================
// CUSTOM CURSOR
// ================================================================
function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let mx = -100, my = -100, rx = -100, ry = -100
    let rafId: number
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY
      if (dotRef.current) dotRef.current.style.transform = `translate(${mx - 4}px,${my - 4}px)`
    }
    const onEnter = () => {
      dotRef.current?.classList.add("cursor-hover")
      ringRef.current?.classList.add("cursor-hover")
    }
    const onLeave = () => {
      dotRef.current?.classList.remove("cursor-hover")
      ringRef.current?.classList.remove("cursor-hover")
    }
    const tick = () => {
      rx = lerp(rx, mx, 0.13); ry = lerp(ry, my, 0.13)
      if (ringRef.current) ringRef.current.style.transform = `translate(${rx - 18}px,${ry - 18}px)`
      rafId = requestAnimationFrame(tick)
    }

    window.addEventListener("mousemove", onMove)
    document.querySelectorAll("a,button").forEach(el => {
      el.addEventListener("mouseenter", onEnter)
      el.addEventListener("mouseleave", onLeave)
    })
    tick()
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(rafId) }
  }, [])

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  aria-hidden />
      <div ref={ringRef} className="cursor-ring" aria-hidden />
    </>
  )
}

// ================================================================
// CANVAS STAR FIELD
// ================================================================
function CanvasStarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const COLORS = ["#f59e0b","#0ea5e9","#fbbf24","#7dd3fc","#ffffff"]
    interface Star { x:number; y:number; vx:number; vy:number; size:number; color:string; phase:number; speed:number }
    const stars: Star[] = []

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener("resize", resize, { passive: true })

    for (let i = 0; i < 75; i++) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        size: Math.random() * 1.2 + 0.4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.6 + 0.3,
      })
    }

    let t = 0, rafId: number
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      t += 0.015
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i]
        s.x += s.vx; s.y += s.vy
        if (s.x < 0) s.x = canvas.width
        if (s.x > canvas.width)  s.x = 0
        if (s.y < 0) s.y = canvas.height
        if (s.y > canvas.height) s.y = 0
        const twinkle = (Math.sin(t * s.speed + s.phase) + 1) / 2
        ctx.globalAlpha = 0.2 + twinkle * 0.7
        ctx.fillStyle   = s.color
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2)
        ctx.fill()
      }
      rafId = requestAnimationFrame(draw)
    }
    draw()
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(rafId) }
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
        const STEPS = 55, DUR = 1800
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
// SPOTLIGHT CARD
// ================================================================
function SpotlightCard({ children, className, style }: { children:React.ReactNode; className?:string; style?:React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null)
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current; if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`)
    el.style.setProperty("--my", `${((e.clientY - r.top)  / r.height) * 100}%`)
  }, [])
  return (
    <div ref={ref} className={`glass-card spotlight-card ${className ?? ""}`} style={style} onMouseMove={handleMouseMove}>
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
    el.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-6px)`
  }, [])
  const handleMouseLeave = useCallback(() => {
    const el = ref.current; if (!el) return
    el.style.transition = "transform .55s cubic-bezier(.22,1,.36,1)"
    el.style.transform  = "perspective(900px) rotateY(0) rotateX(0) translateY(0)"
    setTimeout(() => { if (ref.current) ref.current.style.transition = "" }, 560)
  }, [])
  return (
    <div ref={ref} className={`card-3d ${className ?? ""}`} style={{ transformStyle:"preserve-3d", transition:"transform .12s linear", ...style }}
      onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      {children}
    </div>
  )
}

// ================================================================
// CODE WINDOW (hero decoration)
// ================================================================
function CodeWindow() {
  return (
    <div className="code-window animate-float" style={{ animationDuration:"6s" }}>
      <div className="code-window-header">
        <div className="code-dot red"    />
        <div className="code-dot yellow" />
        <div className="code-dot green"  />
        <span className="code-filename">portfolio.ts</span>
      </div>
      <div className="code-body" style={{ color:"rgba(255,255,255,0.75)" }}>
        <span className="code-line"><span className="cm">// Developer object</span></span>
        <span className="code-line"><span className="ck">const</span> <span className="cv">developer</span> <span className="cp">= {"{"}</span></span>
        <span className="code-line">{"  "}<span className="cv">name</span><span className="cp">:</span> <span className="cs">&quot;M. Usman&quot;</span><span className="cp">,</span></span>
        <span className="code-line">{"  "}<span className="cv">role</span><span className="cp">:</span> <span className="cs">&quot;Full Stack Dev&quot;</span><span className="cp">,</span></span>
        <span className="code-line">{"  "}<span className="cv">stack</span><span className="cp">: [</span><span className="cs">&quot;MERN&quot;</span><span className="cp">,</span> <span className="cs">&quot;Next.js&quot;</span><span className="cp">],</span></span>
        <span className="code-line">{"  "}<span className="cv">fiverr</span><span className="cp">:</span> <span className="cs">&quot;⭐ 5.0 Rating&quot;</span><span className="cp">,</span></span>
        <span className="code-line">{"  "}<span className="cv">available</span><span className="cp">:</span> <span className="cb">true</span><span className="cp">,</span></span>
        <span className="code-line"><span className="cp">{"}"}</span><span className="cp">;</span></span>
      </div>
    </div>
  )
}

// ================================================================
// MAIN PORTFOLIO
// ================================================================
export default function Portfolio() {
  const [isMenuOpen,  setIsMenuOpen]  = useState(false)
  const [typingText,  setTypingText]  = useState("")
  const [roleIndex,   setRoleIndex]   = useState(0)
  const [isDeleting,  setIsDeleting]  = useState(false)
  const [navScrolled, setNavScrolled] = useState(false)
  const [scrollPct,   setScrollPct]   = useState(0)
  const [mousePos,    setMousePos]    = useState({ x:0, y:0 })
  const [isMounted,   setIsMounted]   = useState(false)

  // Dynamic data from localStorage (set by admin panel)
  const [dynProjects, setDynProjects] = useState(DEFAULT_PROJECTS)
  const [dynReviews,  setDynReviews]  = useState(DEFAULT_REVIEWS)
  const [dynSkills,   setDynSkills]   = useState(DEFAULT_SKILLS)
  const [dynServices, setDynServices] = useState(DEFAULT_SERVICES)

  useEffect(() => {
    setIsMounted(true)
    // Load dynamic data from admin localStorage
    setDynProjects(loadLS(LS_KEYS.projects, DEFAULT_PROJECTS))
    setDynReviews( loadLS(LS_KEYS.reviews,  DEFAULT_REVIEWS))
    setDynSkills(  loadLS(LS_KEYS.skills,   DEFAULT_SKILLS))
    setDynServices(loadLS(LS_KEYS.services, DEFAULT_SERVICES))
  }, [])


  // Typing
  useEffect(() => {
    const role  = ROLES[roleIndex]
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

  // Scroll
  useEffect(() => {
    const handle = () => {
      setNavScrolled(window.scrollY > 60)
      const docH = document.documentElement.scrollHeight - window.innerHeight
      setScrollPct(docH > 0 ? (window.scrollY / docH) * 100 : 0)
    }
    window.addEventListener("scroll", handle, { passive:true })
    return () => window.removeEventListener("scroll", handle)
  }, [])

  // Mouse parallax (throttled for 60fps performance)
  useEffect(() => {
    let ticking = false
    const handle = (e: MouseEvent) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setMousePos({
            x: (e.clientX / window.innerWidth  - 0.5) * 2,
            y: (e.clientY / window.innerHeight - 0.5) * 2,
          })
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener("mousemove", handle, { passive:true })
    return () => window.removeEventListener("mousemove", handle)
  }, [])

  // Scroll reveal
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("revealed") }),
      { threshold:0.07, rootMargin:"0px 0px -50px 0px" }
    )
    const t = setTimeout(() => {
      document.querySelectorAll(".reveal,.reveal-left,.reveal-right,.reveal-3d").forEach(el => obs.observe(el))
    }, 150)
    return () => { clearTimeout(t); obs.disconnect() }
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior:"smooth" })
    setIsMenuOpen(false)
  }

  // ================================================================
  // RENDER
  // ================================================================
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">

      <div className="noise-overlay" aria-hidden />
      {isMounted && <CustomCursor />}
      <div className="scroll-progress" style={{ width:`${scrollPct}%` }} aria-hidden />

      {/* ====== NAVBAR ====== */}
      <nav className={`fixed z-50 w-full px-4 transition-all duration-500 ${navScrolled ? "top-0" : "top-2"}`}>
        <div className={`flex h-14 items-center justify-between px-6 max-w-5xl mx-auto rounded-2xl transition-all duration-400 ${navScrolled ? "glass" : "bg-transparent"}`}
          style={navScrolled ? { boxShadow:"0 8px 40px rgba(0,0,0,0.4)", borderColor:"rgba(245,158,11,0.1)" } : {}}>
          <a href="/">
            <span className="text-xl font-bold tracking-tight gradient-text-animated glitch-text" data-text="<M.Usman />">
              {"<M.Usman />"}
            </span>
          </a>
          <div className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map(({ label, id }) => (
              <button key={id} id={`nav-${id}`} onClick={() => scrollTo(id)} className="nav-link">{label}</button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <a href="/admin" aria-label="Admin Dashboard" className="p-2 rounded-xl text-muted-foreground hover:text-amber-400 transition-colors"
              style={{ border:"1px solid rgba(245,158,11,0.2)", background:"rgba(245,158,11,0.06)" }}>
              <Settings className="h-4 w-4" />
            </a>
            <Button id="hire-me-btn" size="sm" onClick={() => scrollTo("contact")}
              className="hidden md:flex gap-1.5 text-xs px-4 btn-primary-glow font-bold"
              style={{ background:"linear-gradient(135deg,#f59e0b,#0ea5e9)", color:"#000", border:"none" }}>
              <Zap className="h-3.5 w-3.5" />Hire Me
            </Button>
            <button id="mobile-menu-toggle" className="md:hidden p-1.5 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden glass mx-4 mt-1 rounded-2xl" style={{ borderColor:"rgba(245,158,11,0.12)" }}>
            <div className="flex flex-col px-6 py-4 gap-1">
              {NAV_LINKS.map(({ label, id }) => (
                <button key={id} onClick={() => scrollTo(id)}
                  className="text-left py-2.5 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
                  {label}
                </button>
              ))}
              <Button size="sm" onClick={() => scrollTo("contact")} className="mt-3 gap-1.5 text-xs font-bold"
                style={{ background:"linear-gradient(135deg,#f59e0b,#0ea5e9)", color:"#000", border:"none" }}>
                <Zap className="h-3.5 w-3.5" />Hire Me
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* ====== HERO ====== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16">
        {isMounted && <CanvasStarField />}
        <div className="aurora-bg" aria-hidden />

        {/* Orbs with parallax */}
        <div className="hero-orb-1" style={{ transform:`translate(${mousePos.x * 22}px,${mousePos.y * 14}px)` }} aria-hidden />
        <div className="hero-orb-2" style={{ transform:`translate(${mousePos.x * -18}px,${mousePos.y * -12}px)` }} aria-hidden />
        <div className="hero-orb-3" aria-hidden />

        {/* Grid */}
        <div className="absolute inset-0 -z-10" style={{
          backgroundImage:"linear-gradient(rgba(245,158,11,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(245,158,11,.03) 1px,transparent 1px)",
          backgroundSize:"72px 72px",
          maskImage:"radial-gradient(ellipse 85% 85% at 50% 50%,black 30%,transparent 100%)",
        }} aria-hidden />

        <div className="container px-6 mx-auto max-w-6xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Hero Details */}
            <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left"
              style={{ transform:`translate(${mousePos.x * -6}px,${mousePos.y * -4}px)`, transition:"transform 0.1s linear" }}>

              {/* Available badge */}
              <div id="availability-badge" className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in"
                style={{ border:"1px solid rgba(34,197,94,0.35)", background:"rgba(34,197,94,0.08)", color:"#4ade80" }}>
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-dot" />
                Available for Freelance Work
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-[1.15] tracking-tight animate-fade-in"
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

              <p className="text-base sm:text-lg text-muted-foreground max-w-xl mb-8 leading-relaxed animate-fade-in"
                style={{ animationDelay:".45s" }}>
                Full-Stack Developer skilled in building high-performance web applications using the
                MERN stack. Passionate about clean code, modern UI/UX, and solving real-world problems.
              </p>

              <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-10 animate-fade-in"
                style={{ animationDelay:".6s" }}>
                <a href="https://drive.google.com/file/d/1L8iT_FWQeu5zaE9CWjt7kEoik7iMzb51/view?usp=sharing" target="_blank" rel="noopener noreferrer">
                  <Button id="download-resume-btn" size="lg" className="gap-2 px-7 font-bold btn-primary-glow"
                    style={{ background:"linear-gradient(135deg,#f59e0b,#0ea5e9)", color:"#000", border:"none" }}>
                    <Download className="h-4 w-4" />Download Resume
                  </Button>
                </a>
                <Button id="get-in-touch-btn" variant="outline" size="lg" className="gap-2 px-7 social-icon"
                  style={{ borderColor:"rgba(245,158,11,0.28)", background:"rgba(245,158,11,0.06)", color:"#f59e0b" }}
                  onClick={() => scrollTo("contact")}>
                  <Mail className="h-4 w-4" />Get In Touch
                </Button>
              </div>

              {/* Socials */}
              <div className="flex items-center justify-center lg:justify-start gap-3 animate-fade-in" style={{ animationDelay:".75s" }}>
                {[
                  { href:"http://github.com/mani78979",         icon:<Github   className="h-[18px] w-[18px]" />, label:"GitHub"   },
                  { href:"http://www.linkedin.com/in/musman78", icon:<Linkedin className="h-[18px] w-[18px]" />, label:"LinkedIn" },
                  { href:"mailto:usmankousar772@gmail.com",     icon:<Mail     className="h-[18px] w-[18px]" />, label:"Email"    },
                ].map(({ href, icon, label }) => (
                  <a key={label} href={href} target={href.startsWith("mailto") ? "_self" : "_blank"} rel="noopener noreferrer"
                    aria-label={label} className="p-3 rounded-xl text-muted-foreground hover:text-foreground transition-all duration-200 social-icon"
                    style={{ border:"1px solid rgba(255,255,255,0.08)", background:"rgba(255,255,255,0.02)" }}>
                    {icon}
                  </a>
                ))}
                {/* Fiverr */}
                <a href="https://www.fiverr.com/musman079" target="_blank" rel="noopener noreferrer" aria-label="Fiverr"
                  className="p-3 rounded-xl text-muted-foreground hover:text-green-400 transition-all duration-200 social-icon"
                  style={{ border:"1px solid rgba(255,255,255,0.08)", background:"rgba(255,255,255,0.02)" }}>
                  <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.004 15.588a.995.995 0 1 0 .002-1.99.995.995 0 0 0-.002 1.99zm-.996-3.705h-1.33c-.57 0-.995.424-.995.992v4.46H18.38v-4.46c0-.568-.424-.992-.995-.992h-.568v-1.184h.568c.57 0 .995-.424.995-.992V8.58c0-1.756.997-2.752 2.752-2.752h.994v1.313h-.994c-.854 0-1.38.525-1.38 1.38v1.185h1.38v1.184h-1.38v4.46h1.38v-4.46c0-.568.428-.992.996-.992h1.33v1.185zm-8.507-6.59a.89.89 0 0 1 .891.89.89.89 0 0 1-.891.892.89.89 0 0 1-.89-.891.89.89 0 0 1 .89-.891zm.532 3.704h-.532v7.337h-1.33V9.001h-.568V7.817h.568v-.568c0-.568.424-.992.995-.992h.867v1.23zm-5.325 2.752c.284 0 .568.142.71.427L10.85 13.7a2.36 2.36 0 0 0-.427-.284 2.68 2.68 0 0 0-.71-.142c-.854 0-1.523.71-1.523 1.563 0 .855.67 1.563 1.523 1.563.284 0 .568-.142.71-.284l1.186 1.17a2.978 2.978 0 0 1-1.896.71c-1.614 0-2.894-1.28-2.894-2.895 0-1.613 1.28-2.893 2.894-2.893.284 0 .568.142.71.142zM6.254 7.108c.568 0 .995.142 1.38.284l-.142 1.186a2.683 2.683 0 0 0-.995-.284c-.71 0-1.28.568-1.28 1.28v1.043h2.276v1.185H5.217v4.46H3.888v-4.46H3.32V10.617h.568V9.574c0-1.33 1.043-2.466 2.366-2.466z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Right Column: Code Window Card */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end mt-4 lg:mt-0 relative z-10"
              style={{ transform:`translate(${mousePos.x * -12}px,${mousePos.y * 8}px)`, transition:"transform 0.1s linear" }}>
              <div className="relative w-full flex justify-center lg:justify-end">
                <CodeWindow />
                {/* Floating badge over code window */}
                <div className="absolute -bottom-3 -left-3 glass px-3.5 py-2 rounded-2xl shadow-xl hidden sm:flex items-center gap-2 text-xs font-semibold"
                  style={{ border:"1px solid rgba(245,158,11,0.3)", background:"rgba(13,15,22,0.92)" }}>
                  <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                  <span>5.0 Rating on Fiverr</span>
                </div>
                <div className="absolute -top-3 -right-3 glass px-3.5 py-2 rounded-2xl shadow-xl hidden sm:flex items-center gap-2 text-xs font-semibold"
                  style={{ border:"1px solid rgba(14,165,233,0.3)", background:"rgba(13,15,22,0.92)" }}>
                  <Code2 className="h-4 w-4 text-sky-400" />
                  <span>MERN Stack Expert</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <button onClick={() => scrollTo("about")}
              className="inline-flex flex-col items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors mx-auto animate-fade-in group"
              style={{ animationDelay:".9s" }}>
              <span className="text-xs tracking-widest uppercase font-mono group-hover:text-amber-400 transition-colors">Scroll Down</span>
              <ChevronDown className="h-4 w-4 animate-bounce" />
            </button>
          </div>
        </div>
      </section>

      {/* ====== STATS ====== */}
      <section className="py-16 relative overflow-hidden"
        style={{ borderTop:"1px solid rgba(245,158,11,0.08)", borderBottom:"1px solid rgba(245,158,11,0.08)" }}>
        <div className="absolute inset-0 -z-10"
          style={{ background:"linear-gradient(135deg,rgba(245,158,11,0.03) 0%,rgba(14,165,233,0.03) 100%)" }} />
        <div className="container px-6 mx-auto max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 text-center">
            {STATS.map(({ label, icon:Icon, color, num, suffix, isFloat }, i) => (
              <TiltCard key={label} className="rounded-2xl p-6 flex flex-col items-center gap-3 reveal glow-border"
                style={{ transitionDelay:`${i * 0.1}s`, background:"rgba(255,255,255,0.022)", border:"1px solid rgba(255,255,255,0.06)" }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ background:`${color}14`, border:`1px solid ${color}28`, boxShadow:`0 0 22px ${color}18` }}>
                  <Icon className="h-6 w-6" style={{ color }} />
                </div>
                <div className="text-3xl font-bold" style={{ color, textShadow:`0 0 18px ${color}55` }}>
                  <AnimatedCounter num={num} suffix={suffix} isFloat={isFloat} />
                </div>
                <div className="text-sm text-muted-foreground font-medium">{label}</div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ====== TECH MARQUEE ====== */}
      <section className="py-6" style={{ borderBottom:"1px solid rgba(245,158,11,0.06)" }}>
        <TechMarquee />
      </section>

      {/* ====== ABOUT ====== */}
      <section id="about" className="py-28 relative overflow-hidden">
        <span className="section-number" aria-hidden>01</span>
        <div className="container px-6 mx-auto max-w-5xl relative z-10">
          <div className="text-center mb-16 reveal">
            <span className="section-label" style={{ color:"#f59e0b", borderColor:"rgba(245,158,11,0.3)" }}>Who I Am</span>
            <h2 className="text-4xl sm:text-5xl font-bold mt-2 tracking-tight">About Me</h2>
          </div>
          <div className="grid gap-14 md:grid-cols-2 items-center">
            <div className="space-y-5 reveal-left">
              <p className="text-muted-foreground text-lg leading-relaxed">
                I&apos;m a dedicated{" "}
                <span style={{ color:"#f59e0b" }} className="font-semibold neon-text">Full-Stack Developer</span>{" "}
                with a focus on the MERN stack — MongoDB, Express.js, React, and Node.js.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                I enjoy building scalable, user-friendly applications that combine strong functionality
                with clean, modern UI design. I&apos;m constantly learning new technologies and pushing
                the limits of what web apps can do.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Whether building <span style={{ color:"#0ea5e9" }} className="font-semibold">RESTful APIs</span> or
                crafting interactive front-end experiences, I love delivering exceptional results
                for clients worldwide on{" "}
                <span style={{ color:"#1dbf73" }} className="font-semibold">Fiverr</span>.
              </p>

              {/* Info cards grid */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                {[
                  { icon:Coffee,   label:"Coffee-Driven Coder", color:"#f59e0b" },
                  { icon:Sparkles, label:"UI/UX Perfectionist",  color:"#0ea5e9" },
                  { icon:Terminal, label:"API Architecture",     color:"#f59e0b" },
                  { icon:Globe,    label:"Remote-First Worker",  color:"#0ea5e9" },
                ].map(({ icon:Icon, label, color }) => (
                  <div key={label} className="info-card flex items-center gap-2.5">
                    <Icon className="h-4 w-4 flex-shrink-0" style={{ color }} />
                    <span className="text-xs font-medium text-muted-foreground">{label}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {["React","Node.js","Express.js","MongoDB","TypeScript","Next.js","Tailwind CSS"].map(sk => (
                  <Badge key={sk} className="text-xs px-3 py-1 cursor-default"
                    style={{ background:"rgba(245,158,11,0.08)", border:"1px solid rgba(245,158,11,0.25)", color:"#f59e0b" }}>
                    {sk}
                  </Badge>
                ))}
              </div>
              <Button variant="outline" size="sm" className="gap-2 group mt-2"
                style={{ borderColor:"rgba(245,158,11,0.25)", color:"#f59e0b", background:"rgba(245,158,11,0.05)" }}
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
                  <Image src="/placeholder.jpg" alt="Muhammad Usman – Full Stack Developer" width={288} height={288} className="object-cover w-full h-full" />
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

      {/* ====== SKILLS ====== */}
      <section id="skills" className="py-28 relative overflow-hidden"
        style={{ background:"linear-gradient(180deg,rgba(245,158,11,0.02) 0%,transparent 100%)" }}>
        <span className="section-number" aria-hidden>02</span>
        <div className="container px-6 mx-auto max-w-5xl relative z-10">
          <div className="text-center mb-16 reveal">
            <span className="section-label" style={{ color:"#0ea5e9", borderColor:"rgba(14,165,233,0.3)" }}>What I Know</span>
            <h2 className="text-4xl sm:text-5xl font-bold mt-2 tracking-tight">Skills & Technologies</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {dynSkills.map((sk, i) => {
              const Icon = SKILL_ICONS[sk.category] ?? SKILL_ICONS.default
              return (
              <SpotlightCard key={sk.id} className="rounded-2xl p-6 reveal" style={{ transitionDelay:`${i * 0.1}s` }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background:`${sk.color}12`, border:`1px solid ${sk.color}28`, boxShadow:`0 0 16px ${sk.color}18` }}>
                  <Icon style={{ color:sk.color }} className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-base mb-0">{sk.category}</h3>
                <div className="skill-bar mb-4">
                  <div className="skill-bar-fill" style={{ width:`${sk.level}%`, background:`linear-gradient(90deg,${sk.color},${sk.color==="#f59e0b"?"#0ea5e9":"#f59e0b"})` }} />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {sk.items.map(s => <span key={s} className="tech-badge">{s}</span>)}
                </div>
              </SpotlightCard>
            )})}
          </div>
        </div>
      </section>

      <div className="section-divider max-w-5xl" />

      {/* ====== SERVICES ====== */}
      <section id="services" className="py-28 relative overflow-hidden">
        <span className="section-number" aria-hidden>03</span>
        <div className="container px-6 mx-auto max-w-5xl relative z-10">
          <div className="text-center mb-16 reveal">
            <span className="section-label" style={{ color:"#f59e0b", borderColor:"rgba(245,158,11,0.3)" }}>What I Offer</span>
            <h2 className="text-4xl sm:text-5xl font-bold mt-2 tracking-tight">Services</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">From concept to deployment — here&apos;s what I can build for you.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {dynServices.map((svc, i) => {
              const Icon = SERVICE_ICONS[svc.title] ?? Globe
              return (
              <TiltCard key={svc.id} className="glass-card rounded-2xl p-8 reveal group" style={{ transitionDelay:`${i * 0.1}s` }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                  style={{ background:`${svc.color}14`, border:`1px solid ${svc.color}28`, boxShadow:`0 0 20px ${svc.color}20` }}>
                  <Icon style={{ color:svc.color }} className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{svc.title}</h3>
                <p className="text-muted-foreground leading-relaxed mb-5">{svc.description}</p>
                <ul className="space-y-2">
                  {svc.points.map(pt => (
                    <li key={pt} className="flex items-center gap-2 text-sm text-muted-foreground">
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

      {/* ====== PROJECTS ====== */}
      <section id="projects" className="py-28 relative overflow-hidden"
        style={{ background:"linear-gradient(180deg,rgba(14,165,233,0.02) 0%,transparent 100%)" }}>
        <span className="section-number" aria-hidden>04</span>
        <div className="container px-6 mx-auto max-w-5xl relative z-10">
          <div className="text-center mb-16 reveal">
            <span className="section-label" style={{ color:"#0ea5e9", borderColor:"rgba(14,165,233,0.3)" }}>My Work</span>
            <h2 className="text-4xl sm:text-5xl font-bold mt-2 tracking-tight">Featured Projects</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">A selection of projects I&apos;ve built — from full-stack apps to mobile + AI solutions.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {dynProjects.map((proj, i) => {
              const ProjIcon = PROJECT_ICONS[proj.title] ?? PROJECT_ICONS.default
              return (
              <SpotlightCard key={proj.id} className="rounded-2xl overflow-hidden reveal" style={{ transitionDelay:`${i * 0.12}s` }}>
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
                        <h3 className="text-lg font-bold leading-tight">{proj.title}</h3>
                        <p className="text-xs font-mono mt-0.5" style={{ color:proj.accentColor }}>{proj.subtitle}</p>
                      </div>
                    </div>
                    <div className="flex gap-1.5 ml-2">
                      {proj.github && (
                        <a href={proj.github} target="_blank" rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                          style={{ background:"rgba(255,255,255,0.05)" }}>
                          <Github className="h-4 w-4" />
                        </a>
                      )}
                      {proj.live && (
                        <a href={proj.live} target="_blank" rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                          style={{ background:"rgba(255,255,255,0.05)" }}>
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">{proj.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {proj.tech.map(t => <span key={t} className="tech-badge">{t}</span>)}
                  </div>
                  {(proj.github || proj.live) && (
                    <div className="flex gap-3 pt-4" style={{ borderTop:"1px solid rgba(255,255,255,0.06)" }}>
                      {proj.github && (
                        <a href={proj.github} target="_blank" rel="noopener noreferrer" className="flex-1">
                          <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs"
                            style={{ borderColor:"rgba(255,255,255,0.12)" }}>
                            <Github className="h-3.5 w-3.5" />Code
                          </Button>
                        </a>
                      )}
                      {proj.live && (
                        <a href={proj.live} target="_blank" rel="noopener noreferrer" className="flex-1">
                          <Button size="sm" className="w-full gap-1.5 text-xs font-bold"
                            style={{ background:proj.accentColor, color:"#000", border:"none", boxShadow:`0 4px 18px ${proj.accentColor}40` }}>
                            <ExternalLink className="h-3.5 w-3.5" />Live Demo
                          </Button>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </SpotlightCard>
            )})}
          </div>
          <div className="text-center mt-10 reveal">
            <a href="https://github.com/mani78979" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="gap-2 group"
                style={{ borderColor:"rgba(14,165,233,0.25)", background:"rgba(14,165,233,0.05)", color:"#0ea5e9" }}>
                <Github className="h-4 w-4" />View All on GitHub
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      <div className="section-divider max-w-5xl" />

      {/* ====== REVIEWS ====== */}
      <section id="reviews" className="py-28 relative overflow-hidden">
        <span className="section-number" aria-hidden>05</span>
        <div className="container px-6 mx-auto max-w-5xl relative z-10">
          <div className="text-center mb-6 reveal">
            <span className="section-label" style={{ color:"#10b981", borderColor:"rgba(16,185,129,0.3)" }}>Client Feedback</span>
            <h2 className="text-4xl sm:text-5xl font-bold mt-2 tracking-tight">Fiverr Reviews</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">100% real reviews from real clients on Fiverr.</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-5 mb-12 glass-card rounded-2xl px-8 py-5 max-w-xl mx-auto reveal">
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">{[1,2,3,4,5].map(s => <Star key={s} className="h-5 w-5 fill-yellow-400 star-gold" />)}</div>
              <span className="font-bold text-xl">5.0</span>
            </div>
            <div className="w-px h-8" style={{ background:"rgba(255,255,255,0.1)" }} />
            <div className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">Level 1</span> Fiverr Seller</div>
            <div className="w-px h-8" style={{ background:"rgba(255,255,255,0.1)" }} />
            <a href="https://www.fiverr.com/musman079" target="_blank" rel="noopener noreferrer">
              <Button size="sm" className="gap-1.5 text-xs btn-fiverr">View Profile <ExternalLink className="h-3 w-3" /></Button>
            </a>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {dynReviews.map(({ name, country, rating, review, date, project }, i) => (
              <SpotlightCard key={i} className="rounded-2xl p-6 reveal relative review-quote"
                style={{ transitionDelay:`${i * 0.1}s` }}>
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                      style={{ background:"linear-gradient(135deg,rgba(245,158,11,0.15),rgba(14,165,233,0.15))", border:"1px solid rgba(245,158,11,0.28)", color:"#f59e0b" }}>
                      {name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{name}</div>
                      <div className="text-xs text-muted-foreground">{country}</div>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length:rating }).map((_,j) => <Star key={j} className="h-4 w-4 fill-yellow-400 star-gold" />)}
                  </div>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 relative z-10">&quot;{review}&quot;</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 relative z-10"
                  style={{ borderTop:"1px solid rgba(255,255,255,0.06)" }}>
                  <span className="font-mono opacity-70">{project}</span>
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

      {/* ====== CONTACT ====== */}
      <section id="contact" className="py-28 relative overflow-hidden"
        style={{ background:"linear-gradient(180deg,rgba(245,158,11,0.02) 0%,transparent 100%)" }}>
        <span className="section-number" aria-hidden>06</span>
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full -z-10"
          style={{ background:"radial-gradient(circle,rgba(245,158,11,0.07) 0%,transparent 70%)", filter:"blur(70px)" }} />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full -z-10"
          style={{ background:"radial-gradient(circle,rgba(14,165,233,0.07) 0%,transparent 70%)", filter:"blur(70px)" }} />
        <div className="container px-6 mx-auto max-w-3xl relative z-10">
          <div className="text-center mb-16 reveal">
            <span className="section-label" style={{ color:"#f59e0b", borderColor:"rgba(245,158,11,0.3)" }}>Let&apos;s Work Together</span>
            <h2 className="text-4xl sm:text-5xl font-bold mt-2 tracking-tight">Get In Touch</h2>
          </div>
          <TiltCard className="glass-card rounded-3xl p-10 md:p-14 text-center reveal contact-glow relative overflow-hidden">
            <div className="absolute inset-0 -z-10"
              style={{ background:"radial-gradient(ellipse 80% 60% at 50% 110%,rgba(245,158,11,0.1),rgba(14,165,233,0.06),transparent)" }} />
            <p className="text-xl text-muted-foreground leading-relaxed max-w-lg mx-auto mb-8">
              I&apos;m always open to exciting freelance work, collaboration, or full-time roles.
              Let&apos;s connect and build something amazing together!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <a href="mailto:usmankousar772@gmail.com">
                <Button id="send-email-btn" size="lg" className="gap-2 px-8 font-bold btn-primary-glow"
                  style={{ background:"linear-gradient(135deg,#f59e0b,#0ea5e9)", color:"#000", border:"none" }}>
                  <Mail className="h-4 w-4" />Send Email
                </Button>
              </a>
              <a href="http://www.linkedin.com/in/musman78" target="_blank" rel="noopener noreferrer">
                <Button id="linkedin-btn" variant="outline" size="lg" className="gap-2 px-8 social-icon"
                  style={{ borderColor:"rgba(245,158,11,0.25)", background:"rgba(245,158,11,0.05)", color:"#f59e0b" }}>
                  <Linkedin className="h-4 w-4" />LinkedIn Profile
                </Button>
              </a>
            </div>
            <div className="flex items-center justify-center gap-4 pt-6"
              style={{ borderTop:"1px solid rgba(255,255,255,0.06)" }}>
              <span className="text-sm text-muted-foreground">Or reach me at</span>
              <a href="mailto:usmankousar772@gmail.com" className="text-sm font-mono hover:underline" style={{ color:"#f59e0b" }}>
                usmankousar772@gmail.com
              </a>
            </div>
          </TiltCard>
        </div>
      </section>

      {/* ====== FOOTER ====== */}
      <footer className="py-10 relative" style={{ borderTop:"1px solid rgba(245,158,11,0.08)" }}>
        <div className="container px-6 mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-5">
            <span className="text-lg font-bold gradient-text-animated glitch-text" data-text="<M.Usman />">
              {"<M.Usman />"}
            </span>
            <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Muhammad Usman. All rights reserved.</p>
            <div className="flex items-center gap-3">
              {[
                { href:"https://github.com/mani78979",         icon:<Github   className="h-4 w-4" />, label:"GitHub"   },
                { href:"https://www.linkedin.com/in/musman78", icon:<Linkedin className="h-4 w-4" />, label:"LinkedIn" },
                { href:"mailto:usmankousar772@gmail.com",      icon:<Mail     className="h-4 w-4" />, label:"Email"    },
              ].map(({ href, icon, label }) => (
                <a key={label} href={href} target={href.startsWith("mailto") ? "_self" : "_blank"} rel="noopener noreferrer"
                  aria-label={label} className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors social-icon"
                  style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.06)" }}>
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
