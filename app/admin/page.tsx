"use client"

import React, { useState, useEffect } from "react"
import {
  Plus, Edit2, Trash2, LogOut, Code2, Star, Layers, Server, Globe,
  Palette, GitBranch, Eye, EyeOff, Save, X, User, Upload, Link2,
  FileText, Briefcase, Calculator, BarChart3, MessageSquare, MapPin,
  CheckCircle2, AlertCircle, ArrowUpRight, ShieldCheck, Sparkles, Terminal,
  Mail, Phone, Clock, RefreshCw, Check, Send, CheckCheck, Inbox, Search
} from "lucide-react"

const ACCENT_COLORS = ["#f59e0b", "#0ea5e9", "#10b981", "#8b5cf6", "#ec4899", "#ef4444", "#14b8a6", "#f97316"]

// ================================================================
// TYPES
// ================================================================
interface Project {
  id: string
  title: string
  subtitle: string
  category: string
  description: string
  tech: string[]
  github: string
  live: string
  accentColor: string
  details?: string[]
}

interface Review {
  id: string
  name: string
  country: string
  rating: number
  review: string
  date: string
  project: string
}

interface Skill {
  id: string
  category: string
  items: string[]
  color: string
  level: number
}

interface Service {
  id: string
  title: string
  description: string
  points: string[]
  color: string
}

interface InquiryItem {
  _id: string
  name: string
  email: string
  projectType: string
  message: string
  estimatedBudget?: string
  status: "unread" | "read" | "replied" | "archived"
  createdAt: string
}

interface AnalyticsData {
  pageViews: number
  cliLaunches: number
  estimatorCalculations: number
  resumeDownloads: number
  contactInquiries: number
  unreadInquiries: number
  totalInquiries: number
  totalProjects: number
  totalReviews: number
  lastUpdated?: string
}

interface SiteSettings {
  id?: string
  avatarUrl: string
  name: string
  title: string
  bio: string
  resumeUrl: string
  location: string
  available: boolean
  availableText: string
  typingRoles: string[]
  email: string
  whatsapp: string
  whatsappUrl: string
  github: string
  linkedin: string
  fiverrUrl: string
  fiverrRating: string
  fiverrLevel: string
  aboutHeading: string
  aboutParagraph1: string
  aboutParagraph2: string
  aboutParagraph3: string
  aboutBadges: Array<{ label: string; color: string }>
  stats: Array<{ label: string; num: number; suffix: string; color: string; isFloat?: boolean }>
  journey: Array<{ year: string; title: string; subtitle: string; description: string; badge: string; color: string }>
  estimatorRates: Record<string, number>
  footerBio: string
  copyrightText: string
}

// ================================================================
// LOGIN SCREEN (Server-Secured Authentication)
// ================================================================
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw] = useState("")
  const [show, setShow] = useState(false)
  const [error, setError] = useState("")
  const [shake, setShake] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        sessionStorage.setItem("admin_auth", "1")
        onLogin()
      } else {
        setError(data.error || "Incorrect master password! Check .env.local")
        setShake(true)
        setTimeout(() => setShake(false), 500)
      }
    } catch {
      setError("Unable to reach authentication service.")
      setShake(true)
      setTimeout(() => setShake(false), 500)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "hsl(228,45%,5%)" }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 mb-3 text-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.2)]">
            <Terminal className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black gradient-text-animated mb-1">VIP Admin Panel</h1>
          <p className="text-xs text-muted-foreground">Muhammad Usman Portfolio CMS & Lead Center</p>
        </div>

        <form onSubmit={handleSubmit} className={`admin-card ${shake ? "animate-bounce" : ""}`}>
          <label className="admin-label">Master Password</label>
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              value={pw}
              onChange={e => { setPw(e.target.value); setError("") }}
              className="admin-input pr-10"
              placeholder="Enter master password"
              autoFocus
              required
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {error && <p className="text-xs mt-2 text-rose-500 font-medium">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="admin-btn-primary w-full mt-5 py-3 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Unlock VIP Dashboard</span>
              </>
            )}
          </button>
        </form>
        <p className="text-center text-xs mt-4 text-muted-foreground font-mono">
          Configured in <code className="text-amber-400">.env.local</code> (default: <code className="text-amber-400">admin123</code>)
        </p>
      </div>
    </div>
  )
}

