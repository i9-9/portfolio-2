"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import type P5 from "p5";
import { cn } from "@/lib/utils";

type Dot = { bx: number; by: number; x: number; y: number; baseR: number };

/** Square grid halftone + pointer repel; DPR capped for sharp dots without 3× cost. */
export function HeroHalftoneP5({ className }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !wrapRef.current) return;

    const container = wrapRef.current;
    let disposed = false;
    let pInst: P5 | null = null;
    let ro: ResizeObserver | null = null;

    const pointer = { x: -99999, y: -99999 };

    const onPointer = (e: PointerEvent) => {
      const r = container.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
    };

    const onLeave = () => {
      pointer.x = -99999;
      pointer.y = -99999;
    };

    const dotFill = (p: P5) => {
      const raw = getComputedStyle(container).getPropertyValue("--foreground").trim();
      p.fill(raw ? `hsl(${raw} / 0.16)` : "rgba(0,0,0,0.16)");
    };

    void (async () => {
      const p5 = (await import("p5")).default;
      if (disposed) return;

      const deviceDpr = () => Math.min(2, window.devicePixelRatio || 1);

      const applyDpr = (p: P5) => {
        p.pixelDensity(deviceDpr());
        const ctx = (p as unknown as { drawingContext?: CanvasRenderingContext2D }).drawingContext;
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
        }
      };

      const SPACING = 17;
      const REPEL_RADIUS = 180;
      const REPEL_MAX = 52;
      /** Cap draw rate — halftone no necesita 60fps */
      const TARGET_FPS = 24;
      const EASE = 0.16;

      let dots: Dot[] = [];
      let cw = 0;
      let ch = 0;

      const rebuild = (p: P5) => {
        cw = Math.max(1, container.clientWidth);
        ch = Math.max(1, container.clientHeight);
        p.resizeCanvas(cw, ch);
        applyDpr(p);
        dots = [];
        const nx = Math.ceil(cw / SPACING) + 1;
        const ny = Math.ceil(ch / SPACING) + 1;
        for (let iy = 0; iy < ny; iy++) {
          for (let ix = 0; ix < nx; ix++) {
            const bx = ix * SPACING + SPACING * 0.5;
            const by = iy * SPACING + SPACING * 0.5;
            const t = Math.pow(by / ch, 0.72);
            const wobble = 0.88 + 0.12 * Math.sin(ix * 0.55 + iy * 0.31);
            const baseR = (p.lerp(0.75, 2.95, t) * wobble * SPACING) / 7.25;
            dots.push({ bx, by, x: bx, y: by, baseR });
          }
        }
      };

      const sketch = (p: P5) => {
        p.setup = () => {
          p.createCanvas(1, 1);
          const el = (p as unknown as { canvas?: HTMLCanvasElement }).canvas;
          el?.classList.add("block", "h-full", "w-full", "max-h-full", "max-w-full");
          rebuild(p);
          p.frameRate(TARGET_FPS);
        };

        p.draw = () => {
          p.clear();
          dotFill(p);
          p.noStroke();

          const mx = pointer.x;
          const my = pointer.y;
          const R = REPEL_RADIUS;
          const R2 = R * R;

          for (let i = 0; i < dots.length; i++) {
            const d = dots[i];
            let tx = d.bx;
            let ty = d.by;

            const dx = d.bx - mx;
            const dy = d.by - my;
            const d2 = dx * dx + dy * dy;
            if (d2 > 0 && d2 < R2) {
              const dist = Math.sqrt(d2);
              const f = (R - dist) / R;
              const push = f * f * REPEL_MAX;
              tx += (dx / dist) * push;
              ty += (dy / dist) * push;
            }

            d.x += (tx - d.x) * EASE;
            d.y += (ty - d.y) * EASE;
            p.circle(d.x, d.y, d.baseR * 2);
          }
        };
      };

      pInst = new p5(sketch, container);

      if (disposed) {
        pInst.remove();
        pInst = null;
        return;
      }

      window.addEventListener("pointermove", onPointer, { passive: true });
      container.addEventListener("pointerleave", onLeave);

      ro = new ResizeObserver(() => {
        if (pInst && !disposed) rebuild(pInst);
      });
      if (!disposed) ro.observe(container);
    })();

    return () => {
      disposed = true;
      ro?.disconnect();
      window.removeEventListener("pointermove", onPointer);
      container.removeEventListener("pointerleave", onLeave);
      pInst?.remove();
      pInst = null;
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <div
      ref={wrapRef}
      className={cn("absolute inset-0 overflow-hidden", className)}
      aria-hidden
    />
  );
}
