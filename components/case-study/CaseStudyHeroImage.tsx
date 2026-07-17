"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Project } from "@/app/data/projects";

const DESKTOP_MQ = "(min-width: 768px)";

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

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_MQ);
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isDesktop;
}

export function CaseStudyHeroImage({
  project,
  alt,
}: {
  project: Project;
  alt: string;
}) {
  const isDesktop = useIsDesktop();

  // SSR / pre-hydration: single poster so we never double-fetch media.
  if (isDesktop === null) {
    return (
      <Image
        src={project.caseStudyHeroMobile}
        alt={alt}
        fill
        className="object-cover object-top"
        sizes="100vw"
        priority
      />
    );
  }

  if (isDesktop) {
    const desktopVideo =
      project.previewVideoDesktop ?? project.previewVideo;
    return desktopVideo ? (
      <CaseStudyHeroVideo
        src={desktopVideo}
        poster={project.caseStudyHero}
        className="absolute inset-0 h-full w-full object-cover object-top"
      />
    ) : (
      <Image
        src={project.caseStudyHero}
        alt={alt}
        fill
        className="object-cover object-top"
        sizes="100vw"
        priority
      />
    );
  }

  const mobileVideo = project.previewVideoMobile ?? project.previewVideo;
  return mobileVideo ? (
    <CaseStudyHeroVideo
      src={mobileVideo}
      poster={project.caseStudyHeroMobile}
      className="absolute inset-0 h-full w-full object-cover object-top"
    />
  ) : (
    <Image
      src={project.caseStudyHeroMobile}
      alt={alt}
      fill
      className="object-cover object-top"
      sizes="100vw"
      priority
    />
  );
}
