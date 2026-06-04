export type ProjectSlug =
  | "heybristol"
  | "kostume"
  | "ursulabenavidez"
  | "templodetierra"
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
  /** Hero image for /work/[slug] case study */
  caseStudyHero: string;
}

export const projects: Project[] = [
  {
    id: 1,
    slug: "heybristol",
    year: 2025,
    name: "Hey Bristol",
    anchor: "https://heybristol.com",
    image: "/projects-heybristol/heybristol_macbook_mockup.png",
    previewImage: "/projects/heybristol.png",
    caseStudyHero: "/projects-v2/heybristol.png",
  },
  {
    id: 2,
    slug: "kostume",
    year: 2025,
    name: "Kostüme",
    anchor: "https://www.kostumeweb.net",
    image: "/projects-landing/kostume/jul:24/4 - Macbook mockup.png",
    previewImage: "/projects/kostume.png",
    caseStudyHero: "/projects-v2/kostume.png",
  },
  {
    id: 3,
    slug: "ursulabenavidez",
    year: 2025,
    name: "Ursula Benavidez",
    anchor: "https://www.ursulabenavidez.com/",
    image: "/projects/ursulabenavidez.png",
    previewImage: "/projects/ursulabenavidez.png",
    caseStudyHero: "/projects-v2/ursulabenavidez.png",
  },
  {
    id: 4,
    slug: "templodetierra",
    year: 2024,
    name: "Templo de Tierra",
    anchor: "https://templodetierra.com",
    image: "/projects/templodetierra.png",
    previewImage: "/projects/templodetierra.png",
    caseStudyHero: "/projects-v2/templodetierra.png",
  },
  {
    id: 5,
    slug: "desenfreno",
    year: 2026,
    name: "El Desenfreno",
    anchor: "https://eldesenfreno.com",
    image: "/projects-eldesenfreno/el_desenfreno_macbook_mockup.png",
    previewImage: "/projects/eldesenfreno.png",
    caseStudyHero: "/projects-v2/eldesenfreno.png",
  },
  {
    id: 6,
    slug: "grupofrali",
    year: 2025,
    name: "Grupo Frali",
    anchor: "https://www.grupofrali.com/",
    image: "/projects-v2/grupofrali.png",
    previewImage: "/projects-v2/grupofrali.png",
    caseStudyHero: "/projects-v2/grupofrali.png",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
