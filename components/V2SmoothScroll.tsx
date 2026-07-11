"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "framer-motion";
import {
  SPLASH_SESSION_KEY,
  useSplashHandoff,
} from "@/lib/splash/SplashHandoffContext";
import {
  scrollToLandingHashWhenReady,
  landingHashId,
} from "@/lib/scroll/landingHash";
import { setLandingLenis, getLandingLenis } from "@/lib/scroll/lenisStore";

/**
 * Smooth scroll for layouts that wrap this provider (e.g. home). Disabled when `prefers-reduced-motion` is set.
 * Imperative Lenis (not ReactLenis) + `resize()` after paint avoids a stuck scroll
 * when global `html,body{height:100%}` under-measures document height.
 * Lenis is loaded asynchronously so it does not inflate the main layout bundle.
 */
export function V2SmoothScroll({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();
  const { handoff: splashHandoff } = useSplashHandoff();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [lenisReady, setLenisReady] = useState(false);
  const lenisRef = useRef<import("lenis").default | null>(null);

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
      lenisRef.current = lenis;
      setLandingLenis(lenis);
      setLenisReady(true);

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
      lenisRef.current = null;
      setLandingLenis(null);
      setLenisReady(false);
    };
  }, [mounted, reducedMotion]);

  // Scroll to #section after splash, dynamic import, or when returning from /work/*
  useEffect(() => {
    if (!mounted || pathname !== "/") return;

    const hash = window.location.hash;
    if (!hash) return;

    let skipSplash = false;
    try {
      skipSplash = sessionStorage.getItem(SPLASH_SESSION_KEY) === "1";
    } catch {
      skipSplash = false;
    }

    const splashReady =
      reducedMotion === true || splashHandoff || skipSplash;
    if (!splashReady) return;

    const currentLenis = () => lenisRef.current ?? getLandingLenis();

    // Soft-nav from /work/*: Next scroll-to-top cancels animated Lenis — use reliable/instant.
    const cancelScroll = scrollToLandingHashWhenReady(hash, {
      getLenis: currentLenis,
      reducedMotion: reducedMotion === true,
      reliable: true,
    });

    const scrollHash = (next: string, { reliable }: { reliable: boolean }) => {
      scrollToLandingHashWhenReady(next, {
        getLenis: currentLenis,
        reducedMotion:
          reducedMotion === true || landingHashId(next) === "contact",
        reliable: reliable || landingHashId(next) === "contact",
      });
    };

    // Soft-nav from /work/* often sets the hash without firing hashchange.
    // Re-run when the portfolio chunk mounts and dispatches this.
    const onLandingReady = () => {
      const next = window.location.hash;
      if (!next) return;
      scrollHash(next, { reliable: true });
    };

    const onHashChange = () => {
      const next = window.location.hash;
      if (!next) return;
      // Same-page hash changes can animate; contact stays instant.
      scrollHash(next, { reliable: landingHashId(next) === "contact" });
    };

    window.addEventListener("hashchange", onHashChange);
    window.addEventListener("landing:sections-ready", onLandingReady);
    return () => {
      cancelScroll();
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("landing:sections-ready", onLandingReady);
    };
  }, [mounted, pathname, reducedMotion, splashHandoff, lenisReady]);

  return <>{children}</>;
}
