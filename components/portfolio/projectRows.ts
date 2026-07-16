import type { ProjectSlug } from "@/app/data/projects";
import { CASE_STUDY_NAV_ORDER } from "@/lib/case-studies/navigation";

export type ProjectRowMeta = {
  key: ProjectSlug;
  idx: number;
  metricEn: string;
  metricEs: string;
};

/** Landing work list — same order as case-study "Next project". */
export const PROJECT_ROWS: ProjectRowMeta[] = CASE_STUDY_NAV_ORDER.map(
  (key, idx) => ({
    key,
    idx,
    metricEn: "",
    metricEs: "",
  }),
);
