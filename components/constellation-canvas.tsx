"use client";

import React, { useRef, useEffect } from "react";

export function ConstellationCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    interface Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
    }

    const COLORS = ["#f59e0b", "#06b6d4", "#10b981", "#ec4899", "#8b5cf6", "#38bdf8"];
    let nodes: Node[] = [];
    const mouse = { x: -1000, y: -1000, radiusSq: 14400 };
    let isVisible = true;

    const initNodes = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const count = window.innerWidth < 768 ? 20 : 45;
      nodes = [];
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 1.5 + 0.8,
          color: COLORS[i % COLORS.length],
        });
      }
    };

    initNodes();
    window.addEventListener("resize", initNodes, { passive: true });

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    observer.observe(canvas);

    let rafId: number;
    const maxDistSq = 12100;

    const draw = () => {
      if (isVisible) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < nodes.length; i++) {
          const ni = nodes[i];
          for (let j = i + 1; j < nodes.length; j++) {
            const nj = nodes[j];
            const dx = ni.x - nj.x;
            const dy = ni.y - nj.y;
            const distSq = dx * dx + dy * dy;
            if (distSq < maxDistSq) {
              const alpha = (1 - distSq / maxDistSq) * 0.22;
              ctx.beginPath();
              ctx.moveTo(ni.x, ni.y);
              ctx.lineTo(nj.x, nj.y);
              ctx.strokeStyle = `rgba(245, 158, 11, ${alpha})`;
              ctx.lineWidth = 0.6;
              ctx.stroke();
            }
          }
        }

        for (let i = 0; i < nodes.length; i++) {
          const n = nodes[i];

          const mdx = n.x - mouse.x;
          const mdy = n.y - mouse.y;
          const mDistSq = mdx * mdx + mdy * mdy;
          if (mDistSq < mouse.radiusSq && mDistSq > 0) {
            const mDist = Math.sqrt(mDistSq);
            const force = (1 - mDist / 120) * 1.2;
            n.x += (mdx / mDist) * force;
            n.y += (mdy / mDist) * force;
          }

          n.x += n.vx;
          n.y += n.vy;

          if (n.x < 0) n.x = canvas.width;
          if (n.x > canvas.width) n.x = 0;
          if (n.y < 0) n.y = canvas.height;
          if (n.y > canvas.height) n.y = 0;

          ctx.beginPath();
          ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
          ctx.fillStyle = n.color;
          ctx.fill();
        }
      }

      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", initNodes);
      window.removeEventListener("mousemove", handleMouseMove);
      observer.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, []);

  return <canvas ref={canvasRef} className="stars-canvas" />;
}
