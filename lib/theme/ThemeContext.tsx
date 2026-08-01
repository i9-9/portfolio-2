"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { flushSync } from 'react-dom';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: (origin?: { x: number; y: number }) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/** Keep in sync with `--theme-transition-duration` in globals.css */
const THEME_TRANSITION_MS = 520;

type ViewTransitionLike = {
  finished: Promise<void>;
};

function applyThemeClass(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function startThemeViewTransition(update: () => void): ViewTransitionLike | null {
  const doc = document as Document & {
    startViewTransition?: (cb: () => void) => ViewTransitionLike;
  };
  if (typeof doc.startViewTransition !== 'function' || prefersReducedMotion()) {
    return null;
  }
  return doc.startViewTransition(update);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');

  useEffect(() => {
    applyThemeClass(theme);
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
  }, []);

  const toggleTheme = useCallback(
    (origin?: { x: number; y: number }) => {
      const next: Theme = theme === 'dark' ? 'light' : 'dark';
      const root = document.documentElement;
      const x = origin?.x ?? window.innerWidth / 2;
      const y = origin?.y ?? window.innerHeight / 2;
      const radius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      );

      root.style.setProperty('--theme-tx', `${x}px`);
      root.style.setProperty('--theme-ty', `${y}px`);
      root.style.setProperty('--theme-tr', `${Math.ceil(radius)}px`);

      const apply = () => {
        flushSync(() => {
          setThemeState(next);
        });
        applyThemeClass(next);
      };

      const transition = startThemeViewTransition(apply);
      if (transition) {
        root.dataset.themeTransition = 'reveal';
        void transition.finished.finally(() => {
          delete root.dataset.themeTransition;
          root.style.removeProperty('--theme-tx');
          root.style.removeProperty('--theme-ty');
          root.style.removeProperty('--theme-tr');
        });
        return;
      }

      root.classList.add('theme-transition');
      apply();
      window.setTimeout(() => {
        root.classList.remove('theme-transition');
        root.style.removeProperty('--theme-tx');
        root.style.removeProperty('--theme-ty');
        root.style.removeProperty('--theme-tr');
      }, THEME_TRANSITION_MS);
    },
    [theme],
  );

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
