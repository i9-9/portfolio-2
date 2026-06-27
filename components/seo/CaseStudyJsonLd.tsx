import { buildCaseStudyJsonLd } from "@/lib/seo/case-study";
import type { Project } from "@/app/data/projects";
import type { CaseStudySlug } from "@/lib/case-studies";

export function CaseStudyJsonLd({
  project,
  slug,
}: {
  project: Project;
  slug: CaseStudySlug;
}) {
  const jsonLd = buildCaseStudyJsonLd(project, slug);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
