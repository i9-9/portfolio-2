"use client";

import { useState, useEffect, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Smooth scroll for layouts that wrap this provider (e.g. `/v2`). Disabled when `prefers-reduced-motion` is set.
 * Imperative Lenis (not ReactLenis) + `resize()` after paint avoids a stuck scroll
 * when global `html,body{height:100%}` under-measures document height.
 * Lenis is loaded asynchronously so it does not inflate the main layout bundle.
 */
export function V2SmoothScroll({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || reducedMotion === true) {
      return;
    }

    let lenis: import("lenis").default | null = null;
    let ro: ResizeObserver | null = null;
    let onLoad: (() => void) | null = null;
    let cancelled = false;
    let rafId: number | null = null;

    void import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;

      lenis = new Lenis({
        /** Higher lerp = closer to native scroll, less “floating” lag. */
        lerp: 0.14,
        wheelMultiplier: 1,
        touchMultiplier: 1.1,
        smoothWheel: true,
        autoRaf: true,
        anchors: true,
      });

      ro = new ResizeObserver(() => {
        lenis?.resize();
      });
      ro.observe(document.body);

      onLoad = () => lenis?.resize();
      window.addEventListener("load", onLoad);

      rafId = requestAnimationFrame(() => {
        lenis?.resize();
      });
    });

    return () => {
      cancelled = true;
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (onLoad) window.removeEventListener("load", onLoad);
      ro?.disconnect();
      lenis?.destroy();
      lenis = null;
      ro = null;
      onLoad = null;
    };
  }, [mounted, reducedMotion]);

  if (!mounted || reducedMotion === true) {
    return <>{children}</>;
  }

  return <>{children}</>;
}
