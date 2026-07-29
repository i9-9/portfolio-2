/** Content reveal — opacity, translateY. Apple-style smooth easing. */
export const EASE_OUT_EXPO = [0.32, 0.72, 0, 1] as const;

/**
 * Golden-ratio bezier — control points at 1/φ (0.618) and 1/φ² (0.382).
 * Even, unhurried in/out for time-based reveals.
 */
export const EASE_GOLDEN = [0.618, 0, 0.382, 1] as const;

/**
 * Footer reveal travel. -100% = full counter-translation: the footer content
 * appears pinned behind the page while the section above scrolls away.
 * Lower it (e.g. "-38.2%") for a softer partial parallax instead of a pin.
 */
export const FOOTER_PARALLAX_TRAVEL = "-100%";

/**
 * Mobile parallax travel — reduced to -50% for better performance and less
 * visual jarring on smaller screens. Full -100% travel can cause jank on
 * mobile due to larger pixel distances and weaker GPUs.
 */
export const MOBILE_PARALLAX_TRAVEL = "-50%";

/** Loader exit, nav slide — slow cinematic ease. */
export const EASE_CINEMATIC = [0.87, 0, 0.13, 1] as const;

/** Mobile menu panel clip-path reveal — faster, more responsive. */
export const MOBILE_MENU_PANEL_OPEN_DURATION = 0.5;
export const MOBILE_MENU_PANEL_CLOSE_DURATION = 0.4;

/** Delay before nav links/lines start — after panel begins opening. */
export const MOBILE_MENU_CONTENT_DELAY =
  MOBILE_MENU_PANEL_OPEN_DURATION * 0.28;

/** Nav name color crossfade when mobile menu toggles. */
export const MOBILE_MENU_NAME_COLOR_DURATION = 0.45;
export const MOBILE_MENU_NAME_COLOR_DELAY = 0.1;

/** Mobile menu toggle 3D flip — faster, more responsive. */
export const MOBILE_MENU_TOGGLE_DURATION = 0.35;
