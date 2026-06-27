import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects, getProjectBySlug } from "@/app/data/projects";
import { isCaseStudySlug } from "@/lib/case-studies";
import { CaseStudyPage } from "@/components/case-study/CaseStudyPage";
import { CaseStudyJsonLd } from "@/components/seo/CaseStudyJsonLd";
import { buildCaseStudyMetadata } from "@/lib/seo/case-study";

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
  return buildCaseStudyMetadata(project, slug);
}

export default async function WorkCaseStudyRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project || !isCaseStudySlug(slug)) {
    notFound();
  }

  return (
    <>
      <CaseStudyJsonLd project={project} slug={slug} />
      <CaseStudyPage slug={slug} />
    </>
  );
}
