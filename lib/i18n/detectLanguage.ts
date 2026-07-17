export type Language = "en" | "es";

/** Prefer Spanish/English from the browser; null → use geo fallback. */
export function languageFromBrowser(): Language | null {
  if (typeof navigator === "undefined") return null;

  const tags = [...(navigator.languages ?? []), navigator.language]
    .filter(Boolean)
    .map((tag) => tag.toLowerCase());

  for (const tag of tags) {
    if (tag === "es" || tag.startsWith("es-")) return "es";
    if (tag === "en" || tag.startsWith("en-")) return "en";
  }

  return null;
}
