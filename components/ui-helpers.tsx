"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Terminal } from "lucide-react";

// Brand color mapping for technology tags
export const TECH_TAG_COLORS: Record<string, { bg: string; text: string; border: string }> = {
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
};

export function TechBadge({ label }: { label: string }) {
  const brand = TECH_TAG_COLORS[label];
  if (brand) {
    return (
      <span
        className="text-[11px] font-medium px-2.5 py-0.5 rounded-full transition-all duration-200 hover:scale-105"
        style={{ background: brand.bg, color: brand.text, border: `1px solid ${brand.border}` }}
      >
        {label}
      </span>
    );
  }
  return <span className="tech-badge">{label}</span>;
}

export const TECH_STACK = [
  "React", "Next.js 15", "TypeScript", "Node.js", "Express.js", "MongoDB", "Tailwind CSS",
  "Firebase", "REST APIs", "JWT Auth", "Git & GitHub", "Vercel", "Figma", "Redux Toolkit",
  "WebSockets", "Docker", "PostgreSQL", "Railway", "Render", "VS Code",
];

export function TechMarquee() {
  const doubled = [...TECH_STACK, ...TECH_STACK];
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
  );
}

export function AnimatedCounter({ num, suffix, isFloat }: { num: number; suffix: string; isFloat?: boolean }) {
  const [display, setDisplay] = useState("0");
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const STEPS = 40, DUR = 1400;
        let step = 0;
        const id = setInterval(() => {
          step++;
          const p = 1 - Math.pow(1 - step / STEPS, 3);
          setDisplay((isFloat ? (num * p).toFixed(1) : Math.floor(num * p).toString()) + suffix);
          if (step >= STEPS) clearInterval(id);
        }, DUR / STEPS);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [num, suffix, isFloat]);

  return <span ref={ref} className="counter-value">{display}</span>;
}

