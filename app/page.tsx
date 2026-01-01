import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Github, Linkedin, Mail, ExternalLink, Download, Code, Palette, Database, Globe } from "lucide-react"
import Image from "next/image"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <a className="mr-6 flex items-center space-x-2" href="/">
              <span className="font-bold">Portfolio</span>
            </a>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <a href="#about" className="transition-colors hover:text-foreground/80">
                About
              </a>
              <a href="#skills" className="transition-colors hover:text-foreground/80">
                Skills
              </a>
              <a href="#projects" className="transition-colors hover:text-foreground/80">
                Projects
              </a>
              <a href="#contact" className="transition-colors hover:text-foreground/80">
                Contact
              </a>
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
<section className="container px-4 py-24 md:py-32">
  <div className="flex flex-col items-center text-center space-y-8">
    <div className="space-y-4">
      <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
        Hi, I'm <span className="text-primary">Muhammad Usman</span>
      </h1>
      <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl">
        Full-Stack Web Developer skilled in building high-performance applications using the MERN stack (MongoDB, Express, React, Node.js). Passionate about clean code, modern UI/UX, and solving real-world problems through tech.
      </p>
    </div>

    <div className="flex flex-col sm:flex-row gap-4">
      <a
        href="https://drive.google.com/file/d/1L8iT_FWQeu5zaE9CWjt7kEoik7iMzb51/view?usp=sharing" // Replace with actual link
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button size="lg" className="gap-2">
          <Download className="h-4 w-4" />
          Download Resume
        </Button>
      </a>
      <a href="mailto:usmankousar772@gmail.com">
        <Button variant="outline" size="lg" className="gap-2 bg-transparent">
          <Mail className="h-4 w-4" />
          Get In Touch
        </Button>
      </a>
    </div>

    <div className="flex items-center space-x-4">
      <a href="http://github.com/mani78979" target="_blank" rel="noopener noreferrer">
        <Button variant="ghost" size="icon">
          <Github className="h-5 w-5" />
        </Button>
      </a>
      <a href="http://www.linkedin.com/in/musman78" target="_blank" rel="noopener noreferrer">
        <Button variant="ghost" size="icon">
          <Linkedin className="h-5 w-5" />
        </Button>
      </a>
      <a href="mailto:usmankousar772@gmail.com">
        <Button variant="ghost" size="icon">
          <Mail className="h-5 w-5" />
        </Button>
      </a>
    </div>
  </div>
</section>


      {/* About Section */}
<section id="about" className="container px-4 py-24">
  <div className="mx-auto max-w-3xl">
    <h2 className="text-3xl font-bold tracking-tighter mb-8 text-center">About Me</h2>
    <div className="grid gap-8 md:grid-cols-2 items-center">
      <div className="space-y-4">
        <p className="text-muted-foreground">
          I'm a dedicated Full Stack Web Developer with a focus on the MERN stack — MongoDB, Express.js, React, and Node.js.
          I enjoy building scalable and user-friendly applications, combining functionality with clean UI design.
        </p>
        <p className="text-muted-foreground">
          I'm constantly learning and experimenting with new technologies to improve my skill set.
          Whether it's building RESTful APIs or creating interactive front-end experiences, I’m always eager to take on new challenges.
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">React</Badge>
          <Badge variant="secondary">Node.js</Badge>
          <Badge variant="secondary">Express.js</Badge>
          <Badge variant="secondary">MongoDB</Badge>
          <Badge variant="secondary">JavaScript</Badge>
          <Badge variant="secondary">HTML</Badge>
          <Badge variant="secondary">CSS</Badge>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="relative w-64 h-64 rounded-full overflow-hidden bg-muted">
          <Image
            src="/placeholder.jpg?height=256&width=256" // ✅ Kept exactly as you had it
            alt="Muhammad Usman"
            width={256}
            height={256}
            className="object-cover"
          />
        </div>
      </div>
    </div>
  </div>
</section>


      {/* Skills Section */}
<section id="skills" className="container px-4 py-24 bg-muted/50">
  <div className="mx-auto max-w-4xl">
    <h2 className="text-3xl font-bold tracking-tighter mb-12 text-center">Skills & Technologies</h2>
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

      {/* Frontend */}
      <Card>
        <CardHeader className="text-center">
          <Code className="h-12 w-12 mx-auto mb-4 text-primary" />
          <CardTitle>Frontend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">React</Badge>
            <Badge variant="outline">JavaScript</Badge>
            <Badge variant="outline">Tailwind CSS</Badge>
            <Badge variant="outline">HTML</Badge>
            <Badge variant="outline">CSS</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Backend */}
      <Card>
        <CardHeader className="text-center">
          <Database className="h-12 w-12 mx-auto mb-4 text-primary" />
          <CardTitle>Backend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Node.js</Badge>
            <Badge variant="outline">Express.js</Badge>
            <Badge variant="outline">MongoDB</Badge>
            <Badge variant="outline">Firebase</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Design */}
      <Card>
        <CardHeader className="text-center">
          <Palette className="h-12 w-12 mx-auto mb-4 text-primary" />
          <CardTitle>Design</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Figma</Badge>
            <Badge variant="outline">UI/UX</Badge>
            <Badge variant="outline">Responsive Design</Badge>
            <Badge variant="outline">Wireframing</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Tools & Deployment */}
      <Card>
        <CardHeader className="text-center">
          <Globe className="h-12 w-12 mx-auto mb-4 text-primary" />
          <CardTitle>Tools & Deployment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Git</Badge>
            <Badge variant="outline">GitHub</Badge>
            <Badge variant="outline">Vercel</Badge>
            <Badge variant="outline">Render</Badge>
          </div>
        </CardContent>
      </Card>

    </div>
  </div>
