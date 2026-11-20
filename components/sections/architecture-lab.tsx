"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  ShieldCheck,
  Server,
  Database,
  Cpu,
  Zap,
  Activity,
  Play,
  RotateCcw,
  Radio,
  Smartphone,
  Layers,
  CheckCircle2,
  ArrowRight,
  ArrowDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/motion-primitives";
import { playClickSound, playSuccessSound } from "@/lib/sound-effects";

interface ArchNode {
  id: string;
  label: string;
  sub: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  latencyMs: number;
  traceMsg: string;
  stack: string[];
  engineeringNote: string;
  sla: string;
}

interface Blueprint {
  id: string;
  title: string;
  badge: string;
  endpoint: string;
  summary: string;
  nodes: ArchNode[];
}

const BLUEPRINTS: Blueprint[] = [
  {
    id: "saas",
    title: "Full-Stack SaaS",
    badge: "Next.js 15 + MERN",
    endpoint: "POST /api/v1/workspaces/deploy",
    summary: "Production-grade multi-tenant architecture with edge protection, JWT RBAC, and indexed MongoDB Atlas.",
    nodes: [
      {
        id: "client",
        label: "Next.js 15 Client",
        sub: "React 19 • SSR/RSC",
        icon: Globe,
        color: "#0ea5e9",
        latencyMs: 5,
        traceMsg: "Hydrated RSC payload & dispatched signed request",
        stack: ["Next.js 15", "React 19", "TypeScript", "Tailwind CSS"],
        engineeringNote:
          "Server Components cut client JS bundle size while optimistic UI updates keep interactions instantaneous.",
        sla: "LCP < 1.1s",
      },
      {
        id: "edge",
        label: "Edge Security",
        sub: "Rate Limit • JWT Auth",
        icon: ShieldCheck,
        color: "#f59e0b",
        latencyMs: 6,
        traceMsg: "IP rate-limit passed • JWT HS256 signature verified",
        stack: ["Edge Middleware", "JWT / HttpOnly Cookies", "Zod Validation"],
        engineeringNote:
          "Blocks abusive bursts at the edge and validates every request schema before it ever touches core compute.",
        sla: "99.99% Uptime",
      },
      {
        id: "api",
        label: "Node.js API Core",
        sub: "Express / Route Handlers",
        icon: Server,
        color: "#8b5cf6",
        latencyMs: 9,
        traceMsg: "Business logic executed • idempotency key locked",
        stack: ["Node.js", "Express.js", "REST APIs", "Webhooks"],
        engineeringNote:
          "Stateless horizontal-ready handlers with structured error boundaries and automatic webhook dispatch.",
        sla: "p95 < 25ms",
      },
      {
        id: "db",
        label: "MongoDB Atlas",
        sub: "Compound Indexes • Pool",
        icon: Database,
        color: "#10b981",
        latencyMs: 7,
        traceMsg: "Write committed to primary replica • 200 OK",
        stack: ["MongoDB Atlas", "Mongoose", "Connection Pooling"],
        engineeringNote:
          "Global cached connection pool prevents cold-start storms in serverless deployments with compound query indexes.",
        sla: "Query < 8ms",
      },
    ],
  },
  {
    id: "realtime",
    title: "Real-Time Engine",
    badge: "WebSockets + Events",
    endpoint: "WS wss://stream.app/room/live",
    summary: "Low-latency bidirectional messaging & live presence engineered for chat, dashboards, and collaboration.",
    nodes: [
      {
        id: "ui",
        label: "Reactive UI",
        sub: "Optimistic State",
        icon: Layers,
        color: "#0ea5e9",
        latencyMs: 4,
        traceMsg: "Frame queued locally & emitted over duplex socket",
        stack: ["React 19", "Framer Motion", "Zustand / Redux"],
        engineeringNote:
          "Zero-flicker optimistic updates render instantly on the sender while reconciling server acks seamlessly.",
        sla: "60/120 FPS",
      },
      {
        id: "ws",
        label: "Socket Gateway",
        sub: "WSS • Heartbeat Auth",
        icon: Radio,
        color: "#f59e0b",
        latencyMs: 5,
        traceMsg: "Handshake authenticated • room channel subscribed",
        stack: ["Socket.IO", "WebSockets", "Token Handshake"],
        engineeringNote:
          "Auto-reconnecting channels with exponential backoff, presence heartbeats, and per-room ACL enforcement.",
        sla: "< 15ms Fanout",
      },
      {
        id: "pubsub",
        label: "Event Broker",
        sub: "Pub/Sub • Rate Guard",
        icon: Zap,
        color: "#ec4899",
        latencyMs: 4,
        traceMsg: "Broadcast fanned out to 42 connected peers",
        stack: ["Redis Pub/Sub", "Worker Queues", "Backpressure"],
        engineeringNote:
          "Decouples socket nodes so horizontal scaling works across multiple instances without dropped messages.",
        sla: "10k+ msg/sec",
      },
      {
        id: "store",
        label: "Persistent Store",
        sub: "Async Write-Behind",
        icon: Database,
        color: "#10b981",
        latencyMs: 6,
        traceMsg: "Batch history persisted & indexed • ACK sent",
        stack: ["MongoDB", "TTL Indexes", "Cursor Pagination"],
        engineeringNote:
          "Cursor-based pagination and write-behind batching keep chat history instant even at millions of documents.",
        sla: "Zero Data Loss",
      },
    ],
  },
  {
    id: "ai",
    title: "AI & Mobile Pipeline",
    badge: "Flutter + TFLite",
    endpoint: "POST /api/v1/geo/infer-tile",
    summary: "Cross-platform mobile intelligence combining on-device CNN inference with cloud geospatial analytics.",
    nodes: [
      {
        id: "mobile",
        label: "Flutter App",
        sub: "iOS & Android Native",
        icon: Smartphone,
        color: "#0ea5e9",
        latencyMs: 6,
        traceMsg: "Satellite tile captured & normalized (224×224)",
        stack: ["Flutter", "Dart", "GeoJSON Maps"],
        engineeringNote:
          "Single codebase delivering 60 FPS native maps, offline tile caching, and hardware-accelerated camera input.",
        sla: "Offline Ready",
      },
      {
        id: "tflite",
        label: "On-Device CNN",
        sub: "TensorFlow Lite",
        icon: Cpu,
        color: "#f59e0b",
        latencyMs: 14,
        traceMsg: "Quantized TFLite model classified urban sprawl (96.4%)",
        stack: ["TensorFlow Lite", "INT8 Quantization", "Edge AI"],
        engineeringNote:
          "Quantized neural network runs directly on mobile silicon — zero cloud inference cost and works without internet.",
        sla: "14ms Inference",
      },
      {
        id: "gateway",
        label: "Sync API",
        sub: "Delta Upload • Auth",
        icon: ShieldCheck,
        color: "#8b5cf6",
        latencyMs: 8,
        traceMsg: "Compressed GeoJSON delta verified & queued",
        stack: ["Node.js", "REST API", "Firebase Auth"],
        engineeringNote:
          "Uploads compact classification polygons instead of raw imagery, saving >90% mobile bandwidth.",
        sla: "90% Less Data",
      },
      {
        id: "cloud",
        label: "Analytics Store",
        sub: "Firestore + Aggregation",
        icon: Database,
        color: "#10b981",
        latencyMs: 7,
        traceMsg: "Regional growth metrics updated live • 200 OK",
        stack: ["Firebase Firestore", "MongoDB", "Live Dashboards"],
        engineeringNote:
          "Real-time aggregation feeds urban-growth heatmaps and exportable reports for researchers and planners.",
        sla: "Live Sync",
      },
    ],
  },
];

