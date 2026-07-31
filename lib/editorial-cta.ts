import { cn } from "@/lib/utils";

/** Square corners — Swiss / International Style. */
const radius = "";

/**
 * Type-box pad — same recipe as the name, nav labels, and section titles.
 * Em-based so the inked box sits almost flush on the glyphs.
 * glyph-center trims to cap→baseline — single-line only (no descenders).
 */
export const editorialTypeBox = "glyph-center px-[0.15em] py-[0.12em]";

/**
 * Multi-line type-box — no baseline trim; slight extra bottom for descenders
 * (e.g. “g” in Argentina) without floating away from the inked edge.
 */
export const editorialTypeBoxBlock = "px-[0.15em] pt-[0.12em] pb-[0.2em]";

/**
 * Contact kicker — Display Bold phrase with optical tracking (see globals).
 */
export const contactKickerType = cn(
  editorialTypeBoxBlock,
  "contact-kicker inline-block bg-foreground text-background font-helveticaNowDisplayBold normal-case text-type-project",
);

/** Larger hit pad — case study footer CTAs only. */
const padComfortable = "px-6 py-4";

/** Display Bold + φ step --type-nav-link. */
export const editorialNavType = cn(
  "font-helveticaNowDisplayBold normal-case tracking-[-0.02em] text-nav-link",
);

type EditorialPad = "comfortable" | "type";

function pad(size: EditorialPad) {
  return size === "type" ? editorialTypeBox : padComfortable;
}

const editorialButtonBase = cn(
  "inline-flex items-center justify-center gap-2",
  editorialNavType,
  radius,
  "transition-colors duration-300",
);

/**
 * Full-width contact rail — box spans the cell; pad stays type-tight.
 */
export const editorialRail = cn(
  "flex w-full min-w-0 justify-start overflow-hidden text-left",
);

/** Solid type-box — name / title language (contact message, socials, case study). */
export function editorialNavPrimary(
  className?: string,
  size: EditorialPad = "comfortable",
) {
  return cn(
    editorialButtonBase,
    pad(size),
    "border border-transparent bg-foreground text-background hover:bg-foreground/90",
    className,
  );
}

/** Outline type-box. */
export function editorialNavOutline(
  className?: string,
  size: EditorialPad = "comfortable",
) {
  return cn(
    editorialButtonBase,
    pad(size),
    "border border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-background",
    className,
  );
}

/** Muted type-box — contact mail, secondary actions. Default = name-tight. */
export function editorialNavMuted(
  className?: string,
  size: EditorialPad = "type",
) {
  return cn(
    editorialButtonBase,
    pad(size),
    "border border-border bg-background text-foreground hover:bg-accent",
    className,
  );
}
