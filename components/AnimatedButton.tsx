"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import Image from "next/image";

interface AnimatedButtonProps {
  href: string;
  previewImage?: string;
}

export function AnimatedButton({ href, previewImage }: AnimatedButtonProps) {
  const { t } = useLanguage();

  return (
    <div className="relative group">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="relative inline-flex items-center gap-3 rounded-sm border border-border px-6 py-4 text-sm tracking-[0.15em] uppercase font-helveticaNowTextRegular transition-all duration-300 hover:bg-foreground hover:border-foreground group w-fit"
      >
        {/* Text container with fixed width and overflow hidden */}
        <div className="relative overflow-hidden">
          <span className="inline-block transition-opacity duration-300 text-foreground group-hover:text-background group-hover:opacity-0">
            {t('button.visit')}
          </span>
          {/* Marquee effect on hover - duplicate text */}
          <div className="absolute top-0 left-0 whitespace-nowrap opacity-0 group-hover:opacity-100 group-hover:animate-marquee-smooth">
            <span className="inline-block text-background pr-8">
              {t('button.visit')}
            </span>
            <span className="inline-block text-background pr-8">
              {t('button.visit')}
            </span>
            <span className="inline-block text-background pr-8">
              {t('button.visit')}
            </span>
            <span className="inline-block text-background pr-8">
              {t('button.visit')}
            </span>
          </div>
        </div>

        <ArrowRightIcon className="w-5 h-5 flex-shrink-0 transition-all duration-300 group-hover:translate-x-1 text-foreground group-hover:text-background relative z-10" />
      </a>

      {/* Preview Image - Only on Desktop */}
      {previewImage && (
        <div className="hidden lg:block absolute top-full left-0 mt-2 w-80 h-48 bg-popover border border-border rounded-md shadow-lg opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 ease-out z-50 overflow-hidden">
          <Image
            src={previewImage}
            alt="Project preview"
            width={320}
            height={192}
            className="w-full h-full object-cover"
            priority={false}
          />
        </div>
      )}
    </div>
  );
} 