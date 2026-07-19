"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { getProjectBySlug, type ProjectSlug } from "@/app/data/projects";
import { useProjectTransition } from "@/lib/transitions/ProjectTransitionContext";
import { getProjectPreview } from "@/lib/projects/screenshot";
import { EASE_OUT_EXPO } from "@/lib/motion/easing";

interface ProjectGridProps {
  projectKeys: string[];
  inView: boolean;
}

export function ProjectGrid({ projectKeys, inView }: ProjectGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {projectKeys.map((key, index) => {
        const project = getProjectBySlug(key);
        if (!project) return null;
        return (
          <ProjectGridCard
            key={key}
            slug={key as ProjectSlug}
            project={project}
            index={index}
            inView={inView}
          />
        );
      })}
    </div>
  );
}

function ProjectGridCard({
  slug,
  project,
  index,
  inView,
}: {
  slug: ProjectSlug;
  project: NonNullable<ReturnType<typeof getProjectBySlug>>;
  index: number;
  inView: boolean;
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
    const cardRect = e.currentTarget.getBoundingClientRect();
    const origin = {
      x: cardRect.left,
      y: cardRect.top,
      width: cardRect.width,
      height: cardRect.height,
    };
    const preview = getProjectPreview(project);
    navigateToProject(slug, preview, origin);
  };

  return (
    <motion.a
      href={`/work/${slug}`}
      onClick={handleClick}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 1.05, delay: index * 0.08, ease: EASE_OUT_EXPO }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group relative flex flex-col overflow-hidden border-2 border-foreground/10 transition-colors duration-500 hover:border-foreground/30"
    >
      <div className="relative w-full aspect-[16/10] bg-muted overflow-hidden">
        <motion.div
          className="absolute inset-0"
          animate={{ scale: hovered ? 1.05 : 1 }}
          transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
        >
          <Image
            src={project.previewImage}
            alt={project.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </motion.div>
      </div>
      <div className="flex flex-col gap-2 p-4 lg:p-5 bg-background">
        <motion.h3
          className="font-helveticaNowDisplayBold text-type-project leading-none"
          animate={{ x: hovered ? 4 : 0 }}
          transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
        >
          {project.name}
        </motion.h3>
        <p className="text-type-project-subtitle font-helveticaNowTextRegular text-muted-foreground">
          {project.year}
        </p>
      </div>
    </motion.a>
  );
}
