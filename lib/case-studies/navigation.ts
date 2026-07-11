import type { CaseStudySlug } from "./types";

/** Same order as the landing work list (ProjectRow). */
export const CASE_STUDY_NAV_ORDER: CaseStudySlug[] = [
  "heybristol",
  "kostume",
  "ursulabenavidez",
  "desenfreno",
  "grupofrali",
];

export function getNextCaseStudySlug(slug: CaseStudySlug): CaseStudySlug | null {
  const i = CASE_STUDY_NAV_ORDER.indexOf(slug);
  if (i === -1) return null;
  return CASE_STUDY_NAV_ORDER[i + 1] ?? null;
}
