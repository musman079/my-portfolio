"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { Terminal, Search } from "lucide-react";
import {
  DEFAULT_SITE_CONFIG,
  DEFAULT_PROJECTS,
  DEFAULT_SKILLS,
  DEFAULT_SERVICES,
  DEFAULT_REVIEWS,
} from "@/lib/site-config";
import {
  playClickSound,
  playSuccessSound,
  isSoundEnabled,
  setSoundEnabled,
} from "@/lib/sound-effects";

// Modular Sections
import { Navbar, NAV_LINKS } from "@/components/sections/navbar";
import { HeroSection } from "@/components/sections/hero-section";
import { AboutSection } from "@/components/sections/about-section";
import { JourneySection } from "@/components/sections/journey-section";
import { SkillsSection } from "@/components/sections/skills-section";
import { ServicesSection } from "@/components/sections/services-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { ReviewsSection } from "@/components/sections/reviews-section";
import { ContactSection } from "@/components/sections/contact-section";
import { Footer } from "@/components/sections/footer";
import type { ProjectDetail } from "@/components/project-modal";

// Lazy-loaded heavy tools & modals (SSR: false for optimal performance)
const DevTerminal = dynamic(
  () => import("@/components/dev-terminal").then((m) => m.DevTerminal),
  { ssr: false }
);
const CommandPalette = dynamic(
  () => import("@/components/command-palette").then((m) => m.CommandPalette),
  { ssr: false }
);
const ProjectModal = dynamic(
  () => import("@/components/project-modal").then((m) => m.ProjectModal),
  { ssr: false }
);
const CostEstimator = dynamic(
  () => import("@/components/cost-estimator").then((m) => m.CostEstimator),
  { ssr: false }
);
const ConstellationCanvas = dynamic(
  () =>
    import("@/components/constellation-canvas").then(
      (m) => m.ConstellationCanvas
    ),
  { ssr: false }
);
const WhatsAppWidget = dynamic(
  () =>
    import("@/components/whatsapp-widget").then((m) => m.WhatsAppWidget),
  { ssr: false }
);

