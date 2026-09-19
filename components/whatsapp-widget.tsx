"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Send,
  Sparkles,
  Clock,
  CheckCircle2,
  GripVertical,
  Move,
} from "lucide-react";
import { playClickSound, playSuccessSound } from "@/lib/sound-effects";

interface WhatsAppWidgetProps {
  phoneNumber?: string; // e.g. "923189053287"
  defaultMessage?: string;
}

const QUICK_PROMPTS = [
  "Hi Usman! Need a Full-Stack MERN web app.",
  "Hi! Want to convert Figma design to React/Next.js.",
  "Looking for an API / Node.js backend developer.",
  "Quick consultation for an upcoming project.",
];

export function WhatsAppWidget({
  phoneNumber = "923189053287",
  defaultMessage = "Hi Usman! I saw your portfolio and would like to discuss a project.",
}: WhatsAppWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState(defaultMessage);

  // Position state (null = use default CSS bottom-left before mount)
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const dragRef = useRef<{
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    hasMoved: boolean;
  }>({ startX: 0, startY: 0, origX: 0, origY: 0, hasMoved: false });

  const widgetRef = useRef<HTMLDivElement>(null);

  // Set default position at bottom-left on client mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const defaultX = 24;
      const defaultY = Math.max(24, window.innerHeight - 80);
      setPosition({ x: defaultX, y: defaultY });
    }
  }, []);

  // Pointer Down (Mouse or Touch)
  const handlePointerDown = (e: React.PointerEvent) => {
    // Only drag with left click or touch
    if (e.button !== 0 && e.pointerType === "mouse") return;

    const currentX = position?.x ?? 24;
    const currentY = position?.y ?? (window.innerHeight - 80);

    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: currentX,
      origY: currentY,
      hasMoved: false,
    };

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const dx = moveEvent.clientX - dragRef.current.startX;
      const dy = moveEvent.clientY - dragRef.current.startY;

      // Threshold to distinguish click vs drag
      if (!dragRef.current.hasMoved && Math.hypot(dx, dy) > 5) {
        dragRef.current.hasMoved = true;
        setIsDragging(true);
      }

      if (dragRef.current.hasMoved) {
        const widgetWidth = widgetRef.current?.offsetWidth || 180;
        const widgetHeight = widgetRef.current?.offsetHeight || 50;

        // Clamp inside window boundaries
        const newX = Math.min(
          Math.max(12, dragRef.current.origX + dx),
          window.innerWidth - widgetWidth - 12
        );
        const newY = Math.min(
          Math.max(12, dragRef.current.origY + dy),
          window.innerHeight - widgetHeight - 12
        );

        setPosition({ x: newX, y: newY });
      }
    };

    const handlePointerUp = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);

      if (dragRef.current.hasMoved) {
        setTimeout(() => setIsDragging(false), 50);
      } else {
        setIsDragging(false);
      }
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  const handleToggleOpen = () => {
    if (isDragging || dragRef.current.hasMoved) return;
    playClickSound();
    setIsOpen(!isOpen);
  };

  const handleSend = (textToSend?: string) => {
    playSuccessSound();
    const finalMsg = textToSend || customMsg;
    const cleanNumber = phoneNumber.replace(/[^0-9]/g, "");
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(finalMsg)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Determine if popup should render above or below based on position
  const isNearTop = (position?.y ?? 500) < 380;

  return (
    <div
      ref={widgetRef}
      style={
        position
          ? {
              position: "fixed",
              left: `${position.x}px`,
              top: `${position.y}px`,
              zIndex: 9999,
              touchAction: "none",
            }
          : {
              position: "fixed",
              bottom: "24px",
              left: "24px",
              zIndex: 9999,
            }
      }
      className="font-sans select-none transition-shadow"
    >
      {/* Pop-up Chat Card */}
      {isOpen && (
        <div
          className={`absolute ${
            isNearTop ? "top-14" : "bottom-14"
          } left-0 w-[320px] sm:w-[360px] rounded-3xl bg-[#0d121c]/95 border border-emerald-500/35 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.7),0_0_30px_rgba(16,185,129,0.2)] overflow-hidden transition-all duration-300 animate-in fade-in zoom-in-95`}
        >
          {/* Card Header with Drag Banner */}
          <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 p-4 text-white relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-sm border border-white/40 shadow-inner">
                    MU
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-300 border-2 border-emerald-800 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-bold text-sm flex items-center gap-1.5 leading-tight">
                    Muhammad Usman
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200 fill-emerald-200 text-emerald-700" />
                  </h4>
                  <p className="text-[11px] text-emerald-100/90 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" /> Typically replies within 15 mins
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  playClickSound();
                  setIsOpen(false);
                }}
                className="p-1.5 rounded-full hover:bg-white/25 transition-colors text-white/90 hover:text-white"
                aria-label="Close WhatsApp widget"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3 bg-[#0d121c]/90">
            <div className="rounded-2xl p-3.5 bg-emerald-500/10 border border-emerald-500/25 text-xs text-foreground/90 leading-relaxed shadow-sm">
              👋 Hey there! Have a project in mind, need a MERN app, or want a fast quote? Message me directly on WhatsApp!
            </div>

            {/* Quick Topic Chips */}
            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1 uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-amber-400" /> Instant topics:
              </p>
              <div className="flex flex-col gap-1.5">
                {QUICK_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(prompt)}
                    className="text-left text-xs px-3 py-2.5 rounded-xl bg-slate-900/80 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-500/50 text-foreground transition-all duration-150 flex items-center justify-between group shadow-sm hover:scale-[1.01]"
                  >
                    <span className="truncate pr-2 font-medium">{prompt}</span>
                    <Send className="w-3 h-3 text-emerald-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Message Input & Send */}
            <div className="pt-2 border-t border-border/50 flex items-center gap-2">
              <input
                type="text"
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 text-xs px-3.5 py-2.5 rounded-xl bg-slate-900 border border-border focus:outline-none focus:border-emerald-500 text-foreground placeholder:text-muted-foreground/60 shadow-inner"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
              />
              <button
                onClick={() => handleSend()}
                className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-bold shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all hover:scale-105 active:scale-95"
                title="Send on WhatsApp"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Draggable Pill Trigger */}
      <div
        onPointerDown={handlePointerDown}
        onClick={handleToggleOpen}
        className={`group flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 text-white shadow-[0_10px_30px_rgba(16,185,129,0.45)] hover:shadow-[0_14px_40px_rgba(16,185,129,0.65)] transition-all duration-200 border border-emerald-300/40 cursor-grab active:cursor-grabbing ${
          isDragging ? "scale-105 shadow-[0_20px_50px_rgba(16,185,129,0.7)]" : "hover:scale-105"
        }`}
        title="Drag anywhere or click to chat on WhatsApp"
      >
        {/* Grip Handle for clear draggable affordance */}
        <div className="text-white/60 group-hover:text-white transition-colors cursor-grab active:cursor-grabbing">
          <GripVertical className="w-3.5 h-3.5" />
        </div>

        {/* Pulsating Online Indicator */}
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-80" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
        </span>

        {/* WhatsApp Icon */}
        <svg
          className="w-5 h-5 fill-current text-white drop-shadow"
          viewBox="0 0 24 24"
        >
          <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.1-.477-.15-.678.15-.2.301-.777.978-.953 1.179-.176.2-.351.226-.652.075-.301-.15-1.272-.469-2.423-1.496-.896-.799-1.5-1.787-1.676-2.088-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.176.201-.301.301-.502.1-.201.05-.376-.025-.527-.075-.15-.678-1.632-.929-2.235-.245-.588-.493-.509-.678-.518l-.578-.01c-.2 0-.527.075-.803.376s-1.054 1.03-1.054 2.511c0 1.482 1.079 2.911 1.23 3.112.15.201 2.124 3.243 5.145 4.549.719.311 1.281.497 1.719.636.722.229 1.378.197 1.898.119.58-.088 1.78-.727 2.031-1.431.251-.704.251-1.308.176-1.431-.075-.123-.276-.2-.577-.35zM12.042 22.082h-.008c-1.776 0-3.518-.478-5.045-1.385l-.362-.215-3.751.984.999-3.657-.235-.375c-.997-1.587-1.524-3.432-1.524-5.328 0-5.503 4.478-9.98 9.985-9.98 2.666 0 5.172 1.038 7.057 2.924 1.885 1.886 2.922 4.393 2.922 7.059 0 5.505-4.478 9.977-9.977 9.977zm8.109-17.037c-2.166-2.167-5.048-3.361-8.118-3.361-6.319 0-11.462 5.143-11.462 11.463 0 2.019.527 3.99 1.527 5.723l-1.623 5.928 6.064-1.591c1.668.91 3.535 1.389 5.441 1.389h.005c6.318 0 11.462-5.143 11.462-11.464 0-3.064-1.194-5.945-3.361-8.112z" />
        </svg>

        <span className="text-xs font-bold tracking-tight pr-1 hidden xs:inline sm:inline">
          Chat with Usman
        </span>
      </div>
    </div>
  );
}
