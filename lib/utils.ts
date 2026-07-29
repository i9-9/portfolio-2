import { ClassValue, clsx } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

/**
 * Custom type-scale utilities live under `text-*` but set font-size, not color.
 * Without registering them, twMerge treats e.g. `text-type-project` as a color
 * and drops `text-background` / `text-foreground`.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        "text-name-nav",
        "text-name-hero",
        "text-hero-subtitle",
        "text-nav-link",
        "text-type-micro",
        "text-type-grid-label",
        "text-type-grid-num",
        "text-type-0",
        "text-type-3",
        "text-type-project",
        "text-type-project-subtitle",
        "text-type-case-title",
        "text-type-body",
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
