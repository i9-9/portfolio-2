/** Content reveal — opacity, translateY. Apple-style smooth easing. */
export const EASE_OUT_EXPO = [0.32, 0.72, 0, 1] as const;

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
