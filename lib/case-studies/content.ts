import type { CaseStudyBundle, CaseStudySlug, CaseStudyLocale } from "./types";

function emptyStudy(): CaseStudyLocale {
  return {
    tagline: "",
    client: { paragraphs: [] },
    brief: { paragraphs: [] },
    objectives: [],
    outcomes: { paragraphs: [] },
    process: [],
    stack: [],
  };
}

export const CASE_STUDIES: Record<CaseStudySlug, CaseStudyBundle> = {
  heybristol: {
    en: {
      tagline:
        "A technical implementation for an audiovisual production company, built around real video, fast navigation, and self-managed content.",
      client: {
        paragraphs: [
          "Hey Bristol is a Buenos Aires-based audiovisual production company.",
          "They came in with the design solved — they needed someone to implement it right.",
        ],
      },
      brief: {
        paragraphs: [
          "The challenge was technical, not visual: build an experience that showcased each director's work with real video, without compromising performance, and without requiring a developer every time content needed to change.",
        ],
      },
      objectives: [],
      outcomes: {
        paragraphs: [
          "The solution was a Next.js app built on Contentful as a headless CMS — the Hey Bristol team can add directors, update content and manage videos without touching code.",
          "Each director has their own section with a looping video preview; clicking through loads the full video pulled from the Vimeo API, with custom controls designed to match the site's identity. Navigation between directors is seamless, no full page reloads.",
          "The site uses Incremental Static Regeneration (ISR): pages are served statically for maximum speed and automatically regenerate when content changes in Contentful — no manual redeploys needed. Performance work included targeted video compression and lazy loading to keep the site fast despite heavy media content.",
        ],
      },
      process: [],
      stack: [
        "Next.js (ISR)",
        "Contentful",
        "Vimeo API",
        "Tailwind CSS",
        "Custom video controls",
        "Video compression & optimization",
      ],
    },
    es: {
      tagline:
        "Una implementación técnica para una productora audiovisual, pensada para video real, navegación rápida y contenido autogestionable.",
      client: {
        paragraphs: [
          "Hey Bristol es una productora audiovisual con sede en Buenos Aires.",
          "Llegaron con el diseño resuelto: necesitaban a alguien que lo implementara bien.",
        ],
      },
      brief: {
        paragraphs: [
          "El desafío no era visual sino técnico: construir una experiencia que mostrara el trabajo de cada director con video real, sin que la performance se cayera y sin que el contenido dependiera de un desarrollador para actualizarse.",
        ],
      },
      objectives: [],
      outcomes: {
        paragraphs: [
          "La solución fue una app construida sobre Contentful como CMS headless — el equipo de Hey Bristol puede agregar directores, actualizar contenido y gestionar videos sin tocar código.",
          "Cada director tiene su propia sección con preview de video en loop, y al ingresar se accede al video completo traído desde Vimeo vía API, con controles custom diseñados para la identidad del sitio. La navegación entre directores es fluida, sin recargas.",
          "El sitio usa Incremental Static Regeneration (ISR): las páginas se sirven como estáticas para máxima velocidad y se regeneran automáticamente cuando el contenido cambia en Contentful — sin redeploys manuales. El trabajo de performance incluyó compresiones específicas por tipo de video y carga diferida para mantener la web rápida con contenido pesado.",
        ],
      },
      process: [],
      stack: [
        "Next.js (ISR)",
        "Contentful",
        "Vimeo API",
        "Tailwind CSS",
        "Custom video controls",
        "Video compression & optimization",
      ],
    },
  },
  kostume: {
    en: {
      tagline:
        "A two-phase e-commerce project: first improving the existing Tienda Nube store, then giving the brand a fully custom front door.",
      client: {
        paragraphs: [
          "Kostüme is a Buenos Aires-based fashion brand with an online store.",
          "When they came in, their e-commerce was running on Tienda Nube but the platform wasn't reflecting the brand's visual level — the shopping experience needed to match the product.",
        ],
      },
      brief: {
        paragraphs: [
          "The work started inside the existing platform, but over time it became clear that Tienda Nube had a ceiling. Kostüme needed more control over design, performance and the first impression of the brand.",
        ],
      },
      objectives: [],
      outcomes: {
        paragraphs: [
          "The result is a brand that controls its digital identity without being constrained by platform templates. The relationship continues with monthly maintenance and seasonal updates.",
        ],
      },
      process: [
        {
          phase: "Phase 1 — Tienda Nube customization",
          text: "We accessed the Tienda Nube codebase via FTP and reworked the base template to align with Kostüme's branding. I designed and developed the full experience from scratch: navigation architecture, product presentation and UI — all within the platform's constraints.",
        },
        {
          phase: "Phase 2 — Custom presentation layer",
          text: "I proposed separating the presentation layer from the e-commerce engine: a Next.js landing page as the main face of Kostüme, with the shop running on its own subdomain. All calls to action point to the store — the transaction still happens in Tienda Nube, but the first impression is fully custom.",
        },
      ],
      stack: [
        "Phase 1: Tienda Nube",
        "Phase 1: FTP",
        "Phase 1: CSS/JS",
        "Phase 1: UX/UI",
        "Phase 2: Next.js",
        "Phase 2: Tailwind CSS",
        "Phase 2: Tienda Nube (subdomain)",
      ],
    },
    es: {
      tagline:
        "Un proyecto e-commerce en dos fases: primero mejorar la tienda en Tienda Nube, después construir una entrada completamente custom para la marca.",
      client: {
        paragraphs: [
          "Kostüme es una marca de moda con tienda online basada en Buenos Aires.",
          "Cuando llegaron, tenían su e-commerce en Tienda Nube pero la plataforma no reflejaba el nivel visual de la marca — necesitaban que la experiencia de compra estuviera a la altura del producto.",
        ],
      },
      brief: {
        paragraphs: [
          "El trabajo empezó dentro de la plataforma existente, pero con el tiempo quedó claro que Tienda Nube tenía un techo. Kostüme necesitaba más control sobre el diseño, la performance y la experiencia de entrada a la marca.",
        ],
      },
      objectives: [],
      outcomes: {
        paragraphs: [
          "El resultado es una marca que controla su identidad digital sin estar limitada por los templates de una plataforma. La relación continúa con mantenimiento mensual y actualizaciones de temporada.",
        ],
      },
      process: [
        {
          phase: "Fase 1 — Customización en Tienda Nube",
          text: "Accedimos al código de Tienda Nube vía FTP e intervenimos la plantilla base para alinearla con el branding de Kostüme. Diseñé y desarrollé la experiencia completa: arquitectura de navegación, diseño de producto y UI — todo desde cero dentro de las posibilidades de la plataforma.",
        },
        {
          phase: "Fase 2 — Capa de presentación custom",
          text: "Propuse separar la capa de presentación del e-commerce: una landing page construida en Next.js como cara principal de Kostüme, con el eshop corriendo en un subdominio propio. Todos los calls to action apuntan al store — la transacción sigue ocurriendo en Tienda Nube, pero la primera impresión es completamente custom.",
        },
      ],
      stack: [
        "Fase 1: Tienda Nube",
        "Fase 1: FTP",
        "Fase 1: CSS/JS",
        "Fase 1: UX/UI",
        "Fase 2: Next.js",
        "Fase 2: Tailwind CSS",
        "Fase 2: Tienda Nube (subdominio)",
      ],
    },
  },
  vinorodante: {
    en: {
      tagline:
        "A bespoke wine e-commerce built from zero, covering brand identity, product architecture, subscription logic and storefront development.",
      client: {
        paragraphs: [
          "Vino Rodante is an Argentine wine shop with a weekly subscription model.",
          "The project started from scratch: no brand, no platform, no visual identity.",
        ],
      },
      brief: {
        paragraphs: [
          "I handled the project end to end. First the identity: name direction, logo, color palette and full creative direction — positioned to sit in the accessible premium segment.",
          "Then the product architecture and user experience: purchase flows, subscription club system (Tinto, Blanco, Naranjo, Mixto) and product catalog design.",
        ],
      },
      objectives: [],
      outcomes: {
        paragraphs: [
          "The result is a bespoke e-commerce that can scale with the brand.",
        ],
      },
      process: [
        {
          phase: "Brand and product system",
          text: "The project started with the name, logo, color palette and creative direction, then moved into the purchase flows, subscription clubs and catalog structure.",
        },
        {
          phase: "Custom commerce build",
          text: "The core technical decision was to not use a generic e-commerce platform. I built the full store in Next.js with Supabase for database and image storage — giving complete control over design, performance and business logic without the constraints or fees of a SaaS solution.",
        },
      ],
      stack: [
        "Next.js",
        "Supabase",
        "Tailwind CSS",
        "Branding",
        "UX/UI",
        "Creative direction",
      ],
    },
    es: {
      tagline:
        "Un e-commerce de vinos a medida, construido desde cero: identidad, arquitectura de producto, lógica de suscripción y desarrollo del store.",
      client: {
        paragraphs: [
          "Vino Rodante es una tienda online de vinos argentinos con modelo de suscripción semanal.",
          "El proyecto arrancó desde cero: no había marca, no había plataforma, no había identidad visual.",
        ],
      },
      brief: {
        paragraphs: [
          "Desarrollé el proyecto de forma integral. Primero la identidad: nombre, logo, paleta y dirección creativa completa — todo orientado a posicionar la marca en el segmento premium accesible.",
          "Después la arquitectura del producto y la experiencia de usuario, diseñando los flujos de compra, el sistema de clubs de suscripción (Tinto, Blanco, Naranjo, Mixto) y el catálogo de productos.",
        ],
      },
      objectives: [],
      outcomes: {
        paragraphs: [
          "El resultado es un e-commerce a medida que puede crecer con la marca.",
        ],
      },
      process: [
        {
          phase: "Sistema de marca y producto",
          text: "El proyecto empezó por el nombre, logo, paleta y dirección creativa, y después avanzó hacia los flujos de compra, los clubs de suscripción y la estructura del catálogo.",
        },
        {
          phase: "Desarrollo de commerce custom",
          text: "La decisión técnica central fue no usar una plataforma de e-commerce genérica. Construí el store completo en Next.js con Supabase como base de datos y storage de imágenes — lo que da control total sobre el diseño, la performance y la lógica de negocio sin las limitaciones ni las comisiones de un SaaS.",
        },
      ],
      stack: [
        "Next.js",
        "Supabase",
        "Tailwind CSS",
        "Branding",
        "UX/UI",
        "Dirección creativa",
      ],
    },
  },
  ursulabenavidez: {
    en: {
      tagline:
        "A portfolio for an art director, production designer and set designer, built to feel visual, autonomous and fast.",
      client: {
        paragraphs: [
          "Ursula Benavidez is a Buenos Aires-based art director, production designer and set designer.",
          "She needed an online portfolio that matched the level of her visual work — and that she could update without relying on a developer every time she closed a new project.",
        ],
      },
      brief: {
        paragraphs: [
          "She came in with an idea and a defined design direction. My job was to bring that design to life on the web.",
        ],
      },
      objectives: [],
      outcomes: {
        paragraphs: [
          "I built the site in Next.js with Contentful as a headless CMS and ISR, allowing her to manage and publish projects autonomously from a simple dashboard, with static-site performance.",
          "The landing page component was my own design work — the point where the client's visual direction and my implementation judgment merged. The animations are also my own: every transition and movement was designed and built to reflect the tempo and sensibility of Ursula's work, without overloading the experience.",
        ],
      },
      process: [],
      stack: [
        "Next.js (ISR)",
        "Contentful",
        "Tailwind CSS",
        "Custom animations",
      ],
    },
    es: {
      tagline:
        "Un portfolio para una directora de arte, diseñadora de producción y escenógrafa, pensado para sentirse visual, autónomo y rápido.",
      client: {
        paragraphs: [
          "Ursula Benavidez es directora de arte, diseñadora de producción y escenógrafa con base en Buenos Aires.",
          "Necesitaba un portfolio online que estuviera a la altura de su trabajo visual — y que pudiera actualizarse sin depender de un desarrollador cada vez que cerraba un proyecto nuevo.",
        ],
      },
      brief: {
        paragraphs: [
          "Llegó con una idea y una dirección de diseño definida. Mi trabajo fue llevar ese diseño a la web y hacerlo cobrar vida.",
        ],
      },
      objectives: [],
      outcomes: {
        paragraphs: [
          "Implementé el sitio en Next.js con Contentful como CMS headless e ISR, lo que le permite gestionar y publicar sus proyectos de forma autónoma desde un panel simple, con el rendimiento de un sitio estático.",
          "El componente de landing page lo diseñé yo — fue el punto donde la dirección visual del cliente y mi criterio de implementación se fusionaron. Las animaciones también son trabajo propio: cada transición y movimiento fue diseñado e implementado para reflejar el tempo y la sensibilidad del trabajo de Ursula, sin sobrecargar la experiencia.",
        ],
      },
      process: [],
      stack: [
        "Next.js (ISR)",
        "Contentful",
        "Tailwind CSS",
        "Animaciones custom",
      ],
    },
  },
  templodetierra: {
    en: {
      tagline:
        "A full-service identity and web project for a sustainable bio-construction accommodation in Uruguay.",
      client: {
        paragraphs: [
          "Templo de Tierra is a sustainable bio-construction accommodation in Punta del Este, Uruguay.",
          "Each temple is built using ancestral techniques and has its own identity — the challenge was translating that sensibility into a coherent digital presence.",
        ],
      },
      brief: {
        paragraphs: [
          "I handled the project end to end: full branding (logo, color palette, visual identity) and web development.",
          "The design direction had to balance the organic and ancestral with a clear, functional browsing experience for guests looking to book.",
        ],
      },
      objectives: [],
      outcomes: {
        paragraphs: [
          "The site includes five individual temple pages, plus an experiences section and contact.",
          "It is built in Next.js with a static architecture — performant, lightweight and easy to maintain. International client, full-service delivery.",
        ],
      },
      process: [],
      stack: [
        "Next.js",
        "Tailwind CSS",
        "Branding",
        "UX/UI",
        "Editorial design",
      ],
    },
    es: {
      tagline:
        "Un proyecto integral de identidad y web para un alojamiento sostenible en bioconstrucción en Uruguay.",
      client: {
        paragraphs: [
          "Templo de Tierra es un espacio de alojamiento sostenible en bioconstrucción ubicado en Punta del Este, Uruguay.",
          "Cada templo está construido con técnicas ancestrales y tiene su propia identidad — el desafío era trasladar esa sensibilidad a una presencia digital coherente.",
        ],
      },
      brief: {
        paragraphs: [
          "Hice el proyecto de forma integral: branding completo (logo, paleta, identidad visual) y desarrollo web.",
          "La dirección de diseño tenía que equilibrar lo orgánico y lo ancestral con una experiencia de navegación clara y funcional para quienes buscan reservar.",
        ],
      },
      objectives: [],
      outcomes: {
        paragraphs: [
          "Cinco templos, cada uno con su propia página, más sección de experiencias y contacto.",
          "El sitio está construido en Next.js con arquitectura estática — performante, liviano y de fácil mantenimiento. Cliente internacional, entrega completa.",
        ],
      },
      process: [],
      stack: [
        "Next.js",
        "Tailwind CSS",
        "Branding",
        "UX/UI",
        "Diseño editorial",
      ],
    },
  },
  desenfreno: { en: emptyStudy(), es: emptyStudy() },
  grupofrali: { en: emptyStudy(), es: emptyStudy() },
};

export function isCaseStudySlug(slug: string): slug is CaseStudySlug {
  return Object.hasOwn(CASE_STUDIES, slug);
}