export function ArchitectureLab() {
  const [blueprintId, setBlueprintId] = useState<string>("saas");
  const [selectedNodeId, setSelectedNodeId] = useState<string>("client");
  const [activeStep, setActiveStep] = useState<number>(-1);
  const [isSimulating, setIsSimulating] = useState(false);
  const [traces, setTraces] = useState<{ ms: number; node: string; msg: string; color: string }[]>([]);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const blueprint = BLUEPRINTS.find((b) => b.id === blueprintId) || BLUEPRINTS[0];
  const selectedNode =
    blueprint.nodes.find((n) => n.id === selectedNodeId) || blueprint.nodes[0];

  const clearTimers = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  };

  useEffect(() => {
    return () => clearTimers();
  }, []);

  const switchBlueprint = (id: string) => {
    playClickSound();
    clearTimers();
    setIsSimulating(false);
    setActiveStep(-1);
    setTraces([]);
    setBlueprintId(id);
    const next = BLUEPRINTS.find((b) => b.id === id);
    if (next) setSelectedNodeId(next.nodes[0].id);
  };

  const runSimulation = () => {
    playClickSound();
    clearTimers();
    setIsSimulating(true);
    setTraces([]);
    setActiveStep(0);

    let elapsed = 0;
    blueprint.nodes.forEach((node, idx) => {
      const t = setTimeout(() => {
        elapsed += node.latencyMs;
        setActiveStep(idx);
        setSelectedNodeId(node.id);
        setTraces((prev) => [
          ...prev,
          {
            ms: elapsed,
            node: node.label,
            msg: node.traceMsg,
            color: node.color,
          },
        ]);

        if (idx === blueprint.nodes.length - 1) {
          const finish = setTimeout(() => {
            setIsSimulating(false);
            playSuccessSound();
          }, 450);
          timersRef.current.push(finish);
        }
      }, idx * 520);
      timersRef.current.push(t);
    });
  };

  const totalMs = traces.length ? traces[traces.length - 1].ms : 0;

  return (
    <section id="architecture" className="py-24 sm:py-28 relative overflow-hidden">
      <div className="container px-4 sm:px-6 mx-auto max-w-5xl relative z-10">
        <ScrollReveal className="text-center mb-12">
          <span
            className="section-label"
            style={{ color: "#0ea5e9", borderColor: "rgba(14,165,233,0.3)" }}
          >
            Interactive Blueprint
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold mt-2 tracking-tight text-foreground">
            Live System Architecture Lab
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto text-sm sm:text-base">
            Don&apos;t just read my stack — simulate a live request and click any
            node to inspect how I architect scalable production systems.
          </p>
        </ScrollReveal>

        <ScrollReveal>
          <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-border overflow-hidden">
            {/* Top Bar: Blueprint Switcher + Simulate CTA */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-border">
              <div className="flex flex-wrap items-center gap-2">
                {BLUEPRINTS.map((bp) => {
                  const active = bp.id === blueprint.id;
                  return (
                    <button
                      key={bp.id}
                      type="button"
                      onClick={() => switchBlueprint(bp.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
                        active
                          ? "bg-amber-500 text-black border-amber-500 shadow-[0_0_18px_rgba(245,158,11,0.35)]"
                          : "bg-card text-muted-foreground border-border hover:border-amber-500/40 hover:text-foreground"
                      }`}
                    >
                      {bp.title}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={runSimulation}
                  disabled={isSimulating}
                  className="gap-2 text-xs font-bold px-4 btn-primary-glow flex-1 md:flex-initial"
                  style={{
                    background: "linear-gradient(135deg,#f59e0b,#0ea5e9)",
                    color: "#000",
                    border: "none",
                  }}
                >
                  {isSimulating ? (
                    <>
                      <Activity className="w-3.5 h-3.5 animate-spin" />
                      Simulating Packet...
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Simulate Live Request
                    </>
                  )}
                </Button>
                {traces.length > 0 && !isSimulating && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      playClickSound();
                      setActiveStep(-1);
                      setTraces([]);
                    }}
                    className="px-2.5"
                    aria-label="Reset Simulation"
                    title="Reset Simulation"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            </div>

            {/* Endpoint Pill + Summary */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-100 dark:bg-white/5 border border-border text-[11px] font-mono text-foreground max-w-full overflow-x-auto">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
                <span className="whitespace-nowrap">{blueprint.endpoint}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {blueprint.badge}
              </span>
            </div>

            {/* 4-Node Pipeline */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-4 relative">
              {blueprint.nodes.map((node, idx) => {
                const Icon = node.icon;
                const isSelected = selectedNode.id === node.id;
                const isReached = activeStep >= idx;
                const isCurrent = activeStep === idx;

                return (
                  <div key={node.id} className="relative flex flex-col items-stretch min-w-0">
                    <motion.button
                      type="button"
                      onClick={() => {
                        playClickSound();
                        setSelectedNodeId(node.id);
                      }}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full text-left p-4 rounded-2xl border transition-all relative overflow-hidden ${
                        isCurrent
                          ? "bg-card shadow-lg"
                          : isSelected
                          ? "bg-card/90 border-amber-500/50 shadow-md"
                          : "bg-slate-100/60 dark:bg-card/50 border-border hover:border-amber-500/30"
                      }`}
                      style={
                        isCurrent || isSelected
                          ? {
                              borderColor: `${node.color}88`,
                              boxShadow: isCurrent
                                ? `0 0 26px ${node.color}35`
                                : `0 0 14px ${node.color}18`,
                            }
                          : undefined
                      }
                    >
                      {/* Top step bar */}
                      <div className="flex items-center justify-between mb-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                          style={{
                            background: `${node.color}18`,
                            border: `1px solid ${node.color}40`,
                          }}
                        >
                          <Icon className="w-5 h-5" style={{ color: node.color }} />
                        </div>
                        <span
                          className="text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold"
                          style={{
                            background: isReached
                              ? `${node.color}22`
                              : "rgba(148,163,184,0.12)",
                            color: isReached ? node.color : "var(--muted-foreground)",
                          }}
                        >
                          {isReached ? `${node.latencyMs}ms ✓` : `0${idx + 1}`}
                        </span>
                      </div>

                      <div className="font-bold text-sm text-foreground leading-tight">
                        {node.label}
                      </div>
                      <div className="text-[11px] font-mono text-muted-foreground mt-1">
                        {node.sub}
                      </div>

                      {/* Active pulse line */}
                      {isCurrent && (
                        <motion.div
                          layoutId="activeArchPulse"
                          className="absolute bottom-0 left-0 right-0 h-[3px]"
                          style={{ background: node.color }}
                        />
                      )}
                    </motion.button>

                    {/* Connector Arrow */}
                    {idx < blueprint.nodes.length - 1 && (
                      <>
                        {/* Desktop right arrow */}
                        <div
                          className="hidden lg:flex items-center justify-center absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-background border border-border"
                          aria-hidden
                        >
                          <ArrowRight
                            className={`w-3 h-3 transition-colors ${
                              activeStep > idx
                                ? "text-amber-500"
                                : "text-muted-foreground"
                            }`}
                          />
                        </div>
                        {/* Mobile down arrow */}
                        <div
                          className="flex lg:hidden items-center justify-center py-1"
                          aria-hidden
                        >
                          <ArrowDown
                            className={`w-3.5 h-3.5 transition-colors ${
                              activeStep > idx
                                ? "text-amber-500"
                                : "text-muted-foreground"
                            }`}
                          />
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Selected Node Engineering Inspector */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${blueprint.id}-${selectedNode.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="mt-6 p-4 sm:p-5 rounded-2xl bg-slate-100/70 dark:bg-[#0d101b] border border-border"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ background: selectedNode.color }}
                    />
                    <h3 className="text-sm sm:text-base font-bold text-foreground">
                      {selectedNode.label} — Engineering Deep-Dive
                    </h3>
                  </div>
                  <span
                    className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full"
                    style={{
                      background: `${selectedNode.color}18`,
                      color: selectedNode.color,
                      border: `1px solid ${selectedNode.color}35`,
                    }}
                  >
                    Target: {selectedNode.sla}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-3">
                  {selectedNode.engineeringNote}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedNode.stack.map((tech) => (
                    <span
                      key={tech}
                      className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-background border border-border text-foreground/90"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Live Request Trace Console */}
            {traces.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 rounded-xl bg-[#0a0c12] border border-amber-500/25 p-3.5 sm:p-4 font-mono text-[11px] sm:text-xs text-slate-200 overflow-x-auto"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-2 border-b border-white/10 text-[10px] uppercase tracking-wider text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Live Request Trace
                  </span>
                  <span className="text-emerald-400 font-bold">
                    Total Round-Trip: {totalMs}ms • HTTP 200 OK
                  </span>
                </div>
                <div className="space-y-1.5">
                  {traces.map((tr, i) => (
                    <div key={i} className="flex items-start gap-2 leading-snug">
                      <span className="text-slate-500 shrink-0">
                        [{String(tr.ms).padStart(2, "0")}ms]
                      </span>
                      <span className="font-bold shrink-0" style={{ color: tr.color }}>
                        {tr.node}:
                      </span>
                      <span className="text-slate-300">{tr.msg}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
