import type { CaseStudySlug } from "./types";

/** Editorial order for “Next project” on case study pages. */
export const CASE_STUDY_NAV_ORDER: CaseStudySlug[] = [
  "heybristol",
  "grupofrali",
  "kostume",
  "ursulabenavidez",
  "desenfreno",
];

export function getNextCaseStudySlug(slug: CaseStudySlug): CaseStudySlug | null {
  const i = CASE_STUDY_NAV_ORDER.indexOf(slug);
  if (i === -1) return null;
  return CASE_STUDY_NAV_ORDER[i + 1] ?? null;
}