// ================================================================
// MAIN VIP ADMIN DASHBOARD
// ================================================================
export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("inquiries")
  const [mounted, setMounted] = useState(false)

  // State Collections
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [inquiries, setInquiries] = useState<InquiryItem[]>([])
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)

  // UI state
  const [toastMsg, setToastMsg] = useState("")
  const [saving, setSaving] = useState(false)
  const [inquiryFilter, setInquiryFilter] = useState<string>("all")
  const [inquirySearch, setInquirySearch] = useState<string>("")
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryItem | null>(null)

  // Modals
  const [projectModal, setProjectModal] = useState<{ open: boolean; item: Project | null }>({ open: false, item: null })
  const [projectForm, setProjectForm] = useState<Partial<Project>>({})
  const [projectTechInput, setProjectTechInput] = useState("")
  const [projectDetailsInput, setProjectDetailsInput] = useState("")

  const [reviewModal, setReviewModal] = useState<{ open: boolean; item: Review | null }>({ open: false, item: null })
  const [reviewForm, setReviewForm] = useState<Partial<Review>>({})

  const [skillModal, setSkillModal] = useState<{ open: boolean; item: Skill | null }>({ open: false, item: null })
  const [skillForm, setSkillForm] = useState<Partial<Skill>>({})
  const [skillItemsInput, setSkillItemsInput] = useState("")

  const [serviceModal, setServiceModal] = useState<{ open: boolean; item: Service | null }>({ open: false, item: null })
  const [serviceForm, setServiceForm] = useState<Partial<Service>>({})
  const [servicePointsInput, setServicePointsInput] = useState("")

  const [journeyModal, setJourneyModal] = useState<{ open: boolean; index: number | null }>({ open: false, index: null })
  const [journeyForm, setJourneyForm] = useState({ year: "", title: "", subtitle: "", description: "", badge: "Active", color: "#f59e0b" })

  const notify = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(""), 3500)
  }

  const loadAllData = async () => {
    try {
      const [settData, projData, revData, skillData, svcData, inqData, anaData] = await Promise.all([
        fetch("/api/profile").then(r => r.json()).catch(() => null),
        fetch("/api/projects").then(r => r.json()).catch(() => null),
        fetch("/api/reviews").then(r => r.json()).catch(() => null),
        fetch("/api/skills").then(r => r.json()).catch(() => null),
        fetch("/api/services").then(r => r.json()).catch(() => null),
        fetch("/api/contact").then(r => r.json()).catch(() => null),
        fetch("/api/analytics").then(r => r.json()).catch(() => null),
      ])
      if (settData) setSettings(settData)
      if (Array.isArray(projData)) setProjects(projData)
      if (Array.isArray(revData)) setReviews(revData)
      if (Array.isArray(skillData)) setSkills(skillData)
      if (Array.isArray(svcData)) setServices(svcData)
      if (Array.isArray(inqData)) setInquiries(inqData)
      if (anaData) setAnalytics(anaData)
    } catch {
      notify("Failed to connect to database APIs.")
    }
  }

  useEffect(() => {
    setMounted(true)
    setIsLoggedIn(sessionStorage.getItem("admin_auth") === "1")
    loadAllData()
  }, [])

  const handleSeedDefaults = async (action: string = "seed") => {
    setSaving(true)
    try {
      const res = await fetch("/api/seed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })
      const data = await res.json()
      if (res.ok) {
        notify(data.message || "Database seeded successfully! 🚀")
        await loadAllData()
      } else {
        notify(data.error || "Seed failed.")
      }
    } catch {
      notify("Failed to trigger database seeding.")
    } finally {
      setSaving(false)
    }
  }

  const handleLogin = () => {
    setIsLoggedIn(true)
    loadAllData()
  }

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth")
    setIsLoggedIn(false)
  }

  // Save Settings to Database
  const saveSettings = async (updatedSettings?: SiteSettings) => {
    const toSave = updatedSettings || settings
    if (!toSave) return
    setSaving(true)
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toSave),
      })
      const updated = await res.json()
      setSettings(updated)
      notify("Settings updated & published successfully! ✅")
    } catch {
      notify("Failed to save settings. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  // Avatar Upload Handler
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !settings) return
    if (file.size > 4 * 1024 * 1024) {
      alert("Image file size must be under 4MB")
      return
    }
    const reader = new FileReader()
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setSettings({ ...settings, avatarUrl: reader.result })
        notify("Avatar updated! Click 'Save Changes' to publish.")
      }
    }
    reader.readAsDataURL(file)
  }

  // ============================================================ INQUIRIES CRUD
  const handleUpdateInquiryStatus = async (id: string, newStatus: "unread" | "read" | "replied" | "archived") => {
    try {
      const res = await fetch("/api/contact", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      })
      if (res.ok) {
        setInquiries(prev => prev.map(item => item._id === id ? { ...item, status: newStatus } : item))
        notify(`Inquiry marked as ${newStatus}!`)
        if (selectedInquiry?._id === id) {
          setSelectedInquiry({ ...selectedInquiry, status: newStatus })
        }
      }
    } catch {
      notify("Failed to update inquiry status.")
    }
  }

  const handleDeleteInquiry = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this client inquiry?")) return
    try {
      const res = await fetch(`/api/contact?id=${id}`, { method: "DELETE" })
      if (res.ok) {
        setInquiries(prev => prev.filter(item => item._id !== id))
        if (selectedInquiry?._id === id) setSelectedInquiry(null)
        notify("Inquiry deleted from database.")
      }
    } catch {
      notify("Failed to delete inquiry.")
    }
  }

  // ============================================================ PROJECTS CRUD
  const openAddProject = () => {
    setProjectForm({ accentColor: "#f59e0b", category: "Full-Stack MERN", tech: [], details: [] })
    setProjectTechInput("")
    setProjectDetailsInput("")
    setProjectModal({ open: true, item: null })
  }
  const openEditProject = (p: Project) => {
    setProjectForm({ ...p })
    setProjectTechInput(p.tech.join(", "))
    setProjectDetailsInput(p.details?.join("\n") || "")
    setProjectModal({ open: true, item: p })
  }
  const handleSaveProject = async () => {
    const techArr = projectTechInput.split(",").map(t => t.trim()).filter(Boolean)
    const detailsArr = projectDetailsInput.split("\n").map(d => d.trim()).filter(Boolean)
    const payload = { ...projectForm, tech: techArr, details: detailsArr }

    if (projectModal.item) {
      const res = await fetch(`/api/projects?id=${projectModal.item.id}`, { method: "PUT", body: JSON.stringify(payload) })
      const updated = await res.json()
      setProjects(projects.map(p => p.id === updated.id ? updated : p))
      notify("Project updated successfully! 🚀")
    } else {
      const res = await fetch("/api/projects", { method: "POST", body: JSON.stringify(payload) })
      const created = await res.json()
      setProjects([...projects, created])
      notify("New project added to portfolio! 🚀")
    }
    setProjectModal({ open: false, item: null })
  }
  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return
    await fetch(`/api/projects?id=${id}`, { method: "DELETE" })
    setProjects(projects.filter(p => p.id !== id))
    notify("Project deleted.")
  }

  // ============================================================ REVIEWS CRUD
  const openAddReview = () => {
    setReviewForm({ rating: 5, country: "🇺🇸 United States" })
    setReviewModal({ open: true, item: null })
  }
  const openEditReview = (r: Review) => {
    setReviewForm({ ...r })
    setReviewModal({ open: true, item: r })
  }
  const handleSaveReview = async () => {
    if (reviewModal.item) {
      const res = await fetch(`/api/reviews?id=${reviewModal.item.id}`, { method: "PUT", body: JSON.stringify(reviewForm) })
      const updated = await res.json()
      setReviews(reviews.map(r => r.id === updated.id ? updated : r))
      notify("Review updated! ⭐")
    } else {
      const res = await fetch("/api/reviews", { method: "POST", body: JSON.stringify(reviewForm) })
      const created = await res.json()
      setReviews([...reviews, created])
      notify("Review added! ⭐")
    }
    setReviewModal({ open: false, item: null })
  }
  const handleDeleteReview = async (id: string) => {
    if (!confirm("Delete this review?")) return
    await fetch(`/api/reviews?id=${id}`, { method: "DELETE" })
    setReviews(reviews.filter(r => r.id !== id))
    notify("Review removed.")
  }

  // ============================================================ SKILLS CRUD
  const openAddSkill = () => {
    setSkillForm({ color: "#06b6d4", level: 85, items: [] })
    setSkillItemsInput("")
    setSkillModal({ open: true, item: null })
  }
  const openEditSkill = (s: Skill) => {
    setSkillForm({ ...s })
    setSkillItemsInput(s.items.join(", "))
    setSkillModal({ open: true, item: s })
  }
  const handleSaveSkill = async () => {
    const items = skillItemsInput.split(",").map(t => t.trim()).filter(Boolean)
    const payload = { ...skillForm, items }
    if (skillModal.item) {
      const res = await fetch(`/api/skills?id=${skillModal.item.id}`, { method: "PUT", body: JSON.stringify(payload) })
      const updated = await res.json()
      setSkills(skills.map(s => s.id === updated.id ? updated : s))
      notify("Skill category updated! ⚡")
    } else {
      const res = await fetch("/api/skills", { method: "POST", body: JSON.stringify(payload) })
      const created = await res.json()
      setSkills([...skills, created])
      notify("New skill category added! ⚡")
    }
    setSkillModal({ open: false, item: null })
  }
  const handleDeleteSkill = async (id: string) => {
    if (!confirm("Delete this skill category?")) return
    await fetch(`/api/skills?id=${id}`, { method: "DELETE" })
    setSkills(skills.filter(s => s.id !== id))
    notify("Skill category removed.")
  }

  // ============================================================ SERVICES CRUD
  const openAddService = () => {
    setServiceForm({ color: "#f59e0b", points: [] })
    setServicePointsInput("")
    setServiceModal({ open: true, item: null })
  }
  const openEditService = (s: Service) => {
    setServiceForm({ ...s })
    setServicePointsInput(s.points.join(", "))
    setServiceModal({ open: true, item: s })
  }
  const handleSaveService = async () => {
    const points = servicePointsInput.split(",").map(p => p.trim()).filter(Boolean)
    const payload = { ...serviceForm, points }
    if (serviceModal.item) {
      const res = await fetch(`/api/services?id=${serviceModal.item.id}`, { method: "PUT", body: JSON.stringify(payload) })
      const updated = await res.json()
      setServices(services.map(s => s.id === updated.id ? updated : s))
      notify("Service updated! 💼")
    } else {
      const res = await fetch("/api/services", { method: "POST", body: JSON.stringify(payload) })
      const created = await res.json()
      setServices([...services, created])
      notify("Service added! 💼")
    }
    setServiceModal({ open: false, item: null })
  }
  const handleDeleteService = async (id: string) => {
    if (!confirm("Delete this service?")) return
    await fetch(`/api/services?id=${id}`, { method: "DELETE" })
    setServices(services.filter(s => s.id !== id))
    notify("Service removed.")
  }

  // ============================================================ JOURNEY CRUD
  const openAddJourney = () => {
    setJourneyForm({ year: "", title: "", subtitle: "", description: "", badge: "Active", color: "#f59e0b" })
    setJourneyModal({ open: true, index: null })
  }
  const openEditJourney = (idx: number) => {
    if (!settings?.journey?.[idx]) return
    setJourneyForm({ ...settings.journey[idx] })
    setJourneyModal({ open: true, index: idx })
  }
  const handleSaveJourney = () => {
    if (!settings) return
    const updatedJourney = [...(settings.journey || [])]
    if (journeyModal.index !== null) {
      updatedJourney[journeyModal.index] = journeyForm
    } else {
      updatedJourney.push(journeyForm)
    }
    setSettings({ ...settings, journey: updatedJourney })
    setJourneyModal({ open: false, index: null })
    notify("Milestone updated! Remember to click 'Save Changes'.")
  }
  const handleDeleteJourney = (idx: number) => {
    if (!settings || !confirm("Delete this roadmap milestone?")) return
    const updatedJourney = settings.journey.filter((_, i) => i !== idx)
    setSettings({ ...settings, journey: updatedJourney })
    notify("Milestone deleted.")
  }

  if (!mounted) return <div className="min-h-screen bg-[#07090e]" />
  if (!isLoggedIn) return <LoginScreen onLogin={handleLogin} />

  const unreadInquiriesCount = inquiries.filter(i => i.status === "unread").length

  const filteredInquiries = inquiries.filter(inq => {
    if (inquiryFilter !== "all" && inq.status !== inquiryFilter) return false
    if (inquirySearch) {
      const q = inquirySearch.toLowerCase()
      return (
        inq.name.toLowerCase().includes(q) ||
        inq.email.toLowerCase().includes(q) ||
        inq.message.toLowerCase().includes(q) ||
        inq.projectType.toLowerCase().includes(q)
      )
    }
    return true
  })

  const MENU_ITEMS = [
    { id: "inquiries", label: "Client Inquiries", icon: MessageSquare, badge: unreadInquiriesCount, desc: "Incoming client messages, leads & quote requests" },
    { id: "analytics", label: "Live Analytics", icon: BarChart3, desc: "Visitor views, CLI launches & engagement stats" },
    { id: "profile", label: "Profile & Hero", icon: User, desc: "Name, Title, Avatar, Typing Roles & Availability" },
    { id: "socials", label: "Socials & Links", icon: Link2, desc: "Resume, WhatsApp, Fiverr, GitHub & LinkedIn" },
    { id: "about", label: "About Me Section", icon: FileText, desc: "Headings, Story paragraphs & Feature badges" },
    { id: "journey", label: "Journey Roadmap", icon: GitBranch, desc: "Career milestones, Degrees & Timeline nodes" },
    { id: "skills", label: "Skills Arsenal", icon: Layers, desc: "Frontend, Backend, Cloud categories & % levels" },
    { id: "services", label: "Services", icon: Briefcase, desc: "Web dev, API architecture & service packages" },
    { id: "projects", label: "Featured Projects", icon: Code2, desc: "Live apps, GitHub code, Architecture details" },
    { id: "estimator", label: "Cost Estimator", icon: Calculator, desc: "Pricing rates, Feature costs & Turnaround time" },
    { id: "reviews", label: "Fiverr Reviews", icon: Star, desc: "Client testimonials, Ratings & Country flags" },
    { id: "stats", label: "Stats Counter", icon: BarChart3, desc: "Project count, Clients, Ratings & Delivery %" },
    { id: "footer", label: "Footer & Legal", icon: Globe, desc: "Copyright, Footer tagline & legal text" },
  ]

  return (
    <div className="min-h-screen text-foreground bg-[#07090e] flex flex-col font-sans">
      {/* ====== TOP APP BAR ====== */}
      <header className="sticky top-0 z-50 glass border-b border-amber-500/20 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-base gradient-text-animated font-mono">{"<M.Usman VIP CMS />"}</span>
            <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold">
              MongoDB Connected
            </span>
          </div>
        </div>

        {/* Global Toast Alert */}
        {toastMsg && (
          <div className="animate-fade-in px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-semibold flex items-center gap-1.5 shadow-lg">
            <CheckCircle2 className="w-4 h-4" /> {toastMsg}
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSeedDefaults("seed")}
            disabled={saving}
            title="Seed initial demo data into MongoDB so you can edit it"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-amber-400 hover:text-amber-300 bg-amber-500/10 border border-amber-500/30 hover:border-amber-500/50 transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Demo Data to DB</span>
          </button>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground bg-white/5 border border-border hover:border-amber-500/40 transition-all"
          >
            <ArrowUpRight className="w-3.5 h-3.5 text-amber-500" />
            <span>View Live Site</span>
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-500/10 border border-rose-500/20 hover:border-rose-500/40 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* ====== MAIN WORKSPACE LAYOUT (SIDEBAR + CONTENT) ====== */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid lg:grid-cols-12 gap-6 items-start">
        {/* SIDEBAR NAVIGATION */}
        <aside className="lg:col-span-4 glass-card rounded-2xl p-3 border border-border sticky top-20">
          <div className="p-3 mb-2 border-b border-border/60">
            <h2 className="text-xs font-mono font-bold uppercase text-muted-foreground tracking-wider">CMS Sections</h2>
          </div>
          <div className="space-y-1">
            {MENU_ITEMS.map(({ id, label, icon: Icon, badge }) => {
              const active = activeTab === id
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all text-left ${
                    active
                      ? "bg-gradient-to-r from-amber-500/20 to-sky-500/15 text-amber-400 border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.15)] font-bold"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${active ? "text-amber-400" : "text-muted-foreground"}`} />
                    <span>{label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {badge !== undefined && badge > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-black animate-pulse">
                        {badge} new
                      </span>
                    )}
                    {active && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                  </div>
                </button>
              )
            })}
          </div>
        </aside>

        {/* CONTENT PANEL */}
        <main className="lg:col-span-8 space-y-6">

          {/* ============================================================ 0. CLIENT INQUIRIES TAB */}
          {activeTab === "inquiries" && (
            <div className="admin-card space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
                <div>
                  <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-amber-500" /> Client Inquiries & Leads Inbox
                  </h2>
                  <p className="text-xs text-muted-foreground">Direct messages sent through your portfolio contact form & cost estimator.</p>
                </div>
                <button
                  onClick={loadAllData}
                  className="admin-btn-edit text-xs flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Refresh Inbox
                </button>
              </div>

              {/* Inquiry Stats Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-border">
                  <div className="text-xs text-muted-foreground font-mono">Total Messages</div>
                  <div className="text-2xl font-bold text-foreground mt-0.5">{inquiries.length}</div>
                </div>
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <div className="text-xs text-amber-400 font-mono">Unread Leads</div>
                  <div className="text-2xl font-bold text-amber-400 mt-0.5">{unreadInquiriesCount}</div>
                </div>
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                  <div className="text-xs text-emerald-400 font-mono">Replied</div>
                  <div className="text-2xl font-bold text-emerald-400 mt-0.5">{inquiries.filter(i => i.status === "replied").length}</div>
                </div>
                <div className="p-3.5 rounded-xl bg-sky-500/10 border border-sky-500/30">
                  <div className="text-xs text-sky-400 font-mono">Read</div>
                  <div className="text-2xl font-bold text-sky-400 mt-0.5">{inquiries.filter(i => i.status === "read").length}</div>
                </div>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
                  {["all", "unread", "read", "replied"].map(filter => (
                    <button
                      key={filter}
                      onClick={() => setInquiryFilter(filter)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                        inquiryFilter === filter
                          ? "bg-amber-500 text-black shadow-md font-bold"
                          : "bg-white/5 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={inquirySearch}
                    onChange={e => setInquirySearch(e.target.value)}
                    placeholder="Search sender, email, query..."
                    className="admin-input pl-9 text-xs py-1.5"
                  />
                </div>
              </div>

              {/* Inquiry Message List */}
              {filteredInquiries.length === 0 ? (
                <div className="text-center py-16 px-4 border border-dashed border-border rounded-2xl">
                  <Inbox className="w-10 h-10 text-muted-foreground mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-semibold text-foreground">No inquiries found</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {inquiryFilter === "all" ? "Client inquiries sent through your website will appear here in real-time." : `No inquiries match the '${inquiryFilter}' filter.`}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredInquiries.map(item => {
                    const isUnread = item.status === "unread"
                    const dateFormatted = new Date(item.createdAt).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    })

                    return (
                      <div
                        key={item._id}
                        className={`p-5 rounded-2xl border transition-all ${
                          isUnread
                            ? "bg-amber-500/[0.04] border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.08)]"
                            : "bg-slate-900/40 border-border"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                              style={{ background: isUnread ? "rgba(245,158,11,0.2)" : "rgba(255,255,255,0.06)", color: isUnread ? "#f59e0b" : "#94a3b8" }}
                            >
                              {item.name?.[0]?.toUpperCase() || "C"}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-foreground">{item.name}</span>
                                <span
                                  className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded font-bold ${
                                    item.status === "unread"
                                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                      : item.status === "replied"
                                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                      : "bg-slate-500/20 text-slate-400 border border-slate-500/30"
                                  }`}
                                >
                                  {item.status}
                                </span>
                              </div>
                              <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                                <span className="font-mono">{item.email}</span>
                                <span>•</span>
                                <span>{dateFormatted}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-auto">
                            <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-sky-500/10 text-sky-400 border border-sky-500/20 font-medium">
                              {item.projectType}
                            </span>
                          </div>
                        </div>

                        <div className="bg-[#0b0e17] rounded-xl p-4 my-3 text-sm text-foreground/90 leading-relaxed font-sans whitespace-pre-wrap border border-white/5">
                          {item.message}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/50">
                          <div className="flex flex-wrap gap-2">
                            <a
                              href={`mailto:${item.email}?subject=Re: Inquiring about ${encodeURIComponent(item.projectType)}&body=Hi ${encodeURIComponent(item.name)},%0D%0A%0D%0AThank you for reaching out through my portfolio website!`}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 text-black hover:bg-amber-400 flex items-center gap-1.5 transition-colors"
                            >
                              <Mail className="w-3.5 h-3.5" /> Reply via Email
                            </a>
                            <a
                              href={`https://wa.me/923286596772?text=Hello%20${encodeURIComponent(item.name)},%20thank%20you%20for%20your%20inquiry%20regarding%20${encodeURIComponent(item.projectType)}.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 flex items-center gap-1.5 transition-colors"
                            >
                              <Phone className="w-3.5 h-3.5" /> Chat on WhatsApp
                            </a>
                          </div>

                          <div className="flex items-center gap-2">
                            {item.status !== "replied" && (
                              <button
                                onClick={() => handleUpdateInquiryStatus(item._id, "replied")}
                                className="px-2.5 py-1.5 rounded-lg text-xs text-emerald-400 hover:bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1 transition-colors"
                                title="Mark as replied"
                              >
                                <CheckCheck className="w-3.5 h-3.5" /> Mark Replied
                              </button>
                            )}
                            {item.status === "unread" ? (
                              <button
                                onClick={() => handleUpdateInquiryStatus(item._id, "read")}
                                className="px-2.5 py-1.5 rounded-lg text-xs text-sky-400 hover:bg-sky-500/10 border border-sky-500/20 flex items-center gap-1 transition-colors"
                              >
                                <Check className="w-3.5 h-3.5" /> Mark Read
                              </button>
                            ) : (
                              <button
                                onClick={() => handleUpdateInquiryStatus(item._id, "unread")}
                                className="px-2.5 py-1.5 rounded-lg text-xs text-amber-400 hover:bg-amber-500/10 border border-amber-500/20 flex items-center gap-1 transition-colors"
                              >
                                Mark Unread
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteInquiry(item._id)}
                              className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-colors"
                              title="Delete inquiry"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* ============================================================ 0.1 LIVE ANALYTICS TAB */}
          {activeTab === "analytics" && (
            <div className="admin-card space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-sky-400" /> Live Engagement Analytics
                  </h2>
                  <p className="text-xs text-muted-foreground">Real-time statistics on portfolio visitor interactions and interest.</p>
                </div>
                <button onClick={loadAllData} className="admin-btn-edit text-xs flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5" /> Refresh Stats
                </button>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/30">
                  <div className="flex items-center justify-between text-amber-400">
                    <span className="text-xs font-mono uppercase font-bold">Total Page Views</span>
                    <Eye className="w-5 h-5" />
                  </div>
                  <div className="text-3xl font-black text-foreground mt-3">{analytics?.pageViews || 1}</div>
                  <p className="text-[11px] text-muted-foreground mt-1">Total visitors browsed portfolio</p>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/30">
                  <div className="flex items-center justify-between text-emerald-400">
                    <span className="text-xs font-mono uppercase font-bold">CLI Terminal Launches</span>
                    <Terminal className="w-5 h-5" />
                  </div>
                  <div className="text-3xl font-black text-foreground mt-3">{analytics?.cliLaunches || 0}</div>
                  <p className="text-[11px] text-muted-foreground mt-1">Interactions with Dev Console</p>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-sky-500/10 to-sky-500/5 border border-sky-500/30">
                  <div className="flex items-center justify-between text-sky-400">
                    <span className="text-xs font-mono uppercase font-bold">Quotes Calculated</span>
                    <Calculator className="w-5 h-5" />
                  </div>
                  <div className="text-3xl font-black text-foreground mt-3">{analytics?.estimatorCalculations || 0}</div>
                  <p className="text-[11px] text-muted-foreground mt-1">Cost estimator usages by clients</p>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/30">
                  <div className="flex items-center justify-between text-purple-400">
                    <span className="text-xs font-mono uppercase font-bold">Resume Downloads</span>
                    <Upload className="w-5 h-5 rotate-180" />
                  </div>
                  <div className="text-3xl font-black text-foreground mt-3">{analytics?.resumeDownloads || 0}</div>
                  <p className="text-[11px] text-muted-foreground mt-1">Recruiter resume clicks</p>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-500/10 to-rose-500/5 border border-rose-500/30">
                  <div className="flex items-center justify-between text-rose-400">
                    <span className="text-xs font-mono uppercase font-bold">Contact Inquiries</span>
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div className="text-3xl font-black text-foreground mt-3">{analytics?.contactInquiries || inquiries.length}</div>
                  <p className="text-[11px] text-muted-foreground mt-1">Form messages dispatched</p>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border border-cyan-500/30">
                  <div className="flex items-center justify-between text-cyan-400">
                    <span className="text-xs font-mono uppercase font-bold">Published Projects</span>
                    <Code2 className="w-5 h-5" />
                  </div>
                  <div className="text-3xl font-black text-foreground mt-3">{projects.length}</div>
                  <p className="text-[11px] text-muted-foreground mt-1">Active showcase portfolio items</p>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ 1. PROFILE & HERO TAB */}
          {activeTab === "profile" && settings && (
            <div className="admin-card space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <User className="w-5 h-5 text-amber-500" /> Hero & Profile Settings
                  </h2>
                  <p className="text-xs text-muted-foreground">Manage your identity, role titles, and hero presentation.</p>
                </div>
                <button onClick={() => saveSettings()} disabled={saving} className="admin-btn-primary flex items-center gap-1.5 text-xs">
                  <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>

              {/* Avatar Picture */}
              <div>
                <label className="admin-label">Profile Avatar</label>
                <div className="flex items-center gap-5 mt-2">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-lg flex-shrink-0 bg-slate-900">
                    <img src={settings.avatarUrl || "/placeholder.jpg"} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <input
                      type="text"
                      className="admin-input text-xs"
                      placeholder="Avatar image URL"
                      value={settings.avatarUrl}
                      onChange={e => setSettings({ ...settings, avatarUrl: e.target.value })}
                    />
                    <label className="admin-btn-edit text-xs inline-flex items-center gap-1.5 cursor-pointer">
                      <Upload className="w-3.5 h-3.5" /> Upload File from Computer
                      <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              {/* Name & Title */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Full Name</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={settings.name}
                    onChange={e => setSettings({ ...settings, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="admin-label">Main Title</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={settings.title}
                    onChange={e => setSettings({ ...settings, title: e.target.value })}
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="admin-label">Hero Bio Tagline</label>
                <textarea
                  rows={2}
                  className="admin-input"
                  value={settings.bio}
                  onChange={e => setSettings({ ...settings, bio: e.target.value })}
                />
              </div>

              {/* Availability Toggle */}
              <div className="p-4 rounded-xl border border-border bg-white/[0.02] flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-foreground">Freelance Availability Badge</div>
                  <div className="text-xs text-muted-foreground">Controls the green status indicator on hero.</div>
                </div>
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, available: !settings.available })}
                  className={`w-12 h-6 rounded-full transition-colors relative ${settings.available ? "bg-green-500" : "bg-slate-700"}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${settings.available ? "translate-x-6" : "translate-x-0"}`} />
                </button>
              </div>

              {/* Typing roles */}
              <div>
                <label className="admin-label">Hero Typing Animation Roles (One per line)</label>
                <textarea
                  rows={4}
                  className="admin-input font-mono text-xs"
                  value={settings.typingRoles?.join("\n") || ""}
                  onChange={e => setSettings({ ...settings, typingRoles: e.target.value.split("\n").filter(Boolean) })}
                />
              </div>
            </div>
          )}

          {/* ============================================================ 2. SOCIALS & CONTACT TAB */}
          {activeTab === "socials" && settings && (
            <div className="admin-card space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <Link2 className="w-5 h-5 text-sky-400" /> Links & Social Channels
                  </h2>
                  <p className="text-xs text-muted-foreground">Manage your WhatsApp, Fiverr profile, Resume URL and GitHub.</p>
                </div>
                <button onClick={() => saveSettings()} disabled={saving} className="admin-btn-primary flex items-center gap-1.5 text-xs">
                  <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Links"}
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Google Drive Resume URL</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={settings.resumeUrl || ""}
                    onChange={e => setSettings({ ...settings, resumeUrl: e.target.value })}
                  />
                </div>
                <div>
                  <label className="admin-label">Direct Email Address</label>
                  <input
                    type="email"
                    className="admin-input"
                    value={settings.email || ""}
                    onChange={e => setSettings({ ...settings, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">WhatsApp Display Number</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={settings.whatsapp || ""}
                    onChange={e => setSettings({ ...settings, whatsapp: e.target.value })}
                  />
                </div>
                <div>
                  <label className="admin-label">WhatsApp Direct Link URL</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={settings.whatsappUrl || ""}
                    onChange={e => setSettings({ ...settings, whatsappUrl: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">GitHub Profile URL</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={settings.github || ""}
                    onChange={e => setSettings({ ...settings, github: e.target.value })}
                  />
                </div>
                <div>
                  <label className="admin-label">LinkedIn Profile URL</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={settings.linkedin || ""}
                    onChange={e => setSettings({ ...settings, linkedin: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="admin-label">Fiverr Profile Link</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={settings.fiverrUrl || ""}
                    onChange={e => setSettings({ ...settings, fiverrUrl: e.target.value })}
                  />
                </div>
                <div>
                  <label className="admin-label">Fiverr Star Rating</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={settings.fiverrRating || ""}
                    onChange={e => setSettings({ ...settings, fiverrRating: e.target.value })}
                  />
                </div>
                <div>
                  <label className="admin-label">Fiverr Seller Level</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={settings.fiverrLevel || ""}
                    onChange={e => setSettings({ ...settings, fiverrLevel: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ 3. ABOUT TAB */}
          {activeTab === "about" && settings && (
            <div className="admin-card space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <FileText className="w-5 h-5 text-emerald-400" /> About Me Section
                  </h2>
                  <p className="text-xs text-muted-foreground">Edit your personal narrative, background story, and highlights.</p>
                </div>
                <button onClick={() => saveSettings()} disabled={saving} className="admin-btn-primary flex items-center gap-1.5 text-xs">
                  <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save About"}
                </button>
              </div>

              <div>
                <label className="admin-label">About Heading</label>
                <input
                  type="text"
                  className="admin-input"
                  value={settings.aboutHeading || ""}
                  onChange={e => setSettings({ ...settings, aboutHeading: e.target.value })}
                />
              </div>

              <div>
                <label className="admin-label">Paragraph 1 (Core Specialization)</label>
                <textarea
                  rows={3}
                  className="admin-input"
                  value={settings.aboutParagraph1 || ""}
                  onChange={e => setSettings({ ...settings, aboutParagraph1: e.target.value })}
                />
              </div>

              <div>
                <label className="admin-label">Paragraph 2 (Engineering Focus)</label>
                <textarea
                  rows={3}
                  className="admin-input"
                  value={settings.aboutParagraph2 || ""}
                  onChange={e => setSettings({ ...settings, aboutParagraph2: e.target.value })}
                />
              </div>

              <div>
                <label className="admin-label">Paragraph 3 (Global Freelance Experience)</label>
                <textarea
                  rows={3}
                  className="admin-input"
                  value={settings.aboutParagraph3 || ""}
                  onChange={e => setSettings({ ...settings, aboutParagraph3: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* ============================================================ 4. JOURNEY ROADMAP */}
          {activeTab === "journey" && settings && (
            <div className="admin-card space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <GitBranch className="w-5 h-5 text-purple-400" /> Career Journey Roadmap
                  </h2>
                  <p className="text-xs text-muted-foreground">Manage your educational and professional milestones.</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={openAddJourney} className="admin-btn-edit text-xs flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5" /> Add Milestone
                  </button>
                  <button onClick={() => saveSettings()} disabled={saving} className="admin-btn-primary flex items-center gap-1.5 text-xs">
                    <Save className="w-4 h-4" /> Save
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {settings.journey?.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-border bg-white/[0.02] flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: item.color }} />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-foreground">{item.title}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-muted-foreground font-semibold">{item.year}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.subtitle}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => openEditJourney(idx)} className="admin-btn-edit text-xs p-2"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDeleteJourney(idx)} className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/10 border border-rose-500/20"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================ 5. SKILLS TAB */}
          {activeTab === "skills" && (
            <div className="admin-card space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <Layers className="w-5 h-5 text-cyan-400" /> Skills Arsenal
                  </h2>
                  <p className="text-xs text-muted-foreground">Manage categories, skills tags, and proficiency levels.</p>
                </div>
                <button onClick={openAddSkill} className="admin-btn-primary flex items-center gap-1.5 text-xs">
                  <Plus className="w-4 h-4" /> Add Category
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {skills.map(s => (
                  <div key={s.id} className="p-4 rounded-xl border border-border bg-white/[0.02] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ background: s.color }} />
                        <span className="font-bold text-sm text-foreground">{s.category}</span>
                      </div>
                      <span className="text-xs font-mono font-bold" style={{ color: s.color }}>{s.level}%</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {s.items.map(t => (
                        <span key={t} className="text-[11px] px-2 py-0.5 rounded bg-white/5 border border-border text-muted-foreground">{t}</span>
                      ))}
                    </div>
                    <div className="flex gap-2 pt-2 border-t border-border/60">
                      <button onClick={() => openEditSkill(s)} className="admin-btn-edit flex-1 text-xs py-1.5 flex items-center justify-center gap-1">
                        <Edit2 className="w-3 h-3" /> Edit
                      </button>
                      <button onClick={() => handleDeleteSkill(s.id)} className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 border border-rose-500/20">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================ 6. SERVICES TAB */}
          {activeTab === "services" && (
            <div className="admin-card space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-amber-400" /> Services & Offerings
                  </h2>
                  <p className="text-xs text-muted-foreground">Manage your development packages, features, and offerings.</p>
                </div>
                <button onClick={openAddService} className="admin-btn-primary flex items-center gap-1.5 text-xs">
                  <Plus className="w-4 h-4" /> Add Service
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {services.map(svc => (
                  <div key={svc.id} className="p-5 rounded-xl border border-border bg-white/[0.02] space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-foreground">{svc.title}</h3>
                      <span className="w-3 h-3 rounded-full" style={{ background: svc.color }} />
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{svc.description}</p>
                    <ul className="space-y-1 pt-1 text-[11px] text-muted-foreground font-mono">
                      {svc.points?.map((pt, i) => <li key={i}>• {pt}</li>)}
                    </ul>
                    <div className="flex gap-2 pt-2 border-t border-border/60">
                      <button onClick={() => openEditService(svc)} className="admin-btn-edit flex-1 text-xs py-1.5 flex items-center justify-center gap-1">
                        <Edit2 className="w-3 h-3" /> Edit
                      </button>
                      <button onClick={() => handleDeleteService(svc.id)} className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 border border-rose-500/20">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================ 7. FEATURED PROJECTS TAB */}
          {activeTab === "projects" && (
            <div className="admin-card space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-emerald-400" /> Featured Projects
                  </h2>
                  <p className="text-xs text-muted-foreground">Manage showcase projects, GitHub links, and live previews.</p>
                </div>
                <button onClick={openAddProject} className="admin-btn-primary flex items-center gap-1.5 text-xs">
                  <Plus className="w-4 h-4" /> Add Project
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {projects.map(p => (
                  <div key={p.id} className="p-5 rounded-xl border border-border bg-white/[0.02] space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-sm text-foreground">{p.title}</h3>
                        <p className="text-xs font-mono" style={{ color: p.accentColor }}>{p.subtitle}</p>
                      </div>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/5 border border-border text-muted-foreground">
                        {p.category}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{p.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {p.tech.map(t => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-muted-foreground">{t}</span>
                      ))}
                    </div>
                    <div className="flex gap-2 pt-2 border-t border-border/60">
                      <button onClick={() => openEditProject(p)} className="admin-btn-edit flex-1 text-xs py-1.5 flex items-center justify-center gap-1">
                        <Edit2 className="w-3 h-3" /> Edit
                      </button>
                      <button onClick={() => handleDeleteProject(p.id)} className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 border border-rose-500/20">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================ 8. ESTIMATOR RATES TAB */}
          {activeTab === "estimator" && settings && (
            <div className="admin-card space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-amber-500" /> Project Cost Estimator Rates
                  </h2>
                  <p className="text-xs text-muted-foreground">Customize base project costs and add-on rates in USD ($).</p>
                </div>
                <button onClick={() => saveSettings()} disabled={saving} className="admin-btn-primary flex items-center gap-1.5 text-xs">
                  <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Rates"}
                </button>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(settings.estimatorRates || {}).map(([key, val]) => (
                  <div key={key} className="p-3.5 rounded-xl border border-border bg-white/[0.02]">
                    <label className="admin-label capitalize">{key} Rate ($)</label>
                    <input
                      type="number"
                      className="admin-input"
                      value={val}
                      onChange={e => {
                        const updated = { ...settings.estimatorRates, [key]: Number(e.target.value) }
                        setSettings({ ...settings, estimatorRates: updated })
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================ 9. FIVERR REVIEWS TAB */}
          {activeTab === "reviews" && (
            <div className="admin-card space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400" /> Fiverr Client Reviews
                  </h2>
                  <p className="text-xs text-muted-foreground">Manage verified client testimonials, ratings, and flags.</p>
                </div>
                <button onClick={openAddReview} className="admin-btn-primary flex items-center gap-1.5 text-xs">
                  <Plus className="w-4 h-4" /> Add Review
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {reviews.map(r => (
                  <div key={r.id} className="p-4 rounded-xl border border-border bg-white/[0.02] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-sm text-foreground">{r.name}</span>
                        <div className="text-xs text-muted-foreground">{r.country}</div>
                      </div>
                      <div className="flex text-yellow-400">
                        {Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                      </div>
                    </div>
                    <p className="text-xs text-foreground/90 leading-relaxed italic">&quot;{r.review}&quot;</p>
                    <div className="text-[10px] font-mono text-amber-400">{r.project} • {r.date}</div>
                    <div className="flex gap-2 pt-2 border-t border-border/60">
                      <button onClick={() => openEditReview(r)} className="admin-btn-edit flex-1 text-xs py-1.5 flex items-center justify-center gap-1">
                        <Edit2 className="w-3 h-3" /> Edit
                      </button>
                      <button onClick={() => handleDeleteReview(r.id)} className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 border border-rose-500/20">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================ 10. STATS COUNTER TAB */}
          {activeTab === "stats" && settings && (
            <div className="admin-card space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-amber-500" /> Stats Counter
                  </h2>
                  <p className="text-xs text-muted-foreground">Adjust animated numbers shown across your portfolio.</p>
                </div>
                <button onClick={() => saveSettings()} disabled={saving} className="admin-btn-primary flex items-center gap-1.5 text-xs">
                  <Save className="w-4 h-4" /> Save Stats
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {settings.stats?.map((stat, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-border bg-white/[0.02] space-y-3">
                    <div>
                      <label className="admin-label">Stat Label</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={stat.label}
                        onChange={e => {
                          const updated = [...settings.stats]
                          updated[idx].label = e.target.value
                          setSettings({ ...settings, stats: updated })
                        }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="admin-label">Number</label>
                        <input
                          type="number"
                          step="0.1"
                          className="admin-input"
                          value={stat.num}
                          onChange={e => {
                            const updated = [...settings.stats]
                            updated[idx].num = Number(e.target.value)
                            setSettings({ ...settings, stats: updated })
                          }}
                        />
                      </div>
                      <div>
                        <label className="admin-label">Suffix (e.g. +, %, ★)</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={stat.suffix}
                          onChange={e => {
                            const updated = [...settings.stats]
                            updated[idx].suffix = e.target.value
                            setSettings({ ...settings, stats: updated })
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================ 11. FOOTER TAB */}
          {activeTab === "footer" && settings && (
            <div className="admin-card space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <Globe className="w-5 h-5 text-sky-400" /> Footer Copy & Copyright
                  </h2>
                  <p className="text-xs text-muted-foreground">Manage footer subtitle and copyright line.</p>
                </div>
                <button onClick={() => saveSettings()} disabled={saving} className="admin-btn-primary flex items-center gap-1.5 text-xs">
                  <Save className="w-4 h-4" /> Save Footer
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="admin-label">Footer Tagline</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={settings.footerBio || ""}
                    onChange={e => setSettings({ ...settings, footerBio: e.target.value })}
                  />
                </div>
                <div>
                  <label className="admin-label">Copyright Notice</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={settings.copyrightText || ""}
                    onChange={e => setSettings({ ...settings, copyrightText: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ====== MODAL: PROJECTS ====== */}
      {projectModal.open && (
        <div className="admin-modal-overlay" onClick={e => { if (e.target === e.currentTarget) setProjectModal({ open: false, item: null }) }}>
          <div className="admin-modal admin-slide-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">{projectModal.item ? "Edit Project" : "Add Project"}</h3>
              <button onClick={() => setProjectModal({ open: false, item: null })}><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="admin-label">Project Title</label>
                  <input className="admin-input" placeholder="ThinkBoard" value={projectForm.title || ""}
                    onChange={e => setProjectForm({ ...projectForm, title: e.target.value })} />
                </div>
                <div>
                  <label className="admin-label">Subtitle / Type</label>
                  <input className="admin-input" placeholder="MERN Notes App" value={projectForm.subtitle || ""}
                    onChange={e => setProjectForm({ ...projectForm, subtitle: e.target.value })} />
                </div>
              </div>

              <div>
                <label className="admin-label">Filter Category</label>
                <select
                  className="admin-input bg-[#161924]"
                  value={projectForm.category || "Full-Stack MERN"}
                  onChange={e => setProjectForm({ ...projectForm, category: e.target.value })}
                >
                  <option value="Full-Stack MERN">Full-Stack MERN</option>
                  <option value="Next.js / Frontend">Next.js / Frontend</option>
                  <option value="Mobile & AI">Mobile & AI</option>
                </select>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="admin-label">GitHub URL</label>
                  <input className="admin-input" placeholder="https://github.com/..." value={projectForm.github || ""}
                    onChange={e => setProjectForm({ ...projectForm, github: e.target.value })} />
                </div>
                <div>
                  <label className="admin-label">Live Demo URL</label>
                  <input className="admin-input" placeholder="https://..." value={projectForm.live || ""}
                    onChange={e => setProjectForm({ ...projectForm, live: e.target.value })} />
                </div>
              </div>

              <div>
                <label className="admin-label">Short Description</label>
                <textarea className="admin-input" rows={3} placeholder="Project overview..."
                  value={projectForm.description || ""}
                  onChange={e => setProjectForm({ ...projectForm, description: e.target.value })} />
              </div>

              <div>
                <label className="admin-label">Tech Stack (comma separated)</label>
                <input className="admin-input" placeholder="React, Node.js, MongoDB, Tailwind CSS"
                  value={projectTechInput} onChange={e => setProjectTechInput(e.target.value)} />
              </div>

              <div>
                <label className="admin-label">Architecture / Feature Points (One per line for modal)</label>
                <textarea className="admin-input" rows={3} placeholder="JWT Auth architecture&#10;Rate-limited Express APIs&#10;Full CRUD Markdown support"
                  value={projectDetailsInput} onChange={e => setProjectDetailsInput(e.target.value)} />
              </div>

              <div>
                <label className="admin-label">Accent Theme Color</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {ACCENT_COLORS.map(c => (
                    <button key={c} type="button" onClick={() => setProjectForm({ ...projectForm, accentColor: c })}
                      className="w-7 h-7 rounded-full border-2 transition-all"
                      style={{ background: c, borderColor: projectForm.accentColor === c ? "#fff" : "transparent" }} />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={handleSaveProject} className="admin-btn-primary flex-1 flex items-center justify-center gap-1.5">
                <Save className="w-4 h-4" /> Save Project
              </button>
              <button onClick={() => setProjectModal({ open: false, item: null })} className="admin-btn-edit">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ====== MODAL: REVIEWS ====== */}
      {reviewModal.open && (
        <div className="admin-modal-overlay" onClick={e => { if (e.target === e.currentTarget) setReviewModal({ open: false, item: null }) }}>
          <div className="admin-modal admin-slide-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">{reviewModal.item ? "Edit Review" : "Add Review"}</h3>
              <button onClick={() => setReviewModal({ open: false, item: null })}><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="admin-label">Client Name</label>
                  <input className="admin-input" placeholder="john_d***" value={reviewForm.name || ""}
                    onChange={e => setReviewForm({ ...reviewForm, name: e.target.value })} />
                </div>
                <div>
                  <label className="admin-label">Country (with flag emoji)</label>
                  <input className="admin-input" placeholder="🇺🇸 United States" value={reviewForm.country || ""}
                    onChange={e => setReviewForm({ ...reviewForm, country: e.target.value })} />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="admin-label">Project Type</label>
                  <input className="admin-input" placeholder="MERN Stack Web App" value={reviewForm.project || ""}
                    onChange={e => setReviewForm({ ...reviewForm, project: e.target.value })} />
                </div>
                <div>
                  <label className="admin-label">Date String</label>
                  <input className="admin-input" placeholder="2 weeks ago" value={reviewForm.date || ""}
                    onChange={e => setReviewForm({ ...reviewForm, date: e.target.value })} />
                </div>
              </div>

              <div>
                <label className="admin-label">Rating (1 to 5 Stars)</label>
                <div className="flex gap-2 mt-1">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button key={n} type="button" onClick={() => setReviewForm({ ...reviewForm, rating: n })}>
                      <Star className={`w-6 h-6 ${(reviewForm.rating || 5) >= n ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="admin-label">Client Review Copy</label>
                <textarea className="admin-input" rows={4} placeholder="Exceptional work! Delivered ahead of schedule..."
                  value={reviewForm.review || ""}
                  onChange={e => setReviewForm({ ...reviewForm, review: e.target.value })} />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={handleSaveReview} className="admin-btn-primary flex-1 flex items-center justify-center gap-1.5">
                <Save className="w-4 h-4" /> Save Review
              </button>
              <button onClick={() => setReviewModal({ open: false, item: null })} className="admin-btn-edit">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ====== MODAL: SKILLS ====== */}
      {skillModal.open && (
        <div className="admin-modal-overlay" onClick={e => { if (e.target === e.currentTarget) setSkillModal({ open: false, item: null }) }}>
          <div className="admin-modal admin-slide-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">{skillModal.item ? "Edit Skill Category" : "Add Skill Category"}</h3>
              <button onClick={() => setSkillModal({ open: false, item: null })}><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="admin-label">Category Name</label>
                <input className="admin-input" placeholder="Frontend / Backend / Cloud" value={skillForm.category || ""}
                  onChange={e => setSkillForm({ ...skillForm, category: e.target.value })} />
              </div>
              <div>
                <label className="admin-label">Skills (Comma-separated tags)</label>
                <input className="admin-input" placeholder="React.js, Next.js 15, TypeScript, Tailwind CSS"
                  value={skillItemsInput} onChange={e => setSkillItemsInput(e.target.value)} />
              </div>
              <div>
                <label className="admin-label">Proficiency Level ({skillForm.level || 85}%)</label>
                <input type="range" min="20" max="100" step="5" value={skillForm.level || 85}
                  onChange={e => setSkillForm({ ...skillForm, level: Number(e.target.value) })}
                  className="w-full accent-amber-500" />
              </div>
              <div>
                <label className="admin-label">Category Glow Color</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {ACCENT_COLORS.map(c => (
                    <button key={c} type="button" onClick={() => setSkillForm({ ...skillForm, color: c })}
                      className="w-7 h-7 rounded-full border-2 transition-all"
                      style={{ background: c, borderColor: skillForm.color === c ? "#fff" : "transparent" }} />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={handleSaveSkill} className="admin-btn-primary flex-1 flex items-center justify-center gap-1.5">
                <Save className="w-4 h-4" /> Save Skill Category
              </button>
              <button onClick={() => setSkillModal({ open: false, item: null })} className="admin-btn-edit">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ====== MODAL: SERVICES ====== */}
      {serviceModal.open && (
        <div className="admin-modal-overlay" onClick={e => { if (e.target === e.currentTarget) setServiceModal({ open: false, item: null }) }}>
          <div className="admin-modal admin-slide-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">{serviceModal.item ? "Edit Service" : "Add Service"}</h3>
              <button onClick={() => setServiceModal({ open: false, item: null })}><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="admin-label">Service Title</label>
                <input className="admin-input" placeholder="Full-Stack Web Development" value={serviceForm.title || ""}
                  onChange={e => setServiceForm({ ...serviceForm, title: e.target.value })} />
              </div>
              <div>
                <label className="admin-label">Description</label>
                <textarea className="admin-input" rows={3} placeholder="End-to-end web apps with clean code..."
                  value={serviceForm.description || ""}
                  onChange={e => setServiceForm({ ...serviceForm, description: e.target.value })} />
              </div>
              <div>
                <label className="admin-label">Key Bullet Points (Comma separated)</label>
                <input className="admin-input" placeholder="MERN Stack Apps, SSR & Next.js 15, State Management"
                  value={servicePointsInput} onChange={e => setServicePointsInput(e.target.value)} />
              </div>
              <div>
                <label className="admin-label">Theme Color</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {ACCENT_COLORS.map(c => (
                    <button key={c} type="button" onClick={() => setServiceForm({ ...serviceForm, color: c })}
                      className="w-7 h-7 rounded-full border-2 transition-all"
                      style={{ background: c, borderColor: serviceForm.color === c ? "#fff" : "transparent" }} />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={handleSaveService} className="admin-btn-primary flex-1 flex items-center justify-center gap-1.5">
                <Save className="w-4 h-4" /> Save Service
              </button>
              <button onClick={() => setServiceModal({ open: false, item: null })} className="admin-btn-edit">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ====== MODAL: JOURNEY ====== */}
      {journeyModal.open && (
        <div className="admin-modal-overlay" onClick={e => { if (e.target === e.currentTarget) setJourneyModal({ open: false, index: null }) }}>
          <div className="admin-modal admin-slide-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">{journeyModal.index !== null ? "Edit Milestone" : "Add Milestone"}</h3>
              <button onClick={() => setJourneyModal({ open: false, index: null })}><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="admin-label">Year Range</label>
                  <input className="admin-input" placeholder="2024 — Present" value={journeyForm.year}
                    onChange={e => setJourneyForm({ ...journeyForm, year: e.target.value })} />
                </div>
                <div>
                  <label className="admin-label">Badge Label</label>
                  <input className="admin-input" placeholder="Active / Milestone / Degree" value={journeyForm.badge}
                    onChange={e => setJourneyForm({ ...journeyForm, badge: e.target.value })} />
                </div>
              </div>

              <div>
                <label className="admin-label">Milestone Title</label>
                <input className="admin-input" placeholder="Freelance Full-Stack Developer" value={journeyForm.title}
                  onChange={e => setJourneyForm({ ...journeyForm, title: e.target.value })} />
              </div>

              <div>
                <label className="admin-label">Subtitle / Institution</label>
                <input className="admin-input" placeholder="Fiverr Level-1 Seller (5.0★ Rating)" value={journeyForm.subtitle}
                  onChange={e => setJourneyForm({ ...journeyForm, subtitle: e.target.value })} />
              </div>

              <div>
                <label className="admin-label">Description</label>
                <textarea className="admin-input" rows={3} placeholder="Details about this phase of your career..."
                  value={journeyForm.description}
                  onChange={e => setJourneyForm({ ...journeyForm, description: e.target.value })} />
              </div>

              <div>
                <label className="admin-label">Timeline Node Color</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {ACCENT_COLORS.map(c => (
                    <button key={c} type="button" onClick={() => setJourneyForm({ ...journeyForm, color: c })}
                      className="w-7 h-7 rounded-full border-2 transition-all"
                      style={{ background: c, borderColor: journeyForm.color === c ? "#fff" : "transparent" }} />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={handleSaveJourney} className="admin-btn-primary flex-1 flex items-center justify-center gap-1.5">
                <Save className="w-4 h-4" /> Save Milestone
              </button>
              <button onClick={() => setJourneyModal({ open: false, index: null })} className="admin-btn-edit">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
