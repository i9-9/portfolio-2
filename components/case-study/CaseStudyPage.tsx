"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getProjectBySlug } from "@/app/data/projects";
import { useProjectTransition } from "@/lib/transitions/ProjectTransitionContext";
import { TRANSITION_EASE } from "@/lib/transitions/config";
import {
  editorialNavMuted,
  editorialNavOutline,
  editorialNavPrimary,
  editorialNavType,
} from "@/lib/editorial-cta";
import { cn } from "@/lib/utils";
import {
  CASE_STUDIES,
  getNextCaseStudySlug,
  type CaseStudySlug,
} from "@/lib/case-studies";
import { CaseStudyHeroImage } from "@/components/case-study/CaseStudyHeroImage";
import { CaseStudyHeroBack } from "@/components/case-study/CaseStudyHeroBack";

/** Body copy in section rows — one step below headings, no desktop size bump. */
const caseStudyBody =
  "text-type-body font-helveticaNowTextRegular leading-normal text-muted-foreground";

export function CaseStudyPage({ slug }: { slug: string }) {
  const { language, t } = useLanguage();
  const { phase } = useProjectTransition();
  const reducedMotion = useReducedMotion();
  const project = getProjectBySlug(slug);
  const study = CASE_STUDIES[slug as CaseStudySlug];
  if (!project || !study) return null;

  const entering = phase === "enter";
  const pageLive = reducedMotion || phase === "idle" || entering;

  const loc = language === "en" ? study.en : study.es;
  const cat = t(`work.${slug}.title` as Parameters<typeof t>[0]);
  const nextSlug = getNextCaseStudySlug(slug as CaseStudySlug);
  const nextProject = nextSlug ? getProjectBySlug(nextSlug) : undefined;
  const nextHref = nextSlug ? `/work/${nextSlug}` : "/#work";

  return (
    <motion.article
      className="case-study-page min-h-screen bg-background text-foreground"
      initial={{ opacity: 0 }}
      animate={{ opacity: pageLive ? 1 : 0 }}
      transition={{ duration: entering ? 0.45 : 0, ease: TRANSITION_EASE, delay: entering ? 0.12 : 0 }}
    >
      {/* Hero — full viewport; navbar slides in over content on scroll */}
      <div className="relative h-[100dvh] w-full overflow-hidden">
        <CaseStudyHeroImage
          project={project}
          alt={`${project.name} — preview`}
        />
        <CaseStudyHeroBack />
      </div>

      <div className="grid-container py-16 lg:py-24">
        <header className="col-span-12">
          <div
            className={cn(
              editorialNavType,
              "flex items-baseline justify-between gap-x-3 gap-y-1 text-muted-foreground",
            )}
          >
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span>{t("caseStudy.caseStudyLabel")}</span>
              <span className="text-muted-foreground/50" aria-hidden>
                ·
              </span>
              <span className="tabular-nums">{project.year}</span>
            </div>
            <span className="shrink-0 text-right">{project.name}</span>
          </div>

          <h1 className="mt-6 w-full font-helveticaNowDisplayBold text-type-case-title leading-[1] tracking-[-0.02em] text-foreground">
            {loc.headline}
          </h1>

          <p className={cn(editorialNavType, "mt-3 text-muted-foreground")}>
            {cat}
          </p>

          {loc.creditNote ? (
            <p className={cn("mt-5 max-w-2xl", caseStudyBody)}>
              {loc.creditNote}
            </p>
          ) : null}

          {loc.roles.length ? (
            <div className="mt-10 flex flex-wrap gap-2">
              {loc.roles.map((role) => (
                <span
                  key={role}
                  className={cn(
                    editorialNavType,
                    "rounded-sm border border-border bg-muted/30 px-3 py-2 text-foreground/90",
                  )}
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
                  className={cn(
                    editorialNavType,
                    "rounded-sm border border-border px-3 py-2 text-muted-foreground",
                  )}
                >
                  {item}
                </span>
              ))}
            </div>
          ) : null}
        </header>

        <div className="col-span-12 mt-14 grid grid-cols-subgrid border-t border-border">
          <CaseStudySection title={t("caseStudy.challenge")}>
            <TextBlock paragraphs={loc.challenge.paragraphs} />
          </CaseStudySection>

          <CaseStudySection title={t("caseStudy.keyDecision")}>
            <p className={caseStudyBody}>{loc.keyDecision}</p>
          </CaseStudySection>

          <CaseStudySection title={t("caseStudy.result")}>
            <p className={caseStudyBody}>{loc.result}</p>
          </CaseStudySection>
        </div>

        <footer className="col-span-12 mt-14 flex flex-col gap-4 border-t border-border pt-12 lg:flex-row lg:flex-wrap lg:items-center lg:gap-6">
            <a
              href={project.anchor}
              target="_blank"
              rel="noopener noreferrer"
              className={editorialNavPrimary("group w-fit")}
              aria-label={`${t("caseStudy.viewLiveSite")} — ${t("caseStudy.openExternal")}`}
            >
              {t("caseStudy.viewLiveSite")}
              <ArrowRight className="size-3.5 transition-opacity duration-300 group-hover:opacity-70" aria-hidden />
            </a>

            <Link
              href={nextHref}
              scroll={nextHref.startsWith("/#") ? false : undefined}
              className={editorialNavOutline("group w-fit")}
              aria-label={
                nextProject
                  ? `${t("caseStudy.nextProject")}: ${nextProject.name}`
                  : t("caseStudy.nextProject")
              }
            >
              {nextProject ? (
                <span className="inline-flex items-baseline gap-2">
                  <span>{t("caseStudy.nextProject")}</span>
                  <span className="text-muted-foreground/45" aria-hidden>
                    ·
                  </span>
                  <span>{nextProject.name}</span>
                </span>
              ) : (
                t("caseStudy.nextProject")
              )}
              <ArrowRight className="size-3.5 transition-opacity duration-300 group-hover:opacity-70" aria-hidden />
            </Link>

            <Link
              href="/#contact"
              scroll={false}
              className={editorialNavMuted("w-fit", "comfortable")}
            >
              {t("caseStudy.workWithMe")}
            </Link>
        </footer>
      </div>
    </motion.article>
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
    <section className="col-span-12 grid grid-cols-subgrid items-start gap-x-4 gap-y-2 border-b border-border py-10 lg:gap-x-6 lg:gap-y-0 lg:py-12">
      <h2 className="case-study-section-heading col-span-12 lg:col-span-3 lg:row-start-1">
        {title}
      </h2>
      <div className="case-study-section-copy col-span-12 lg:col-span-6 lg:col-start-4 lg:row-start-1">
        {children}
      </div>
    </section>
  );
}

function TextBlock({ paragraphs }: { paragraphs: string[] }) {
  return <p className={caseStudyBody}>{paragraphs.join(" ")}</p>;
}
