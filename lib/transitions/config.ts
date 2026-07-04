import type { ProjectSlug } from "@/app/data/projects";

/** Visual language per project — maps identity to transition mechanics. */
export type ProjectTransitionVariant =
  | "letterbox" // Hey Bristol — whisper cinema bars + quiet logo settle
  | "curtain" // Kostüme — fashion runway lift
  | "curtainDown" // Reserved — editorial drop from top
  | "marquee" // El Desenfreno — centered wordmark on black
  | "slices" // Reserved — contact-sheet strips
  | "expand" // Reserved — quiet scale from row, full frame
  | "grid" // Reserved — architectural grid reveal
  | "typographic"; // Grupo Frali — wordmark fade + baseline settle

export const PROJECT_TRANSITION_VARIANT: Record<
  ProjectSlug,
  ProjectTransitionVariant
> = {
  heybristol: "letterbox",
  kostume: "curtain",
  ursulabenavidez: "typographic",
  desenfreno: "marquee",
  grupofrali: "typographic",
};

/** Solid backdrop behind the transition content. */
export type ProjectTransitionBackdrop = "white" | "black";

export const PROJECT_TRANSITION_BACKDROP: Record<
  ProjectSlug,
  ProjectTransitionBackdrop
> = {
  heybristol: "black",
  kostume: "white",
  ursulabenavidez: "white",
  desenfreno: "black",
  grupofrali: "white",
};

/** Optional logo sizing overrides — wide wordmarks need more horizontal room. */
export const PROJECT_TRANSITION_LOGO_CLASS: Partial<
  Record<ProjectSlug, string>
> = {
  grupofrali: "max-h-[min(14vh,56px)] max-w-[min(92vw,900px)]",
  heybristol: "max-h-[min(20vh,148px)] max-w-[min(78vw,480px)]",
  ursulabenavidez: "max-h-[min(9vh,44px)] max-w-[min(90vw,560px)]",
};

export const TRANSITION_EXIT_MS = 680;
/** Beat at full-bleed cover before route change. */
export const TRANSITION_FULLSCREEN_HOLD_MS = 160;
export const TRANSITION_ENTER_MS = 560;
export const TRANSITION_EASE = [0.76, 0, 0.24, 1] as const;

export const TRANSITION_SESSION_KEY = "portfolio-project-transition";
