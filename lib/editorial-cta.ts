import { cn } from "@/lib/utils";

/** One radius for all editorial CTAs — tweak only `radius` for consistency. */
const radius = "rounded-sm";

/** Hero + case study footer — original `px-6 py-4`. */
const padComfortable = "px-6 py-4";

/** Contact row + case study header link — original `px-5 py-3`. */
const padCompact = "px-5 py-3";

/** Nav + contact footer — Display Bold, normal case, shared scale. */
export const editorialNavType = cn(
  "font-helveticaNowDisplayBold normal-case tracking-[-0.02em] text-nav-link",
);

type EditorialPad = "comfortable" | "compact";

function pad(size: EditorialPad) {
  return size === "compact" ? padCompact : padComfortable;
}

/** Contact footer pair — shared layout/size for mail + message buttons. */
export const contactFooterButtonStructure = cn(
  "flex h-11 w-full min-w-0 max-w-full items-center justify-start gap-2 overflow-hidden text-left sm:w-auto",
  editorialNavType,
);

/** Muted outline — nav editorial style (contact footer mail). */
export function editorialFooterMuted(className?: string) {
  return cn(
    radius,
    padCompact,
    contactFooterButtonStructure,
    "border border-border bg-background text-foreground transition-colors duration-300 active:scale-[0.98] hover:bg-accent",
    className,
  );
}

/** Solid fill — nav editorial style (contact footer message). */
export function editorialFooterPrimary(className?: string) {
  return cn(
    radius,
    padCompact,
    contactFooterButtonStructure,
    "border border-transparent bg-foreground text-background transition-colors duration-300 active:scale-[0.98] hover:bg-foreground/90",
    className,
  );
}

const editorialButtonBase = cn(
  "inline-flex items-center justify-center gap-2",
  editorialNavType,
  radius,
  "transition-colors duration-300 active:scale-[0.98]",
);

/** Solid CTA — nav editorial style (case study, inline actions). */
export function editorialNavPrimary(className?: string, size: EditorialPad = "comfortable") {
  return cn(
    editorialButtonBase,
    pad(size),
    "border border-transparent bg-foreground text-background hover:bg-foreground/90",
    className,
  );
}

/** Outline CTA — nav editorial style. */
export function editorialNavOutline(className?: string, size: EditorialPad = "comfortable") {
  return cn(
    editorialButtonBase,
    pad(size),
    "border border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-background",
    className,
  );
}

/** Muted outline CTA — nav editorial style. */
export function editorialNavMuted(className?: string, size: EditorialPad = "compact") {
  return cn(
    editorialButtonBase,
    pad(size),
    "border border-border bg-background text-foreground hover:bg-accent",
    className,
  );
}
