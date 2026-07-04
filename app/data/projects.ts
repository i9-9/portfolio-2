export type ProjectSlug =
  | "heybristol"
  | "kostume"
  | "ursulabenavidez"
  | "desenfreno"
  | "grupofrali";

export interface Project {
  id: number;
  slug: ProjectSlug;
  year: number;
  name: string;
  anchor: string;
  image: string;
  previewImage: string;
  /** Mobile viewport preview (390px) for transitions and listings */
  previewImageMobile: string;
  /** Optional looping video — mobile viewport (case study hero, mobile thumb) */
  previewVideoMobile?: string;
  /** Optional looping video — desktop viewport (case study hero, hover preview) */
  previewVideoDesktop?: string;
  /** @deprecated Use previewVideoMobile / previewVideoDesktop */
  previewVideo?: string;
  /** Brand logo for route transition overlay */
  logo: string;
  /** Hero image for /work/[slug] case study — desktop viewport */
  caseStudyHero: string;
  /** Hero image for /work/[slug] case study — mobile viewport */
  caseStudyHeroMobile: string;
  /** Intrinsic pixel dimensions of caseStudyHero */
  heroWidth: number;
  heroHeight: number;
  /** Intrinsic pixel dimensions of caseStudyHeroMobile */
  heroMobileWidth: number;
  heroMobileHeight: number;
}

export const projects: Project[] = [
  {
    id: 1,
    slug: "heybristol",
    year: 2025,
    name: "Hey Bristol",
    anchor: "https://heybristol.com",
    image: "/projects-heybristol/heybristol_macbook_mockup.png",
    previewImage: "/projects-v2/heybristol.png",
    previewImageMobile: "/projects-v2/heybristol-mobile.png",
    previewVideoMobile: "/projects-v2/heybristol-preview-mobile.mp4",
    previewVideoDesktop: "/projects-v2/heybristol-preview-desktop.mp4",
    logo: "/project-logos/heybristol.svg",
    caseStudyHero: "/projects-v2/heybristol.png",
    caseStudyHeroMobile: "/projects-v2/heybristol-mobile.png",
    heroWidth: 2880,
    heroHeight: 1800,
    heroMobileWidth: 780,
    heroMobileHeight: 1688,
  },
  {
    id: 2,
    slug: "kostume",
    year: 2025,
    name: "Kostüme",
    anchor: "https://www.kostumeweb.net",
    image: "/projects-landing/kostume/jul:24/4 - Macbook mockup.png",
    previewImage: "/projects-v2/kostume.png",
    previewImageMobile: "/projects-v2/kostume-mobile.png",
    previewVideoMobile: "/projects-v2/kostume-preview-mobile.mp4",
    previewVideoDesktop: "/projects-v2/kostume-preview-desktop.mp4",
    logo: "/project-logos/kostume.svg",
    caseStudyHero: "/projects-v2/kostume.png",
    caseStudyHeroMobile: "/projects-v2/kostume-mobile.png",
    heroWidth: 2880,
    heroHeight: 1800,
    heroMobileWidth: 780,
    heroMobileHeight: 1688,
  },
  {
    id: 3,
    slug: "ursulabenavidez",
    year: 2025,
    name: "Ursula Benavidez",
    anchor: "https://www.ursulabenavidez.com/",
    image: "/projects/ursulabenavidez.png",
    previewImage: "/projects-v2/ursulabenavidez.png",
    previewImageMobile: "/projects-v2/ursulabenavidez-mobile.png",
    previewVideoMobile: "/projects-v2/ursulabenavidez-preview-mobile.mp4",
    previewVideoDesktop: "/projects-v2/ursulabenavidez-preview-desktop.mp4",
    logo: "/project-logos/ursulabenavidez.svg",
    caseStudyHero: "/projects-v2/ursulabenavidez.png",
    caseStudyHeroMobile: "/projects-v2/ursulabenavidez-mobile.png",
    heroWidth: 2880,
    heroHeight: 1800,
    heroMobileWidth: 780,
    heroMobileHeight: 1688,
  },
  {
    id: 4,
    slug: "desenfreno",
    year: 2026,
    name: "El Desenfreno",
    anchor: "https://eldesenfreno.com",
    image: "/projects-eldesenfreno/el_desenfreno_macbook_mockup.png",
    previewImage: "/projects-v2/eldesenfreno.png",
    previewImageMobile: "/projects-v2/eldesenfreno-mobile.png",
    previewVideoMobile: "/projects-v2/eldesenfreno-preview-mobile.mp4",
    previewVideoDesktop: "/projects-v2/eldesenfreno-preview-desktop.mp4",
    logo: "/project-logos/desenfreno.png",
    caseStudyHero: "/projects-v2/eldesenfreno.png",
    caseStudyHeroMobile: "/projects-v2/eldesenfreno-mobile.png",
    heroWidth: 2880,
    heroHeight: 1792,
    heroMobileWidth: 780,
    heroMobileHeight: 1688,
  },
  {
    id: 5,
    slug: "grupofrali",
    year: 2025,
    name: "Grupo Frali",
    anchor: "https://www.grupofrali.com/",
    image: "/projects-v2/grupofrali.png",
    previewImage: "/projects-v2/grupofrali.png",
    previewImageMobile: "/projects-v2/grupofrali-mobile.png",
    previewVideoMobile: "/projects-v2/grupofrali-preview-mobile.mp4",
    previewVideoDesktop: "/projects-v2/grupofrali-preview-desktop.mp4",
    logo: "/project-logos/grupofrali.svg",
    caseStudyHero: "/projects-v2/grupofrali.png",
    caseStudyHeroMobile: "/projects-v2/grupofrali-mobile.png",
    heroWidth: 2880,
    heroHeight: 1800,
    heroMobileWidth: 780,
    heroMobileHeight: 1688,
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
