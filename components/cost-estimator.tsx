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

const PROJECT_TYPES: ProjectType[] = [
  {
    id: "landing",
    name: "Modern Landing Page / Portfolio",
    basePrice: 50,
    baseDays: 3,
    description: "Ultra-fast, pixel-perfect responsive web page with modern animations and SEO.",
  },
  {
    id: "mern",
    name: "Full-Stack MERN Web App",
    basePrice: 150,
    baseDays: 8,
    description: "Complete web application with React/Next.js frontend and Express/MongoDB backend.",
  },
  {
    id: "api",
    name: "REST API & Backend System",
    basePrice: 80,
    baseDays: 4,
    description: "Secure, scalable backend with JWT authentication, CRUD APIs, and database modeling.",
  },
  {
    id: "custom",
    name: "Custom SaaS / AI Solution",
    basePrice: 200,
    baseDays: 12,
    description: "Complex application with custom algorithms, AI models, or third-party API pipelines.",
  },
]

interface AddonFeature {
  id: string
  name: string
  price: number
  days: number
}

const ADDON_FEATURES: AddonFeature[] = [
  { id: "auth", name: "User Auth & Roles (JWT/OAuth)", price: 30, days: 1 },
  { id: "admin", name: "Admin Dashboard & CMS", price: 50, days: 2 },
  { id: "payments", name: "Payment Gateway (Stripe/PayPal)", price: 40, days: 2 },
  { id: "realtime", name: "Real-time Chat / WebSockets", price: 40, days: 2 },
  { id: "seo", name: "SEO Tuning & Fast Load Speed", price: 25, days: 1 },
  { id: "priority", name: "⚡ Priority Fast-Track Delivery", price: 50, days: -2 },
]

export function CostEstimator({ onSelectQuote }: { onSelectQuote?: (quoteDetails: string) => void }) {
  const [selectedType, setSelectedType] = useState<string>("mern")
  const [selectedAddons, setSelectedAddons] = useState<string[]>(["auth", "admin"])

  const currentType = PROJECT_TYPES.find(t => t.id === selectedType) || PROJECT_TYPES[1]

  const toggleAddon = (id: string) => {
    playClickSound()
    setSelectedAddons(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  // Calculate Totals
  const addonsCost = selectedAddons.reduce((sum, id) => {
    const addon = ADDON_FEATURES.find(a => a.id === id)
    return sum + (addon ? addon.price : 0)
  }, 0)

  const addonsDays = selectedAddons.reduce((sum, id) => {
    const addon = ADDON_FEATURES.find(a => a.id === id)
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
    <div className="glass-card rounded-3xl p-6 sm:p-10 border border-amber-500/25 bg-card/80 text-card-foreground relative overflow-hidden shadow-2xl">
      {/* Background radial highlight */}
      <div
        className="absolute -top-24 -right-24 w-80 h-80 rounded-full pointer-events-none opacity-20"
        style={{ background: "radial-gradient(circle, #f59e0b, transparent 70%)", filter: "blur(50px)" }}
      />

      <div className="flex flex-col lg:flex-row gap-8 items-start relative z-10">
        {/* Left Side: Selectors */}
        <div className="flex-1 space-y-6 w-full">
          <div>
            <label className="text-xs uppercase font-mono tracking-widest text-amber-500 dark:text-amber-400 font-bold block mb-3">
              Step 1: Select Project Scope
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              {PROJECT_TYPES.map(type => {
                const isSelected = type.id === selectedType
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => {
                      playClickSound()
                      setSelectedType(type.id)
                    }}
                    className={`p-4 rounded-2xl text-left transition-all duration-200 ${
                      isSelected
                        ? "bg-amber-500/15 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.15)]"
                        : "bg-slate-100/60 dark:bg-[#12141f] border-slate-200 dark:border-white/5 hover:border-amber-500/30"
                    } border`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm text-foreground">{type.name}</span>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-black">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-2">{type.description}</p>
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-amber-500 dark:text-amber-400 font-bold">From ${type.basePrice}</span>
                      <span className="text-muted-foreground">~{type.baseDays} Days</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className="text-xs uppercase font-mono tracking-widest text-sky-500 dark:text-sky-400 font-bold block mb-3">
              Step 2: Add-on Features & Superpowers
            </label>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {ADDON_FEATURES.map(addon => {
                const isChecked = selectedAddons.includes(addon.id)
                return (
                  <button
                    key={addon.id}
                    type="button"
                    onClick={() => toggleAddon(addon.id)}
                    className={`flex items-center justify-between p-3 rounded-xl text-left text-xs transition-all ${
                      isChecked
                        ? "bg-sky-500/15 border-sky-500/40 text-sky-700 dark:text-sky-200"
                        : "bg-slate-100/60 dark:bg-[#12141f] border-slate-200 dark:border-white/5 text-muted-foreground hover:border-sky-500/30"
                    } border`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center border ${
                          isChecked ? "bg-sky-500 border-sky-400 text-black" : "border-slate-400 dark:border-slate-600 bg-transparent"
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className="font-medium text-foreground">{addon.name}</span>
                    </div>
                    <span className="font-mono text-muted-foreground font-semibold">
                      +${addon.price}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Instant Quote Card */}
        <div className="w-full lg:w-80 bg-slate-50 dark:bg-[#0d0f18] border border-amber-500/30 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-2xl relative">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <span className="text-xs font-mono uppercase text-muted-foreground">Estimated Quote</span>
              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20 font-semibold">
                <Zap className="w-3 h-3" /> Live Estimate
              </span>
            </div>

            <div>
              <div className="text-4xl font-extrabold text-foreground tracking-tight flex items-baseline gap-1">
                <span className="text-2xl text-amber-500 font-bold">$</span>
                <span className="gradient-text">{totalPrice}</span>
                <span className="text-xs text-muted-foreground font-normal">USD</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Transparent starting estimate with zero hidden fees.
              </p>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-border text-xs text-foreground">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="w-3.5 h-3.5 text-amber-500" /> Turnaround Time:
                </span>
                <span className="font-mono font-semibold text-foreground">~{totalDays} business days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Revisions:
                </span>
                <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">Unlimited on Fiverr</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Sparkles className="w-3.5 h-3.5 text-sky-500" /> Code Quality:
                </span>
                <span className="font-mono font-semibold text-sky-600 dark:text-sky-300">Clean & Documented</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-6">
            <Button
              onClick={handleHireClick}
              className="w-full gap-2 text-xs font-bold py-5 btn-primary-glow"
              style={{
                background: "linear-gradient(135deg,#f59e0b,#0ea5e9)",
                color: "#000",
                border: "none",
              }}
            >
              Start This Project <ArrowRight className="w-4 h-4" />
            </Button>
            <a
              href="https://www.fiverr.com/musman079"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-1.5 text-xs border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
              >
                Hire on Fiverr with Protection <ExternalLink className="w-3 h-3" />
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
