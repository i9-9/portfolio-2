import type { ProjectSlug } from "@/app/data/projects";

/** Visual language per project — maps identity to transition mechanics. */
export type ProjectTransitionVariant =
  | "letterbox" // Hey Bristol — cinema / video production
  | "curtain" // Kostüme — fashion runway lift
  | "curtainDown" // El Desenfreno — editorial drop from top
  | "slices" // Ursula Benavidez — motion frames
  | "expand" // Templo de Tierra — quiet scale from row, full frame
  | "grid" // Reserved — architectural grid reveal
  | "typographic"; // Grupo Frali — wordmark fade + baseline settle

export const PROJECT_TRANSITION_VARIANT: Record<
  ProjectSlug,
  ProjectTransitionVariant
> = {
  heybristol: "letterbox",
  kostume: "curtain",
  ursulabenavidez: "slices",
  templodetierra: "expand",
  desenfreno: "curtainDown",
  grupofrali: "typographic",
};

/** Backdrop behind the transition logo. */
export type ProjectTransitionBackdrop = "blur" | "white";

export const PROJECT_TRANSITION_BACKDROP: Record<
  ProjectSlug,
  ProjectTransitionBackdrop
> = {
  heybristol: "blur",
  kostume: "blur",
  ursulabenavidez: "white",
  templodetierra: "blur",
  desenfreno: "blur",
  grupofrali: "blur",
};

/** Optional logo sizing overrides — wide wordmarks need more horizontal room. */
export const PROJECT_TRANSITION_LOGO_CLASS: Partial<
  Record<ProjectSlug, string>
> = {
  grupofrali: "max-h-[min(14vh,56px)] max-w-[min(92vw,900px)]",
  templodetierra: "max-h-[min(10vh,56px)] max-w-[min(28vw,120px)]",
};

export const TRANSITION_EXIT_MS = 680;
/** Beat at full-bleed cover before route change. */
export const TRANSITION_FULLSCREEN_HOLD_MS = 160;
export const TRANSITION_ENTER_MS = 560;
export const TRANSITION_EASE = [0.76, 0, 0.24, 1] as const;

export const TRANSITION_SESSION_KEY = "portfolio-project-transition";
