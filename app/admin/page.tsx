"use client"

import React, { useState, useEffect } from "react"
import { Plus, Edit2, Trash2, LogOut, Code2, Star, Layers, Server, Globe, Palette, GitBranch, Eye, EyeOff, Save, X } from "lucide-react"

// ================================================================
// TYPES
// ================================================================
interface Project {
  id: string
  title: string
  subtitle: string
  description: string
  tech: string[]
  github: string
  live: string
  accentColor: string
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

const ACCENT_COLORS = ["#f59e0b","#0ea5e9","#10b981","#8b5cf6","#ef4444","#ec4899","#14b8a6","#f97316"]
const ADMIN_PASSWORD = "admin123"

// ================================================================
// LOGIN SCREEN
// ================================================================
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw]       = useState("")
  const [show, setShow]   = useState(false)
  const [error, setError] = useState("")
  const [shake, setShake] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (pw === ADMIN_PASSWORD) { onLogin() }
    else {
      setError("Galat password!"); setShake(true)
      setTimeout(() => setShake(false), 500)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background:"hsl(228,45%,5%)" }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="text-3xl font-black gradient-text-animated mb-2">Admin Panel</div>
          <p className="text-sm" style={{ color:"hsl(220,12%,52%)" }}>Portfolio CMS — Muhammad Usman</p>
        </div>
        <form onSubmit={handleSubmit} className={`admin-card ${shake ? "animate-bounce" : ""}`}>
          <label className="admin-label">Password</label>
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              value={pw}
              onChange={e => { setPw(e.target.value); setError("") }}
              className="admin-input pr-10"
              placeholder="Enter admin password"
              autoFocus
            />
            <button type="button" onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              style={{ cursor:"pointer" }}>
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {error && <p className="text-xs mt-2" style={{ color:"#ef4444" }}>{error}</p>}
          <button type="submit" className="admin-btn-primary w-full mt-5">
            Login to Dashboard
          </button>
        </form>
        <p className="text-center text-xs mt-4" style={{ color:"hsl(220,12%,38%)" }}>
          Password: <code style={{ color:"#f59e0b" }}>admin123</code>
        </p>
      </div>
    </div>
  )
}

