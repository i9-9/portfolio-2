"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface AnimatedButtonProps {
  href: string;
}

export function AnimatedButton({ href }: AnimatedButtonProps) {
  const { t } = useLanguage();

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="relative inline-flex items-center justify-center overflow-hidden rounded-sm border border-border px-3 py-1 group"
      whileHover="hover"
      initial="initial"
    >
      <motion.span
        className="relative text-[9px] tracking-[0.2em] uppercase font-helveticaNowTextRegular"
        variants={{
          initial: { x: "0%" },
          hover: { x: "-100%" }
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {t('button.visit')}
      </motion.span>
      <motion.span
        className="absolute text-[9px] tracking-[0.2em] uppercase font-helveticaNowTextRegular"
        variants={{
          initial: { x: "100%" },
          hover: { x: "0%" }
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {t('button.visit')}
      </motion.span>
    </motion.a>
  );
} 