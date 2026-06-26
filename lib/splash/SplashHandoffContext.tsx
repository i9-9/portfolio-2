"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useState,
  type ReactNode,
} from "react";
import { useReducedMotion } from "framer-motion";

export const SPLASH_SESSION_KEY = "v2-splash-seen";

type SplashHandoffContextValue = {
  handoff: boolean;
  notifyHandoff: () => void;
};

const SplashHandoffContext = createContext<SplashHandoffContextValue>({
  handoff: false,
  notifyHandoff: () => {},
});

export function SplashHandoffProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const [handoff, setHandoff] = useState(false);

  useLayoutEffect(() => {
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

  return (
    <SplashHandoffContext.Provider value={{ handoff, notifyHandoff }}>
      {children}
    </SplashHandoffContext.Provider>
  );
}

export function useSplashHandoff() {
  return useContext(SplashHandoffContext);
}
