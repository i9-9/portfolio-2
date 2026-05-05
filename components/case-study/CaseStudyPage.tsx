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
import { Badge } from "@/components/ui/badge";

function StudySection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid grid-cols-1 gap-4 border-t border-border py-10 lg:grid-cols-12 lg:gap-6">
      <h2 className="font-helveticaNowTextRegular text-[10px] uppercase leading-relaxed tracking-[0.22em] text-muted-foreground lg:col-span-3 lg:pt-0.5">
        {label}
      </h2>
      <div className="space-y-4 lg:col-span-9">{children}</div>
    </section>
  );
}

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
            href="/v2#work"
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
          <p className="mt-6 font-helveticaNowTextRegular text-base leading-relaxed text-muted-foreground lg:text-lg">
            {loc.tagline}
          </p>

          <div className="mt-10">
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
        <div className="col-span-12 py-16 lg:py-24">
        <StudySection label={t("caseStudy.client")}>
          {loc.client.paragraphs.map((p, i) => (
            <p
              key={i}
              className="font-helveticaNowTextRegular text-sm leading-relaxed text-muted-foreground lg:text-[15px]"
            >
              {p}
            </p>
          ))}
        </StudySection>

        <StudySection label={t("caseStudy.brief")}>
          {loc.brief.paragraphs.map((p, i) => (
            <p
              key={i}
              className="font-helveticaNowTextRegular text-sm leading-relaxed text-muted-foreground lg:text-[15px]"
            >
              {p}
            </p>
          ))}
        </StudySection>

        <StudySection label={t("caseStudy.objectives")}>
          <ul className="list-none space-y-3">
            {loc.objectives.map((item, i) => (
              <li
                key={i}
                className="flex gap-3 font-helveticaNowTextRegular text-sm leading-relaxed text-muted-foreground lg:text-[15px]"
              >
                <span className="mt-0.5 font-helveticaNowDisplayBold tabular-nums text-foreground/80">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </StudySection>

        <StudySection label={t("caseStudy.outcomes")}>
          {loc.outcomes.paragraphs.map((p, i) => (
            <p
              key={i}
              className="font-helveticaNowTextRegular text-sm leading-relaxed text-muted-foreground lg:text-[15px]"
            >
              {p}
            </p>
          ))}
          {loc.outcomes.highlights && loc.outcomes.highlights.length > 0 && (
            <ul className="mt-4 space-y-2 border-l border-border pl-4">
              {loc.outcomes.highlights.map((h, i) => (
                <li
                  key={i}
                  className="font-helveticaNowTextRegular text-sm text-foreground/85 lg:text-[15px]"
                >
                  {h}
                </li>
              ))}
            </ul>
          )}
        </StudySection>

        <StudySection label={t("caseStudy.process")}>
          <ol className="space-y-8">
            {loc.process.map((step, i) => (
              <li key={i} className="grid gap-2 sm:grid-cols-[minmax(0,7rem)_1fr] sm:gap-8">
                <span className="font-helveticaNowDisplayBold text-xs uppercase tracking-[0.15em] text-foreground">
                  {step.phase}
                </span>
                <p className="font-helveticaNowTextRegular text-sm leading-relaxed text-muted-foreground lg:text-[15px]">
                  {step.text}
                </p>
              </li>
            ))}
          </ol>
        </StudySection>

        <StudySection label={t("caseStudy.stack")}>
          <div className="flex flex-wrap gap-2">
            {loc.stack.map((s) => (
              <Badge
                key={s}
                variant="outline"
                className="text-[9px] font-normal tracking-[0.18em]"
              >
                {s}
              </Badge>
            ))}
          </div>
        </StudySection>

        <div className="border-t border-border pt-12">
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
      </div>
    </article>
  );
}
