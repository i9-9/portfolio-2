"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface SplashContextType {
  showSplash: boolean;
  setShowSplash: (show: boolean) => void;
}

const SplashContext = createContext<SplashContextType | undefined>(undefined);

export function SplashProvider({ children }: { children: ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);

  // Check sessionStorage to see if splash was already shown
  // Also disable splash on mobile devices for better UX
  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem("hasSeenSplash");
    const isMobile = window.innerWidth < 768;

    if (hasSeenSplash === "true" || isMobile) {
      setShowSplash(false);
    }
  }, []);

  return (
    <SplashContext.Provider value={{ showSplash, setShowSplash }}>
      {children}
    </SplashContext.Provider>
  );
}

export function useSplash() {
  const context = useContext(SplashContext);
  if (context === undefined) {
    throw new Error("useSplash must be used within a SplashProvider");
  }
  return context;
}
