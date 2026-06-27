import type { Metadata } from "next";
import type { Project } from "@/app/data/projects";
import { CASE_STUDIES, type CaseStudySlug } from "@/lib/case-studies";
import { translations } from "@/lib/i18n/translations";
import {
  SITE_NAME,
  SITE_TAGLINE,
  absoluteUrl,
  truncateMeta,
} from "@/lib/seo/site";

function workCategory(slug: CaseStudySlug, lang: "en" | "es"): string {
  return translations[lang].work[slug].title;
}

export function buildCaseStudyMetadata(
  project: Project,
  slug: CaseStudySlug,
): Metadata {
  const study = CASE_STUDIES[slug];
  const categoryEs = workCategory(slug, "es");
  const categoryEn = workCategory(slug, "en");
  const path = `/work/${slug}`;
  const url = absoluteUrl(path);
  const image = absoluteUrl(project.caseStudyHero);

  const title = `${project.name} — ${categoryEs} · ${SITE_NAME}`;
  const description = truncateMeta(
    `${categoryEs}. ${study.es.headline} ${study.es.result}`,
  );
  const descriptionEn = truncateMeta(
    `${categoryEn}. ${study.en.headline} ${study.en.result}`,
  );

  const keywords = [
    project.name,
    categoryEs,
    categoryEn,
    ...study.es.roles,
    ...study.es.stack,
    SITE_NAME,
    "diseño gráfico",
    "desarrollo front end",
    "case study",
    "caso de estudio",
  ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: `${SITE_NAME} Portfolio`,
      locale: "es_AR",
      alternateLocale: ["en_US"],
      type: "article",
      images: [
        {
          url: image,
          width: project.heroWidth,
          height: project.heroHeight,
          alt: `${project.name} — ${categoryEs}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: descriptionEn,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export function buildCaseStudyJsonLd(project: Project, slug: CaseStudySlug) {
  const study = CASE_STUDIES[slug];
  const categoryEs = workCategory(slug, "es");
  const path = `/work/${slug}`;
  const url = absoluteUrl(path);
  const image = absoluteUrl(project.caseStudyHero);

  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": url,
    name: `${project.name} — ${categoryEs}`,
    headline: study.es.headline,
    description: truncateMeta(
      `${study.es.headline} ${study.es.keyDecision} ${study.es.result}`,
      240,
    ),
    url,
    image,
    inLanguage: ["es-AR", "en"],
    datePublished: String(project.year),
    genre: categoryEs,
    keywords: [...study.es.roles, ...study.es.stack].join(", "),
    author: {
      "@type": "Person",
      name: SITE_NAME,
      url: absoluteUrl("/"),
      jobTitle: SITE_TAGLINE,
    },
    creator: {
      "@type": "Person",
      name: SITE_NAME,
      url: absoluteUrl("/"),
    },
    isPartOf: {
      "@type": "WebSite",
      name: `${SITE_NAME} Portfolio`,
      url: absoluteUrl("/"),
    },
  };
}
