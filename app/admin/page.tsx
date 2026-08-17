"use client"

import React, { useState, useEffect } from "react"
import {
  Plus, Edit2, Trash2, LogOut, Code2, Star, Layers, Server, Globe,
  Palette, GitBranch, Eye, EyeOff, Save, X, User, Upload, Link2,
  FileText, Briefcase, Calculator, BarChart3, MessageSquare, MapPin,
  CheckCircle2, AlertCircle, ArrowUpRight, ShieldCheck, Sparkles, Terminal
} from "lucide-react"

const ACCENT_COLORS = ["#f59e0b", "#0ea5e9", "#10b981", "#8b5cf6", "#ec4899", "#ef4444", "#14b8a6", "#f97316"]
const ADMIN_PASSWORD = "admin123"

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
// LOGIN SCREEN
// ================================================================
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw] = useState("")
  const [show, setShow] = useState(false)
  const [error, setError] = useState("")
  const [shake, setShake] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (pw === ADMIN_PASSWORD) {
      onLogin()
    } else {
      setError("Incorrect password! Try 'admin123'")
      setShake(true)
      setTimeout(() => setShake(false), 500)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "hsl(228,45%,5%)" }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 mb-3 text-amber-400">
            <Terminal className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-black gradient-text-animated mb-1">VIP Admin Panel</h1>
          <p className="text-xs text-muted-foreground">Muhammad Usman Portfolio CMS</p>
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
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {error && <p className="text-xs mt-2 text-rose-500">{error}</p>}
          <button type="submit" className="admin-btn-primary w-full mt-5 py-3">
            Unlock Dashboard
          </button>
        </form>
        <p className="text-center text-xs mt-4 text-muted-foreground font-mono">
          Default password: <code className="text-amber-400">admin123</code>
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
  const [activeTab, setActiveTab] = useState<string>("profile")
  const [mounted, setMounted] = useState(false)

  // State Collections
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [services, setServices] = useState<Service[]>([])

  // UI state
  const [toastMsg, setToastMsg] = useState("")
  const [saving, setSaving] = useState(false)

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

  useEffect(() => {
    setMounted(true)
    setIsLoggedIn(sessionStorage.getItem("admin_auth") === "1")

    // Fetch initial data
    Promise.all([
      fetch("/api/profile").then(r => r.json()),
      fetch("/api/projects").then(r => r.json()),
      fetch("/api/reviews").then(r => r.json()),
      fetch("/api/skills").then(r => r.json()),
      fetch("/api/services").then(r => r.json()),
    ]).then(([settData, projData, revData, skillData, svcData]) => {
      if (settData) setSettings(settData)
      if (Array.isArray(projData)) setProjects(projData)
      if (Array.isArray(revData)) setReviews(revData)
      if (Array.isArray(skillData)) setSkills(skillData)
      if (Array.isArray(svcData)) setServices(svcData)
    })
  }, [])

  const handleLogin = () => {
    sessionStorage.setItem("admin_auth", "1")
    setIsLoggedIn(true)
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

  // Avatar Upload
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
      }
    }
    reader.readAsDataURL(file)
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
      notify("Skill category added! ⚡")
    }
    setSkillModal({ open: false, item: null })
  }
  const handleDeleteSkill = async (id: string) => {
    if (!confirm("Delete this skill category?")) return
    await fetch(`/api/skills?id=${id}`, { method: "DELETE" })
    setSkills(skills.filter(s => s.id !== id))
    notify("Skill category deleted.")
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
    const points = servicePointsInput.split(",").map(t => t.trim()).filter(Boolean)
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
    notify("Service deleted.")
  }

  // ============================================================ JOURNEY CRUD
  const openAddJourney = () => {
    setJourneyForm({ year: "2024 — Present", title: "", subtitle: "", description: "", badge: "Active", color: "#f59e0b" })
    setJourneyModal({ open: true, index: null })
  }
  const openEditJourney = (index: number) => {
    if (!settings?.journey?.[index]) return
    setJourneyForm({ ...settings.journey[index] })
    setJourneyModal({ open: true, index })
  }
  const handleSaveJourney = () => {
    if (!settings) return
    let updatedJourney = [...(settings.journey || [])]
    if (journeyModal.index !== null) {
      updatedJourney[journeyModal.index] = journeyForm
    } else {
      updatedJourney.push(journeyForm)
    }
    const nextSettings = { ...settings, journey: updatedJourney }
    setSettings(nextSettings)
    saveSettings(nextSettings)
    setJourneyModal({ open: false, index: null })
  }
  const handleDeleteJourney = (index: number) => {
    if (!settings || !confirm("Delete this journey milestone?")) return
    const updatedJourney = settings.journey.filter((_, i) => i !== index)
    const nextSettings = { ...settings, journey: updatedJourney }
    setSettings(nextSettings)
    saveSettings(nextSettings)
  }

  if (!mounted) return <div className="min-h-screen bg-[#07090e]" />
  if (!isLoggedIn) return <LoginScreen onLogin={handleLogin} />

  const MENU_ITEMS = [
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
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-base gradient-text-animated font-mono">{"<M.Usman VIP CMS />"}</span>
            <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold">
              Live Connected
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
            {MENU_ITEMS.map(({ id, label, icon: Icon }) => {
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
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                </button>
              )
            })}
          </div>
        </aside>

        {/* CONTENT PANEL */}
        <main className="lg:col-span-8 space-y-6">
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
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-lg flex-shrink-0">
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

              {/* Typing Animation Roles */}
              <div>
                <label className="admin-label">Animated Typing Roles (Comma-separated)</label>
                <input
                  type="text"
                  className="admin-input"
                  value={settings.typingRoles?.join(", ") || ""}
                  onChange={e => setSettings({
                    ...settings,
                    typingRoles: e.target.value.split(",").map(r => r.trim()).filter(Boolean)
                  })}
                />
              </div>

              {/* Location Badge */}
              <div>
                <label className="admin-label">Location & Presence Tag</label>
                <input
                  type="text"
                  className="admin-input"
                  value={settings.location || ""}
                  onChange={e => setSettings({ ...settings, location: e.target.value })}
                />
              </div>

              {/* Hero Bio */}
              <div>
                <label className="admin-label">Hero Bio Pitch</label>
                <textarea
                  rows={3}
                  className="admin-input"
                  value={settings.bio}
                  onChange={e => setSettings({ ...settings, bio: e.target.value })}
                />
              </div>

              {/* Availability Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-border">
                <div>
                  <div className="text-sm font-semibold text-foreground">Freelance Availability Badge</div>
                  <div className="text-xs text-muted-foreground">Toggles green pulse indicator on hero and about picture</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.available}
                  onChange={e => setSettings({ ...settings, available: e.target.checked })}
                  className="w-5 h-5 accent-amber-500 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* ============================================================ 2. SOCIALS & CONTACTS TAB */}
          {activeTab === "socials" && settings && (
            <div className="admin-card space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <Link2 className="w-5 h-5 text-sky-400" /> Social Profiles & Contact Links
                  </h2>
                  <p className="text-xs text-muted-foreground">Manage your WhatsApp, Google Drive Resume, Fiverr, and GitHub links.</p>
                </div>
                <button onClick={() => saveSettings()} disabled={saving} className="admin-btn-primary flex items-center gap-1.5 text-xs">
                  <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="admin-label">Resume / CV (Google Drive URL)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={settings.resumeUrl}
                    onChange={e => setSettings({ ...settings, resumeUrl: e.target.value })}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="admin-label">Direct Email</label>
                    <input
                      type="email"
                      className="admin-input"
                      value={settings.email}
                      onChange={e => setSettings({ ...settings, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="admin-label">WhatsApp Number / Display</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={settings.whatsapp}
                      onChange={e => setSettings({ ...settings, whatsapp: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="admin-label">GitHub Profile URL</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={settings.github}
                      onChange={e => setSettings({ ...settings, github: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="admin-label">LinkedIn Profile URL</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={settings.linkedin}
                      onChange={e => setSettings({ ...settings, linkedin: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="admin-label">Fiverr Profile URL</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={settings.fiverrUrl}
                      onChange={e => setSettings({ ...settings, fiverrUrl: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="admin-label">Fiverr Rating</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={settings.fiverrRating}
                      onChange={e => setSettings({ ...settings, fiverrRating: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="admin-label">Fiverr Level Badge</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={settings.fiverrLevel}
                      onChange={e => setSettings({ ...settings, fiverrLevel: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ 3. ABOUT ME TAB */}
          {activeTab === "about" && settings && (
            <div className="admin-card space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <FileText className="w-5 h-5 text-amber-500" /> About Me Copy & Highlight Badges
                  </h2>
                  <p className="text-xs text-muted-foreground">Customize your bio story, paragraph descriptions, and skills badges.</p>
                </div>
                <button onClick={() => saveSettings()} disabled={saving} className="admin-btn-primary flex items-center gap-1.5 text-xs">
                  <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="admin-label">Section Heading</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={settings.aboutHeading || "About Me"}
                    onChange={e => setSettings({ ...settings, aboutHeading: e.target.value })}
                  />
                </div>

                <div>
                  <label className="admin-label">Paragraph 1 (Main Pitch)</label>
                  <textarea
                    rows={3}
                    className="admin-input"
                    value={settings.aboutParagraph1}
                    onChange={e => setSettings({ ...settings, aboutParagraph1: e.target.value })}
                  />
                </div>

                <div>
                  <label className="admin-label">Paragraph 2 (Engineering Focus)</label>
                  <textarea
                    rows={3}
                    className="admin-input"
                    value={settings.aboutParagraph2}
                    onChange={e => setSettings({ ...settings, aboutParagraph2: e.target.value })}
                  />
                </div>

                <div>
                  <label className="admin-label">Paragraph 3 (Client Track Record & Fiverr)</label>
                  <textarea
                    rows={3}
                    className="admin-input"
                    value={settings.aboutParagraph3}
                    onChange={e => setSettings({ ...settings, aboutParagraph3: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ 4. JOURNEY ROADMAP TAB */}
          {activeTab === "journey" && settings && (
            <div className="admin-card space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <GitBranch className="w-5 h-5 text-sky-400" /> Career & Experience Milestones
                  </h2>
                  <p className="text-xs text-muted-foreground">Add and organize your timeline roadmap items.</p>
                </div>
                <button onClick={openAddJourney} className="admin-btn-primary flex items-center gap-1.5 text-xs">
                  <Plus className="w-4 h-4" /> Add Milestone
                </button>
              </div>

              <div className="space-y-3">
                {settings.journey?.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-white/5 border border-border flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-3.5 h-3.5 rounded-full mt-1 flex-shrink-0" style={{ background: item.color, boxShadow: `0 0 10px ${item.color}` }} />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-foreground">{item.title}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full" style={{ background: `${item.color}20`, color: item.color, border: `1px solid ${item.color}40` }}>
                            {item.year}
                          </span>
                        </div>
                        <div className="text-xs font-mono text-muted-foreground mt-0.5">{item.subtitle}</div>
                        <p className="text-xs text-foreground/80 mt-1.5 leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => openEditJourney(idx)} className="admin-btn-edit text-xs flex items-center gap-1">
                        <Edit2 className="w-3 h-3" /> Edit
                      </button>
                      <button onClick={() => handleDeleteJourney(idx)} className="admin-btn-danger text-xs flex items-center gap-1">
                        <Trash2 className="w-3 h-3" /> Del
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================ 5. SKILLS ARSENAL TAB */}
          {activeTab === "skills" && (
            <div className="admin-card space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <Layers className="w-5 h-5 text-emerald-400" /> Skills & Tech Arsenal
                  </h2>
                  <p className="text-xs text-muted-foreground">Manage your skill categories, proficiency levels, and tech tags.</p>
                </div>
                <button onClick={openAddSkill} className="admin-btn-primary flex items-center gap-1.5 text-xs">
                  <Plus className="w-4 h-4" /> Add Skill Category
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {skills.map(s => (
                  <div key={s.id} className="p-4 rounded-xl bg-white/5 border border-border space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ background: s.color, boxShadow: `0 0 8px ${s.color}` }} />
                        <span className="font-bold text-sm text-foreground">{s.category}</span>
                      </div>
                      <span className="font-mono text-xs font-semibold" style={{ color: s.color }}>{s.level}%</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {s.items.map(item => (
                        <span key={item} className="tech-badge text-[10px]">{item}</span>
                      ))}
                    </div>
                    <div className="flex justify-end gap-2 pt-2 border-t border-border/50">
                      <button onClick={() => openEditSkill(s)} className="admin-btn-edit text-xs flex items-center gap-1">
                        <Edit2 className="w-3 h-3" /> Edit
                      </button>
                      <button onClick={() => handleDeleteSkill(s.id)} className="admin-btn-danger text-xs flex items-center gap-1">
                        <Trash2 className="w-3 h-3" /> Del
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
                    <Briefcase className="w-5 h-5 text-amber-400" /> Services & Packages
                  </h2>
                  <p className="text-xs text-muted-foreground">Manage your service offerings, descriptions, and feature checklists.</p>
                </div>
                <button onClick={openAddService} className="admin-btn-primary flex items-center gap-1.5 text-xs">
                  <Plus className="w-4 h-4" /> Add Service
                </button>
              </div>

              <div className="space-y-4">
                {services.map(s => (
                  <div key={s.id} className="p-5 rounded-xl bg-white/5 border border-border flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ background: s.color, boxShadow: `0 0 8px ${s.color}` }} />
                        <h3 className="font-bold text-sm text-foreground">{s.title}</h3>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{s.description}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {s.points?.map(p => (
                          <span key={p} className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 text-foreground/80 border border-border">
                            ✓ {p}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => openEditService(s)} className="admin-btn-edit text-xs flex items-center gap-1">
                        <Edit2 className="w-3 h-3" /> Edit
                      </button>
                      <button onClick={() => handleDeleteService(s.id)} className="admin-btn-danger text-xs flex items-center gap-1">
                        <Trash2 className="w-3 h-3" /> Del
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
                    <Code2 className="w-5 h-5 text-amber-500" /> Featured Projects & Architecture
                  </h2>
                  <p className="text-xs text-muted-foreground">Manage your portfolio projects, categories, links, and detailed modal breakdowns.</p>
                </div>
                <button onClick={openAddProject} className="admin-btn-primary flex items-center gap-1.5 text-xs">
                  <Plus className="w-4 h-4" /> Add New Project
                </button>
              </div>

              <div className="space-y-4">
                {projects.map(p => (
                  <div key={p.id} className="p-5 rounded-2xl bg-white/5 border border-border flex items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <div className="w-3.5 h-3.5 rounded-full" style={{ background: p.accentColor, boxShadow: `0 0 10px ${p.accentColor}` }} />
                        <span className="font-bold text-base text-foreground">{p.title}</span>
                        <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-white/5 border border-border text-amber-400">
                          {p.category || "Full-Stack MERN"}
                        </span>
                      </div>
                      <div className="text-xs font-mono text-muted-foreground">{p.subtitle}</div>
                      <p className="text-xs text-foreground/80 leading-relaxed">{p.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {p.tech.map(t => (
                          <span key={t} className="tech-badge text-[10px]">{t}</span>
                        ))}
                      </div>
                      <div className="flex gap-4 pt-1 text-xs font-mono">
                        {p.github && <a href={p.github} target="_blank" rel="noreferrer" className="text-sky-400 hover:underline">GitHub ↗</a>}
                        {p.live && <a href={p.live} target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">Live Demo ↗</a>}
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => openEditProject(p)} className="admin-btn-edit text-xs flex items-center gap-1">
                        <Edit2 className="w-3 h-3" /> Edit
                      </button>
                      <button onClick={() => handleDeleteProject(p.id)} className="admin-btn-danger text-xs flex items-center gap-1">
                        <Trash2 className="w-3 h-3" /> Del
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================ 8. COST ESTIMATOR TAB */}
          {activeTab === "estimator" && settings && (
            <div className="admin-card space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-emerald-400" /> Cost Estimator Base Rates
                  </h2>
                  <p className="text-xs text-muted-foreground">Adjust base package pricing and add-on feature fees for client calculations.</p>
                </div>
                <button onClick={() => saveSettings()} disabled={saving} className="admin-btn-primary flex items-center gap-1.5 text-xs">
                  <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Rates"}
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-mono uppercase text-muted-foreground font-bold mb-3">Base Project Packages ($USD)</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      { key: "mern", label: "Full-Stack MERN App Base ($)" },
                      { key: "frontend", label: "Next.js / Frontend Base ($)" },
                      { key: "api", label: "REST API & Backend Base ($)" },
                      { key: "mobile", label: "Custom SaaS / AI Base ($)" },
                    ].map(({ key, label }) => (
                      <div key={key}>
                        <label className="admin-label">{label}</label>
                        <input
                          type="number"
                          className="admin-input"
                          value={settings.estimatorRates?.[key] || 100}
                          onChange={e => setSettings({
                            ...settings,
                            estimatorRates: {
                              ...settings.estimatorRates,
                              [key]: Number(e.target.value)
                            }
                          })}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-mono uppercase text-muted-foreground font-bold mb-3">Add-on Feature Fees ($USD)</h3>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {[
                      { key: "auth", label: "User Auth (JWT/OAuth)" },
                      { key: "admin", label: "Admin Dashboard & CMS" },
                      { key: "payment", label: "Payment Gateway Integration" },
                      { key: "realtime", label: "WebSockets / Realtime" },
                      { key: "seo", label: "SEO & Speed Optimization" },
                    ].map(({ key, label }) => (
                      <div key={key}>
                        <label className="admin-label">{label}</label>
                        <input
                          type="number"
                          className="admin-input"
                          value={settings.estimatorRates?.[key] || 40}
                          onChange={e => setSettings({
                            ...settings,
                            estimatorRates: {
                              ...settings.estimatorRates,
                              [key]: Number(e.target.value)
                            }
                          })}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ 9. FIVERR REVIEWS TAB */}
          {activeTab === "reviews" && (
            <div className="admin-card space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400" /> Fiverr Testimonials & Reviews
                  </h2>
                  <p className="text-xs text-muted-foreground">Manage client testimonials, 5-star ratings, and review dates.</p>
                </div>
                <button onClick={openAddReview} className="admin-btn-primary flex items-center gap-1.5 text-xs">
                  <Plus className="w-4 h-4" /> Add New Review
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {reviews.map(r => (
                  <div key={r.id} className="p-4 rounded-xl bg-white/5 border border-border space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-sm text-foreground">{r.name}</span>
                        <div className="text-xs text-muted-foreground">{r.country}</div>
                      </div>
                      <div className="flex gap-0.5">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-foreground/85 leading-relaxed">&quot;{r.review}&quot;</p>
                    <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground pt-2 border-t border-border/50">
                      <span>{r.project}</span>
                      <div className="flex gap-2">
                        <button onClick={() => openEditReview(r)} className="admin-btn-edit text-xs flex items-center gap-1">
                          <Edit2 className="w-3 h-3" /> Edit
                        </button>
                        <button onClick={() => handleDeleteReview(r.id)} className="admin-btn-danger text-xs flex items-center gap-1">
                          <Trash2 className="w-3 h-3" /> Del
                        </button>
                      </div>
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
                    <BarChart3 className="w-5 h-5 text-amber-500" /> Stats Bar Metrics
                  </h2>
                  <p className="text-xs text-muted-foreground">Edit numeric counters, suffixes, and colors shown in the Stats bar.</p>
                </div>
                <button onClick={() => saveSettings()} disabled={saving} className="admin-btn-primary flex items-center gap-1.5 text-xs">
                  <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Stats"}
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {settings.stats?.map((stat, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-white/5 border border-border space-y-3">
                    <div>
                      <label className="admin-label">Metric Label</label>
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
                        <label className="admin-label">Number Value</label>
                        <input
                          type="number"
                          step={stat.isFloat ? "0.1" : "1"}
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
                  <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Footer"}
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
