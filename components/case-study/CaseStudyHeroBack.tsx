"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { cn } from "@/lib/utils";

/** Swiss-minimal back control — readable on any hero (light or dark). */
export function CaseStudyHeroBack() {
  const { t } = useLanguage();

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-10">
      <div className="relative grid-container py-4 lg:py-5">
        <Link
          href="/#work"
          aria-label={t("caseStudy.back")}
          className={cn(
            "pointer-events-auto inline-flex items-center gap-1",
            "font-helveticaNowTextRegular text-type-grid-label uppercase tracking-[0.16em] leading-none",
            "text-white/90 case-study-hero-back-label",
            "transition-[color,opacity] duration-300 hover:text-white",
          )}
        >
          <ArrowLeft
            className="size-2.5 shrink-0 case-study-hero-back-icon"
            strokeWidth={1.15}
            aria-hidden
          />
          <span>{t("caseStudy.backShort")}</span>
        </Link>
      </div>
    </div>
  );
}
