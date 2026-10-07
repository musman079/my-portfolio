"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
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
import {
  ScrollReveal,
  StaggerContainer,
  staggerItem,
  MagneticButton,
} from "@/components/motion-primitives";

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
      <motion.div
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(245,158,11,0.09) 0%, rgba(245,158,11,0.02) 50%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(14,165,233,0.09) 0%, rgba(14,165,233,0.02) 50%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container px-6 mx-auto max-w-4xl relative z-10">
        <ScrollReveal className="text-center mb-16">
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
        </ScrollReveal>

        <div className="grid gap-8 md:grid-cols-12">
          {/* Quick Action Info Cards */}
          <StaggerContainer className="md:col-span-5 space-y-4" stagger={0.12}>
            {/* One-Click Copy Email */}
            <motion.div variants={staggerItem}>
              <motion.div
                onClick={handleCopyEmail}
                className="glass-card rounded-2xl p-5 cursor-pointer hover:border-amber-500/50 transition-all group"
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500"
                      whileHover={{ rotate: 15 }}
                    >
                      <Mail className="w-5 h-5" />
                    </motion.div>
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
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring" }}
                      >
                        <Check className="w-4 h-4 text-emerald-500" />
                      </motion.div>
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </div>
                </div>
                {copiedEmail && (
                  <motion.p
                    className="text-[11px] text-emerald-500 mt-2 font-mono"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    ✓ Copied to clipboard!
                  </motion.p>
                )}
              </motion.div>
            </motion.div>

            {/* WhatsApp / Direct Chat */}
            <motion.div variants={staggerItem}>
              <motion.a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card rounded-2xl p-5 block hover:border-emerald-500/50 transition-all group"
                whileHover={{ scale: 1.02, x: 4 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400"
                      whileHover={{ rotate: -15 }}
                    >
                      <Phone className="w-5 h-5" />
                    </motion.div>
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
              </motion.a>
            </motion.div>

            {/* Fiverr Profile Direct */}
            <motion.div variants={staggerItem}>
              <motion.a
                href={fiverrUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card rounded-2xl p-5 block hover:border-emerald-500/50 transition-all group"
                whileHover={{ scale: 1.02, x: 4 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="w-10 h-10 rounded-xl bg-[#1dbf73]/15 border border-[#1dbf73]/30 flex items-center justify-center text-[#1dbf73]"
                      whileHover={{ rotate: 15 }}
                    >
                      <Star className="w-5 h-5 fill-current" />
                    </motion.div>
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
              </motion.a>
            </motion.div>
          </StaggerContainer>

          {/* Interactive Contact Form */}
          <ScrollReveal direction="right" distance={60} className="md:col-span-7">
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

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
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
              </motion.div>

              <motion.div
                className="grid gap-4 sm:grid-cols-2"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
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
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
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
              </motion.div>

              {errorMessage && (
                <motion.div
                  className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-500 text-sm flex items-center gap-2 font-medium"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <span className="font-bold">Error:</span> {errorMessage}
                </motion.div>
              )}

              {status === "sent" ? (
                <motion.div
                  className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-sm flex items-center gap-2 font-medium"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring" }}
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>
                    Message received successfully! Usman will reply within 24
                    hours.
                  </span>
                </motion.div>
              ) : (
                <MagneticButton strength={0.15} className="w-full">
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
                        <motion.span
                          className="w-4 h-4 border-2 border-black border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Direct Message</span>
                      </>
                    )}
                  </Button>
                </MagneticButton>
              )}
            </form>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
