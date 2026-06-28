"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { useReducedMotion } from "framer-motion";
import type { ProjectSlug } from "@/app/data/projects";
import {
  TRANSITION_ENTER_MS,
  TRANSITION_EXIT_MS,
  TRANSITION_FULLSCREEN_HOLD_MS,
  TRANSITION_SESSION_KEY,
} from "./config";

export type TransitionPhase = "idle" | "exit" | "enter";

export type TransitionOrigin = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type TransitionState = {
  phase: TransitionPhase;
  slug: ProjectSlug | null;
  previewImage: string | null;
  origin: TransitionOrigin | null;
};

type ProjectTransitionContextValue = {
  phase: TransitionPhase;
  slug: ProjectSlug | null;
  previewImage: string | null;
  origin: TransitionOrigin | null;
  isTransitioning: boolean;
  navigateToProject: (
    slug: ProjectSlug,
    previewImage: string,
    origin?: TransitionOrigin,
  ) => void;
};

const idleState: TransitionState = {
  phase: "idle",
  slug: null,
  previewImage: null,
  origin: null,
};

const ProjectTransitionContext =
  createContext<ProjectTransitionContextValue>({
    phase: "idle",
    slug: null,
    previewImage: null,
    origin: null,
    isTransitioning: false,
    navigateToProject: () => {},
  });

export function ProjectTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const [state, setState] = useState<TransitionState>(idleState);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const enterTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingSlugRef = useRef<ProjectSlug | null>(null);

  const clearTimers = useCallback(() => {
    if (exitTimerRef.current) {
      clearTimeout(exitTimerRef.current);
      exitTimerRef.current = null;
    }
    if (enterTimerRef.current) {
      clearTimeout(enterTimerRef.current);
      enterTimerRef.current = null;
    }
  }, []);

  const finishEnter = useCallback(() => {
    enterTimerRef.current = setTimeout(() => {
      setState(idleState);
      pendingSlugRef.current = null;
    }, TRANSITION_ENTER_MS);
  }, []);

  const navigateToProject = useCallback(
    (slug: ProjectSlug, previewImage: string, origin?: TransitionOrigin) => {
      if (reducedMotion) {
        router.push(`/work/${slug}`);
        return;
      }

      clearTimers();
      pendingSlugRef.current = slug;

      const fallbackOrigin: TransitionOrigin = {
        x: window.innerWidth / 2 - 192,
        y: window.innerHeight / 2 - 120,
        width: 384,
        height: 240,
      };

      setState({
        phase: "exit",
        slug,
        previewImage,
        origin: origin ?? fallbackOrigin,
      });

      exitTimerRef.current = setTimeout(() => {
        try {
          sessionStorage.setItem(TRANSITION_SESSION_KEY, slug);
        } catch {
          /* ignore */
        }
        router.push(`/work/${slug}`);
      }, TRANSITION_EXIT_MS + TRANSITION_FULLSCREEN_HOLD_MS);
    },
    [clearTimers, reducedMotion, router],
  );

  // After route change: play enter on the matching case study.
  useEffect(() => {
    if (!pathname.startsWith("/work/")) return;

    const routeSlug = pathname.replace("/work/", "") as ProjectSlug;
    let pending: string | null = null;
    try {
      pending = sessionStorage.getItem(TRANSITION_SESSION_KEY);
    } catch {
      pending = pendingSlugRef.current;
    }

    if (pending !== routeSlug) return;

    try {
      sessionStorage.removeItem(TRANSITION_SESSION_KEY);
    } catch {
      /* ignore */
    }

    setState((prev) =>
      prev.slug === routeSlug && prev.previewImage
        ? { ...prev, phase: "enter" }
        : prev,
    );
    finishEnter();
  }, [pathname, finishEnter]);

  // Lock scroll while the overlay is active.
  useEffect(() => {
    if (state.phase === "idle") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [state.phase]);

  useEffect(() => clearTimers, [clearTimers]);

  const isTransitioning = state.phase !== "idle";

  return (
    <ProjectTransitionContext.Provider
      value={{
        phase: state.phase,
        slug: state.slug,
        previewImage: state.previewImage,
        origin: state.origin,
        isTransitioning,
        navigateToProject,
      }}
    >
      {children}
    </ProjectTransitionContext.Provider>
  );
}

export function useProjectTransition() {
  return useContext(ProjectTransitionContext);
}
