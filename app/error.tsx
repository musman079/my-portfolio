"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error boundary:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-6 relative overflow-hidden">
      <div className="glass-card rounded-3xl p-8 sm:p-12 max-w-lg w-full text-center border border-border">
        <div className="w-14 h-14 rounded-2xl mx-auto mb-6 flex items-center justify-center bg-amber-500/10 border border-amber-500/30 text-amber-500">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-3">
          Something went wrong
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed mb-8">
          An unexpected error occurred while rendering this view. You can try
          reloading the section or return to the homepage.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-black transition-transform hover:scale-105"
            style={{
              background: "linear-gradient(135deg,#f59e0b,#0ea5e9)",
            }}
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border border-border bg-card hover:border-amber-500/40 transition-colors"
          >
            <Home className="w-4 h-4" />
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}

