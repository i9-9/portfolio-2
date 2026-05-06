import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects, getProjectBySlug } from "@/app/data/projects";
import { CASE_STUDIES, isCaseStudySlug } from "@/lib/case-studies";
import { CaseStudyPage } from "@/components/case-study/CaseStudyPage";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project || !isCaseStudySlug(slug)) {
    return { title: "Work" };
  }
  const tagline = CASE_STUDIES[slug].en.tagline;
  const metaDescription = tagline || `${project.name} — case study`;
  return {
    title: `${project.name} — Case study · Ivan Nevares`,
    description: metaDescription,
    openGraph: {
      title: `${project.name} — Case study`,
      description: metaDescription,
    },
  };
}

export default async function WorkCaseStudyRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!getProjectBySlug(slug) || !isCaseStudySlug(slug)) {
    notFound();
  }
  return <CaseStudyPage slug={slug} />;
}
