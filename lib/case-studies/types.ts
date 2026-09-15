export interface CaseStudyLocale {
  /** Result-first hook (one or two short sentences). */
  headline: string;
  /** What you did — shown as tags, not prose. */
  roles: string[];
  /** Tech / tools — shown as chips. */
  stack: string[];
  /** Single narrative paragraph (why called → decision → result). */
  body: string;
  /** e.g. design credit when implementation-only. */
  creditNote?: string;
}

export type CaseStudySlug =
  | "heybristol"
  | "kostume"
  | "ursulabenavidez"
  | "desenfreno"
  | "grupofrali";

export type CaseStudyBundle = Record<"en" | "es", CaseStudyLocale>;
