"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { languageFromBrowser, type Language } from "./detectLanguage";
import { translations } from "./translations";

const LANG_STORAGE_KEY = "portfolio-lang";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

function readStoredLanguage(): Language | null {
  try {
    const stored = window.localStorage.getItem(LANG_STORAGE_KEY);
    if (stored === "en" || stored === "es") return stored;
  } catch {
    /* private mode / quota */
  }
  return null;
}

function persistLanguage(lang: Language) {
  try {
    window.localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch {
    /* private mode / quota */
  }
}

async function languageFromGeo(): Promise<Language> {
  try {
    const res = await fetch("/api/locale");
    if (!res.ok) return "en";
    const data = (await res.json()) as { language?: string };
    return data.language === "es" ? "es" : "en";
  } catch {
    return "en";
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("es");

  useLayoutEffect(() => {
    const stored = readStoredLanguage();
    if (stored) {
      setLanguageState(stored);
      return;
    }

    const fromBrowser = languageFromBrowser();
    if (fromBrowser) {
      setLanguageState(fromBrowser);
      persistLanguage(fromBrowser);
    }
  }, []);

  useEffect(() => {
    if (readStoredLanguage()) return;

    const fromBrowser = languageFromBrowser();
    if (fromBrowser) return;

    let cancelled = false;
    void languageFromGeo().then((lang) => {
      if (cancelled || readStoredLanguage()) return;
      setLanguageState(lang);
      persistLanguage(lang);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    persistLanguage(lang);
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
