"use client"

import React, { useState, useEffect, useRef } from "react"
import { Terminal as TerminalIcon, X, Maximize2, Minimize2, Sparkles, Send, CornerDownLeft } from "lucide-react"
import { playTerminalKeySound, playSuccessSound, playClickSound } from "@/lib/sound-effects"

interface OutputLine {
  id: string
  type: "input" | "output" | "error" | "success" | "system"
  text: string
  link?: { url: string; label: string }
}

const COMMAND_LIST = ["help", "about", "skills", "projects", "services", "contact", "matrix", "sudo hire-usman", "resume", "fiverr", "github", "clear", "exit"]

const INITIAL_LINES: OutputLine[] = [
  { id: "1", type: "system", text: "⚡ Muhammad Usman Developer Console [Version 2.5.0]" },
  { id: "2", type: "system", text: "Type 'help' or click any command chip below. Press 'Tab' to autocomplete." },
]

export function DevTerminal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [input, setInput] = useState("")
  const [lines, setLines] = useState<OutputLine[]>(INITIAL_LINES)
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isMaximized, setIsMaximized] = useState(false)
  const [matrixActive, setMatrixActive] = useState(false)
  const [vipUnlocked, setVipUnlocked] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const terminalEndRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Auto-scroll to bottom on new line
  useEffect(() => {
    if (isOpen) {
      terminalEndRef.current?.scrollIntoView({ behavior: "smooth" })
      inputRef.current?.focus()
    }
  }, [lines, isOpen])

  // Matrix Rain Effect
  useEffect(() => {
    if (!matrixActive || !isOpen) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = canvas.parentElement?.clientWidth || 600
    canvas.height = canvas.parentElement?.clientHeight || 400

    const chars = "01010101MERNSTACKREACTNODEJSNEXTJSMUHAMMADUSMAN1234567890@#$%&*"
    const fontSize = 13
    const columns = Math.floor(canvas.width / fontSize)
    const drops: number[] = Array(columns).fill(1)

    let animationId: number
    const draw = () => {
      ctx.fillStyle = "rgba(10, 12, 18, 0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = "#22c55e"
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)]
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
      animationId = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(animationId)
  }, [matrixActive, isOpen])

  const handleCommand = (cmdStr: string) => {
    const rawCmd = cmdStr.trim()
    if (!rawCmd) return

    playTerminalKeySound()
    setHistory(prev => [...prev, rawCmd])
    setHistoryIndex(-1)

    const cmd = rawCmd.toLowerCase()
    const newLines: OutputLine[] = [
      ...lines,
      { id: Date.now().toString(), type: "input", text: `> ${rawCmd}` },
    ]

    switch (cmd) {
      case "help":
        newLines.push({
          id: (Date.now() + 1).toString(),
          type: "output",
          text: `
Available Commands:
  • about       - Overview of Muhammad Usman
  • skills      - Core tech stack & frameworks
  • projects    - Featured web apps & repositories
  • services    - Freelance & full-stack development services
  • contact     - Get email, WhatsApp, and Fiverr links
  • matrix      - Toggle Cyberpunk Matrix rain effect
  • sudo hire-usman - Special VIP recruiter access
  • resume      - View Usman's latest resume
  • fiverr      - Visit Fiverr Level-1 Profile
  • github      - Open GitHub repositories
  • clear       - Clean terminal screen
  • exit        - Close terminal window
          `.trim(),
        })
        break

      case "about":
      case "bio":
        newLines.push({
          id: (Date.now() + 1).toString(),
          type: "output",
          text: "Muhammad Usman is a passionate Full-Stack Developer specializing in the MERN Stack (MongoDB, Express.js, React, Node.js) and Next.js. With a 5.0★ Fiverr rating, he crafts high-performance web applications with clean architecture and responsive UI/UX.",
        })
        break

      case "skills":
        newLines.push({
          id: (Date.now() + 1).toString(),
          type: "output",
          text: `
[Frontend]  React.js, Next.js 15, TypeScript, Tailwind CSS, Redux, HTML5/CSS3
[Backend]   Node.js, Express.js, REST APIs, JWT Auth, WebSockets
[Databases] MongoDB, Mongoose, Firebase, PostgreSQL
[DevOps]    Git, GitHub, Vercel, Railway, Render, Docker
[Design]    Figma to Code, Micro-animations, Glassmorphism, UI/UX
          `.trim(),
        })
        break

      case "projects":
        newLines.push({
          id: (Date.now() + 1).toString(),
          type: "output",
          text: `
1. ThinkBoard - Full-Stack MERN Note-taking App with Markdown & Auth
   Live: https://mern-thinkboard-production-56fc.up.railway.app/
2. GeoSpatial Urbanization - Flutter + TensorFlow Lite AI Analysis
   GitHub: https://github.com/mani78979/GeoSpatial-Analysis-for-Better-Urbanization-of-Faisalabad-City
3. Dev Portfolio - Next.js 15, TypeScript & Interactive 3D Effects
          `.trim(),
        })
        break

      case "services":
        newLines.push({
          id: (Date.now() + 1).toString(),
          type: "output",
          text: "• Full-Stack MERN Development\n• RESTful API Design & JWT Auth\n• Figma to React / Next.js Conversion\n• Performance Tuning & SEO Optimization",
        })
        break

      case "contact":
      case "email":
        newLines.push({
          id: (Date.now() + 1).toString(),
          type: "success",
          text: "📧 Email: usmankousar772@gmail.com\n💬 WhatsApp: +92 328 6596772\n💼 LinkedIn: linkedin.com/in/musman78\n⭐ Fiverr: fiverr.com/musman079",
        })
        break

      case "matrix":
        setMatrixActive(prev => !prev)
        newLines.push({
          id: (Date.now() + 1).toString(),
          type: "success",
          text: matrixActive ? "[!] Matrix rain deactivated." : "[⚡] Cyberpunk Matrix rain activated!",
        })
        break

      case "sudo hire-usman":
      case "sudo hire":
        setVipUnlocked(true)
        playSuccessSound()
        newLines.push({
          id: (Date.now() + 1).toString(),
          type: "success",
          text: "👑 [ACCESS GRANTED] VIP Status Unlocked! Usman is prioritized for your project. Email usmankousar772@gmail.com with promo code 'SUDO-VIP' for priority response.",
        })
        break

      case "resume":
        window.open("https://drive.google.com/file/d/1L8iT_FWQeu5zaE9CWjt7kEoik7iMzb51/view?usp=sharing", "_blank")
        newLines.push({
          id: (Date.now() + 1).toString(),
          type: "success",
          text: "📄 Opening Usman's resume in a new tab...",
        })
        break

      case "fiverr":
        window.open("https://www.fiverr.com/musman079", "_blank")
        newLines.push({
          id: (Date.now() + 1).toString(),
          type: "success",
          text: "🌟 Opening Fiverr profile...",
        })
        break

      case "github":
        window.open("https://github.com/mani78979", "_blank")
        newLines.push({
          id: (Date.now() + 1).toString(),
          type: "success",
          text: "🐙 Opening GitHub profile...",
        })
        break

      case "clear":
      case "cls":
        setLines([])
        setInput("")
        return

      case "exit":
      case "quit":
        onClose()
        return

      default:
        newLines.push({
          id: (Date.now() + 1).toString(),
          type: "error",
          text: `Command not found: '${rawCmd}'. Type 'help' for a list of valid commands.`,
        })
        break
    }

    setLines(newLines)
    setInput("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleCommand(input)
    } else if (e.key === "Tab") {
      e.preventDefault()
      const query = input.trim().toLowerCase()
      if (query) {
        const match = COMMAND_LIST.find(c => c.startsWith(query))
        if (match) setInput(match)
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (history.length > 0) {
        const nextIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1)
        setHistoryIndex(nextIndex)
        setInput(history[nextIndex])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex !== -1) {
        const nextIndex = historyIndex + 1
        if (nextIndex >= history.length) {
          setHistoryIndex(-1)
          setInput("")
        } else {
          setHistoryIndex(nextIndex)
          setInput(history[nextIndex])
        }
      }
    } else {
      playTerminalKeySound()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div
        className={`relative flex flex-col bg-[#0b0d14] border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
          isMaximized ? "w-full h-full max-w-6xl max-h-[92vh]" : "w-full max-w-2xl h-[540px]"
        }`}
        style={{
          boxShadow: "0 25px 60px -15px rgba(0,0,0,0.9), 0 0 35px rgba(245,158,11,0.2)",
        }}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Matrix Canvas Layer */}
        {matrixActive && (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none opacity-25 z-0"
          />
        )}

        {/* Terminal Header */}
        <div className="relative z-10 flex items-center justify-between px-4 py-3 bg-[#111420] border-b border-amber-500/20 select-none">
          <div className="flex items-center gap-2">
            <div className="flex gap-2">
              <button
                onClick={() => {
                  playClickSound()
                  onClose()
                }}
                className="w-3 h-3 rounded-full bg-red-500 hover:opacity-80 transition-opacity"
                aria-label="Close"
              />
              <button
                onClick={() => {
                  playClickSound()
                  setLines(INITIAL_LINES)
                }}
                className="w-3 h-3 rounded-full bg-yellow-500 hover:opacity-80 transition-opacity"
                aria-label="Reset"
              />
              <button
                onClick={() => {
                  playClickSound()
                  setIsMaximized(!isMaximized)
                }}
                className="w-3 h-3 rounded-full bg-green-500 hover:opacity-80 transition-opacity"
                aria-label="Maximize"
              />
            </div>
            <div className="flex items-center gap-2 ml-4 text-xs font-mono text-slate-300">
              <TerminalIcon className="w-3.5 h-3.5 text-amber-400" />
              <span>usman@portfolio:~</span>
              {vipUnlocked && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-bold border border-amber-500/40">
                  <Sparkles className="w-2.5 h-2.5" /> VIP
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playClickSound()
                setIsMaximized(!isMaximized)
              }}
              className="p-1 text-slate-400 hover:text-white transition-colors"
              aria-label="Toggle Fullscreen"
            >
              {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => {
                playClickSound()
                onClose()
              }}
              className="p-1 text-slate-400 hover:text-white transition-colors"
              aria-label="Close Terminal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Command Action Chips */}
        <div className="relative z-10 flex flex-wrap items-center gap-1.5 px-4 py-2 bg-[#0e101a] border-b border-white/5 text-[11px] font-mono text-slate-400">
          <span className="text-slate-500 hidden sm:inline">Quick commands:</span>
          {["help", "skills", "projects", "matrix", "contact", "clear"].map(cmd => (
            <button
              key={cmd}
              onClick={e => {
                e.stopPropagation()
                handleCommand(cmd)
              }}
              className="px-2 py-0.5 rounded bg-white/5 hover:bg-amber-500/20 hover:text-amber-300 border border-white/5 hover:border-amber-500/30 transition-colors"
            >
              {cmd}
            </button>
          ))}
        </div>

        {/* Terminal Output Area */}
        <div className="relative z-10 flex-1 p-4 font-mono text-xs sm:text-sm overflow-y-auto space-y-2 text-slate-200">
          {lines.map(line => (
            <div
              key={line.id}
              className={`whitespace-pre-wrap leading-relaxed ${
                line.type === "input"
                  ? "text-amber-400 font-semibold"
                  : line.type === "error"
                  ? "text-red-400"
                  : line.type === "success"
                  ? "text-emerald-400"
                  : line.type === "system"
                  ? "text-sky-400"
                  : "text-slate-300"
              }`}
            >
              {line.text}
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>

        {/* Terminal Command Input */}
        <div className="relative z-10 flex items-center gap-2 px-4 py-3 bg-[#0d0f18] border-t border-amber-500/20">
          <span className="text-amber-400 font-mono font-bold text-sm select-none">➜</span>
          <span className="text-sky-400 font-mono text-xs select-none hidden sm:inline">~</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type 'help' or press Tab to autocomplete..."
            className="flex-1 bg-transparent text-slate-100 font-mono text-xs sm:text-sm outline-none border-none placeholder:text-slate-600"
            autoFocus
          />
          <button
            onClick={() => handleCommand(input)}
            className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition-colors"
            aria-label="Execute Command"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
