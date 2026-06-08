"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getProjectBySlug } from "@/app/data/projects";
import {
  editorialMutedLabel,
  editorialOutline,
  editorialPrimary,
} from "@/lib/editorial-cta";
import {
  CASE_STUDIES,
  getNextCaseStudySlug,
  type CaseStudySlug,
} from "@/lib/case-studies";

export function CaseStudyPage({ slug }: { slug: string }) {
  const { language, t } = useLanguage();
  const project = getProjectBySlug(slug);
  const study = CASE_STUDIES[slug as CaseStudySlug];
  if (!project || !study) return null;

  const loc = language === "en" ? study.en : study.es;
  const cat = t(`work.${slug}.title` as Parameters<typeof t>[0]);
  const nextSlug = getNextCaseStudySlug(slug as CaseStudySlug);
  const nextProject = nextSlug ? getProjectBySlug(nextSlug) : undefined;
  const nextHref = nextSlug ? `/work/${nextSlug}` : "/#work";

  return (
    <article className="min-h-screen bg-background text-foreground">
      <div className="grid-container pt-24 pb-6 lg:pt-28">
        <div className="col-span-12">
          <Link
            href="/#work"
            className="inline-flex items-center gap-2 font-helveticaNowTextRegular text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" aria-hidden />
            {t("caseStudy.back")}
          </Link>
        </div>
      </div>

      <div className="w-full overflow-hidden bg-muted">
        <Image
          src={project.caseStudyHero}
          alt={`${project.name} — preview`}
          width={project.heroWidth}
          height={project.heroHeight}
          className="block h-auto w-full"
          sizes="100vw"
          priority
        />
      </div>

      <div className="grid-container py-16 lg:py-24">
        <div className="col-span-12 lg:col-span-10 lg:col-start-2">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-helveticaNowTextRegular text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            <span>{t("caseStudy.caseStudyLabel")}</span>
            <span className="text-muted-foreground/50" aria-hidden>
              ·
            </span>
            <span className="tabular-nums">{project.year}</span>
            <span className="text-muted-foreground/50" aria-hidden>
              ·
            </span>
            <span>{project.name}</span>
          </div>

          <h1 className="mt-6 max-w-4xl font-helveticaNowDisplayBold text-[clamp(1.75rem,4.5vw,2.75rem)] leading-[1.08] tracking-tight text-foreground">
            {loc.headline}
          </h1>

          <p className="mt-3 font-helveticaNowTextRegular text-sm text-muted-foreground lg:text-base">
            {cat}
          </p>

          {loc.creditNote ? (
            <p className="mt-5 max-w-2xl font-helveticaNowTextRegular text-sm leading-[1.55] text-muted-foreground">
              {loc.creditNote}
            </p>
          ) : null}

          {loc.roles.length ? (
            <div className="mt-10 flex flex-wrap gap-2">
              {loc.roles.map((role) => (
                <span
                  key={role}
                  className="rounded-sm border border-border bg-muted/30 px-3 py-2 font-helveticaNowTextRegular text-[10px] uppercase tracking-[0.14em] text-foreground/90"
                >
                  {role}
                </span>
              ))}
            </div>
          ) : null}

          {loc.stack.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {loc.stack.map((item) => (
                <span
                  key={item}
                  className="rounded-sm border border-border px-3 py-2 font-helveticaNowTextRegular text-xs tracking-wide text-muted-foreground"
                >
                  {item}
                </span>
              ))}
            </div>
          ) : null}

          <div className="mt-14 border-t border-border">
            <CaseStudySection title={t("caseStudy.challenge")}>
              <TextBlock paragraphs={loc.challenge.paragraphs} />
            </CaseStudySection>

            <CaseStudySection title={t("caseStudy.keyDecision")}>
              <p className="font-helveticaNowTextRegular text-base leading-[1.55] text-muted-foreground lg:text-lg">
                {loc.keyDecision}
              </p>
            </CaseStudySection>

            <CaseStudySection title={t("caseStudy.result")}>
              <p className="font-helveticaNowDisplayBold text-lg leading-snug tracking-tight text-foreground lg:text-xl">
                {loc.result}
              </p>
            </CaseStudySection>
          </div>

          <div className="mt-14 flex flex-col gap-4 border-t border-border pt-12 lg:flex-row lg:flex-wrap lg:items-center lg:gap-6">
            <a
              href={project.anchor}
              target="_blank"
              rel="noopener noreferrer"
              className={editorialPrimary("group inline-flex w-fit")}
              aria-label={`${t("caseStudy.viewLiveSite")} — ${t("caseStudy.openExternal")}`}
            >
              {t("caseStudy.viewLiveSite")}
              <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:rotate-90 group-hover:translate-y-0.5" aria-hidden />
            </a>

            <Link
              href={nextHref}
              className={editorialOutline("group inline-flex w-fit")}
              aria-label={
                nextProject
                  ? `${t("caseStudy.nextProject")}: ${nextProject.name}`
                  : t("caseStudy.nextProject")
              }
            >
              {t("caseStudy.nextProject")}
              <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:rotate-90 group-hover:translate-y-0.5" aria-hidden />
            </Link>

            <Link
              href="/#contact"
              className={editorialMutedLabel("inline-flex w-fit")}
            >
              {t("caseStudy.workWithMe")}
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function CaseStudySection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="grid grid-cols-12 gap-4 border-b border-border py-10 lg:gap-6 lg:py-12">
      <h2 className="col-span-12 font-helveticaNowTextRegular text-[10px] uppercase tracking-[0.22em] text-muted-foreground lg:col-span-3">
        {title}
      </h2>
      <div className="col-span-12 lg:col-span-8 lg:col-start-5">{children}</div>
    </section>
  );
}

function TextBlock({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="space-y-4">
      {paragraphs.map((paragraph) => (
        <p
          key={paragraph}
          className="font-helveticaNowTextRegular text-base leading-[1.55] text-muted-foreground lg:text-lg"
        >
          {paragraph}
        </p>
      ))}
    </div>
  );
}
