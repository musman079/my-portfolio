import Link from "next/link";
import { ArrowLeft, Terminal } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-6 relative overflow-hidden">
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(245,158,11,0.12), transparent 50%), radial-gradient(circle at 75% 75%, rgba(14,165,233,0.12), transparent 50%)",
        }}
      />
      <div className="glass-card rounded-3xl p-8 sm:p-12 max-w-lg w-full text-center border border-border">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono text-amber-500 border border-amber-500/30 bg-amber-500/10 mb-6">
          <Terminal className="w-3.5 h-3.5" />
          <span>HTTP 404 • ROUTE_NOT_FOUND</span>
        </div>

        <h1 className="text-6xl sm:text-7xl font-black tracking-tight gradient-text-animated mb-3">
          404
        </h1>
        <h2 className="text-xl sm:text-2xl font-bold mb-3">
          Page Not Found
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-8">
          The page you are looking for doesn&apos;t exist or has been moved.
          Head back to explore Muhammad Usman&apos;s projects and services.
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-black transition-transform hover:scale-105"
          style={{
            background: "linear-gradient(135deg,#f59e0b,#0ea5e9)",
          }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Portfolio
        </Link>
      </div>
    </main>
  );
}
