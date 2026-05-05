export interface CaseStudyLocale {
  tagline: string;
  client: { paragraphs: string[] };
  brief: { paragraphs: string[] };
  objectives: string[];
  outcomes: { paragraphs: string[]; highlights?: string[] };
  process: { phase: string; text: string }[];
  stack: string[];
}

export type CaseStudySlug =
  | "heybristol"
  | "kostume"
  | "vinorodante"
  | "ursulabenavidez"
  | "templodetierra"
  | "desenfreno"
  | "grupofrali";

export type CaseStudyBundle = Record<"en" | "es", CaseStudyLocale>;
