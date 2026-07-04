import type { CaseStudyBundle, CaseStudySlug } from "./types";

export const CASE_STUDIES: Record<CaseStudySlug, CaseStudyBundle> = {
  heybristol: {
    en: {
      headline: "Film production studio site. Built for heavy video and frequent content updates.",
      roles: ["Development", "CMS integration", "Performance"],
      stack: ["Next.js", "ISR", "Contentful", "Vimeo API", "Tailwind CSS"],
      challenge: {
        paragraphs: [
          "Design was done. Problem was implementation. Heavy video files, content updates every week, and the site can't go down.",
        ],
      },
      keyDecision:
        "I built the video player from scratch to match their brand. I integrated the Vimeo API to pull content directly—no embeds. I set up ISR so Contentful updates sync without redeploys.",
      result:
        "Team updates directors and videos themselves. Site performance stayed fast.",
    },
    es: {
      headline: "Sitio para productora audiovisual. Para video pesado y actualizaciones constantes.",
      roles: ["Desarrollo", "Integración CMS", "Performance"],
      stack: ["Next.js", "ISR", "Contentful", "Vimeo API", "Tailwind CSS"],
      challenge: {
        paragraphs: [
          "El diseño estaba hecho. El problema era la implementación. Archivos de video pesados, actualizaciones cada semana, y el sitio no puede caerse.",
        ],
      },
      keyDecision:
        "Construí el player de video desde cero para que coincida con su marca. Integré la API de Vimeo para traer el contenido directo—sin embeds. Configuré ISR para que los updates de Contentful entren sin redeploys.",
      result:
        "El equipo actualiza directores y videos por su cuenta. El performance del sitio se mantuvo rápido.",
    },
  },
  kostume: {
    en: {
      headline: "Fashion brand on Tienda Nube. Rebuilt the front-end, kept the checkout.",
      roles: ["UX/UI design", "Development", "E-commerce"],
      stack: ["Next.js", "Tailwind CSS", "Tienda Nube", "FTP", "CSS/JS"],
      challenge: {
        paragraphs: [
          "They had a Tienda Nube store. Platform limits were killing the design. Needed more control without migrating the entire e-commerce.",
        ],
      },
      keyDecision:
        "Phase 1: hacked into Tienda Nube via FTP and rebuilt everything. Phase 2: hit the platform ceiling. Proposed splitting: Next.js landing for the brand, subdomain for the store. Transactions still on Tienda Nube. Full design control.",
      result: "Still working with them. Seasonal updates and ongoing maintenance.",
    },
    es: {
      headline: "Marca de moda en Tienda Nube. Reconstruí el front-end, mantuve el checkout.",
      roles: ["UX/UI", "Desarrollo", "E-commerce"],
      stack: ["Next.js", "Tailwind CSS", "Tienda Nube", "FTP", "CSS/JS"],
      challenge: {
        paragraphs: [
          "Tenían una tienda en Tienda Nube. Los límites de la plataforma mataban el diseño. Necesitaban más control sin migrar todo el e-commerce.",
        ],
      },
      keyDecision:
        "Fase 1: entré al código de Tienda Nube vía FTP y reconstruí todo. Fase 2: llegué al techo de la plataforma. Propuse dividir: landing en Next.js para la marca, subdominio para la tienda. Transacciones siguen en Tienda Nube. Control total del diseño.",
      result: "Todavía trabajo con ellos. Actualizaciones de temporada y mantenimiento continuo.",
    },
  },
  ursulabenavidez: {
    en: {
      headline: "Portfolio for an art director. Custom animations and autonomous CMS.",
      roles: ["Development", "Motion design", "Component design", "CMS integration"],
      stack: ["Next.js", "ISR", "Contentful", "Tailwind CSS", "Custom animations"],
      challenge: {
        paragraphs: [
          "She had design direction. Needed web implementation. Animations had to match her work. She needed to update projects herself.",
        ],
      },
      keyDecision:
        "Designed and built the landing component from scratch. Every animation coded manually to match the pacing. ISR + Contentful so she can publish projects without me.",
      result: "Site live. She's been managing content independently since launch.",
    },
    es: {
      headline: "Portfolio para directora de arte. Animaciones custom y CMS autónomo.",
      roles: ["Desarrollo", "Motion", "Diseño de componentes", "Integración CMS"],
      stack: ["Next.js", "ISR", "Contentful", "Tailwind CSS", "Animaciones custom"],
      challenge: {
        paragraphs: [
          "Tenía dirección de diseño. Necesitaba implementación web. Las animaciones tenían que coincidir con su trabajo. Necesitaba actualizar proyectos sola.",
        ],
      },
      keyDecision:
        "Diseñé y construí el componente de landing desde cero. Cada animación codificada manualmente para que coincida con el ritmo. ISR + Contentful para que pueda publicar proyectos sin mí.",
      result: "Sitio live. Maneja el contenido de forma independiente desde el lanzamiento.",
    },
  },
  desenfreno: {
    en: {
      headline:
        "Poetry publisher site. Blog, store, and embedded audio previews.",
      roles: ["UX/UI design", "Development", "E-commerce", "CMS integration"],
      stack: ["Next.js", "ISR", "Contentful", "Tailwind CSS", "Bandcamp integration"],
      challenge: {
        paragraphs: [
          "Independent publisher. Poetry books + sound compilations. Needed editorial site, blog, and store in one place.",
        ],
      },
      keyDecision:
        "I integrated Bandcamp so audio previews play on the site instead of redirecting users. I built the blog on Contentful with ISR so they can publish without touching code.",
      result: "One system: store, blog, editorial. Content managed autonomously.",
    },
    es: {
      headline:
        "Sitio para editorial de poesía. Blog, tienda, y previews de audio embebidos.",
      roles: ["UX/UI", "Desarrollo", "E-commerce", "Integración CMS"],
      stack: ["Next.js", "ISR", "Contentful", "Tailwind CSS", "Integración Bandcamp"],
      challenge: {
        paragraphs: [
          "Editorial independiente. Libros de poesía + compilados sonoros. Necesitaban sitio editorial, blog, y tienda en un solo lugar.",
        ],
      },
      keyDecision:
        "Integré Bandcamp para que los previews de audio corran en el sitio en vez de redirigir usuarios. Monté el blog en Contentful con ISR para que publiquen sin tocar código.",
      result: "Un sistema: tienda, blog, editorial. Contenido gestionado de forma autónoma.",
    },
  },
  grupofrali: {
    en: {
      headline: "High-end investment group site. Pixel-perfect Figma implementation.",
      roles: ["Development", "Motion design", "CMS integration"],
      stack: ["Next.js", "Contentful", "Tailwind CSS", "Custom animations"],
      challenge: {
        paragraphs: [
          "Design by Wohl Studio. High-end. Needed pixel-perfect Figma match and animations that work in production.",
        ],
      },
      keyDecision:
        "Knowing when to match the pixel and when to adapt. Built animations from scratch—designed for the client's tone, implemented with technical constraints in mind.",
      result: "Site live. Design matched. CMS functional.",
      creditNote:
        "Design by Wohl Studio. This case study covers implementation.",
    },
    es: {
      headline: "Sitio para grupo inversor. Implementación pixel-perfect de Figma.",
      roles: ["Desarrollo", "Motion", "Integración CMS"],
      stack: ["Next.js", "Contentful", "Tailwind CSS", "Animaciones custom"],
      challenge: {
        paragraphs: [
          "Diseño de Wohl Studio. Alto nivel. Necesitaba match pixel-perfect con Figma y animaciones que funcionen en producción.",
        ],
      },
      keyDecision:
        "Saber cuándo igualar el pixel y cuándo adaptar. Construí las animaciones desde cero—diseñadas para el tono del cliente, implementadas con restricciones técnicas en mente.",
      result: "Sitio live. Diseño igualado. CMS funcional.",
      creditNote:
        "Diseño de Wohl Studio. Este caso presenta la implementación.",
    },
  },
};

export function isCaseStudySlug(slug: string): slug is CaseStudySlug {
  return Object.hasOwn(CASE_STUDIES, slug);
}
