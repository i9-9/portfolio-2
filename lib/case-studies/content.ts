import type { CaseStudyBundle, CaseStudySlug } from "./types";

export const CASE_STUDIES: Record<CaseStudySlug, CaseStudyBundle> = {
  heybristol: {
    en: {
      // TODO: Translate to EN
      headline:
        "Site for a film production studio. Built for heavy video and frequent content updates.",
      roles: ["Development", "CMS integration", "Performance"],
      stack: ["Next.js", "ISR", "Contentful", "Vimeo API", "Tailwind CSS"],
      body: "Design was done. Problem was implementation. Heavy video files, content updates every week, and the site can't go down. I built the video player from scratch to match their brand. I integrated the Vimeo API to pull content directly—no embeds. I set up ISR so Contentful updates sync without redeploys. Team updates directors and videos themselves. Site performance stayed fast.",
    },
    es: {
      headline:
        "Sitio para una productora audiovisual. Pensado para video pesado y actualizaciones constantes.",
      roles: ["Desarrollo", "Integración CMS", "Performance"],
      stack: ["Next.js", "ISR", "Contentful", "Vimeo API", "Tailwind CSS"],
      body: "El diseño ya estaba resuelto; lo que faltaba era la implementación, y ahí aparecían los problemas reales: archivos de video pesados, actualizaciones cada semana y cero margen para que el sitio se caiga. Construí el player de video desde cero para que coincidiera con la marca en vez de usar un embed genérico, y conecté la API de Vimeo directamente para traer el contenido sin pasar por terceros. Para que las actualizaciones de Contentful entraran sin depender de un redeploy, configuré ISR. Hoy el equipo actualiza videos por su cuenta, y el sitio sigue respondiendo rápido pese al peso de los archivos.",
    },
  },
  kostume: {
    en: {
      // TODO: Translate to EN
      headline:
        "Fashion brand on Tienda\u00A0Nube. Rebuilt the front\u2011end without replacing the checkout.",
      roles: ["UX/UI design", "Development", "E-commerce"],
      stack: ["Next.js", "Tailwind CSS", "Tienda Nube", "FTP", "CSS/JS"],
      body: "They had a Tienda Nube store. Platform limits were killing the design. Needed more control without migrating the entire e-commerce. Phase 1: hacked into Tienda Nube via FTP and rebuilt everything. Phase 2: hit the platform ceiling. Proposed splitting: Next.js landing for the brand, subdomain for the store. Transactions still on Tienda Nube. Full design control. Still working with them. Seasonal updates and ongoing maintenance.",
    },
    es: {
      headline:
        "Marca de moda en Tienda\u00A0Nube. Reconstruí el front\u2011end y mantuve el checkout.",
      roles: ["UX/UI", "Desarrollo", "E-commerce"],
      stack: ["Next.js", "Tailwind CSS", "Tienda Nube", "FTP", "CSS/JS"],
      body: "Kostüme ya tenía su tienda en Tienda Nube, pero los límites de la plataforma le ponían un techo bajo al diseño, y migrar todo el e-commerce no era una opción. Primero entré al código vía FTP y reconstruí lo que se podía dentro de esos límites. Cuando llegué al techo real de la plataforma, propuse separar las cosas: una landing en Next.js para la marca, con control total del diseño, y un subdominio que sigue corriendo en Tienda Nube solo para las transacciones. Sigo trabajando con ellos — cada cambio de temporada y el mantenimiento pasan por mí.",
    },
  },
  ursulabenavidez: {
    en: {
      // TODO: Translate to EN
      headline:
        "Portfolio for an art director. Custom animations with an autonomous CMS.",
      roles: ["Development", "Motion design", "Component design", "CMS integration"],
      stack: ["Next.js", "ISR", "Contentful", "Tailwind CSS", "Custom animations"],
      body: "She had design direction. Needed web implementation. Animations had to match her work. She needed to update projects herself. Designed and built the landing component from scratch. Every animation coded manually to match the pacing. ISR + Contentful so she can publish projects without me. Site live. She's been managing content independently since launch.",
    },
    es: {
      headline:
        "Portfolio para una directora de arte. Animaciones custom con un CMS autónomo.",
      roles: ["Desarrollo", "Motion", "Diseño de componentes", "Integración CMS"],
      stack: ["Next.js", "ISR", "Contentful", "Tailwind CSS", "Animaciones custom"],
      body: "Ursula ya tenía resuelta la dirección de diseño; lo que necesitaba era llevarla a la web sin perder su ritmo visual, y poder actualizar sus proyectos sin depender de mí después del lanzamiento. Diseñé y construí el componente de landing desde cero, codeando cada animación a mano para que respondiera a ese mismo ritmo. Pareé Contentful e ISR, así publica proyectos nuevos sin tocar código. Desde que lanzamos, maneja el sitio sola.",
    },
  },
  desenfreno: {
    en: {
      // TODO: Translate to EN
      headline:
        "Site for a poetry publisher. Blog, store, and embedded audio previews.",
      roles: ["UX/UI design", "Development", "E-commerce", "CMS integration"],
      stack: ["Next.js", "ISR", "Contentful", "Tailwind CSS", "Bandcamp integration"],
      body: "Independent publisher. Poetry books + sound compilations. Needed editorial site, blog, and store in one place. I integrated Bandcamp so audio previews play on the site instead of redirecting users. I built the blog on Contentful with ISR so they can publish without touching code. One system: store, blog, editorial. Content managed autonomously.",
    },
    es: {
      headline:
        "Sitio para una editorial de poesía. Blog, tienda y previews de audio embebidos.",
      roles: ["UX/UI", "Desarrollo", "E-commerce", "Integración CMS"],
      stack: ["Next.js", "ISR", "Contentful", "Tailwind CSS", "Integración Bandcamp"],
      body: "El Desenfreno es una editorial independiente que publica poesía y compilados sonoros, y necesitaba un solo sitio que funcionara como editorial, blog y tienda a la vez. Integré Bandcamp directamente para que los previews de audio se reproduzcan ahí mismo, sin mandar al usuario a otra pestaña, y monté el blog sobre Contentful con ISR para que puedan publicar sin depender de mí. El resultado es un sistema único donde tienda, blog y catálogo editorial conviven, con el contenido gestionado por ellos.",
    },
  },
  grupofrali: {
    en: {
      // TODO: Translate to EN
      headline:
        "Site for a high\u2011end investment group. Pixel\u2011perfect implementation from Figma.",
      roles: ["Development", "Motion design", "CMS integration"],
      stack: ["Next.js", "Contentful", "Tailwind CSS", "Custom animations"],
      body: "Design by Wohl Studio. High-end. Needed pixel-perfect Figma match and animations that work in production. Knowing when to match the pixel and when to adapt. Built animations from scratch—designed for the client's tone, implemented with technical constraints in mind. Site live. Design matched. CMS functional.",
      creditNote:
        "Design by Wohl Studio. This case study covers implementation.",
    },
    es: {
      headline:
        "Sitio para un grupo inversor. Implementación pixel\u2011perfect del diseño en Figma.",
      roles: ["Desarrollo", "Motion", "Integración CMS"],
      stack: ["Next.js", "Contentful", "Tailwind CSS", "Animaciones custom"],
      body: "Acá el diseño no fue mío — lo hizo Wohl Studio, y mi parte fue llevarlo a producción con un match pixel-perfect en Figma y animaciones que funcionaran de verdad, no solo en el mockup. Construí las animaciones desde cero pensando en el tono que pedía el cliente, ajustándolas donde la implementación real imponía sus propias restricciones: hubo que decidir caso pa pena pelear por el pixel exacto y dónde convenía adaptar. El sitio está en producción, el diseño quedó igualado y el CMS funciona sin fricciones.",
      creditNote:
        "Diseño de Wohl Studio. Este caso presenta la implementación.",
    },
  },
};

export function isCaseStudySlug(slug: string): slug is CaseStudySlug {
  return Object.hasOwn(CASE_STUDIES, slug);
}
