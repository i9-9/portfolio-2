"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useReducedMotion } from "framer-motion";

export const SPLASH_SESSION_KEY = "v2-splash-seen";

/** Hard cap so a stuck canvas never blocks the landing forever. */
export const SPLASH_MAX_MS = 3500;
/** Minimum dwell so the loader doesn’t flash. */
export const SPLASH_MIN_MS = 900;
/** Cap waiting on document.fonts.ready. */
export const SPLASH_FONT_CAP_MS = 1400;

type SplashHandoffContextValue = {
  handoff: boolean;
  notifyHandoff: () => void;
  /** Hero canvas / graphic collage (or static fallback) is usable. */
  heroVisualReady: boolean;
  notifyHeroVisualReady: () => void;
};

const SplashHandoffContext = createContext<SplashHandoffContextValue>({
  handoff: false,
  notifyHandoff: () => {},
  heroVisualReady: false,
  notifyHeroVisualReady: () => {},
});

export function SplashHandoffProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const [handoff, setHandoff] = useState(false);
  const [heroVisualReady, setHeroVisualReady] = useState(false);
  const heroReadyOnce = useRef(false);

  useLayoutEffect(() => {
    if (reduced === null) return;
    if (reduced) {
      setHandoff(true);
      return;
    }
    try {
      if (sessionStorage.getItem(SPLASH_SESSION_KEY) === "1") {
        setHandoff(true);
      }
    } catch {
      setHandoff(true);
    }
  }, [reduced]);

  const notifyHandoff = useCallback(() => setHandoff(true), []);

  const notifyHeroVisualReady = useCallback(() => {
    if (heroReadyOnce.current) return;
    heroReadyOnce.current = true;
    setHeroVisualReady(true);
  }, []);

  return (
    <SplashHandoffContext.Provider
      value={{
        handoff,
        notifyHandoff,
        heroVisualReady,
        notifyHeroVisualReady,
      }}
    >
      {children}
    </SplashHandoffContext.Provider>
  );
}

export function useSplashHandoff() {
  return useContext(SplashHandoffContext);
}
