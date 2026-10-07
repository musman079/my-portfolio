"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Download,
  Mail,
  Github,
  Linkedin,
  Star,
  Code2,
  ChevronDown,
} from "lucide-react";
import { CodeWindow } from "@/components/ui-helpers";
import {
  ScrollReveal,
  MagneticButton,
  TextReveal,
} from "@/components/motion-primitives";

interface HeroSectionProps {
  profile: any;
  typingText: string;
  onScrollTo: (id: string) => void;
  onOpenTerminal: () => void;
  canvasElement?: React.ReactNode;
  scene3D?: React.ReactNode;
}

export function HeroSection({
  profile,
  typingText,
  onScrollTo,
  onOpenTerminal,
  canvasElement,
  scene3D,
}: HeroSectionProps) {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.92]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);

  const handleResumeDownload = () => {
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "resumeDownload" }),
    }).catch(() => {});
  };

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-28 pb-16"
    >
      {/* 3D Scene Background */}
      {scene3D}
      {canvasElement}
      <div className="aurora-bg" aria-hidden />

      {/* Static Ambient Orbs (Zero GPU overhead) */}
      <div className="hero-orb-1" aria-hidden />
      <div className="hero-orb-2" aria-hidden />
      <div className="hero-orb-3" aria-hidden />

      {/* Grid Background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(245,158,11,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(245,158,11,.03) 1px,transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "radial-gradient(ellipse 85% 85% at 50% 50%,black 30%,transparent 100%)",
        }}
        aria-hidden
      />

      <motion.div
        className="container px-6 mx-auto max-w-6xl relative z-10"
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Hero Details */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Available for freelance badge */}
            {profile.available && (
              <motion.div
                id="availability-badge"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-[0_0_20px_rgba(34,197,94,0.15)]"
                style={{
                  border: "1px solid rgba(34,197,94,0.4)",
                  background: "rgba(34,197,94,0.09)",
                  color: "#4ade80",
                }}
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.span
                  className="w-2.5 h-2.5 rounded-full bg-green-400"
                  animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                {profile.availableText || "Available for Freelance & Full-Stack Roles"}
              </motion.div>
            )}

            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-[1.15] tracking-tight text-foreground"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              Hi, I&apos;m{" "}
              <TextReveal
                text={profile.name || "Muhammad Usman"}
                className="gradient-text-animated"
                delay={0.4}
              />
            </motion.h1>

            <motion.div
              className="flex items-center justify-center lg:justify-start gap-2 text-xl sm:text-2xl lg:text-3xl font-semibold mb-6 h-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <span className="text-muted-foreground">I&apos;m a&nbsp;</span>
              <span style={{ color: "#f59e0b" }} className="animate-neon">
                {typingText}
                <span className="typing-cursor" />
              </span>
            </motion.div>

            <motion.p
              className="text-base sm:text-lg text-foreground/80 max-w-xl mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {profile.bio ||
                "Full-Stack MERN & Next.js Engineer crafting scalable, ultra-fast web applications with clean code, secure APIs, and responsive, interactive interfaces."}
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4 justify-center lg:justify-start mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <MagneticButton strength={0.25}>
                <a
                  href={
                    profile.resumeUrl ||
                    "https://drive.google.com/file/d/1L8iT_FWQeu5zaE9CWjt7kEoik7iMzb51/view?usp=sharing"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleResumeDownload}
                >
                  <Button
                    id="download-resume-btn"
                    size="lg"
                    className="gap-2 px-7 font-bold btn-primary-glow"
                    style={{
                      background: "linear-gradient(135deg,#f59e0b,#0ea5e9)",
                      color: "#000",
                      border: "none",
                    }}
                  >
                    <Download className="h-4 w-4" />
                    Download Resume
                  </Button>
                </a>
              </MagneticButton>
              <MagneticButton strength={0.25}>
                <Button
                  id="get-in-touch-btn"
                  variant="outline"
                  size="lg"
                  className="gap-2 px-7 social-icon border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/5 hover:bg-amber-500/10"
                  onClick={() => onScrollTo("contact")}
                >
                  <Mail className="h-4 w-4" />
                  Get In Touch
                </Button>
              </MagneticButton>
            </motion.div>

            {/* Social Channels */}
            <motion.div
              className="flex items-center justify-center lg:justify-start gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.85 }}
            >
              {[
                {
                  href: profile.github || "http://github.com/mani78979",
                  icon: <Github className="h-5 w-5" />,
                  label: "GitHub",
                },
                {
                  href: profile.linkedin || "http://www.linkedin.com/in/musman78",
                  icon: <Linkedin className="h-5 w-5" />,
                  label: "LinkedIn",
                },
                {
                  href: `mailto:${profile.email || "usmankousar772@gmail.com"}`,
                  icon: <Mail className="h-5 w-5" />,
                  label: "Email",
                },
              ].map(({ href, icon, label }, i) => (
                <motion.a
                  key={label}
                  href={href}
                  target={href.startsWith("mailto") ? "_self" : "_blank"}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-muted-foreground hover:text-foreground border border-border bg-card shadow-sm hover:border-amber-500/50 hover:text-amber-500 transition-colors"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + i * 0.08, duration: 0.35 }}
                >
                  {icon}
                </motion.a>
              ))}

              {/* Fiverr */}
              <motion.a
                href={profile.fiverrUrl || "https://www.fiverr.com/musman079"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Fiverr"
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-muted-foreground hover:text-green-500 border border-border bg-card shadow-sm hover:border-green-500/50 transition-colors"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.15, duration: 0.35 }}
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M23.004 15.588a.995.995 0 1 0 .002-1.99.995.995 0 0 0-.002 1.99zm-.996-3.705h-1.33c-.57 0-.995.424-.995.992v4.46H18.38v-4.46c0-.568-.424-.992-.995-.992h-.568v-1.184h.568c.57 0 .995-.424.995-.992V8.58c0-1.756.997-2.752 2.752-2.752h.994v1.313h-.994c-.854 0-1.38.525-1.38 1.38v1.185h1.38v1.184h-1.38v4.46h1.38v-4.46c0-.568.428-.992.996-.992h1.33v1.185zm-8.507-6.59a.89.89 0 0 1 .891.89.89.89 0 0 1-.891.892.89.89 0 0 1-.89-.891.89.89 0 0 1 .89-.891zm.532 3.704h-.532v7.337h-1.33V9.001h-.568V7.817h.568v-.568c0-.568.424-.992.995-.992h.867v1.23zm-5.325 2.752c.284 0 .568.142.71.427L10.85 13.7a2.36 2.36 0 0 0-.427-.284 2.68 2.68 0 0 0-.71-.142c-.854 0-1.523.71-1.523 1.563 0 .855.67 1.563 1.523 1.563.284 0 .568-.142.71-.284l1.186 1.17a2.978 2.978 0 0 1-1.896.71c-1.614 0-2.894-1.28-2.894-2.895 0-1.613 1.28-2.893 2.894-2.893.284 0 .568-.142.71-.142zM6.254 7.108c.568 0 .995.142 1.38.284l-.142 1.186a2.683 2.683 0 0 0-.995-.284c-.71 0-1.28.568-1.28 1.28v1.043h2.276v1.185H5.217v4.46H3.888v-4.46H3.32V10.617h.568V9.574c0-1.33 1.043-2.466 2.366-2.466z" />
                </svg>
              </motion.a>
            </motion.div>
          </div>

          {/* Right Column: Interactive Code Window */}
          <motion.div
            className="lg:col-span-5 flex justify-center lg:justify-end mt-4 lg:mt-0 relative z-10"
            initial={{ opacity: 0, x: 60, rotateY: -15 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ perspective: "1000px" }}
          >
            <div className="relative w-full flex justify-center lg:justify-end">
              <CodeWindow
                onOpenTerminal={onOpenTerminal}
                devName={profile.name || "Muhammad Usman"}
              />

              {/* Floating Badges */}
              <motion.div
                className="absolute -bottom-3 -left-3 glass px-3.5 py-2 rounded-2xl shadow-xl hidden sm:flex items-center gap-2 text-xs font-semibold"
                style={{ border: "1px solid rgba(245,158,11,0.3)" }}
                initial={{ opacity: 0, x: -30, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 1.0, duration: 0.6 }}
                whileHover={{ scale: 1.08, y: -5 }}
              >
                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                <span>{profile.fiverrRating || "5.0"} Rating on Fiverr</span>
              </motion.div>
              <motion.div
                className="absolute -top-3 -right-3 glass px-3.5 py-2 rounded-2xl shadow-xl hidden sm:flex items-center gap-2 text-xs font-semibold"
                style={{ border: "1px solid rgba(14,165,233,0.3)" }}
                initial={{ opacity: 0, x: 30, y: -20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 1.1, duration: 0.6 }}
                whileHover={{ scale: 1.08, y: -5 }}
              >
                <Code2 className="h-4 w-4 text-sky-500" />
                <span>MERN & Next.js Expert</span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
        >
          <motion.button
            onClick={() => onScrollTo("about")}
            className="inline-flex flex-col items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors mx-auto group"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="text-xs tracking-widest uppercase font-mono group-hover:text-amber-500 transition-colors">
              Explore Portfolio
            </span>
            <ChevronDown className="h-4 w-4" />
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
}
