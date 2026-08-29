import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Space_Grotesk } from "next/font/google"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Muhammad Usman – Full Stack MERN & Next.js Developer",
  description:
    "Muhammad Usman is an elite Full-Stack MERN & Next.js Engineer, Level-1 Fiverr Freelancer (5.0★ Rating), and Architect building scalable web apps with MongoDB, React 19, and Node.js.",
  keywords: [
    "Full Stack Developer",
    "MERN Stack Developer",
    "Next.js 15 Developer",
    "React 19 Developer",
    "Node.js API Architecture",
    "MongoDB Atlas Specialist",
    "Freelance Web Developer",
    "Muhammad Usman",
    "Fiverr Level 1 Seller",
  ],
  authors: [{ name: "Muhammad Usman", url: "https://github.com/mani78979" }],
  creator: "Muhammad Usman",
  publisher: "Muhammad Usman",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://muhammadusman.dev"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Muhammad Usman – Full Stack MERN & Next.js 15 Architect",
    description:
      "Explore the interactive portfolio of Muhammad Usman: Full-Stack MERN Engineer, Web Audio Synth, 120 FPS Particle Engine, and Dynamic MongoDB Headless CMS.",
    url: "https://muhammadusman.dev",
    siteName: "Muhammad Usman Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Muhammad Usman – Full Stack MERN & Next.js Developer",
    description:
      "Full-Stack MERN & Next.js Developer. 5.0★ Top-Rated on Fiverr. Building hyper-performant web applications.",
    creator: "@musman079",
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Muhammad Usman",
  url: "https://muhammadusman.dev",
  jobTitle: "Full-Stack Developer",
  worksFor: {
    "@type": "Organization",
    name: "Freelance / Fiverr",
  },
  sameAs: [
    "https://github.com/mani78979",
    "http://www.linkedin.com/in/musman78",
    "https://www.fiverr.com/musman079",
  ],
  knowsAbout: [
    "MERN Stack",
    "Next.js",
    "React.js",
    "Node.js",
    "Express.js",
    "MongoDB",
    "TypeScript",
    "Tailwind CSS",
    "RESTful APIs",
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${spaceGrotesk.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

