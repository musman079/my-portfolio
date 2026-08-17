import mongoose, { Schema, model, models } from "mongoose";

const ProfileSchema = new Schema({
  avatarUrl: { type: String, default: "/placeholder.jpg" },
  name: { type: String, default: "Muhammad Usman" },
  title: { type: String, default: "Full-Stack Developer" },
  bio: { type: String, default: "Dedicated Full-Stack Developer with a focus on the MERN stack — MongoDB, Express.js, React, and Node.js." },
  resumeUrl: { type: String, default: "https://drive.google.com/file/d/1L8iT_FWQeu5zaE9CWjt7kEoik7iMzb51/view?usp=sharing" },
  location: { type: String, default: "Faisalabad, Pakistan • Working with Global Clients" },
  available: { type: Boolean, default: true },
  availableText: { type: String, default: "Available for Freelance & Full-Stack Roles" },

  // Typing animation roles
  typingRoles: {
    type: [String],
    default: [
      "Full-Stack Developer",
      "MERN Stack Specialist",
      "Fiverr Level-1 Freelancer",
      "UI/UX Engineering Enthusiast",
      "Next.js & React Architect",
    ],
  },

  // Social & Contact details
  email: { type: String, default: "usmankousar772@gmail.com" },
  whatsapp: { type: String, default: "+92 328 6596772" },
  whatsappUrl: { type: String, default: "https://wa.me/923286596772" },
  github: { type: String, default: "https://github.com/mani78979" },
  linkedin: { type: String, default: "http://www.linkedin.com/in/musman78" },
  fiverrUrl: { type: String, default: "https://www.fiverr.com/musman079" },
  fiverrRating: { type: String, default: "5.0" },
  fiverrLevel: { type: String, default: "Level 1" },

  // About section copy
  aboutHeading: { type: String, default: "About Me" },
  aboutParagraph1: {
    type: String,
    default: "I'm a dedicated Full-Stack MERN Engineer who specializes in designing scalable, secure web architectures and highly-responsive user interfaces.",
  },
  aboutParagraph2: {
    type: String,
    default: "From developing complex multi-tier full stack applications to optimizing REST APIs and crafting Figma-accurate React/Next.js interfaces, I take pride in delivering software that performs flawlessly.",
  },
  aboutParagraph3: {
    type: String,
    default: "As a Level-1 freelancer on Fiverr with a consistent 5.0★ rating, I have successfully collaborated with businesses and founders across the USA, UK, Germany, and beyond.",
  },
  aboutBadges: {
    type: [
      {
        label: String,
        color: String,
      },
    ],
    default: [
      { label: "MERN Architecture", color: "#f59e0b" },
      { label: "Figma to Pixel-Code", color: "#06b6d4" },
      { label: "REST API & JWT Auth", color: "#10b981" },
      { label: "Fiverr Level-1 Pro", color: "#ec4899" },
    ],
  },

  // Stats Metrics
  stats: {
    type: [
      {
        label: String,
        num: Number,
        suffix: String,
        color: String,
        isFloat: Boolean,
      },
    ],
    default: [
      { label: "Projects Built", num: 12, suffix: "+", color: "#f59e0b", isFloat: false },
      { label: "Happy Clients", num: 15, suffix: "+", color: "#0ea5e9", isFloat: false },
      { label: "Fiverr Rating", num: 5.0, suffix: "★", color: "#fbbf24", isFloat: true },
      { label: "On-Time Delivery", num: 100, suffix: "%", color: "#10b981", isFloat: false },
    ],
  },

  // Journey & Milestone Timeline
  journey: {
    type: [
      {
        year: String,
        title: String,
        subtitle: String,
        description: String,
        badge: String,
        color: String,
      },
    ],
    default: [
      {
        year: "2024 — Present",
        title: "Freelance Full-Stack Developer",
        subtitle: "Fiverr Level-1 Seller (5.0★ Rating)",
        description: "Delivering end-to-end full-stack web applications for global clients with 100% on-time completion, specializing in MERN stack and Next.js.",
        badge: "Active",
        color: "#f59e0b",
      },
      {
        year: "2023 — 2024",
        title: "Full-Stack Web Specialization",
        subtitle: "MERN Stack & Next.js Ecosystem",
        description: "Deep dive into scalable RESTful API design, JWT authentication, MongoDB optimization, and modern React 19 / Next.js architecture.",
        badge: "Milestone",
        color: "#0ea5e9",
      },
      {
        year: "2022 — 2023",
        title: "Mobile & Machine Learning Research",
        subtitle: "Satellite Imagery & Urban Sprawl Analysis",
        description: "Engineered cross-platform mobile apps using Flutter and integrated offline-capable TensorFlow Lite machine learning models for satellite image analysis.",
        badge: "Research",
        color: "#10b981",
      },
      {
        year: "2021 — 2025",
        title: "BS Computer Science",
        subtitle: "Undergraduate Degree",
        description: "Comprehensive computer science education focusing on Data Structures, Algorithms, Database Management Systems, and Software Architecture.",
        badge: "Degree",
        color: "#8b5cf6",
      },
    ],
  },

  // Cost Estimator Rates
  estimatorRates: {
    type: Map,
    of: Number,
    default: {
      "mern": 250,
      "frontend": 180,
      "api": 140,
      "mobile": 290,
      "auth": 45,
      "db": 60,
      "payment": 80,
      "admin": 95,
      "realtime": 75,
      "seo": 40,
    },
  },

  // Footer & Legal
  footerBio: {
    type: String,
    default: "Full-Stack MERN Developer • Available for Global Freelance Work",
  },
  copyrightText: {
    type: String,
    default: "Muhammad Usman. Built with Next.js 15 & Tailwind CSS.",
  },
}, { timestamps: true });

export const Profile = models.Profile || model("Profile", ProfileSchema);
