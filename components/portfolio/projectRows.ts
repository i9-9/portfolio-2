import type { ProjectSlug } from "@/app/data/projects";
import { CASE_STUDY_NAV_ORDER } from "@/lib/case-studies/navigation";

export type ProjectRowMeta = {
  key: ProjectSlug;
  idx: number;
  metricEn: string;
  metricEs: string;
  marqueeEn: string;
  marqueeEs: string;
};

const MARQUEE: Record<ProjectSlug, { en: string; es: string }> = {
  heybristol: { en: "Hey Bristol · ", es: "Hey Bristol · " },
  kostume: { en: "Kostüme · ", es: "Kostüme · " },
  ursulabenavidez: { en: "Ursula Benavidez · ", es: "Ursula Benavidez · " },
  desenfreno: { en: "El Desenfreno · ", es: "El Desenfreno · " },
  grupofrali: { en: "Grupo Frali · ", es: "Grupo Frali · " },
};

/** Landing work list — same order as case-study “Next project”. */
export const PROJECT_ROWS: ProjectRowMeta[] = CASE_STUDY_NAV_ORDER.map(
  (key, idx) => ({
    key,
    idx,
    metricEn: "",
    metricEs: "",
    marqueeEn: MARQUEE[key].en,
    marqueeEs: MARQUEE[key].es,
  }),
);
