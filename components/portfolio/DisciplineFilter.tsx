"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ProjectDiscipline } from "@/app/data/projects";
import { editorialNavType } from "@/lib/editorial-cta";
import { EASE_OUT_EXPO } from "@/lib/motion/easing";

export type DisciplineFilterValue = ProjectDiscipline | "all";

interface DisciplineFilterProps {
  active: DisciplineFilterValue;
  onChange: (discipline: DisciplineFilterValue) => void;
  labels: {
    all: string;
    web: string;
    graphic: string;
  };
  inView: boolean;
}

export function DisciplineFilter({
  active,
  onChange,
  labels,
  inView,
}: DisciplineFilterProps) {
  const filters: { value: DisciplineFilterValue; label: string }[] = [
    { value: "all", label: labels.all },
    { value: "web", label: labels.web },
    { value: "graphic", label: labels.graphic },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
      transition={{ duration: 0.9, delay: 0.15, ease: EASE_OUT_EXPO }}
      className="flex flex-wrap gap-2 mb-8"
      role="group"
      aria-label="Filter projects by discipline"
    >
      {filters.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => onChange(value)}
          className={cn(
            editorialNavType,
            "px-4 py-2 border-2 transition-all duration-300",
            active === value
              ? "border-foreground bg-foreground text-background"
              : "border-border bg-background text-muted-foreground hover:border-foreground/40 hover:text-foreground"
          )}
          aria-pressed={active === value}
        >
          {label}
        </button>
      ))}
    </motion.div>
  );
}
