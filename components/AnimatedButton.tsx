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
      className="relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-sm border border-border px-4 py-2 text-[11px] tracking-[0.15em] uppercase font-helveticaNowTextRegular transition-all duration-300 hover:bg-foreground hover:border-foreground group"
    >
      <span className="relative z-10 transition-colors duration-300 text-foreground group-hover:text-background">
        {t('button.visit')}
      </span>
      <ArrowRightIcon className="w-4 h-4 transition-all duration-300 group-hover:translate-x-1 text-foreground group-hover:text-background" />
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