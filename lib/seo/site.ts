export const SITE_URL = "https://inevares.com";
export const SITE_NAME = "Ivan Nevares";
export const SITE_TAGLINE = "graphic design & front end development";

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).href;
}

export function truncateMeta(text: string, max = 155): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= max) return normalized;
  return `${normalized.slice(0, max - 1).trimEnd()}…`;
}
