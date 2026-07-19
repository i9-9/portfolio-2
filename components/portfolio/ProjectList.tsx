"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { getProjectBySlug, type ProjectSlug } from "@/app/data/projects";
import { useProjectTransition } from "@/lib/transitions/ProjectTransitionContext";
import { getProjectPreview } from "@/lib/projects/screenshot";
import { EASE_OUT_EXPO } from "@/lib/motion/easing";

interface ProjectListProps {
  projectKeys: string[];
  categories: Record<string, string>;
  inView: boolean;
}

export function ProjectList({ projectKeys, categories, inView }: ProjectListProps) {
  return (
    <div className="flex flex-col">
      {projectKeys.map((key, index) => {
        const project = getProjectBySlug(key);
        if (!project) return null;
        return (
          <ProjectListItem
            key={key}
            slug={key as ProjectSlug}
            project={project}
            category={categories[key] || ""}
            index={index}
            inView={inView}
            isLast={index === projectKeys.length - 1}
          />
        );
      })}
    </div>
  );
}

function ProjectListItem({
  slug,
  project,
  category,
  index,
  inView,
  isLast,
}: {
  slug: ProjectSlug;
  project: NonNullable<ReturnType<typeof getProjectBySlug>>;
  category: string;
  index: number;
  inView: boolean;
  isLast: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const { navigateToProject } = useProjectTransition();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      e.button !== 0
    ) {
      return;
    }
    e.preventDefault();
    const rowRect = e.currentTarget.getBoundingClientRect();
    const origin = {
      x: rowRect.left,
      y: rowRect.top,
      width: rowRect.width,
      height: rowRect.height,
    };
    const preview = getProjectPreview(project);
    navigateToProject(slug, preview, origin);
  };

  return (
    <>
      <motion.a
        href={`/work/${slug}`}
        onClick={handleClick}
        initial={{ opacity: 0, x: -20 }}
        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
        transition={{ duration: 1.05, delay: index * 0.1, ease: EASE_OUT_EXPO }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        className="group relative flex items-center gap-6 py-6 px-6 -mx-6 transition-colors duration-500 hover:bg-foreground hover:text-background"
      >
        <motion.span
          className="shrink-0 flex items-center justify-center"
          animate={{ scale: hovered ? 1.2 : 1, rotate: hovered ? 90 : 0 }}
          transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
        >
          <ChevronRight className="size-5" />
        </motion.span>
        
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <motion.h3
            className="font-helveticaNowDisplayBold text-type-project leading-none"
            animate={{ x: hovered ? 8 : 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
          >
            {project.name}
          </motion.h3>
          <motion.p
            className="text-type-project-subtitle font-helveticaNowTextRegular text-muted-foreground group-hover:text-background/50 transition-colors duration-500"
            animate={{ x: hovered ? 8 : 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease: EASE_OUT_EXPO }}
          >
            {category}
          </motion.p>
        </div>

        <span className="text-type-0 font-helveticaNowTextRegular text-muted-foreground group-hover:text-background/40 tabular-nums transition-colors duration-500">
          {project.year}
        </span>
      </motion.a>
      
      {!isLast && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{
            duration: 1.5,
            delay: index * 0.1 + 0.3,
            ease: EASE_OUT_EXPO,
          }}
          className="h-px bg-border origin-left"
        />
      )}
    </>
  );
}
