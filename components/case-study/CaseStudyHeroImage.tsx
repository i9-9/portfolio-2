import type { CSSProperties } from "react";
import Image from "next/image";
import type { Project } from "@/app/data/projects";

function heroFitStyle(width: number, height: number): CSSProperties {
  return {
    width: `min(100vw, calc(100dvh * ${width} / ${height}))`,
    height: `min(100dvh, calc(100vw * ${height} / ${width}))`,
  };
}

export function CaseStudyHeroImage({
  project,
  alt,
}: {
  project: Project;
  alt: string;
}) {
  return (
    <div className="flex h-full w-full items-start justify-center bg-background">
      <div
        className="relative md:hidden"
        style={heroFitStyle(project.heroMobileWidth, project.heroMobileHeight)}
      >
        <Image
          src={project.caseStudyHeroMobile}
          alt={alt}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </div>
      <div
        className="relative hidden md:block"
        style={heroFitStyle(project.heroWidth, project.heroHeight)}
      >
        <Image
          src={project.caseStudyHero}
          alt={alt}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </div>
    </div>
  );
}
