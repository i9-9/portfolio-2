import type { CaseStudyBundle, CaseStudySlug, CaseStudyLocale } from "./types";

function emptyStudy(): CaseStudyLocale {
  return {
    tagline: "",
    client: { paragraphs: [] },
    brief: { paragraphs: [] },
    objectives: [],
    outcomes: { paragraphs: [] },
    process: [],
    stack: [],
  };
}

export const CASE_STUDIES: Record<CaseStudySlug, CaseStudyBundle> = {
  heybristol: { en: emptyStudy(), es: emptyStudy() },
  kostume: { en: emptyStudy(), es: emptyStudy() },
  vinorodante: { en: emptyStudy(), es: emptyStudy() },
  ursulabenavidez: { en: emptyStudy(), es: emptyStudy() },
  templodetierra: { en: emptyStudy(), es: emptyStudy() },
  desenfreno: { en: emptyStudy(), es: emptyStudy() },
  grupofrali: { en: emptyStudy(), es: emptyStudy() },
};

export function isCaseStudySlug(slug: string): slug is CaseStudySlug {
  return Object.hasOwn(CASE_STUDIES, slug);
}
