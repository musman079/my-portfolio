"use client";

import React from "react";
import { Github, Linkedin, Mail } from "lucide-react";

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
    <footer className="py-12 relative border-t border-border">
      <div className="container px-6 mx-auto max-w-5xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span
              className="text-xl font-bold gradient-text-animated glitch-text font-mono whitespace-nowrap inline-block"
              data-text="<M.Usman />"
            >
              {"<M.Usman />"}
            </span>
            <p className="text-xs text-muted-foreground mt-1">{footerBio}</p>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            &copy; {new Date().getFullYear()} {copyrightText}
          </p>

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
            ].map(({ href, icon, label }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("mailto") ? "_self" : "_blank"}
                rel="noopener noreferrer"
                aria-label={label}
                className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground transition-colors social-icon border border-border bg-card"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
