"use client";

import React, { useEffect, useMemo, useRef } from "react";

export interface SphereTag {
  label: string;
  color: string;
}

/**
 * Interactive 3D tag sphere.
 * Tags sit on a Fibonacci sphere, are rotated every frame and projected with
 * perspective. Hover steers it, drag spins it with inertia. Pure DOM
 * transforms (no WebGL) so the labels stay crisp and selectable.
 */
export function SkillSphere({ tags }: { tags: SphereTag[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const points = useMemo(() => {
    const n = tags.length;
    const golden = Math.PI * (3 - Math.sqrt(5));
    return tags.map((_, i) => {
      const y = n === 1 ? 0 : 1 - (i / (n - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const a = i * golden;
      return { x: Math.cos(a) * r, y, z: Math.sin(a) * r };
    });
  }, [tags]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || !points.length) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const BASE_X = reduced ? 0 : 0.0016;
    const BASE_Y = reduced ? 0 : 0.0032;

    let vx = BASE_X; // rotation around X axis (rad / frame)
    let vy = BASE_Y; // rotation around Y axis
    let targetVx = BASE_X;
    let targetVy = BASE_Y;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let visible = true;
    let raf = 0;
    let radius = wrap.clientWidth * 0.4;

    const ro = new ResizeObserver(() => {
      radius = wrap.clientWidth * 0.4;
    });
    ro.observe(wrap);

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(wrap);

    const onMove = (e: PointerEvent) => {
      if (dragging) {
        vy = (e.clientX - lastX) * 0.006;
        vx = -(e.clientY - lastY) * 0.006;
        lastX = e.clientX;
        lastY = e.clientY;
        return;
      }
      if (e.pointerType !== "mouse") return;
      const r = wrap.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      targetVy = nx * 0.03;
      targetVx = -ny * 0.03;
    };
    const onLeave = () => {
      targetVx = BASE_X;
      targetVy = BASE_Y;
    };
    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      if (e.pointerType === "mouse") {
        wrap.setPointerCapture(e.pointerId);
      }
      wrap.style.cursor = "grabbing";
    };
    const onUp = (e: PointerEvent) => {
      dragging = false;
      if (wrap.hasPointerCapture(e.pointerId)) wrap.releasePointerCapture(e.pointerId);
      wrap.style.cursor = "grab";
    };

    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);
    wrap.addEventListener("pointerdown", onDown);
    wrap.addEventListener("pointerup", onUp);
    wrap.addEventListener("pointercancel", onUp);

    const PERSPECTIVE = 2.6;

    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;

      if (!dragging) {
        vx += (targetVx - vx) * 0.04;
        vy += (targetVy - vy) * 0.04;
      }

      const cx = Math.cos(vx);
      const sx = Math.sin(vx);
      const cy = Math.cos(vy);
      const sy = Math.sin(vy);

      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        // rotate around Y, then X
        const x1 = p.x * cy + p.z * sy;
        const z1 = -p.x * sy + p.z * cy;
        const y1 = p.y * cx - z1 * sx;
        const z2 = p.y * sx + z1 * cx;
        p.x = x1;
        p.y = y1;
        p.z = z2;

        const el = itemRefs.current[i];
        if (!el) continue;
        const depth = PERSPECTIVE / (PERSPECTIVE - p.z); // >1 in front, <1 behind
        const scale = depth * 0.82;
        const front = (p.z + 1) / 2; // 0 back … 1 front
        el.style.transform = `translate3d(${(p.x * radius * depth).toFixed(1)}px, ${(
          p.y *
          radius *
          depth
        ).toFixed(1)}px, 0) translate(-50%, -50%) scale(${scale.toFixed(3)})`;
        el.style.opacity = (0.18 + front * 0.82).toFixed(2);
        el.style.zIndex = String(Math.round(front * 100));
        el.style.filter = front < 0.35 ? "blur(1px)" : "none";
      }
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
      wrap.removeEventListener("pointerdown", onDown);
      wrap.removeEventListener("pointerup", onUp);
      wrap.removeEventListener("pointercancel", onUp);
    };
  }, [points]);

  return (
    <div
      ref={wrapRef}
      className="skill-sphere"
      role="img"
      aria-label={`Skill sphere: ${tags.map((t) => t.label).join(", ")}`}
    >
      <div className="skill-sphere-glow" aria-hidden />
      <div className="skill-sphere-ring skill-sphere-ring-a" aria-hidden />
      <div className="skill-sphere-ring skill-sphere-ring-b" aria-hidden />
      {tags.map((tag, i) => (
        <span
          key={tag.label}
          ref={(el) => {
            itemRefs.current[i] = el;
          }}
          className="skill-sphere-tag"
          style={
            {
              "--tag": tag.color,
              opacity: 0,
            } as React.CSSProperties
          }
        >
          {tag.label}
        </span>
      ))}
    </div>
  );
}
