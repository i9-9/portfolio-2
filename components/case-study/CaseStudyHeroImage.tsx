import Image from "next/image";
import type { Project } from "@/app/data/projects";

export function CaseStudyHeroImage({
  project,
  alt,
}: {
  project: Project;
  alt: string;
}) {
  return (
    <>
      <Image
        src={project.caseStudyHeroMobile}
        alt={alt}
        width={project.heroMobileWidth}
        height={project.heroMobileHeight}
        className="relative -mt-px block h-auto w-full md:hidden"
        sizes="100vw"
        priority
      />
      <Image
        src={project.caseStudyHero}
        alt={alt}
        width={project.heroWidth}
        height={project.heroHeight}
        className="relative -mt-px hidden h-auto w-full md:block"
        sizes="100vw"
        priority
      />
    </>
  );
}