export function SpotlightCard({
  children,
  className,
  style,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
  }, []);

  return (
    <div
      ref={ref}
      className={`glass-card spotlight-card ${className ?? ""}`}
      style={style}
      onMouseMove={handleMouseMove}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function TiltCard({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = "transform .4s cubic-bezier(.22,1,.36,1)";
    el.style.transform = "perspective(900px) rotateY(0) rotateX(0) translateY(0)";
    setTimeout(() => {
      if (ref.current) ref.current.style.transition = "";
    }, 420);
  }, []);

  return (
    <div
      ref={ref}
      className={`card-3d ${className ?? ""}`}
      style={{ transformStyle: "preserve-3d", willChange: "transform", ...style }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}

export function CodeWindow({ onOpenTerminal, devName }: { onOpenTerminal: () => void; devName: string }) {
  const [activeTab, setActiveTab] = useState<"config" | "api" | "run">("config");
  const [running, setRunning] = useState(false);
  const [latency, setLatency] = useState<number | null>(18);

  const triggerRun = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveTab("run");
    setRunning(true);
    const t0 = performance.now();
    setTimeout(() => {
      setLatency(Math.max(12, Math.min(38, Math.round(performance.now() - t0 - 290))));
      setRunning(false);
    }, 320);
  };

  return (
    <div className="code-window animate-float group" style={{ animationDuration: "6s" }}>
      <div className="code-window-header flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="code-dot red shrink-0" />
          <div className="code-dot yellow shrink-0" />
          <div className="code-dot green shrink-0" />
          <div className="flex items-center gap-1 ml-1.5 overflow-x-auto">
            {(
              [
                { id: "config", label: "developer.ts" },
                { id: "api", label: "api.route.ts" },
                { id: "run", label: "▶ 200 OK" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (tab.id === "run") triggerRun(e);
                  else setActiveTab(tab.id);
                }}
                className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={onOpenTerminal}
          className="text-[10px] font-mono text-amber-400 opacity-85 hover:opacity-100 flex items-center gap-1 shrink-0"
          title="Open Interactive CLI"
        >
          <Terminal className="w-3 h-3" /> CLI
        </button>
      </div>

      <div
        className="code-body cursor-pointer"
        style={{ color: "rgba(255,255,255,0.85)", minHeight: "188px" }}
        onClick={onOpenTerminal}
      >
        {activeTab === "config" && (
          <>
            <span className="code-line"><span className="cm">// Full-Stack Architect Profile</span></span>
            <span className="code-line"><span className="ck">export const</span> <span className="cv">developer</span> <span className="cp">= {"{"}</span></span>
            <span className="code-line">{"  "}<span className="cv">name</span><span className="cp">:</span> <span className="cs">&quot;{devName}&quot;</span><span className="cp">,</span></span>
            <span className="code-line">{"  "}<span className="cv">stack</span><span className="cp">: [</span><span className="cs">&quot;MERN&quot;</span><span className="cp">,</span> <span className="cs">&quot;Next.js 15&quot;</span><span className="cp">,</span> <span className="cs">&quot;TypeScript&quot;</span><span className="cp">],</span></span>
            <span className="code-line">{"  "}<span className="cv">rating</span><span className="cp">:</span> <span className="cs">&quot;5.0 ★ on Fiverr&quot;</span><span className="cp">,</span></span>
            <span className="code-line">{"  "}<span className="cv">status</span><span className="cp">:</span> <span className="cs">&quot;Available for Hire&quot;</span><span className="cp">,</span></span>
            <span className="code-line">{"  "}<span className="cv">launchCLI</span><span className="cp">:</span> <span className="cb">() =&gt;</span> <span className="cs">&quot;Click to open terminal&quot;</span></span>
            <span className="code-line"><span className="cp">{"}"}</span><span className="cp">;</span></span>
          </>
        )}

        {activeTab === "api" && (
          <>
            <span className="code-line"><span className="cm">// Production API Pipeline</span></span>
            <span className="code-line"><span className="ck">export async function</span> <span className="cb">GET</span><span className="cp">() {"{"}</span></span>
            <span className="code-line">{"  "}<span className="ck">await</span> <span className="cb">connectToDatabase</span><span className="cp">();</span></span>
            <span className="code-line">{"  "}<span className="ck">const</span> <span className="cv">auth</span> <span className="cp">=</span> <span className="cb">verifyJWT</span><span className="cp">();</span></span>
            <span className="code-line">{"  "}<span className="ck">return</span> <span className="cv">Response</span><span className="cp">.</span><span className="cb">json</span><span className="cp">({"{"}</span></span>
            <span className="code-line">{"    "}<span className="cv">uptime</span><span className="cp">:</span> <span className="cs">&quot;99.98%&quot;</span><span className="cp">,</span> <span className="cv">security</span><span className="cp">:</span> <span className="cs">&quot;A+&quot;</span></span>
            <span className="code-line">{"  "}<span className="cp">{"}"});</span></span>
            <span className="code-line"><span className="cp">{"}"}</span></span>
          </>
        )}

        {activeTab === "run" && (
          <>
            <span className="code-line">
              <span className="cm">
                {running ? "// Dispatching GET /api/profile..." : `// HTTP/2 200 OK • ${latency ?? 18}ms`}
              </span>
            </span>
            <span className="code-line"><span className="cp">{"{"}</span></span>
            <span className="code-line">{"  "}<span className="cv">&quot;ok&quot;</span><span className="cp">:</span> <span className="ck">true</span><span className="cp">,</span></span>
            <span className="code-line">{"  "}<span className="cv">&quot;architect&quot;</span><span className="cp">:</span> <span className="cs">&quot;{devName}&quot;</span><span className="cp">,</span></span>
            <span className="code-line">{"  "}<span className="cv">&quot;engine&quot;</span><span className="cp">:</span> <span className="cs">&quot;Next.js 15 + MongoDB Atlas&quot;</span><span className="cp">,</span></span>
            <span className="code-line">{"  "}<span className="cv">&quot;latency&quot;</span><span className="cp">:</span> <span className="cs">&quot;{running ? "..." : `${latency ?? 18}ms`}&quot;</span><span className="cp">,</span></span>
            <span className="code-line">{"  "}<span className="cv">&quot;available&quot;</span><span className="cp">:</span> <span className="ck">true</span></span>
            <span className="code-line"><span className="cp">{"}"}</span></span>
          </>
        )}
      </div>
    </div>
  );
}
