"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getProjectBySlug } from "@/app/data/projects";
import {
  editorialMutedLabel,
  editorialPrimary,
} from "@/lib/editorial-cta";
import { CASE_STUDIES, type CaseStudySlug } from "@/lib/case-studies";

export function CaseStudyPage({ slug }: { slug: string }) {
  const { language, t } = useLanguage();
  const project = getProjectBySlug(slug);
  const study = CASE_STUDIES[slug as CaseStudySlug];
  if (!project || !study) return null;

  const loc = language === "en" ? study.en : study.es;
  const cat = t(`work.${slug}.title` as Parameters<typeof t>[0]);

  return (
    <article className="min-h-screen bg-background text-foreground">
      <header className="grid-container pt-24 pb-12 lg:pb-16 lg:pt-28">
        <div className="col-span-12">
          <Link
            href="/#work"
            className="inline-flex items-center gap-2 font-helveticaNowTextRegular text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" aria-hidden />
            {t("caseStudy.back")}
          </Link>

          <div className="mt-10 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-helveticaNowTextRegular text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              {t("caseStudy.caseStudyLabel")}
            </span>
            <span className="text-muted-foreground/50" aria-hidden>
              ·
            </span>
            <span className="tabular-nums font-helveticaNowTextRegular text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              {project.year}
            </span>
          </div>

          <h1 className="mt-4 font-helveticaNowDisplayBold text-[clamp(2rem,6vw,3.75rem)] leading-[0.95]">
            {project.name}
          </h1>
          <p className="mt-2 font-helveticaNowTextRegular text-sm text-muted-foreground lg:text-base">
            {cat}
          </p>
          {loc.tagline ? (
            <p className="mt-6 font-helveticaNowTextRegular text-base leading-relaxed text-muted-foreground lg:text-lg">
              {loc.tagline}
            </p>
          ) : null}

          <div className={loc.tagline ? "mt-10" : "mt-6"}>
            <a
              href={project.anchor}
              target="_blank"
              rel="noopener noreferrer"
              className={editorialMutedLabel("group")}
              aria-label={`${t("caseStudy.liveSite")} — ${t("caseStudy.openExternal")}`}
            >
              {t("caseStudy.liveSite")}
              <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:rotate-90 group-hover:translate-y-0.5" aria-hidden />
            </a>
          </div>
        </div>
      </header>

      <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted lg:aspect-[21/9]">
        <Image
          src={project.caseStudyHero}
          alt={`${project.name} — preview`}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </div>

      <div className="grid-container pb-24 lg:pb-32">
        <div className="col-span-12 border-t border-border py-16 lg:py-24">
          <a
            href={project.anchor}
            target="_blank"
            rel="noopener noreferrer"
            className={editorialPrimary("group")}
          >
            {t("caseStudy.liveSite")}
            <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:rotate-90 group-hover:translate-y-0.5" aria-hidden />
          </a>
        </div>
      </div>
    </article>
  );
}
