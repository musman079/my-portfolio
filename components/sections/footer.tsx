"use client";

import React from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";
import { MagneticButton } from "@/components/motion-primitives";

interface FooterProps {
  footerBio?: string;
  copyrightText?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  email?: string;
}

export function Footer({
  footerBio = "Full-Stack MERN Developer • Available for Global Freelance Work",
  copyrightText = "Muhammad Usman. Built with Next.js 15 & Tailwind CSS.",
  githubUrl = "https://github.com/mani78979",
  linkedinUrl = "https://www.linkedin.com/in/musman78",
  email = "usmankousar772@gmail.com",
}: FooterProps) {
  return (
    <footer className="py-12 relative border-t border-border overflow-hidden">
      {/* Animated gradient line at top */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, #f59e0b, #0ea5e9, #10b981, transparent)",
        }}
        animate={{
          backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      />

      <div className="container px-6 mx-auto max-w-5xl">
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
          >
            <motion.span
              className="text-xl font-bold gradient-text-animated glitch-text font-mono whitespace-nowrap inline-block"
              data-text="<M.Usman />"
              whileHover={{ scale: 1.05 }}
            >
              {"<M.Usman />"}
            </motion.span>
            <p className="text-xs text-muted-foreground mt-1">{footerBio}</p>
          </motion.div>

          <motion.p
            className="text-xs text-muted-foreground text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            &copy; {new Date().getFullYear()} {copyrightText}
          </motion.p>

          <div className="flex items-center gap-3">
            {[
              {
                href: githubUrl,
                icon: <Github className="h-4 w-4" />,
                label: "GitHub",
              },
              {
                href: linkedinUrl,
                icon: <Linkedin className="h-4 w-4" />,
                label: "LinkedIn",
              },
              {
                href: `mailto:${email}`,
                icon: <Mail className="h-4 w-4" />,
                label: "Email",
              },
            ].map(({ href, icon, label }, i) => (
              <MagneticButton key={label} strength={0.4}>
                <motion.a
                  href={href}
                  target={href.startsWith("mailto") ? "_self" : "_blank"}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground transition-colors social-icon border border-border bg-card"
                  whileHover={{ scale: 1.15, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  {icon}
                </motion.a>
              </MagneticButton>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
