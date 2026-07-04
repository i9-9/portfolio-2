"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { Project } from "@/app/data/projects";

function CaseStudyHeroVideo({
  src,
  poster,
  className,
}: {
  src: string;
  poster: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const play = () => {
      void video.play().catch(() => {});
    };

    play();
    video.addEventListener("loadeddata", play);
    return () => video.removeEventListener("loadeddata", play);
  }, [src]);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      className={className}
      aria-hidden
    />
  );
}

export function CaseStudyHeroImage({
  project,
  alt,
}: {
  project: Project;
  alt: string;
}) {
  const mobileVideo =
    project.previewVideoMobile ?? project.previewVideo;
  const desktopVideo =
    project.previewVideoDesktop ?? project.previewVideo;

  return (
    <>
      {mobileVideo ? (
        <CaseStudyHeroVideo
          src={mobileVideo}
          poster={project.caseStudyHeroMobile}
          className="absolute inset-0 h-full w-full object-cover object-top md:hidden"
        />
      ) : (
        <Image
          src={project.caseStudyHeroMobile}
          alt={alt}
          fill
          className="object-cover object-top md:hidden"
          sizes="100vw"
          priority
        />
      )}

      {desktopVideo ? (
        <CaseStudyHeroVideo
          src={desktopVideo}
          poster={project.caseStudyHero}
          className="absolute inset-0 hidden h-full w-full object-cover object-top md:block"
        />
      ) : (
        <Image
          src={project.caseStudyHero}
          alt={alt}
          fill
          className="hidden object-cover object-top md:block"
          sizes="100vw"
          priority
        />
      )}
    </>
  );
}
