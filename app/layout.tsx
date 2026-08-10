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
  title: "Muhammad Usman – Full Stack Developer",
  description:
    "Full-Stack Web Developer specializing in MERN stack. Building high-performance, scalable web applications. Available for freelance work on Fiverr.",
  keywords: [
    "Full Stack Developer",
    "MERN Stack",
    "React Developer",
    "Node.js",
    "MongoDB",
    "Freelancer",
    "Muhammad Usman",
    "Web Developer Pakistan",
  ],
  authors: [{ name: "Muhammad Usman" }],
  openGraph: {
    title: "Muhammad Usman – Full Stack Developer",
    description: "Full-Stack Web Developer specializing in MERN stack. Available for freelance work.",
    type: "website",
  },
  icons: {
    icon: "/icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
