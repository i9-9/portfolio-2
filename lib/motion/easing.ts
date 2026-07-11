/** Content reveal — opacity, translateY (LIVEUP --ease-out-expo). */
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

/** Loader exit, nav slide — slow cinematic ease. */
export const EASE_CINEMATIC = [0.87, 0, 0.13, 1] as const;

/** LIVEUP mobile menu panel clip-path reveal — open slower, close unchanged. */
export const MOBILE_MENU_PANEL_OPEN_DURATION = 2.1;
export const MOBILE_MENU_PANEL_CLOSE_DURATION = 1.45;

/** Delay before nav links/lines start — after panel begins opening. */
export const MOBILE_MENU_CONTENT_DELAY =
  MOBILE_MENU_PANEL_OPEN_DURATION * 0.28;

/** Nav name color crossfade when mobile menu toggles. */
export const MOBILE_MENU_NAME_COLOR_DURATION = 1.55;
export const MOBILE_MENU_NAME_COLOR_DELAY = 0.15;

/** LIVEUP mobile menu toggle 3D flip. */
export const MOBILE_MENU_TOGGLE_DURATION = 0.95;