</section>


{/* Projects Section */}
<section id="projects" className="container px-4 py-24">
  <div className="mx-auto max-w-4xl">
    <h2 className="text-3xl font-bold tracking-tighter mb-12 text-center">Featured Projects</h2>
    <div className="grid gap-8 md:grid-cols-2">

      {/* Project 1: ThinkBoard */}
      <div className="rounded-xl border p-6 shadow-sm bg-background">
        <h3 className="text-2xl font-semibold mb-2">ThinkBoard – MERN Notes App</h3>
        <p className="text-muted-foreground mb-4">
          A modern note-taking web app with markdown support, user authentication, and rate-limited APIs. Built using the MERN stack and deployed on Railway.
        </p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary">MongoDB</Badge>
          <Badge variant="secondary">Express.js</Badge>
          <Badge variant="secondary">React</Badge>
          <Badge variant="secondary">Node.js</Badge>
          <Badge variant="secondary">Tailwind CSS</Badge>
          <Badge variant="secondary">Railway</Badge>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <a href="https://github.com/mani78979/mern-thinkboard" target="_blank" rel="noopener noreferrer">
            <Button size="sm" variant="outline" className="gap-2 bg-transparent">
              <Github className="h-4 w-4" />
              Code
            </Button>
          </a>
          <a href="https://mern-thinkboard-production-56fc.up.railway.app/" target="_blank" rel="noopener noreferrer">
            <Button size="sm" className="gap-2">
              <ExternalLink className="h-4 w-4" />
              Live Demo
            </Button>
          </a>
        </div>
      </div>

      {/* Project 2: GeoSpatial Urbanization App */}
      <div className="rounded-xl border p-6 shadow-sm bg-background">
        <h3 className="text-2xl font-semibold mb-2">GeoSpatial Urbanization Analysis</h3>
        <p className="text-muted-foreground mb-4">
          A Flutter-based mobile app that analyzes urban sprawl using satellite imagery and predicts development patterns using TensorFlow Lite and Firebase.
        </p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary">Flutter</Badge>
          <Badge variant="secondary">Firebase</Badge>
          <Badge variant="secondary">TensorFlow Lite</Badge>
          <Badge variant="secondary">GeoSpatial</Badge>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <a href="https://github.com/mani78979/GeoSpatial-Analysis-for-Better-Urbanization-of-Faisalabad-City" target="_blank" rel="noopener noreferrer">
            <Button size="sm" variant="outline" className="gap-2 bg-transparent">
              <Github className="h-4 w-4" />
              Code
            </Button>
          </a>
        </div>
      </div>

    </div>
  </div>
</section>



    {/* Contact Section */}
<section id="contact" className="container px-4 py-24 bg-muted/50">
  <div className="mx-auto max-w-2xl text-center">
    <h2 className="text-3xl font-bold tracking-tighter mb-8">Get In Touch</h2>
    <p className="text-lg text-muted-foreground mb-8">
      I'm always open to exciting freelance work, collaboration, or full-time roles. Let’s connect and create something amazing together!
    </p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <a href="mailto:usmankousar772@gmail.com">
        <Button size="lg" className="gap-2">
          <Mail className="h-4 w-4" />
          usmankousar772@gmail.com
        </Button>
      </a>
      <a href="https://www.linkedin.com/in/musman78" target="_blank" rel="noopener noreferrer">
        <Button variant="outline" size="lg" className="gap-2 bg-transparent">
          <Linkedin className="h-4 w-4" />
          LinkedIn Profile
        </Button>
      </a>
    </div>
  </div>
</section>


    {/* Footer */}
<footer className="border-t py-8">
  <div className="container px-4">
    <div className="flex flex-col sm:flex-row justify-between items-center">
      <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Muhammad Usman. All rights reserved.</p>
      <div className="flex items-center space-x-4 mt-4 sm:mt-0">
        <a href="https://github.com/mani78979" target="_blank" rel="noopener noreferrer">
          <Button variant="ghost" size="icon">
            <Github className="h-4 w-4" />
          </Button>
        </a>
        <a href="https://www.linkedin.com/in/musman78" target="_blank" rel="noopener noreferrer">
          <Button variant="ghost" size="icon">
            <Linkedin className="h-4 w-4" />
          </Button>
        </a>
        <a href="mailto:usmankousar772@gmail.com">
          <Button variant="ghost" size="icon">
            <Mail className="h-4 w-4" />
          </Button>
        </a>
      </div>
    </div>
  </div>
</footer>

    </div>
  )
}
