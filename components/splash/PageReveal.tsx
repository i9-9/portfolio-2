"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  SPLASH_SESSION_KEY,
  useSplashHandoff,
} from "@/lib/splash/SplashHandoffContext";
import { EASE_CINEMATIC } from "@/lib/motion/easing";
import { LinesLoader } from "@/components/splash/LinesLoader";

const SPLASH_EXIT_MS = 950;
const SPLASH_LOAD_MS = 1400;

/** Loader: horizontal lines sweep left → right, then waits for fonts (capped). */
export function PageReveal() {
  const reduced = useReducedMotion();
  const { notifyHandoff } = useSplashHandoff();
  const handoffRef = useRef(notifyHandoff);
  handoffRef.current = notifyHandoff;

  const [done, setDone] = useState(false);

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

    const FONT_WAIT_CAP_MS = 1400;
    let cancelled = false;

    const finishSplash = () => {
      if (cancelled) return;
      try {
        window.sessionStorage.setItem(SPLASH_SESSION_KEY, "1");
      } catch {
        /* private mode / quota */
      }
      handoffRef.current?.();
      setDone(true);
    };

    const loadTimer = setTimeout(() => {
      const cap = new Promise<void>((r) => {
        setTimeout(r, FONT_WAIT_CAP_MS);
      });
      void Promise.race([fontsP, cap]).finally(finishSplash);
    }, SPLASH_LOAD_MS);

    return () => {
      cancelled = true;
      clearTimeout(loadTimer);
    };
  }, [reduced]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[10000] bg-background select-none"
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
