export type Language = "en" | "es";

/**
 * Browser language preference.
 * Returns null when neither Spanish nor English is clearly preferred
 * (geo fallback should run).
 */
export function languageFromBrowser(): Language | null {
  if (typeof navigator === "undefined") return null;

  const tags = [
    ...(navigator.languages ?? []),
    navigator.language,
  ].filter(Boolean);

  const normalized = tags.map((tag) => tag.toLowerCase());

  const hasEs = normalized.some(
    (tag) => tag === "es" || tag.startsWith("es-"),
  );
  const hasEn = normalized.some(
    (tag) => tag === "en" || tag.startsWith("en-"),
  );

  if (hasEs && !hasEn) return "es";
  if (hasEn && !hasEs) return "en";

  // Both present: prefer whichever appears first in the list
  if (hasEs && hasEn) {
    for (const tag of normalized) {
      if (tag === "es" || tag.startsWith("es-")) return "es";
      if (tag === "en" || tag.startsWith("en-")) return "en";
    }
  }

  return null;
}
