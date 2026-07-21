"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  SPLASH_FONT_CAP_MS,
  SPLASH_MAX_MS,
  SPLASH_MIN_MS,
  SPLASH_SESSION_KEY,
  useSplashHandoff,
} from "@/lib/splash/SplashHandoffContext";
import { EASE_CINEMATIC } from "@/lib/motion/easing";
import { LinesLoader } from "@/components/splash/LinesLoader";

const SPLASH_EXIT_MS = 950;

/** Real loader: lines UI until fonts + hero visual are ready (min dwell, hard cap). */
export function PageReveal() {
  const reduced = useReducedMotion();
  const { notifyHandoff, heroVisualReady } = useSplashHandoff();
  const handoffRef = useRef(notifyHandoff);
  handoffRef.current = notifyHandoff;

  const [done, setDone] = useState(false);
  const [minDone, setMinDone] = useState(false);
  const [fontsDone, setFontsDone] = useState(false);
  const [capped, setCapped] = useState(false);
  const finishedRef = useRef(false);

  // Skip splash before first paint when reduced motion or already seen this session.
  useLayoutEffect(() => {
    if (reduced === null) return;
    let skipSession = false;
    try {
      skipSession =
        typeof window !== "undefined" &&
        window.sessionStorage.getItem(SPLASH_SESSION_KEY) === "1";
    } catch {
      skipSession = false;
    }
    if (!reduced && !skipSession) return;
    handoffRef.current?.();
    setDone(true);
  }, [reduced]);

  useEffect(() => {
    if (reduced !== false) return;

    let skipSession = false;
    try {
      skipSession = window.sessionStorage.getItem(SPLASH_SESSION_KEY) === "1";
    } catch {
      skipSession = false;
    }
    if (skipSession) return;

    const fontsP =
      typeof document !== "undefined" && document.fonts?.ready
        ? document.fonts.ready.catch(() => undefined)
        : Promise.resolve(undefined);

    const minTimer = setTimeout(() => setMinDone(true), SPLASH_MIN_MS);
    const maxTimer = setTimeout(() => setCapped(true), SPLASH_MAX_MS);
    const fontCap = new Promise<void>((r) => {
      setTimeout(r, SPLASH_FONT_CAP_MS);
    });

    void Promise.race([fontsP, fontCap]).finally(() => setFontsDone(true));

    return () => {
      clearTimeout(minTimer);
      clearTimeout(maxTimer);
    };
  }, [reduced]);

  useEffect(() => {
    if (done || finishedRef.current) return;
    if (reduced !== false) return;

    const ready =
      capped || (minDone && fontsDone && heroVisualReady);
    if (!ready) return;

    finishedRef.current = true;
    try {
      window.sessionStorage.setItem(SPLASH_SESSION_KEY, "1");
    } catch {
      /* private mode / quota */
    }
    handoffRef.current?.();
    setDone(true);
  }, [done, reduced, minDone, fontsDone, heroVisualReady, capped]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[10000] min-h-dvh bg-background select-none"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: SPLASH_EXIT_MS / 1000, ease: EASE_CINEMATIC }}
          role="status"
          aria-label="Loading"
        >
          <LinesLoader />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
