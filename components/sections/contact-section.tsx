"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Phone,
  Star,
  ExternalLink,
  Copy,
  Check,
  Send,
  CheckCircle2,
} from "lucide-react";
import { playSuccessSound } from "@/lib/sound-effects";

interface ContactSectionProps {
  email?: string;
  whatsapp?: string;
  whatsappUrl?: string;
  fiverrUrl?: string;
  contactForm: {
    name: string;
    email: string;
    projectType: string;
    message: string;
    estimatedBudget: string;
  };
  setContactForm: React.Dispatch<
    React.SetStateAction<{
      name: string;
      email: string;
      projectType: string;
      message: string;
      estimatedBudget: string;
    }>
  >;
  onSubmit: (e: React.FormEvent) => void;
  status: "idle" | "loading" | "sent" | "error";
  errorMessage: string;
}

export function ContactSection({
  email = "usmankousar772@gmail.com",
  whatsapp = "+92 318 9053287",
  whatsappUrl = "https://wa.me/923189053287",
  fiverrUrl = "https://www.fiverr.com/musman079",
  contactForm,
  setContactForm,
  onSubmit,
  status,
  errorMessage,
}: ContactSectionProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    playSuccessSound();
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <section id="contact" className="py-28 relative overflow-hidden">
      <span className="section-number" aria-hidden>
        08
      </span>
      <div
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(245,158,11,0.09) 0%, rgba(245,158,11,0.02) 50%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(14,165,233,0.09) 0%, rgba(14,165,233,0.02) 50%, transparent 70%)",
        }}
      />

      <div className="container px-6 mx-auto max-w-4xl relative z-10">
        <div className="text-center mb-16 reveal">
          <span
            className="section-label"
            style={{ color: "#f59e0b", borderColor: "rgba(245,158,11,0.3)" }}
          >
            Get In Touch
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold mt-2 tracking-tight text-foreground">
            Let&apos;s Build Together
          </h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
            Have a project, idea, or freelance opportunity? Drop me a message or
            connect directly.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-12 reveal">
          {/* Quick Action Info Cards */}
          <div className="md:col-span-5 space-y-4">
            {/* One-Click Copy Email */}
            <div
              onClick={handleCopyEmail}
              className="glass-card rounded-2xl p-5 cursor-pointer hover:border-amber-500/50 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-muted-foreground">
                      Direct Email
                    </div>
                    <div className="text-sm font-semibold text-foreground">
                      {email}
                    </div>
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 text-muted-foreground group-hover:text-amber-500 transition-colors">
                  {copiedEmail ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </div>
              </div>
              {copiedEmail && (
                <p className="text-[11px] text-emerald-500 mt-2 font-mono">
                  ✓ Copied to clipboard!
                </p>
              )}
            </div>

            {/* WhatsApp / Direct Chat */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card rounded-2xl p-5 block hover:border-emerald-500/50 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-muted-foreground">
                      WhatsApp Chat
                    </div>
                    <div className="text-sm font-semibold text-foreground">
                      {whatsapp}
                    </div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-emerald-500 transition-colors" />
              </div>
            </a>

            {/* Fiverr Profile Direct */}
            <a
              href={fiverrUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card rounded-2xl p-5 block hover:border-emerald-500/50 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1dbf73]/15 border border-[#1dbf73]/30 flex items-center justify-center text-[#1dbf73]">
                    <Star className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-muted-foreground">
                      Fiverr Seller
                    </div>
                    <div className="text-sm font-semibold text-foreground">
                      fiverr.com/{fiverrUrl?.split("/").pop() || "musman079"}
                    </div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-[#1dbf73] transition-colors" />
              </div>
            </a>
          </div>

          {/* Interactive Contact Form */}
          <div className="md:col-span-7">
            <form
              onSubmit={onSubmit}
              className="glass-card rounded-3xl p-7 sm:p-8 space-y-4"
            >
              {/* Hidden Anti-spam Honeypot Field */}
              <input
                type="text"
                name="website_hp"
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />

              <div>
                <label className="text-xs font-mono uppercase text-muted-foreground font-bold block mb-1.5">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={contactForm.name}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, name: e.target.value })
                  }
                  placeholder="e.g. Alex Johnson"
                  className="admin-input"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-mono uppercase text-muted-foreground font-bold block mb-1.5">
                    Your Email
                  </label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, email: e.target.value })
                    }
                    placeholder="alex@company.com"
                    className="admin-input"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono uppercase text-muted-foreground font-bold block mb-1.5">
                    Project Type
                  </label>
                  <select
                    value={contactForm.projectType}
                    onChange={(e) =>
                      setContactForm({
                        ...contactForm,
                        projectType: e.target.value,
                      })
                    }
                    className="admin-input bg-slate-100 dark:bg-[#161924]"
                  >
                    <option value="Full-Stack MERN App">Full-Stack MERN App</option>
                    <option value="Next.js / Frontend App">
                      Next.js / Frontend App
                    </option>
                    <option value="REST API Architecture">
                      REST API Architecture
                    </option>
                    <option value="UI/UX Figma Conversion">
                      UI/UX Figma Conversion
                    </option>
                    <option value="Bug Fix / Optimization">
                      Bug Fix / Optimization
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-muted-foreground font-bold block mb-1.5">
                  Project Details / Message
                </label>
                <textarea
                  rows={4}
                  required
                  value={contactForm.message}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, message: e.target.value })
                  }
                  placeholder="Tell me about your goals, features, or timeline..."
                  className="admin-input resize-none"
                />
              </div>

              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-500 text-sm flex items-center gap-2 font-medium">
                  <span className="font-bold">Error:</span> {errorMessage}
                </div>
              )}

              {status === "sent" ? (
                <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-sm flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>
                    Message received successfully! Usman will reply within 24
                    hours.
                  </span>
                </div>
              ) : (
                <Button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full gap-2 text-xs font-bold py-5 btn-primary-glow"
                  style={{
                    background: "linear-gradient(135deg,#f59e0b,#0ea5e9)",
                    color: "#000",
                    border: "none",
                    opacity: status === "loading" ? 0.7 : 1,
                  }}
                >
                  {status === "loading" ? (
                    <>
                      <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Direct Message</span>
                    </>
                  )}
                </Button>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
