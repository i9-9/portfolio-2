export interface CaseStudyLocale {
  /** Result-first hook (one or two short sentences). */
  headline: string;
  /** What you did — shown as tags, not prose. */
  roles: string[];
  /** Tech / tools — shown as chips. */
  stack: string[];
  /** Problem framing — short lines. */
  challenge: { paragraphs: string[] };
  /** The main technical or product decision — why, not only what. */
  keyDecision: string;
  /** One-line outcome. */
  result: string;
  /** e.g. design credit when implementation-only. */
  creditNote?: string;
}

export type CaseStudySlug =
  | "heybristol"
  | "kostume"
  | "ursulabenavidez"
  | "templodetierra"
  | "desenfreno"
  | "grupofrali";

export type CaseStudyBundle = Record<"en" | "es", CaseStudyLocale>;
