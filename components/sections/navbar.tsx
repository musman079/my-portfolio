"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Menu,
  X,
  Zap,
  Terminal,
  Volume2,
  VolumeX,
  Search,
  Settings,
} from "lucide-react";
import { playClickSound } from "@/lib/sound-effects";

export const NAV_LINKS = [
  { label: "About", id: "about" },
  { label: "Journey", id: "journey" },
  { label: "Skills", id: "skills" },
  { label: "Services", id: "services" },
  { label: "Projects", id: "projects" },
  { label: "Estimator", id: "estimator" },
  { label: "Reviews", id: "reviews" },
  { label: "Contact", id: "contact" },
];

interface NavbarProps {
  navScrolled: boolean;
  activeSection: string;
  soundActive: boolean;
  onScrollTo: (id: string) => void;
  onToggleSound: () => void;
  onOpenTerminal: () => void;
  onOpenPalette: () => void;
}

export function Navbar({
  navScrolled,
  activeSection,
  soundActive,
  onScrollTo,
  onToggleSound,
  onOpenTerminal,
  onOpenPalette,
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLinkClick = (id: string) => {
    onScrollTo(id);
    setIsMenuOpen(false);
  };

  return (
    <motion.nav
      className={`fixed z-50 w-full px-4 transition-all duration-500 ${
        navScrolled ? "top-0" : "top-2"
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className={`flex h-14 items-center justify-between px-6 max-w-6xl mx-auto rounded-2xl transition-all duration-400 ${
          navScrolled ? "glass shadow-2xl" : "bg-transparent"
        }`}
        style={navScrolled ? { borderColor: "rgba(245,158,11,0.18)" } : {}}
      >
        <a href="/" onClick={() => playClickSound()} className="shrink-0 flex items-center">
          <motion.span
            className="text-xl font-bold tracking-tight gradient-text-animated glitch-text font-mono whitespace-nowrap inline-block"
            data-text="<M.Usman />"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {"<M.Usman />"}
          </motion.span>
        </a>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-3.5 xl:gap-6">
          {NAV_LINKS.map(({ label, id }, i) => (
            <motion.button
              key={id}
              id={`nav-${id}`}
              onClick={() => handleLinkClick(id)}
              className={`nav-link text-xs uppercase tracking-wider font-mono ${
                activeSection === id ? "active text-amber-500 font-bold" : ""
              }`}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
            >
              {label}
              {activeSection === id && (
                <motion.div
                  className="absolute bottom-[-2px] left-0 h-[2px] bg-amber-500 rounded-full"
                  layoutId="activeNavIndicator"
                  style={{ width: "100%" }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Command Palette Trigger */}
          <motion.button
            onClick={() => {
              playClickSound();
              onOpenPalette();
            }}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono text-muted-foreground hover:text-foreground bg-slate-100 dark:bg-white/5 border border-border hover:border-amber-500/30 transition-all"
            title="Command Palette (Ctrl+K)"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Search className="w-3.5 h-3.5 text-amber-500" />
            <span>Search</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[10px] text-foreground">
              ⌘K
            </kbd>
          </motion.button>

          {/* Sound Toggle */}
          <motion.button
            onClick={onToggleSound}
            className={`p-2 rounded-xl border transition-all ${
              soundActive
                ? "text-amber-500 bg-amber-500/10 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                : "text-muted-foreground bg-slate-100 dark:bg-white/5 border-border hover:text-foreground"
            }`}
            aria-label={soundActive ? "Mute Sound" : "Enable Sound"}
            title={soundActive ? "Sound Effects ON" : "Sound Effects OFF"}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9, rotate: 15 }}
          >
            {soundActive ? (
              <Volume2 className="h-4 w-4" />
            ) : (
              <VolumeX className="h-4 w-4" />
            )}
          </motion.button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Admin Link */}
          <motion.a
            href="/admin"
            aria-label="Admin Dashboard"
            className="p-2 rounded-xl text-muted-foreground hover:text-amber-500 transition-colors"
            style={{
              border: "1px solid rgba(245,158,11,0.2)",
              background: "rgba(245,158,11,0.06)",
            }}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <Settings className="h-4 w-4" />
          </motion.a>

          {/* Hire Me CTA */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              id="hire-me-btn"
              size="sm"
              onClick={() => onScrollTo("contact")}
              className="hidden md:flex gap-1.5 text-xs px-4 btn-primary-glow font-bold"
              style={{
                background: "linear-gradient(135deg,#f59e0b,#0ea5e9)",
                color: "#000",
                border: "none",
              }}
            >
              <Zap className="h-3.5 w-3.5" />
              Hire Me
            </Button>
          </motion.div>

          {/* Mobile menu toggle */}
          <motion.button
            id="mobile-menu-toggle"
            className="lg:hidden p-1.5 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => {
              playClickSound();
              setIsMenuOpen(!isMenuOpen);
            }}
            aria-label="Toggle menu"
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-5 w-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="h-5 w-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="lg:hidden glass mx-4 mt-2 rounded-2xl shadow-2xl overflow-hidden"
            style={{ borderColor: "rgba(245,158,11,0.2)" }}
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex flex-col px-6 py-4 gap-1">
              {NAV_LINKS.map(({ label, id }, i) => (
                <motion.button
                  key={id}
                  onClick={() => handleLinkClick(id)}
                  className={`text-left py-2.5 text-sm font-medium border-b border-border ${
                    activeSection === id
                      ? "text-amber-500 font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  {label}
                </motion.button>
              ))}
              <div className="flex gap-2 pt-3">
                <Button
                  size="sm"
                  onClick={() => {
                    onOpenTerminal();
                    setIsMenuOpen(false);
                  }}
                  variant="outline"
                  className="flex-1 text-xs gap-1.5 border-amber-500/30 text-amber-500"
                >
                  <Terminal className="h-3.5 w-3.5" /> Dev CLI
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleLinkClick("contact")}
                  className="flex-1 gap-1.5 text-xs font-bold"
                  style={{
                    background: "linear-gradient(135deg,#f59e0b,#0ea5e9)",
                    color: "#000",
                    border: "none",
                  }}
                >
                  <Zap className="h-3.5 w-3.5" /> Hire Me
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
