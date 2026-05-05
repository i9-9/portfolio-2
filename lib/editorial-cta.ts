import { cn } from "@/lib/utils";

/** One radius for all editorial CTAs — tweak only `radius` for consistency. */
const radius = "rounded-sm";

const shell = cn(
  "inline-flex items-center justify-center gap-2 font-helveticaNowTextRegular text-sm transition-colors duration-300 active:scale-[0.98]",
  radius,
);

/** Hero + case study footer — original `px-6 py-4`. */
const padComfortable = "px-6 py-4";

/** Contact row + case study header link — original `px-5 py-3`. */
const padCompact = "px-5 py-3";

const label = "uppercase tracking-[0.12em]";

type EditorialPad = "comfortable" | "compact";

function pad(size: EditorialPad) {
  return size === "compact" ? padCompact : padComfortable;
}

/** Solid on dark / foreground fill (e.g. Let’s talk, Send message, Live site footer). */
export function editorialPrimary(className?: string, size: EditorialPad = "comfortable") {
  return cn(shell, pad(size), label, "bg-foreground text-background hover:bg-foreground/90", className);
}

/** Outline with strong keyline — pairs with solid primary (e.g. See my work). */
export function editorialOutline(className?: string, size: EditorialPad = "comfortable") {
  return cn(
    shell,
    pad(size),
    label,
    "border border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-background",
    className,
  );
}

/** Muted outline — border-border, hover accent. */
export function editorialMuted(className?: string, size: EditorialPad = "comfortable") {
  return cn(
    shell,
    pad(size),
    "border border-border bg-background text-foreground hover:bg-accent",
    className,
  );
}

/** Muted + sentence case for long copy (email). */
export function editorialMutedReadable(className?: string, size: EditorialPad = "compact") {
  return cn(editorialMuted(undefined, size), "normal-case tracking-wide", className);
}

/** Uppercase label + muted border. */
export function editorialMutedLabel(className?: string, size: EditorialPad = "compact") {
  return cn(editorialMuted(undefined, size), label, className);
}
