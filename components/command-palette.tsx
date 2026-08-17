"use client"

import React, { useState, useEffect } from "react"
import {
  Search,
  Terminal,
  ExternalLink,
  Download,
  Copy,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Code2,
  Briefcase,
  Layers,
  MessageSquare,
  User,
  Calculator,
  Sparkles,
} from "lucide-react"
import { useTheme } from "next-themes"
import { playClickSound, playSuccessSound, isSoundEnabled, setSoundEnabled } from "@/lib/sound-effects"

interface CommandItem {
  id: string
  label: string
  category: "Navigation" | "Actions" | "Social & Contact"
  icon: React.ElementType
  action: () => void
  keywords?: string[]
}

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  onOpenTerminal: () => void
  onCopyEmail: () => void
}

export function CommandPalette({ isOpen, onClose, onOpenTerminal, onCopyEmail }: CommandPaletteProps) {
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const { theme, setTheme } = useTheme()
  const [soundOn, setSoundOn] = useState(false)

  useEffect(() => {
    setSoundOn(isSoundEnabled())
  }, [isOpen])

  const scrollTo = (id: string) => {
    playClickSound()
    onClose()
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  const toggleSound = () => {
    const next = !soundOn
    setSoundEnabled(next)
    setSoundOn(next)
    if (next) playSuccessSound()
  }

  const commands: CommandItem[] = [
    // Navigation
    { id: "nav-about", label: "Go to About Me", category: "Navigation", icon: User, action: () => scrollTo("about"), keywords: ["bio", "info", "experience"] },
    { id: "nav-journey", label: "Go to Experience & Journey", category: "Navigation", icon: Sparkles, action: () => scrollTo("journey"), keywords: ["timeline", "history", "career", "education"] },
    { id: "nav-skills", label: "Go to Skills & Technologies", category: "Navigation", icon: Layers, action: () => scrollTo("skills"), keywords: ["tech", "stack", "react", "node", "mongodb"] },
    { id: "nav-services", label: "Go to Services", category: "Navigation", icon: Briefcase, action: () => scrollTo("services"), keywords: ["freelance", "work", "offerings"] },
    { id: "nav-projects", label: "Go to Featured Projects", category: "Navigation", icon: Code2, action: () => scrollTo("projects"), keywords: ["work", "apps", "thinkboard", "portfolio"] },
    { id: "nav-estimator", label: "Go to Project Cost Estimator", category: "Navigation", icon: Calculator, action: () => scrollTo("estimator"), keywords: ["pricing", "cost", "calculator", "quote", "budget"] },
    { id: "nav-reviews", label: "Go to Fiverr Reviews", category: "Navigation", icon: MessageSquare, action: () => scrollTo("reviews"), keywords: ["feedback", "clients", "testimonials", "stars"] },
    { id: "nav-contact", label: "Go to Contact Hub", category: "Navigation", icon: User, action: () => scrollTo("contact"), keywords: ["email", "hire", "message"] },

    // Actions
    {
      id: "act-terminal",
      label: "Open Interactive CLI Terminal",
      category: "Actions",
      icon: Terminal,
      action: () => {
        playClickSound()
        onClose()
        onOpenTerminal()
      },
      keywords: ["cli", "console", "command", "matrix", "shell"],
    },
    {
      id: "act-theme",
      label: `Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`,
      category: "Actions",
      icon: theme === "dark" ? Sun : Moon,
      action: () => {
        playClickSound()
        setTheme(theme === "dark" ? "light" : "dark")
        onClose()
      },
      keywords: ["theme", "mode", "color"],
    },
    {
      id: "act-sound",
      label: soundOn ? "Mute UI Sound Effects" : "Enable Futuristic Sound Effects",
      category: "Actions",
      icon: soundOn ? VolumeX : Volume2,
      action: () => {
        toggleSound()
        onClose()
      },
      keywords: ["sound", "audio", "effects", "mute", "volume"],
    },
    {
      id: "act-resume",
      label: "Download / View Resume",
      category: "Actions",
      icon: Download,
      action: () => {
        playClickSound()
        window.open("https://drive.google.com/file/d/1L8iT_FWQeu5zaE9CWjt7kEoik7iMzb51/view?usp=sharing", "_blank")
        onClose()
      },
      keywords: ["cv", "pdf", "resume"],
    },
    {
      id: "act-copy-email",
      label: "Copy Email (usmankousar772@gmail.com)",
      category: "Actions",
      icon: Copy,
      action: () => {
        onCopyEmail()
        onClose()
      },
      keywords: ["email", "copy", "clipboard"],
    },

    // Social & Contact
    {
      id: "soc-fiverr",
      label: "Open Fiverr 5.0★ Profile",
      category: "Social & Contact",
      icon: ExternalLink,
      action: () => {
        playClickSound()
        window.open("https://www.fiverr.com/musman079", "_blank")
        onClose()
      },
      keywords: ["fiverr", "freelance", "hire", "gig"],
    },
    {
      id: "soc-github",
      label: "Open GitHub Profile (@mani78979)",
      category: "Social & Contact",
      icon: ExternalLink,
      action: () => {
        playClickSound()
        window.open("https://github.com/mani78979", "_blank")
        onClose()
      },
      keywords: ["github", "code", "repos"],
    },
    {
      id: "soc-linkedin",
      label: "Open LinkedIn Profile",
      category: "Social & Contact",
      icon: ExternalLink,
      action: () => {
        playClickSound()
        window.open("http://www.linkedin.com/in/musman78", "_blank")
        onClose()
      },
      keywords: ["linkedin", "network", "connect"],
    },
  ]

  const filteredCommands = commands.filter(item => {
    if (!query) return true
    const q = query.toLowerCase()
    const matchLabel = item.label.toLowerCase().includes(q)
    const matchCategory = item.category.toLowerCase().includes(q)
    const matchKeywords = item.keywords?.some(k => k.toLowerCase().includes(q))
    return matchLabel || matchCategory || matchKeywords
  })

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex(prev => (prev + 1) % (filteredCommands.length || 1))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex(prev => (prev - 1 + (filteredCommands.length || 1)) % (filteredCommands.length || 1))
      } else if (e.key === "Enter" && filteredCommands.length > 0) {
        e.preventDefault()
        filteredCommands[selectedIndex]?.action()
      } else if (e.key === "Escape") {
        e.preventDefault()
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, filteredCommands, selectedIndex, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[110] flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white dark:bg-[#0d0f17] border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up"
        style={{
          boxShadow: "0 20px 50px -10px rgba(0,0,0,0.85), 0 0 30px rgba(245,158,11,0.15)",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border bg-slate-50 dark:bg-[#121522]">
          <Search className="w-5 h-5 text-amber-500" />
          <input
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
            placeholder="Type a command or search sections..."
            className="flex-1 bg-transparent text-sm sm:text-base text-foreground placeholder:text-muted-foreground outline-none border-none"
            autoFocus
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-[10px] font-mono text-muted-foreground bg-slate-200 dark:bg-slate-800 rounded border border-border">
            ESC
          </kbd>
        </div>

        {/* Command List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredCommands.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No matching commands found.
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const Icon = cmd.icon
              const isSelected = idx === selectedIndex
              return (
                <button
                  key={cmd.id}
                  onClick={() => cmd.action()}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all duration-150 ${
                    isSelected
                      ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                      : "text-foreground hover:bg-slate-100 dark:hover:bg-slate-800/50 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-1.5 rounded-lg ${
                        isSelected ? "bg-amber-500/20 text-amber-500" : "bg-slate-200 dark:bg-slate-800 text-muted-foreground"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">{cmd.label}</span>
                  </div>
                  <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">
                    {cmd.category}
                  </span>
                </button>
              )
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-[#090b10] border-t border-border text-[11px] text-muted-foreground select-none">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 border border-border text-foreground">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 border border-border text-foreground ml-1">↓</kbd> to navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 border border-border text-foreground">↵</kbd> to select
            </span>
          </div>
          <span className="font-mono text-amber-500 font-semibold">⌘K / Ctrl+K</span>
        </div>
      </div>
    </div>
  )
}
