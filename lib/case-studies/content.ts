import type { CaseStudyBundle, CaseStudySlug } from "./types";

export const CASE_STUDIES: Record<CaseStudySlug, CaseStudyBundle> = {
  heybristol: {
    en: {
      headline: "A film production studio. Built to perform at scale.",
      roles: ["Development", "CMS integration", "Performance"],
      stack: ["Next.js", "ISR", "Contentful", "Vimeo API", "Tailwind CSS"],
      challenge: {
        paragraphs: [
          "Hey Bristol came in with the design done.",
          "The problem was technical: heavy video, constantly changing content, and zero tolerance for the site breaking.",
        ],
      },
      keyDecision:
        "I could have used a standard video player. Instead, I built custom controls aligned with the studio's identity — and connected everything to Vimeo via API so the content is real, not embeds. ISR ensures every Contentful update goes live without a redeploy.",
      result:
        "The team manages directors and videos independently. The site runs with static-site performance.",
    },
    es: {
      headline: "Una productora audiovisual. Construida para rendir a escala.",
      roles: ["Desarrollo", "Integración CMS", "Performance"],
      stack: ["Next.js", "ISR", "Contentful", "Vimeo API", "Tailwind CSS"],
      challenge: {
        paragraphs: [
          "Hey Bristol llegó con el diseño resuelto.",
          "El problema era técnico: video pesado, contenido cambiante, y cero tolerancia a que el sitio fallara.",
        ],
      },
      keyDecision:
        "Podría haber usado un player de video estándar. En cambio, construí controles custom alineados con la identidad de la productora — y conecté todo a Vimeo vía API para que el contenido sea real, no embeds. ISR garantiza que cada cambio en Contentful se refleja en el sitio sin redeploy.",
      result:
        "El equipo gestiona directores y videos de forma autónoma. El sitio corre con performance de sitio estático.",
    },
  },
  kostume: {
    en: {
      headline: "Fashion brand that outgrew its platform. So we built a new layer.",
      roles: ["UX/UI design", "Development", "E-commerce"],
      stack: ["Next.js", "Tailwind CSS", "Tienda Nube", "FTP", "CSS/JS"],
      challenge: {
        paragraphs: [
          "Kostüme had a Tienda Nube store.",
          "The platform constrained the design — and the design constrained the brand.",
        ],
      },
      keyDecision:
        "Phase 1: I accessed the Tienda Nube codebase via FTP. I designed and built the full experience from scratch. Phase 2: when the ceiling became clear, I proposed separating the layers. A Next.js landing as the brand's face, with the store running on a subdomain. The transaction still happens in Tienda Nube. Brand control is total.",
      result: "Active relationship — ongoing maintenance and seasonal updates.",
    },
    es: {
      headline: "Una marca de moda que superó su plataforma. Entonces construimos otra capa.",
      roles: ["UX/UI", "Desarrollo", "E-commerce"],
      stack: ["Next.js", "Tailwind CSS", "Tienda Nube", "FTP", "CSS/JS"],
      challenge: {
        paragraphs: [
          "Kostüme tenía una tienda en Tienda Nube.",
          "La plataforma limitaba el diseño — y el diseño limitaba la marca.",
        ],
      },
      keyDecision:
        "Fase 1: intervine el código base de Tienda Nube vía FTP. Diseñé y desarrollé la experiencia completa desde cero. Fase 2: cuando el techo quedó claro, propuse separar las capas. Una landing en Next.js como cara de la marca, con la tienda corriendo en un subdominio. La transacción sigue en Tienda Nube. El control de identidad es total.",
      result: "Relación activa con mantenimiento y actualizaciones de temporada.",
    },
  },
  ursulabenavidez: {
    en: {
      headline: "A portfolio that moves the way her work does.",
      roles: ["Development", "Motion design", "Component design", "CMS integration"],
      stack: ["Next.js", "ISR", "Contentful", "Tailwind CSS", "Custom animations"],
      challenge: {
        paragraphs: [
          "Ursula came in with a defined design direction.",
          "The job was to bring it to life on the web — with animations that matched the tempo of her work, and a system she could update without relying on a developer.",
        ],
      },
      keyDecision:
        "I designed the landing component myself — where the client's visual direction and my implementation judgment merged. Every transition and movement was custom-designed and built. ISR with Contentful: she publishes new projects independently, with static-site performance.",
      result: "Portfolio live. Autonomous content management since launch.",
    },
    es: {
      headline: "Un portfolio que se mueve como se mueve su trabajo.",
      roles: ["Desarrollo", "Motion", "Diseño de componentes", "Integración CMS"],
      stack: ["Next.js", "ISR", "Contentful", "Tailwind CSS", "Animaciones custom"],
      challenge: {
        paragraphs: [
          "Ursula llegó con una dirección de diseño definida.",
          "El trabajo era hacerla cobrar vida en la web — con animaciones que reflejaran el tempo de su trabajo, y un sistema que ella pudiera actualizar sin depender de un dev.",
        ],
      },
      keyDecision:
        "Diseñé el componente de landing yo — donde la dirección visual del cliente y mi criterio de implementación se fusionaron. Cada transición y movimiento fue diseñado e implementado a medida. ISR con Contentful: ella publica proyectos nuevos de forma autónoma, con la performance de un sitio estático.",
      result: "Portfolio live. Gestión autónoma de contenido desde el lanzamiento.",
    },
  },
  templodetierra: {
    en: {
      headline: "Branding and web for a sustainable retreat. Built for a client in Uruguay.",
      roles: ["Branding", "UX/UI design", "Development"],
      stack: ["Next.js", "Tailwind CSS"],
      challenge: {
        paragraphs: [
          "No brand, no digital presence.",
          "The challenge: build an identity that balanced the ancestral and organic with a clear, functional booking experience.",
        ],
      },
      keyDecision:
        "I started with identity — logo, palette, visual direction — before touching the web. The identity had to be flexible enough to work across five temples with distinct personalities, and consistent enough to speak as a single brand.",
      result: "Live site. International client (Uruguay). Full delivery — branding and web.",
    },
    es: {
      headline: "Branding y web para un refugio sostenible. Para un cliente en Uruguay.",
      roles: ["Branding", "UX/UI", "Desarrollo"],
      stack: ["Next.js", "Tailwind CSS"],
      challenge: {
        paragraphs: [
          "No había marca ni presencia digital.",
          "El desafío: construir una identidad que equilibrara lo ancestral y orgánico con una experiencia de reserva clara y funcional.",
        ],
      },
      keyDecision:
        "Arranqué por la identidad — logo, paleta, dirección visual — antes de tocar la web. La identidad tuvo que ser lo suficientemente flexible para funcionar en cinco templos con personalidades distintas, y lo suficientemente consistente para hablar como una sola marca.",
      result: "Sitio live. Cliente en Uruguay. Entrega integral — branding y web.",
    },
  },
  desenfreno: {
    en: {
      headline:
        "Editorial, blog and store — for a poetry publisher that lives between literature and music.",
      roles: ["UX/UI design", "Development", "E-commerce", "CMS integration"],
      stack: ["Next.js", "ISR", "Contentful", "Tailwind CSS", "Bandcamp integration"],
      challenge: {
        paragraphs: [
          "An independent poetry publisher that also releases sound compilations.",
          "Needed three things working together: strong editorial identity, a blog, and a store to sell the catalog.",
        ],
      },
      keyDecision:
        "The Bandcamp integration was the key decision: instead of sending visitors elsewhere to listen, sound release previews play directly inside the site. The blog runs on Contentful with ISR — the editorial team publishes without touching code.",
      result: "Store, blog and editorial running as one system. Autonomous content management.",
    },
    es: {
      headline:
        "Editorial, blog y tienda — para una editorial de poesía entre la literatura y la música.",
      roles: ["UX/UI", "Desarrollo", "E-commerce", "Integración CMS"],
      stack: ["Next.js", "ISR", "Contentful", "Tailwind CSS", "Integración Bandcamp"],
      challenge: {
        paragraphs: [
          "Una editorial independiente de poesía que también publica compilados sonoros.",
          "Necesitaba tres cosas funcionando juntas: identidad editorial fuerte, blog propio, y tienda para vender el catálogo.",
        ],
      },
      keyDecision:
        "La integración con Bandcamp fue la decisión clave: en vez de mandar a los visitantes afuera a escuchar, los previews de los lanzamientos sonoros corren directamente dentro del sitio. El blog corre sobre Contentful con ISR — la editorial publica sin tocar código.",
      result: "Tienda, blog y editorial funcionando como un solo sistema. Gestión autónoma de contenido.",
    },
  },
  grupofrali: {
    en: {
      headline: "Pixel-perfect implementation for a high-end investment group.",
      roles: ["Development", "Motion design", "CMS integration"],
      stack: ["Next.js", "Contentful", "Tailwind CSS", "Custom animations"],
      challenge: {
        paragraphs: [
          "The design was high-end — Wohl Studio.",
          "The job was to match it: pixel-perfect Figma implementation, animations that worked in production, and a CMS the team could actually use.",
        ],
      },
      keyDecision:
        "The critical point of any high-end design implementation is knowing when to adapt and when to be pixel-perfect. The animations were my own work — designed for the pace and weight of the client, implemented with developer judgment and design sensibility.",
      result: "Live site. Faithful to the original design. Contentful CMS operational.",
      creditNote:
        "Design by Wohl Studio. This case study covers implementation.",
    },
    es: {
      headline: "Implementación pixel-perfect para un grupo inversor de alto nivel.",
      roles: ["Desarrollo", "Motion", "Integración CMS"],
      stack: ["Next.js", "Contentful", "Tailwind CSS", "Animaciones custom"],
      challenge: {
        paragraphs: [
          "El diseño era de alto nivel — Wohl Studio.",
          "El trabajo era estar a la altura: implementación fiel al Figma, animaciones que funcionaran en producción, y un CMS que el equipo pudiera usar.",
        ],
      },
      keyDecision:
        "El punto crítico de cualquier implementación de diseño de nivel es saber cuándo adaptar y cuándo ser fiel al pixel. Las animaciones fueron trabajo propio — diseñadas para el ritmo y la seriedad del cliente, implementadas con criterio de developer y sensibilidad de diseñador.",
      result: "Sitio live. Implementación fiel al diseño original. CMS operativo con Contentful.",
      creditNote:
        "El diseño es de Wohl Studio. Este caso de estudio presenta la implementación.",
    },
  },
};

export function isCaseStudySlug(slug: string): slug is CaseStudySlug {
  return Object.hasOwn(CASE_STUDIES, slug);
}
