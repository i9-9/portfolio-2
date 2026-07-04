import type { Project } from "@/app/data/projects";

/** Matches Tailwind `md` — mobile layout below 768px. */
export const PROJECT_SCREENSHOT_MOBILE_MAX_WIDTH = 767;

export function isMobileScreenshotViewport(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(`(max-width: ${PROJECT_SCREENSHOT_MOBILE_MAX_WIDTH}px)`).matches;
}

export function getCaseStudyHero(project: Project, mobile = isMobileScreenshotViewport()) {
  return mobile ? project.caseStudyHeroMobile : project.caseStudyHero;
}

export function getProjectPreview(project: Project, mobile = isMobileScreenshotViewport()) {
  return mobile ? project.previewImageMobile : project.previewImage;
}

export function getProjectPreviewVideo(project: Project, mobile = isMobileScreenshotViewport()) {
  if (mobile) {
    return project.previewVideoMobile ?? project.previewVideo;
  }
  return project.previewVideoDesktop ?? project.previewVideo;
}
