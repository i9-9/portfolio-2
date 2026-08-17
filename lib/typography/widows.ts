/**
 * Typographic helpers to avoid 1–2 word orphans at line ends.
 */

/** Split on sentence-final punctuation; keeps the terminator on each part. */
export function splitSentences(text: string): string[] {
  const parts = text.match(/[^.!?]+[.!?]+\s*|[^.!?]+$/g);
  if (!parts) return [text.trim()].filter(Boolean);
  return parts.map((p) => p.trim()).filter(Boolean);
}

/**
 * Bind the last `count` words with NBSP so they wrap as one unit.
 * Prevents a lone word (or two) sitting alone on the final line.
 */
export function glueLastWords(text: string, count = 3): string {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length <= 1) return text.trim();
  const n = Math.min(count, words.length);
  if (n === words.length) return words.join("\u00A0");
  return `${words.slice(0, -n).join(" ")} ${words.slice(-n).join("\u00A0")}`;
}
