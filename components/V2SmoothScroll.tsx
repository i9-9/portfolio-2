"use client";

import { useState, useEffect, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import Lenis from "lenis";

/**
 * Smooth scroll for the main landing route. Disabled when `prefers-reduced-motion` is set.
 * Imperative Lenis (not ReactLenis) + `resize()` after paint avoids a stuck scroll
 * when global `html,body{height:100%}` under-measures document height.
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

    const lenis = new Lenis({
      lerp: 0.085,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.15,
      smoothWheel: true,
      autoRaf: true,
      anchors: true,
    });

    const ro = new ResizeObserver(() => {
      lenis.resize();
    });
    ro.observe(document.body);

    const onLoad = () => lenis.resize();
    window.addEventListener("load", onLoad);

    const id = requestAnimationFrame(() => {
      lenis.resize();
    });

    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("load", onLoad);
      ro.disconnect();
      lenis.destroy();
    };
  }, [mounted, reducedMotion]);

  if (!mounted || reducedMotion === true) {
    return <>{children}</>;
  }

  return <>{children}</>;
}
