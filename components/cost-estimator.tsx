"use client"

import React, { useState } from "react"
import { Check, ArrowRight, Clock, ShieldCheck, Zap, Sparkles, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { playClickSound, playSuccessSound } from "@/lib/sound-effects"

interface ProjectType {
  id: string
  name: string
  basePrice: number
  baseDays: number
  description: string
}

interface AddonFeature {
  id: string
  name: string
  price: number
  days: number
}

interface CostEstimatorProps {
  onSelectQuote?: (quoteDetails: string) => void
  rates?: Record<string, number>
}

export function CostEstimator({ onSelectQuote, rates }: CostEstimatorProps) {
  const projectTypes: ProjectType[] = [
    {
      id: "landing",
      name: "Modern Landing Page / Portfolio",
      basePrice: rates?.frontend ? Math.round(rates.frontend * 0.6) : 50,
      baseDays: 3,
      description: "Ultra-fast, pixel-perfect responsive web page with modern animations and SEO.",
    },
    {
      id: "mern",
      name: "Full-Stack MERN Web App",
      basePrice: rates?.mern || 150,
      baseDays: 8,
      description: "Complete web application with React/Next.js frontend and Express/MongoDB backend.",
    },
    {
      id: "api",
      name: "REST API & Backend System",
      basePrice: rates?.api || 80,
      baseDays: 4,
      description: "Secure, scalable backend with JWT authentication, CRUD APIs, and database modeling.",
    },
    {
      id: "custom",
      name: "Custom SaaS / AI Solution",
      basePrice: rates?.mobile || 200,
      baseDays: 12,
      description: "Complex application with custom algorithms, AI models, or third-party API pipelines.",
    },
  ]

  const addonFeatures: AddonFeature[] = [
    { id: "auth", name: "User Auth & Roles (JWT/OAuth)", price: rates?.auth || 30, days: 1 },
    { id: "admin", name: "Admin Dashboard & CMS", price: rates?.admin || 50, days: 2 },
    { id: "payments", name: "Payment Gateway (Stripe/PayPal)", price: rates?.payment || 40, days: 2 },
    { id: "realtime", name: "Real-time Chat / WebSockets", price: rates?.realtime || 40, days: 2 },
    { id: "seo", name: "SEO Tuning & Fast Load Speed", price: rates?.seo || 25, days: 1 },
    { id: "priority", name: "⚡ Priority Fast-Track Delivery", price: 50, days: -2 },
  ]

  const [selectedType, setSelectedType] = useState<string>("mern")
  const [selectedAddons, setSelectedAddons] = useState<string[]>(["auth", "admin"])

  const currentType = projectTypes.find(t => t.id === selectedType) || projectTypes[1]

  const toggleAddon = (id: string) => {
    playClickSound()
    setSelectedAddons(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  // Calculate Totals
  const addonsCost = selectedAddons.reduce((sum, id) => {
    const addon = addonFeatures.find(a => a.id === id)
    return sum + (addon ? addon.price : 0)
  }, 0)

  const addonsDays = selectedAddons.reduce((sum, id) => {
    const addon = addonFeatures.find(a => a.id === id)
    return sum + (addon ? addon.days : 0)
  }, 0)

  const totalPrice = currentType.basePrice + addonsCost
  const totalDays = Math.max(2, currentType.baseDays + addonsDays)

  const handleHireClick = () => {
    playSuccessSound()
    const summary = `Project: ${currentType.name}, Estimated Budget: ~$${totalPrice}, Timeline: ${totalDays} days, Add-ons: ${selectedAddons.join(", ")}`
    if (onSelectQuote) {
      onSelectQuote(summary)
    } else {
      const el = document.getElementById("contact")
      el?.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-10 border border-border">
      <div className="grid gap-10 lg:grid-cols-12">
        {/* Left column: Selection Options */}
        <div className="lg:col-span-7 space-y-8">
          {/* Step 1: Project Type */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-500 font-mono text-xs flex items-center justify-center font-bold">1</span>
              <h3 className="text-lg font-bold text-foreground">Select Project Scope</h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {projectTypes.map(type => {
                const active = selectedType === type.id
                return (
                  <div
                    key={type.id}
                    onClick={() => {
                      playClickSound()
                      setSelectedType(type.id)
                    }}
                    className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 border text-left ${
                      active
                        ? "bg-amber-500/10 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.15)]"
                        : "bg-slate-100/70 dark:bg-card border-border hover:border-amber-500/40"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={`font-semibold text-sm ${active ? "text-amber-500" : "text-foreground"}`}>
                        {type.name}
                      </span>
                      <span className="font-mono text-xs text-amber-500 font-bold ml-2">
                        ${type.basePrice}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                      {type.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Step 2: Add-on features */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 font-mono text-xs flex items-center justify-center font-bold">2</span>
              <h3 className="text-lg font-bold text-foreground">Select Capabilities & Add-ons</h3>
            </div>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {addonFeatures.map(feat => {
                const checked = selectedAddons.includes(feat.id)
                return (
                  <div
                    key={feat.id}
                    onClick={() => toggleAddon(feat.id)}
                    className={`p-3 rounded-xl cursor-pointer transition-all flex items-center justify-between border ${
                      checked
                        ? "bg-sky-500/10 border-sky-500 text-foreground"
                        : "bg-slate-100/50 dark:bg-card border-border text-muted-foreground hover:border-sky-500/30"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                        checked ? "bg-sky-500 border-sky-500 text-black" : "border-border bg-slate-200 dark:bg-white/5"
                      }`}>
                        {checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span className="text-xs font-medium">{feat.name}</span>
                    </div>
                    <span className="font-mono text-xs font-semibold text-sky-400 ml-2">
                      +${feat.price}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right column: Dynamic Live Quote Summary Card */}
        <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-amber-500/10 via-card to-sky-500/10 border border-amber-500/30">
          <div>
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-border">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground font-bold">Estimated Quote</span>
              </div>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/30">
                100% Guaranteed
              </span>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-muted-foreground">Estimated Investment</span>
                <div className="text-right">
                  <span className="text-3xl sm:text-4xl font-bold font-mono gradient-text-animated">
                    ${totalPrice}
                  </span>
                  <span className="text-xs text-muted-foreground block">USD (approx.)</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-sky-400" /> Turnaround Timeline
                </span>
                <span className="font-mono text-base font-semibold text-foreground">
                  ~{totalDays} Days
                </span>
              </div>

              <div className="space-y-2 pt-4 border-t border-border text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Includes clean code, documentation & bug warranty</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Free deployment assistance on Vercel / Railway</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2.5 pt-4">
            <Button
              onClick={handleHireClick}
              size="lg"
              className="w-full gap-2 text-xs font-bold py-6 btn-primary-glow"
              style={{ background: "linear-gradient(135deg,#f59e0b,#0ea5e9)", color: "#000", border: "none" }}
            >
              <Zap className="w-4 h-4" /> Start This Project with Usman
              <ArrowRight className="w-4 h-4 ml-auto" />
            </Button>
            <p className="text-[11px] text-center text-muted-foreground font-mono">
              Direct contract or 100% secure via Fiverr Escrow
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
