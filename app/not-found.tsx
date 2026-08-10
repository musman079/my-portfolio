import Link from "next/link"

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center px-6"
      style={{ background: "hsl(224,50%,3%)" }}
    >
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(0,217,255,0.07) 0%, transparent 70%)",
        }}
      />
      <h1
        className="text-8xl font-black mb-4"
        style={{
          background: "linear-gradient(135deg, #00d9ff, #7c3aed)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        404
      </h1>
      <p className="text-xl text-white/60 mb-8">
        Oops — this page doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-xl font-semibold text-black transition-all duration-200"
        style={{
          background: "linear-gradient(135deg, #00d9ff, #7c3aed)",
          boxShadow: "0 8px 30px rgba(0,217,255,0.3)",
        }}
      >
        ← Back Home
      </Link>
    </div>
  )
}