// ================================================================
// PROJECTS TAB
// ================================================================
function ProjectsTab() {
  const [projects, setProjects] = useState<Project[]>([])
  const [modal, setModal]       = useState<{ open:boolean; item:Project|null }>({ open:false, item:null })
  const [form, setForm]         = useState<Partial<Project>>({})
  const [techInput, setTechInput] = useState("")

  useEffect(() => {
    fetch('/api/projects').then(r => r.json()).then(data => {
      if (Array.isArray(data)) setProjects(data)
    })
  }, [])

  const openAdd  = () => { setForm({ accentColor:"#f59e0b", tech:[] }); setTechInput(""); setModal({ open:true, item:null }) }
  const openEdit = (p: Project) => { setForm({ ...p }); setTechInput(p.tech.join(", ")); setModal({ open:true, item:p }) }
  const closeModal = () => setModal({ open:false, item:null })

  const handleSave = async () => {
    const techArr = techInput.split(",").map(t => t.trim()).filter(Boolean)
    const payload = { ...form, tech: techArr }
    
    if (modal.item) {
      const res = await fetch(`/api/projects?id=${modal.item.id}`, { method: 'PUT', body: JSON.stringify(payload) })
      const updated = await res.json()
      setProjects(projects.map(p => p.id === updated.id ? updated : p))
    } else {
      const res = await fetch('/api/projects', { method: 'POST', body: JSON.stringify(payload) })
      const created = await res.json()
      setProjects([...projects, created])
    }
    closeModal()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return
    await fetch(`/api/projects?id=${id}`, { method: 'DELETE' })
    setProjects(projects.filter(p => p.id !== id))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Projects <span className="text-sm font-normal" style={{ color:"#f59e0b" }}>({projects.length})</span></h2>
        <button onClick={openAdd} className="admin-btn-primary flex items-center gap-2">
          <Plus className="h-4 w-4" />Add Project
        </button>
      </div>
      <div className="space-y-4">
        {projects.map(p => (
          <div key={p.id} className="admin-card flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="w-3 h-3 rounded-full flex-shrink-0 mt-1.5" style={{ background:p.accentColor, boxShadow:`0 0 8px ${p.accentColor}` }} />
              <div className="min-w-0">
                <div className="font-semibold truncate">{p.title}</div>
                <div className="text-xs mt-0.5" style={{ color:"#f59e0b" }}>{p.subtitle}</div>
                <p className="text-sm mt-1 line-clamp-2" style={{ color:"hsl(220,12%,55%)" }}>{p.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {p.tech.map(t => <span key={t} className="tech-badge text-xs">{t}</span>)}
                </div>
                <div className="flex gap-3 mt-2 text-xs" style={{ color:"hsl(220,12%,45%)" }}>
                  {p.github && <a href={p.github} target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors truncate max-w-[140px]">GitHub ↗</a>}
                  {p.live   && <a href={p.live}   target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors truncate max-w-[140px]">Live ↗</a>}
                </div>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => openEdit(p)} className="admin-btn-edit flex items-center gap-1"><Edit2 className="h-3 w-3" />Edit</button>
              <button onClick={() => handleDelete(p.id)} className="admin-btn-danger flex items-center gap-1"><Trash2 className="h-3 w-3" />Del</button>
            </div>
          </div>
        ))}
      </div>

      {modal.open && (
        <div className="admin-modal-overlay" onClick={e => { if (e.target === e.currentTarget) closeModal() }}>
          <div className="admin-modal admin-slide-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">{modal.item ? "Edit Project" : "Add Project"}</h3>
              <button onClick={closeModal} style={{ cursor:"pointer" }}><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              {[
                { label:"Title",       key:"title",       ph:"ThinkBoard" },
                { label:"Subtitle",    key:"subtitle",    ph:"MERN Notes App" },
                { label:"GitHub URL",  key:"github",      ph:"https://github.com/..." },
                { label:"Live URL",    key:"live",        ph:"https://app.vercel.app" },
              ].map(({ label, key, ph }) => (
                <div key={key}>
                  <label className="admin-label">{label}</label>
                  <input className="admin-input" placeholder={ph} value={(form as Record<string,string>)[key] ?? ""}
                    onChange={e => setForm(f => ({ ...f, [key]:e.target.value }))} />
                </div>
              ))}
              <div>
                <label className="admin-label">Description</label>
                <textarea className="admin-input" rows={3} placeholder="Project description..."
                  value={form.description ?? ""}
                  onChange={e => setForm(f => ({ ...f, description:e.target.value }))} />
              </div>
              <div>
                <label className="admin-label">Tech Stack (comma separated)</label>
                <input className="admin-input" placeholder="React, Node.js, MongoDB"
                  value={techInput} onChange={e => setTechInput(e.target.value)} />
              </div>
              <div>
                <label className="admin-label">Accent Color</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {ACCENT_COLORS.map(c => (
                    <button key={c} onClick={() => setForm(f => ({ ...f, accentColor:c }))}
                      className="w-8 h-8 rounded-full border-2 transition-all"
                      style={{ background:c, borderColor: form.accentColor === c ? "#fff" : "transparent",
                               boxShadow: form.accentColor === c ? `0 0 12px ${c}` : "none", cursor:"pointer" }} />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} className="admin-btn-primary flex-1 flex items-center justify-center gap-2">
                <Save className="h-4 w-4" />{modal.item ? "Update" : "Add"} Project
              </button>
              <button onClick={closeModal} className="admin-btn-edit">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ================================================================
// REVIEWS TAB
// ================================================================
function ReviewsTab() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [modal, setModal]     = useState<{ open:boolean; item:Review|null }>({ open:false, item:null })
  const [form, setForm]       = useState<Partial<Review>>({})

  useEffect(() => {
    fetch('/api/reviews').then(r => r.json()).then(data => {
      if (Array.isArray(data)) setReviews(data)
    })
  }, [])

  const openAdd  = () => { setForm({ rating:5, country:"🇺🇸" }); setModal({ open:true, item:null }) }
  const openEdit = (r: Review) => { setForm({ ...r }); setModal({ open:true, item:r }) }
  const closeModal = () => setModal({ open:false, item:null })

  const handleSave = async () => {
    if (modal.item) {
      const res = await fetch(`/api/reviews?id=${modal.item.id}`, { method: 'PUT', body: JSON.stringify(form) })
      const updated = await res.json()
      setReviews(reviews.map(r => r.id === updated.id ? updated : r))
    } else {
      const res = await fetch('/api/reviews', { method: 'POST', body: JSON.stringify(form) })
      const created = await res.json()
      setReviews([...reviews, created])
    }
    closeModal()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this review?")) return
    await fetch(`/api/reviews?id=${id}`, { method: 'DELETE' })
    setReviews(reviews.filter(r => r.id !== id))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Reviews <span className="text-sm font-normal" style={{ color:"#f59e0b" }}>({reviews.length})</span></h2>
        <button onClick={openAdd} className="admin-btn-primary flex items-center gap-2">
          <Plus className="h-4 w-4" />Add Review
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {reviews.map(r => (
          <div key={r.id} className="admin-card">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{ background:"rgba(245,158,11,0.12)", border:"1px solid rgba(245,158,11,0.28)", color:"#f59e0b" }}>
                  {r.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <div className="font-medium text-sm">{r.name}</div>
                  <div className="text-xs">{r.country}</div>
                </div>
              </div>
              <div className="flex">{Array.from({length:r.rating}).map((_,i) => <Star key={i} className="h-3.5 w-3.5 fill-yellow-400" style={{ color:"#fbbf24" }} />)}</div>
            </div>
            <p className="text-sm line-clamp-2 mb-3" style={{ color:"hsl(220,12%,60%)" }}>&quot;{r.review}&quot;</p>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono" style={{ color:"hsl(220,12%,45%)" }}>{r.project} · {r.date}</span>
              <div className="flex gap-2">
                <button onClick={() => openEdit(r)} className="admin-btn-edit flex items-center gap-1"><Edit2 className="h-3 w-3" />Edit</button>
                <button onClick={() => handleDelete(r.id)} className="admin-btn-danger flex items-center gap-1"><Trash2 className="h-3 w-3" />Del</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modal.open && (
        <div className="admin-modal-overlay" onClick={e => { if (e.target === e.currentTarget) closeModal() }}>
          <div className="admin-modal admin-slide-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">{modal.item ? "Edit Review" : "Add Review"}</h3>
              <button onClick={closeModal} style={{ cursor:"pointer" }}><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              {[
                { label:"Client Name",   key:"name",    ph:"john_d***" },
                { label:"Country Flag",  key:"country", ph:"🇺🇸" },
                { label:"Project Type",  key:"project", ph:"MERN Stack Web App" },
                { label:"Date",          key:"date",    ph:"2 weeks ago" },
              ].map(({ label, key, ph }) => (
                <div key={key}>
                  <label className="admin-label">{label}</label>
                  <input className="admin-input" placeholder={ph} value={(form as Record<string,string>)[key] ?? ""}
                    onChange={e => setForm(f => ({ ...f, [key]:e.target.value }))} />
                </div>
              ))}
              <div>
                <label className="admin-label">Rating</label>
                <div className="flex gap-2 mt-1">
                  {[1,2,3,4,5].map(n => (
                    <button key={n} onClick={() => setForm(f => ({ ...f, rating:n }))} className="admin-star"
                      style={{ cursor:"pointer" }}>
                      <Star className="h-7 w-7" style={{ color: (form.rating ?? 0) >= n ? "#fbbf24" : "rgba(255,255,255,0.2)", fill: (form.rating ?? 0) >= n ? "#fbbf24" : "none" }} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="admin-label">Review Text</label>
                <textarea className="admin-input" rows={4} placeholder="What the client said..."
                  value={form.review ?? ""}
                  onChange={e => setForm(f => ({ ...f, review:e.target.value }))} />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} className="admin-btn-primary flex-1 flex items-center justify-center gap-2">
                <Save className="h-4 w-4" />{modal.item ? "Update" : "Add"} Review
              </button>
              <button onClick={closeModal} className="admin-btn-edit">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ================================================================
// SKILLS TAB
// ================================================================
function SkillsTab() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [modal, setModal]   = useState<{ open:boolean; item:Skill|null }>({ open:false, item:null })
  const [form, setForm]     = useState<Partial<Skill>>({})
  const [itemInput, setItemInput] = useState("")

  useEffect(() => {
    fetch('/api/skills').then(r => r.json()).then(data => {
      if (Array.isArray(data)) setSkills(data)
    })
  }, [])

  const openAdd  = () => { setForm({ color:"#f59e0b", level:80, items:[] }); setItemInput(""); setModal({ open:true, item:null }) }
  const openEdit = (s: Skill) => { setForm({ ...s }); setItemInput(s.items.join(", ")); setModal({ open:true, item:s }) }
  const closeModal = () => setModal({ open:false, item:null })

  const handleSave = async () => {
    const items = itemInput.split(",").map(t => t.trim()).filter(Boolean)
    const payload = { ...form, items }
    
    if (modal.item) {
      const res = await fetch(`/api/skills?id=${modal.item.id}`, { method: 'PUT', body: JSON.stringify(payload) })
      const updated = await res.json()
      setSkills(skills.map(s => s.id === updated.id ? updated : s))
    } else {
      const res = await fetch('/api/skills', { method: 'POST', body: JSON.stringify(payload) })
      const created = await res.json()
      setSkills([...skills, created])
    }
    closeModal()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this skill category?")) return
    await fetch(`/api/skills?id=${id}`, { method: 'DELETE' })
    setSkills(skills.filter(s => s.id !== id))
  }

  const ICONS: Record<string, React.ElementType> = { Frontend:Layers, Backend:Server, Design:Palette, "Tools & Deploy":GitBranch }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Skills <span className="text-sm font-normal" style={{ color:"#f59e0b" }}>({skills.length} categories)</span></h2>
        <button onClick={openAdd} className="admin-btn-primary flex items-center gap-2"><Plus className="h-4 w-4" />Add Category</button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {skills.map(s => {
          const Icon = ICONS[s.category] ?? Code2
          return (
            <div key={s.id} className="admin-card">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background:`${s.color}14`, border:`1px solid ${s.color}28` }}>
                    <Icon className="h-5 w-5" style={{ color:s.color }} />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{s.category}</div>
                    <div className="text-xs" style={{ color:s.color }}>Level: {s.level}%</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(s)} className="admin-btn-edit flex items-center gap-1"><Edit2 className="h-3 w-3" />Edit</button>
                  <button onClick={() => handleDelete(s.id)} className="admin-btn-danger flex items-center gap-1"><Trash2 className="h-3 w-3" />Del</button>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {s.items.map(item => <span key={item} className="tech-badge">{item}</span>)}
              </div>
            </div>
          )
        })}
      </div>

      {modal.open && (
        <div className="admin-modal-overlay" onClick={e => { if (e.target === e.currentTarget) closeModal() }}>
          <div className="admin-modal admin-slide-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">{modal.item ? "Edit Skill Category" : "Add Skill Category"}</h3>
              <button onClick={closeModal} style={{ cursor:"pointer" }}><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="admin-label">Category Name</label>
                <input className="admin-input" placeholder="e.g. Frontend" value={form.category ?? ""}
                  onChange={e => setForm(f => ({ ...f, category:e.target.value }))} />
              </div>
              <div>
                <label className="admin-label">Skills (comma separated)</label>
                <input className="admin-input" placeholder="React, Next.js, TypeScript"
                  value={itemInput} onChange={e => setItemInput(e.target.value)} />
              </div>
              <div>
                <label className="admin-label">Level ({form.level}%)</label>
                <input type="range" min={10} max={100} step={5} value={form.level ?? 80}
                  onChange={e => setForm(f => ({ ...f, level:Number(e.target.value) }))}
                  className="w-full" style={{ accentColor:"#f59e0b" }} />
              </div>
              <div>
                <label className="admin-label">Color</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {ACCENT_COLORS.map(c => (
                    <button key={c} onClick={() => setForm(f => ({ ...f, color:c }))}
                      className="w-8 h-8 rounded-full border-2 transition-all"
                      style={{ background:c, borderColor: form.color === c ? "#fff" : "transparent",
                               boxShadow: form.color === c ? `0 0 12px ${c}` : "none", cursor:"pointer" }} />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} className="admin-btn-primary flex-1 flex items-center justify-center gap-2">
                <Save className="h-4 w-4" />{modal.item ? "Update" : "Add"} Category
              </button>
              <button onClick={closeModal} className="admin-btn-edit">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ================================================================
// SERVICES TAB
// ================================================================
function ServicesTab() {
  const [services, setServices] = useState<Service[]>([])
  const [modal, setModal]       = useState<{ open:boolean; item:Service|null }>({ open:false, item:null })
  const [form, setForm]         = useState<Partial<Service>>({})
  const [pointsInput, setPointsInput] = useState("")

  useEffect(() => {
    fetch('/api/services').then(r => r.json()).then(data => {
      if (Array.isArray(data)) setServices(data)
    })
  }, [])

  const openAdd  = () => { setForm({ color:"#f59e0b", points:[] }); setPointsInput(""); setModal({ open:true, item:null }) }
  const openEdit = (s: Service) => { setForm({ ...s }); setPointsInput(s.points.join(", ")); setModal({ open:true, item:s }) }
  const closeModal = () => setModal({ open:false, item:null })

  const handleSave = async () => {
    const points = pointsInput.split(",").map(t => t.trim()).filter(Boolean)
    const payload = { ...form, points }
    
    if (modal.item) {
      const res = await fetch(`/api/services?id=${modal.item.id}`, { method: 'PUT', body: JSON.stringify(payload) })
      const updated = await res.json()
      setServices(services.map(s => s.id === updated.id ? updated : s))
    } else {
      const res = await fetch('/api/services', { method: 'POST', body: JSON.stringify(payload) })
      const created = await res.json()
      setServices([...services, created])
    }
    closeModal()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this service?")) return
    await fetch(`/api/services?id=${id}`, { method: 'DELETE' })
    setServices(services.filter(s => s.id !== id))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Services <span className="text-sm font-normal" style={{ color:"#f59e0b" }}>({services.length})</span></h2>
        <button onClick={openAdd} className="admin-btn-primary flex items-center gap-2"><Plus className="h-4 w-4" />Add Service</button>
      </div>
      <div className="space-y-4">
        {services.map(s => (
          <div key={s.id} className="admin-card flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="w-3 h-3 rounded-full flex-shrink-0 mt-1.5" style={{ background:s.color, boxShadow:`0 0 8px ${s.color}` }} />
              <div className="min-w-0">
                <div className="font-semibold truncate">{s.title}</div>
                <p className="text-sm mt-1 line-clamp-2" style={{ color:"hsl(220,12%,55%)" }}>{s.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {s.points.map(p => <span key={p} className="tech-badge">{p}</span>)}
                </div>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => openEdit(s)} className="admin-btn-edit flex items-center gap-1"><Edit2 className="h-3 w-3" />Edit</button>
              <button onClick={() => handleDelete(s.id)} className="admin-btn-danger flex items-center gap-1"><Trash2 className="h-3 w-3" />Del</button>
            </div>
          </div>
        ))}
      </div>

      {modal.open && (
        <div className="admin-modal-overlay" onClick={e => { if (e.target === e.currentTarget) closeModal() }}>
          <div className="admin-modal admin-slide-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">{modal.item ? "Edit Service" : "Add Service"}</h3>
              <button onClick={closeModal} style={{ cursor:"pointer" }}><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="admin-label">Service Title</label>
                <input className="admin-input" placeholder="Full-Stack Web Development" value={form.title ?? ""}
                  onChange={e => setForm(f => ({ ...f, title:e.target.value }))} />
              </div>
              <div>
                <label className="admin-label">Description</label>
                <textarea className="admin-input" rows={3} placeholder="What this service includes..."
                  value={form.description ?? ""}
                  onChange={e => setForm(f => ({ ...f, description:e.target.value }))} />
              </div>
              <div>
                <label className="admin-label">Key Points (comma separated)</label>
                <input className="admin-input" placeholder="MERN Stack Apps, SPA & SSR, Authentication"
                  value={pointsInput} onChange={e => setPointsInput(e.target.value)} />
              </div>
              <div>
                <label className="admin-label">Color</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {ACCENT_COLORS.map(c => (
                    <button key={c} onClick={() => setForm(f => ({ ...f, color:c }))}
                      className="w-8 h-8 rounded-full border-2 transition-all"
                      style={{ background:c, borderColor: form.color === c ? "#fff" : "transparent",
                               boxShadow: form.color === c ? `0 0 12px ${c}` : "none", cursor:"pointer" }} />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} className="admin-btn-primary flex-1 flex items-center justify-center gap-2">
                <Save className="h-4 w-4" />{modal.item ? "Update" : "Add"} Service
              </button>
              <button onClick={closeModal} className="admin-btn-edit">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ================================================================
// MAIN ADMIN DASHBOARD
// ================================================================
const TABS = [
  { id:"projects", label:"Projects", icon:Code2  },
  { id:"reviews",  label:"Reviews",  icon:Star   },
  { id:"skills",   label:"Skills",   icon:Layers },
  { id:"services", label:"Services", icon:Globe  },
] as const

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeTab,  setActiveTab]  = useState<string>("projects")
  const [mounted,    setMounted]    = useState(false)
  
  // Note: Tab counts could also be updated based on fetch, but to keep UI simple
  // we are leaving the count dynamic in each tab component instead of the header for now.

  useEffect(() => {
    setMounted(true)
    setIsLoggedIn(sessionStorage.getItem("admin_auth") === "1")
  }, [])

  const handleLogin = () => {
    sessionStorage.setItem("admin_auth", "1")
    setIsLoggedIn(true)
  }
  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth")
    setIsLoggedIn(false)
  }

  if (!mounted) return <div className="min-h-screen" style={{ background:"hsl(228,45%,5%)" }} />
  if (!isLoggedIn) return <LoginScreen onLogin={handleLogin} />

  return (
    <div className="min-h-screen" style={{ background:"hsl(228,45%,5%)", cursor:"default" }}>
      <header className="sticky top-0 z-50 glass" style={{ borderBottom:"1px solid rgba(245,158,11,0.12)" }}>
        <div className="flex h-14 items-center justify-between px-6 max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <a href="/" className="text-lg font-black gradient-text-animated">{"<M.Usman />"}</a>
            <span className="text-xs px-2 py-0.5 rounded-full font-mono font-bold"
              style={{ background:"rgba(245,158,11,0.12)", color:"#f59e0b", border:"1px solid rgba(245,158,11,0.3)" }}>
              ADMIN
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors"
              style={{ color:"hsl(220,12%,55%)", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", cursor:"pointer" }}>
              <Globe className="h-3.5 w-3.5" />View Site
            </a>
            <button onClick={handleLogout} className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors"
              style={{ color:"#ef4444", background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.2)", cursor:"pointer" }}>
              <LogOut className="h-3.5 w-3.5" />Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex gap-2 mb-6 p-1 rounded-2xl" style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", width:"fit-content" }}>
          {TABS.map(({ id, label, icon:Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`admin-tab flex items-center gap-2 ${activeTab === id ? "active" : "inactive"}`}>
              <Icon className="h-4 w-4" />{label}
            </button>
          ))}
        </div>

        <div className="admin-slide-in">
          {activeTab === "projects" && <ProjectsTab />}
          {activeTab === "reviews"  && <ReviewsTab  />}
          {activeTab === "skills"   && <SkillsTab   />}
          {activeTab === "services" && <ServicesTab  />}
        </div>
      </main>
    </div>
  )
}
