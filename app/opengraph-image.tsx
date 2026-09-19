import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Muhammad Usman – Full-Stack MERN & Next.js Architect";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "70px 80px",
          backgroundColor: "#080b14",
          backgroundImage:
            "radial-gradient(circle at 25% 25%, rgba(245, 158, 11, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(14, 165, 233, 0.15) 0%, transparent 50%)",
          fontFamily: "sans-serif",
          color: "#ffffff",
        }}
      >
        {/* Top Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "10px 20px",
              borderRadius: "999px",
              backgroundColor: "rgba(245, 158, 11, 0.1)",
              border: "1px solid rgba(245, 158, 11, 0.3)",
              color: "#fbbf24",
              fontSize: "18px",
              fontWeight: 600,
            }}
          >
            <span>★ 5.0 Rating on Fiverr</span>
            <span style={{ opacity: 0.5 }}>•</span>
            <span>Level 1 Seller</span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 18px",
              borderRadius: "999px",
              backgroundColor: "rgba(34, 197, 94, 0.12)",
              border: "1px solid rgba(34, 197, 94, 0.3)",
              color: "#4ade80",
              fontSize: "16px",
              fontWeight: 600,
            }}
          >
            <span
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: "#4ade80",
              }}
            />
            <span>Available for Hire</span>
          </div>
        </div>

        {/* Center Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              fontSize: "72px",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              background: "linear-gradient(135deg, #ffffff 40%, #f59e0b 80%, #0ea5e9 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            Muhammad Usman
          </div>

          <div
            style={{
              fontSize: "30px",
              fontWeight: 600,
              color: "#94a3b8",
              letterSpacing: "-0.01em",
            }}
          >
            Full-Stack MERN & Next.js 15 Architect
          </div>

          <div
            style={{
              fontSize: "20px",
              color: "#64748b",
              maxWidth: "850px",
              lineHeight: 1.4,
            }}
          >
            Crafting hyper-scalable web architectures, high-performance REST APIs, and Figma-precise React interfaces with 120 FPS micro-animations.
          </div>
        </div>

        {/* Bottom Tech Pills */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          {["MongoDB Atlas", "Express.js", "React 19", "Node.js", "Next.js 15", "TypeScript", "Tailwind CSS"].map(
            (tech) => (
              <div
                key={tech}
                style={{
                  padding: "8px 18px",
                  borderRadius: "12px",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  color: "#cbd5e1",
                  fontSize: "16px",
                  fontWeight: 500,
                }}
              >
                {tech}
              </div>
            )
          )}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
