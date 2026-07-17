"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Project } from "@/app/data/projects";

const DESKTOP_MQ = "(min-width: 768px)";
const MEDIA_CLASS = "absolute inset-0 h-full w-full object-cover object-top";

function CaseStudyHeroVideo({
  src,
  poster,
}: {
  src: string;
  poster: string;
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
      className={MEDIA_CLASS}
      aria-hidden
    />
  );
}

function CaseStudyHeroStill({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover object-top"
      sizes="100vw"
      priority
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

  // SSR / pre-hydration: single poster — never double-fetch media.
  if (isDesktop === null) {
    return <CaseStudyHeroStill src={project.caseStudyHeroMobile} alt={alt} />;
  }

  const video = isDesktop
    ? project.previewVideoDesktop
    : project.previewVideoMobile;
  const poster = isDesktop
    ? project.caseStudyHero
    : project.caseStudyHeroMobile;
  const still = isDesktop
    ? project.caseStudyHero
    : project.caseStudyHeroMobile;

  if (video) {
    return <CaseStudyHeroVideo src={video} poster={poster} />;
  }

  return <CaseStudyHeroStill src={still} alt={alt} />;
}
