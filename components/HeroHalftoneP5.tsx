"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import type P5 from "p5";
import { cn } from "@/lib/utils";

type Dot = {
  bx: number;
  by: number;
  x: number;
  y: number;
  baseR: number;
};

/** Square grid halftone + φ-scaled pointer whisper; DPR capped for sharp dots. */
export function HeroHalftoneP5({
  className,
  onReady,
}: {
  className?: string;
  onReady?: () => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;

  useEffect(() => {
    if (reduced) {
      onReadyRef.current?.();
      return;
    }
    if (!wrapRef.current) return;

    const container = wrapRef.current;
    let disposed = false;
    let pInst: P5 | null = null;
    let ro: ResizeObserver | null = null;
    let viewportIo: IntersectionObserver | null = null;
    let onVisibility: (() => void) | null = null;
    let heroIntersecting = true;

    const pointer = { x: -99999, y: -99999 };

    const syncDrawing = () => {
      if (!pInst || disposed) return;
      if (document.hidden || !heroIntersecting) {
        pInst.noLoop();
      } else {
        pInst.loop();
      }
    };

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

      /** p5 v2 starts asynchronously (#_start); ResizeObserver can fire before _renderer exists. */
      const hasRenderer = (p: P5 | null | undefined) =>
        Boolean(p && (p as unknown as { _renderer?: unknown })._renderer);

      const applyDpr = (p: P5) => {
        if (!hasRenderer(p)) return;
        p.pixelDensity(deviceDpr());
        const ctx = (p as unknown as { drawingContext?: CanvasRenderingContext2D }).drawingContext;
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
        }
      };

      /**
       * φ numerology — mirrors `--phi` / type scale in globals.css.
       * Tight editorial stamp: small field, micro push, crisp falloff.
       */
      const PHI = 1.6180339887;
      const PHI2 = PHI * PHI;
      const PHI3 = PHI2 * PHI;
      const TYPE_BASE_PX = 14; // --type-base
      const SPACING = TYPE_BASE_PX * Math.sqrt(PHI); // ≈ 17.81
      /** Influence field — spacing × φ³ (~4 cells); local, graphic */
      const REPEL_RADIUS = SPACING * PHI3;
      /** Max radial push — spacing × φ (~1.6 cells); present without excess */
      const REPEL_MAX = SPACING * PHI;
      /** Cap draw rate — halftone no necesita 60fps */
      const TARGET_FPS = 24;
      /** Cursor + dots: exponential ease, 1/√φ — snappy, no bounce */
      const POINTER_LERP = 1 / Math.sqrt(PHI);
      const DOT_LERP = 1 / Math.sqrt(PHI);

      let dots: Dot[] = [];
      let cw = 0;
      let ch = 0;

      const rebuild = (p: P5) => {
        if (!hasRenderer(p) || disposed) return;
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
        let smx = pointer.x;
        let smy = pointer.y;
        let signaledReady = false;

        p.setup = () => {
          p.createCanvas(1, 1);
          const el = (p as unknown as { canvas?: HTMLCanvasElement }).canvas;
          el?.classList.add("block", "h-full", "w-full", "max-h-full", "max-w-full");
          rebuild(p);
          smx = pointer.x;
          smy = pointer.y;
          p.frameRate(TARGET_FPS);
        };

        p.draw = () => {
          p.clear();
          dotFill(p);
          p.noStroke();

          smx += (pointer.x - smx) * POINTER_LERP;
          smy += (pointer.y - smy) * POINTER_LERP;

          const mx = smx;
          const my = smy;
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
              /** Ease by φ — crisp rim without killing the core push */
              const t = 1 - dist / R;
              const f = Math.pow(t, PHI);
              const push = f * REPEL_MAX;
              tx += (dx / dist) * push;
              ty += (dy / dist) * push;
            }

            d.x += (tx - d.x) * DOT_LERP;
            d.y += (ty - d.y) * DOT_LERP;

            p.circle(d.x, d.y, d.baseR * 2);
          }

          if (!signaledReady && !disposed) {
            signaledReady = true;
            onReadyRef.current?.();
          }
        };
      };

      pInst = new p5(sketch, container);

      if (disposed) {
        pInst.remove();
        pInst = null;
        return;
      }

      viewportIo = new IntersectionObserver(
        (entries) => {
          heroIntersecting = entries[0]?.isIntersecting ?? true;
          syncDrawing();
        },
        { threshold: 0, rootMargin: "64px 0px" },
      );
      viewportIo.observe(container);

      onVisibility = () => syncDrawing();
      document.addEventListener("visibilitychange", onVisibility);

      window.addEventListener("pointermove", onPointer, { passive: true });
      container.addEventListener("pointerleave", onLeave);

      ro = new ResizeObserver(() => {
        requestAnimationFrame(() => {
          if (disposed || !pInst) return;
          rebuild(pInst);
        });
      });
      // Defer observe: synchronous RO callbacks can run before p5 #_start creates the renderer.
      requestAnimationFrame(() => {
        if (!disposed && pInst && wrapRef.current === container) ro?.observe(container);
      });

      syncDrawing();

      if (disposed) {
        viewportIo?.disconnect();
        viewportIo = null;
        if (onVisibility) {
          document.removeEventListener("visibilitychange", onVisibility);
          onVisibility = null;
        }
        ro?.disconnect();
        ro = null;
        window.removeEventListener("pointermove", onPointer);
        container.removeEventListener("pointerleave", onLeave);
        pInst?.remove();
        pInst = null;
      }
    })();

    return () => {
      disposed = true;
      viewportIo?.disconnect();
      viewportIo = null;
      if (onVisibility) {
        document.removeEventListener("visibilitychange", onVisibility);
        onVisibility = null;
      }
      ro?.disconnect();
      window.removeEventListener("pointermove", onPointer);
      container.removeEventListener("pointerleave", onLeave);
      pInst?.remove();
      pInst = null;
    };
  }, [reduced]);

  /** Static grid matches p5 pitch (type-base × √φ) when motion is reduced. */
  if (reduced) {
    const spacingPx = 14 * Math.sqrt(1.6180339887);
    return (
      <div
        className={cn("absolute inset-0 overflow-hidden", className)}
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle at center, hsl(var(--foreground) / 0.16) 1.1px, transparent 1.2px)",
          backgroundSize: `${spacingPx}px ${spacingPx}px`,
        }}
      />
    );
  }

  return (
    <div
      ref={wrapRef}
      className={cn("absolute inset-0 overflow-hidden", className)}
      aria-hidden
    />
  );
}