export default function Portfolio() {
  const [navScrolled, setNavScrolled] = useState(false);
  const [soundActive, setSoundActive] = useState(false);
  const [activeSection, setActiveSection] = useState("about");
  const [isMounted, setIsMounted] = useState(false);

  // Typing animation
  const [typingText, setTypingText] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Modals & Tools
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectDetail | null>(null);

  // Contact Form State
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    projectType: "Full-Stack MERN App",
    message: "",
    estimatedBudget: "",
  });
  const [contactStatus, setContactStatus] = useState<
    "idle" | "loading" | "sent" | "error"
  >("idle");
  const [contactError, setContactError] = useState("");

  // Dynamic Data from MongoDB APIs
  const [dynProjects, setDynProjects] = useState<ProjectDetail[]>(DEFAULT_PROJECTS);
  const [dynReviews, setDynReviews] = useState(DEFAULT_REVIEWS);
  const [dynSkills, setDynSkills] = useState(DEFAULT_SKILLS);
  const [dynServices, setDynServices] = useState(DEFAULT_SERVICES);
  const [dynProfile, setDynProfile] = useState(DEFAULT_SITE_CONFIG);

  const progressBarRef = useRef<HTMLDivElement>(null);

  // Global Keyboard Shortcut (Ctrl+K / Cmd+K)
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleGlobalKey);
    return () => window.removeEventListener("keydown", handleGlobalKey);
  }, []);

  // Initialization & Data Fetching
  useEffect(() => {
    setIsMounted(true);
    setSoundActive(isSoundEnabled());

    // Analytics hit
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "pageView" }),
    }).catch(() => {});

    // Fetch dynamic content
    Promise.all([
      fetch("/api/projects").then((r) => r.json()).catch(() => null),
      fetch("/api/reviews").then((r) => r.json()).catch(() => null),
      fetch("/api/skills").then((r) => r.json()).catch(() => null),
      fetch("/api/services").then((r) => r.json()).catch(() => null),
      fetch("/api/profile").then((r) => r.json()).catch(() => null),
    ]).then(([projects, reviews, skills, services, profile]) => {
      if (Array.isArray(projects) && projects.length) setDynProjects(projects);
      if (Array.isArray(reviews)) setDynReviews(reviews.length ? reviews : []);
      if (Array.isArray(skills) && skills.length) setDynSkills(skills);
      if (Array.isArray(services) && services.length) setDynServices(services);
      if (profile && profile.name)
        setDynProfile({ ...DEFAULT_SITE_CONFIG, ...profile });
    });
  }, []);

  // Typing animation loop
  const roles =
    dynProfile.typingRoles && dynProfile.typingRoles.length
      ? dynProfile.typingRoles
      : DEFAULT_SITE_CONFIG.typingRoles;

  useEffect(() => {
    const role = roles[roleIndex % roles.length];
    const speed = isDeleting ? 35 : 95;
    const t = setTimeout(() => {
      if (!isDeleting) {
        if (typingText.length < role.length)
          setTypingText(role.slice(0, typingText.length + 1));
        else setTimeout(() => setIsDeleting(true), 2400);
      } else {
        if (typingText.length > 0)
          setTypingText(role.slice(0, typingText.length - 1));
        else {
          setIsDeleting(false);
          setRoleIndex((p) => (p + 1) % roles.length);
        }
      }
    }, speed);
    return () => clearTimeout(t);
  }, [typingText, roleIndex, isDeleting, roles]);

  // Scroll listeners: progress bar, active section, and navbar blur
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setNavScrolled(scrollY > 20);

      const totalH =
        document.documentElement.scrollHeight - window.innerHeight;
      if (progressBarRef.current && totalH > 0) {
        const pct = (scrollY / totalH) * 100;
        progressBarRef.current.style.width = `${pct}%`;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection observer for active navigation section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setActiveSection(e.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    NAV_LINKS.forEach((l) => {
      const el = document.getElementById(l.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Scroll reveal animation observer
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("revealed");
        }),
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    const t = setTimeout(() => {
      document
        .querySelectorAll(".reveal,.reveal-left,.reveal-right")
        .forEach((el) => {
          obs.observe(el);
          el.classList.add("revealed");
        });
    }, 50);
    return () => {
      clearTimeout(t);
      obs.disconnect();
    };
  }, [dynProjects, dynSkills, dynServices, dynReviews]);

  const scrollTo = (id: string) => {
    playClickSound();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleSound = () => {
    const next = !soundActive;
    setSoundEnabled(next);
    setSoundActive(next);
    if (next) playSuccessSound();
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactStatus("loading");
    setContactError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });

      const data = await res.json();

      if (res.ok) {
        playSuccessSound();
        setContactStatus("sent");
        setTimeout(() => {
          setContactStatus("idle");
          setContactForm({
            name: "",
            email: "",
            projectType: "Full-Stack MERN App",
            message: "",
            estimatedBudget: "",
          });
        }, 5000);
      } else {
        setContactStatus("error");
        setContactError(data.error || "Failed to send message. Please try again.");
      }
    } catch {
      setContactStatus("error");
      setContactError("Network error. Please reach out directly via WhatsApp.");
    }
  };

  const statsList =
    dynProfile.stats && dynProfile.stats.length
      ? dynProfile.stats
      : DEFAULT_SITE_CONFIG.stats;

  const journeyList =
    dynProfile.journey && dynProfile.journey.length
      ? dynProfile.journey
      : DEFAULT_SITE_CONFIG.journey;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-amber-500/30 selection:text-amber-500">
      <div className="noise-overlay" aria-hidden />
      <div
        ref={progressBarRef}
        className="scroll-progress"
        style={{ width: "0%" }}
        aria-hidden
      />

      {/* ====== MODALS & TOOLS ====== */}
      <DevTerminal isOpen={terminalOpen} onClose={() => setTerminalOpen(false)} />
      <CommandPalette
        isOpen={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onOpenTerminal={() => setTerminalOpen(true)}
        onCopyEmail={() => {
          playSuccessSound();
          navigator.clipboard.writeText(
            dynProfile.email || "usmankousar772@gmail.com"
          );
        }}
      />
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      {/* ====== FLOATING WHATSAPP CHAT WIDGET ====== */}
      {isMounted && (
        <WhatsAppWidget
          phoneNumber={dynProfile.whatsapp || "923189053287"}
          defaultMessage="Hi Usman! I saw your portfolio and would like to discuss a project."
        />
      )}

      {/* ====== FLOATING ACTION SHORTCUTS (Right) ====== */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2.5">
        <button
          onClick={() => {
            playClickSound();
            setTerminalOpen(true);
          }}
          className="p-3.5 rounded-full bg-[#111420] text-amber-400 border border-amber-500/40 shadow-xl hover:scale-110 hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all duration-200"
          aria-label="Open CLI Terminal"
          title="Open Developer Console (CLI)"
        >
          <Terminal className="w-5 h-5" />
        </button>
        <button
          onClick={() => {
            playClickSound();
            setPaletteOpen(true);
          }}
          className="p-3.5 rounded-full bg-[#111420] text-sky-400 border border-sky-500/40 shadow-xl hover:scale-110 hover:shadow-[0_0_25px_rgba(14,165,233,0.4)] transition-all duration-200"
          aria-label="Command Palette"
          title="Command Palette (Ctrl+K)"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* ====== NAVBAR ====== */}
      <Navbar
        navScrolled={navScrolled}
        activeSection={activeSection}
        soundActive={soundActive}
        onScrollTo={scrollTo}
        onToggleSound={toggleSound}
        onOpenTerminal={() => setTerminalOpen(true)}
        onOpenPalette={() => setPaletteOpen(true)}
      />

      {/* ====== HERO SECTION ====== */}
      <HeroSection
        profile={dynProfile}
        typingText={typingText}
        onScrollTo={scrollTo}
        onOpenTerminal={() => setTerminalOpen(true)}
        canvasElement={isMounted ? <ConstellationCanvas /> : null}
      />

      {/* ====== ABOUT & STATS & TECH MARQUEE ====== */}
      <AboutSection
        profile={dynProfile}
        stats={statsList}
        onScrollTo={scrollTo}
      />

      <div className="section-divider max-w-5xl" />

      {/* ====== JOURNEY TIMELINE ====== */}
      <JourneySection journeyList={journeyList} />

      <div className="section-divider max-w-5xl" />

      {/* ====== SKILLS ====== */}
      <SkillsSection skills={dynSkills} />

      <div className="section-divider max-w-5xl" />

      {/* ====== SERVICES ====== */}
      <ServicesSection services={dynServices} />

      <div className="section-divider max-w-5xl" />

      {/* ====== FEATURED PROJECTS ====== */}
      <ProjectsSection
        projects={dynProjects}
        onSelectProject={(p) => setSelectedProject(p)}
        githubUrl={dynProfile.github || "https://github.com/mani78979"}
      />

      <div className="section-divider max-w-5xl" />

      {/* ====== INTERACTIVE COST ESTIMATOR ====== */}
      <section id="estimator" className="py-28 relative overflow-hidden">
        <span className="section-number" aria-hidden>
          06
        </span>
        <div className="container px-6 mx-auto max-w-5xl relative z-10">
          <div className="text-center mb-16 reveal">
            <span
              className="section-label"
              style={{ color: "#10b981", borderColor: "rgba(16,185,129,0.3)" }}
            >
              Interactive Calculator
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold mt-2 tracking-tight text-foreground">
              Project Cost Estimator
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Select your project type and features for an instant budget and
              timeline estimation.
            </p>
          </div>

          <div className="reveal">
            <CostEstimator
              rates={dynProfile.estimatorRates}
              onSelectQuote={(details) => {
                fetch("/api/analytics", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ event: "estimatorCalculation" }),
                }).catch(() => {});

                // Match estimated budget if possible
                const budgetMatch = details.match(/\$([0-9]+)/);
                const budgetStr = budgetMatch ? `$${budgetMatch[1]}` : "";

                setContactForm((prev) => ({
                  ...prev,
                  estimatedBudget: budgetStr || prev.estimatedBudget,
                  message: `Hello Usman, I'd like to get started on this project:\n${details}`,
                }));

                const el = document.getElementById("contact");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
            />
          </div>
        </div>
      </section>

      <div className="section-divider max-w-5xl" />

      {/* ====== REVIEWS ====== */}
      <ReviewsSection
        reviews={dynReviews}
        fiverrRating={dynProfile.fiverrRating}
        fiverrLevel={dynProfile.fiverrLevel}
        fiverrUrl={dynProfile.fiverrUrl}
      />

      <div className="section-divider max-w-5xl" />

      {/* ====== CONTACT & INQUIRY HUB ====== */}
      <ContactSection
        email={dynProfile.email}
        whatsapp={dynProfile.whatsapp}
        whatsappUrl={dynProfile.whatsappUrl}
        fiverrUrl={dynProfile.fiverrUrl}
        contactForm={contactForm}
        setContactForm={setContactForm}
        onSubmit={handleContactSubmit}
        status={contactStatus}
        errorMessage={contactError}
      />

      {/* ====== FOOTER ====== */}
      <Footer
        footerBio={dynProfile.footerBio}
        copyrightText={dynProfile.copyrightText}
        githubUrl={dynProfile.github}
        linkedinUrl={dynProfile.linkedin}
        email={dynProfile.email}
      />
    </div>
  );
}
