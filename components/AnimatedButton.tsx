"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { ArrowRightIcon } from "@radix-ui/react-icons";

interface AnimatedButtonProps {
  href: string;
}

export function AnimatedButton({ href }: AnimatedButtonProps) {
  const { t } = useLanguage();

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-sm border border-border px-4 py-2 text-[11px] tracking-[0.15em] uppercase font-helveticaNowTextRegular transition-all duration-300 hover:bg-foreground hover:border-foreground group"
    >
      <span className="relative z-10 transition-colors duration-300 text-foreground group-hover:text-background">
        {t('button.visit')}
      </span>
      <ArrowRightIcon className="w-4 h-4 transition-all duration-300 group-hover:translate-x-1 text-foreground group-hover:text-background" />
    </a>
  );
} 