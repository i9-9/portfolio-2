"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { translations } from "./translations";

type Language = "en" | "es";

const LANG_STORAGE_KEY = "portfolio-lang";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

function readStoredLanguage(): Language {
  try {
    const stored = window.localStorage.getItem(LANG_STORAGE_KEY);
    if (stored === "en" || stored === "es") return stored;
  } catch {
    /* private mode / quota */
  }
  return "es";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("es");

  useLayoutEffect(() => {
    setLanguageState(readStoredLanguage());
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch {
      /* private mode / quota */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string) => {
    const keys = key.split(".");
    let value: unknown = translations[language];

    for (const k of keys) {
      if (value === undefined || value === null) return key;
      value = (value as Record<string, unknown>)[k];
    }

    return typeof value === "string" ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
