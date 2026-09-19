"use client";

import React, { useState } from "react";
import { MessageCircle, X, Send, Sparkles, Clock, CheckCircle2 } from "lucide-react";
import { playClickSound, playSuccessSound } from "@/lib/sound-effects";

interface WhatsAppWidgetProps {
  phoneNumber?: string; // e.g. "923286596772"
  defaultMessage?: string;
}

const QUICK_PROMPTS = [
  "Hi Usman! Need a Full-Stack MERN web app.",
  "Hi! Want to convert Figma design to React/Next.js.",
  "Looking for an API / Node.js backend developer.",
  "Quick consultation for an upcoming project.",
];

export function WhatsAppWidget({
  phoneNumber = "923286596772",
  defaultMessage = "Hi Usman! I saw your portfolio and would like to discuss a project.",
}: WhatsAppWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState(defaultMessage);

  const handleOpen = () => {
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

  return (
    <div className="fixed bottom-6 left-6 z-40 font-sans">
      {/* Pop-up Chat Card */}
      {isOpen && (
        <div className="mb-3 w-[330px] sm:w-[360px] rounded-2xl bg-card/95 border border-emerald-500/30 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.35)] overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm border border-white/30">
                    MU
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-emerald-700 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm flex items-center gap-1.5">
                    Muhammad Usman
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
                  </h4>
                  <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Typically replies within 15 mins
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  playClickSound();
                  setIsOpen(false);
                }}
                className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white/80 hover:text-white"
                aria-label="Close WhatsApp widget"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3 bg-background/50">
            <div className="rounded-xl p-3 bg-emerald-500/10 border border-emerald-500/20 text-xs text-foreground/90">
              👋 Hey there! Have a project in mind or need a fast turnaround?
              Message me directly on WhatsApp!
            </div>

            {/* Quick Prompts */}
            <div className="space-y-1.5">
              <p className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" /> Quick topic ideas:
              </p>
              <div className="flex flex-col gap-1.5">
                {QUICK_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(prompt)}
                    className="text-left text-xs px-3 py-2 rounded-lg bg-card hover:bg-emerald-500/15 border border-border hover:border-emerald-500/40 text-foreground transition-all duration-150 flex items-center justify-between group"
                  >
                    <span className="truncate pr-2">{prompt}</span>
                    <Send className="w-3 h-3 text-muted-foreground group-hover:text-emerald-500 transition-colors shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Input */}
            <div className="pt-2 border-t border-border flex items-center gap-2">
              <input
                type="text"
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 text-xs px-3 py-2 rounded-xl bg-muted border border-border focus:outline-none focus:border-emerald-500 text-foreground"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
              />
              <button
                onClick={() => handleSend()}
                className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-semibold shadow-md transition-all hover:scale-105"
                title="Send on WhatsApp"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={handleOpen}
        aria-label="Chat on WhatsApp"
        className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium text-xs shadow-[0_8px_25px_rgba(16,185,129,0.35)] hover:shadow-[0_12px_35px_rgba(16,185,129,0.5)] hover:scale-105 active:scale-95 transition-all duration-200 border border-emerald-400/30"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
        </span>
        <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
        <span className="hidden sm:inline font-semibold">Chat with Usman</span>
      </button>
    </div>
  );
}
