import type { CaseStudyBundle, CaseStudySlug } from "./types";

export const CASE_STUDIES: Record<CaseStudySlug, CaseStudyBundle> = {
  heybristol: {
    en: {
      tagline:
        "A production company site with cinematic rhythm and room for the work to breathe.",
      client: {
        paragraphs: [
          "Hey Bristol is an audiovisual production studio focused on commercials, branded content and short-form storytelling. They needed a digital presence that felt as intentional as their frames — minimal chrome, strong typography, and hierarchy that lets projects lead.",
        ],
      },
      brief: {
        paragraphs: [
          "The previous site fragmented reels, credits and contact across noisy layouts. Stakeholders asked for a faster, editorial portfolio: large visuals, scannable services, and a CMS that non-technical producers could update between shoots.",
          "Performance and clarity were non-negotiable; the experience had to feel premium on-location cellular networks and studio Wi‑Fi alike.",
        ],
      },
      objectives: [
        "Rebuild the portfolio as a single, confident narrative — work first, company second.",
        "Ship a Next.js frontend with a straightforward content model for cases and reels.",
        "Keep interaction subtle: motion only where it clarifies hierarchy, never decoration for its own sake.",
      ],
      outcomes: {
        paragraphs: [
          "We delivered a production-ready marketing site with a calm grid, cinematic hero moments and case templates that scale from single-spot campaigns to longer showreel spreads.",
          "Loading states and image pipelines were tuned so large stills stay sharp without punishing Core Web Vitals.",
        ],
        highlights: [
          "Editorial layout system aligned to the studio’s Swiss-leaning art direction.",
          "Dynamic case studies with modular media blocks.",
        ],
      },
      process: [
        {
          phase: "Discovery",
          text: "Audited legacy IA, mapped producer and client journeys, defined the minimum viable CMS fields for shipping fast between productions.",
        },
        {
          phase: "Design",
          text: "Low-fidelity wireframes in Figma → high-fidelity UI with a strict type ramp and spacing cadence borrowed from print editorial.",
        },
        {
          phase: "Build",
          text: "Next.js App Router, modular React sections, CMS integration, accessibility and SEO baselines before handoff.",
        },
        {
          phase: "Launch",
          text: "Staging reviews with real project assets, image optimization pass, analytics hooks, then cutover with redirects preserved.",
        },
      ],
      stack: ["Next.js", "TypeScript", "React", "Figma", "Headless CMS"],
    },
    es: {
      tagline:
        "Sitio para productora con ritmo cinematográfico y espacio para que el trabajo respire.",
      client: {
        paragraphs: [
          "Hey Bristol es un estudio de producción audiovisual enfocado en publicidad, branded content y narrativas breves. Necesitaban una presencia digital tan intencionada como sus planos: poco cromo, tipografía fuerte y jerarquía que dejara protagonismo a los proyectos.",
        ],
      },
      brief: {
        paragraphs: [
          "El sitio anterior fragmentaba reels, créditos y contacto en layouts ruidosos. El equipo pedía un portfolio más rápido y editorial: grandes visuales, servicios escaneables y un CMS que productores sin perfil técnico pudieran actualizar entre rodajes.",
          "Rendimiento y claridad eran obligatorios; debía sentirse bien tanto en 4G en locación como en Wi‑Fi de estudio.",
        ],
      },
      objectives: [
        "Reconstruir el portfolio como una sola narrativa firme: trabajo primero, estudio después.",
        "Entregar un front Next.js con un modelo de contenido claro para casos y reels.",
        "Mantener la interacción sutil: movimiento solo donde ordena jerarquía, no decoración.",
      ],
      outcomes: {
        paragraphs: [
          "Sitio listo para producción con grilla serena, hero cinematográfico y plantillas que escalan de spots únicos a piezas tipo showreel.",
          "Afinamos pipeline de imágenes y estados de carga para que archivos grandes se vean nítidos sin castigar Core Web Vitals.",
        ],
        highlights: [
          "Sistema editorial alineado a la dirección de arte tipo suizo del estudio.",
          "Casos dinámicos con bloques de media modulares.",
        ],
      },
      process: [
        {
          phase: "Descubrimiento",
          text: "Auditoría de la IA legada, mapas de journey para productores y clientes, campos mínimos del CMS para iterar rápido.",
        },
        {
          phase: "Diseño",
          text: "Wireframes en Figma → UI con rampa tipográfica y ritmo de espacio heredado de editorial impresa.",
        },
        {
          phase: "Desarrollo",
          text: "Next.js App Router, secciones React modulares, CMS, accesibilidad y SEO base antes del cierre.",
        },
        {
          phase: "Lanzamiento",
          text: "Revisiones en staging con assets reales, pasada de optimización de imágenes, analytics y migración con redirects.",
        },
      ],
      stack: ["Next.js", "TypeScript", "React", "Figma", "CMS headless"],
    },
  },

  kostume: {
    en: {
      tagline:
        "Fashion e-commerce where quiet UI lets product and tailoring stay in focus.",
      client: {
        paragraphs: [
          "Kostüme is a fashion e-commerce label balancing editorial shoots with high-volume seasonal drops. Their team needed a storefront that could feel boutique while supporting inventory-heavy flows and a custom checkout.",
        ],
      },
      brief: {
        paragraphs: [
          "The mandate was dual: elevate brand perception (lookbooks, typographic restraint) without compromising conversion paths — size guides, stock accuracy and payment reliability under peak traffic.",
          "Integration with Tienda Nube was required for operations the team already trusted, with room to extend components where the template language fell short.",
        ],
      },
      objectives: [
        "Ship in roughly six weeks without sacrificing QA on checkout edge cases.",
        "Design a modular PDP and PLP system that scales for new collections.",
        "Keep editorial storytelling zones (featured stories) distinct from transactional blocks.",
      ],
      outcomes: {
        paragraphs: [
          "A live storefront pairing minimalist layout with resilient catalog performance. Custom checkout refinements reduced friction in the final funnel steps.",
          "Design tokens were documented so future drops can reuse components without redesigning the grid.",
        ],
        highlights: [
          "Tight collaboration between design and operations to mirror real stock rules.",
          "Reusable bundle for campaign landing pages tied to CRM sends.",
        ],
      },
      process: [
        {
          phase: "Discovery",
          text: "Mapped SKU structure, return policies and peak sale windows; prioritized flows that touched revenue first.",
        },
        {
          phase: "Design",
          text: "Mobile-first PLP/PDP exploration → desktop grid; defined type scale and spacing tied to garment photography ratios.",
        },
        {
          phase: "Build",
          text: "Next.js surfaces with Tienda Nube integration, component QA on slow networks, analytics funnels verified before launch.",
        },
        {
          phase: "Handoff",
          text: "Training for merchandising on updating lookbooks, playbook for seasonal refreshes, backlog for post-launch enhancements.",
        },
      ],
      stack: ["Next.js", "TypeScript", "Tienda Nube", "Figma"],
    },
    es: {
      tagline:
        "E-commerce de moda donde la interfaz silenciosa deja el producto en foco.",
      client: {
        paragraphs: [
          "Kostüme es una marca de moda e-commerce que combina producciones editoriales con drops estacionales con mucho volumen. Necesitaban una tienda que se sintiera boutique sin sacrificar flujos de inventario ni un checkout a medida.",
        ],
      },
      brief: {
        paragraphs: [
          "El mandato era doble: elevar la percepción de marca (lookbooks, tipografía sobria) sin comprometer conversión — guías de talles, stock fiable y pagos estables en picos de tráfico.",
          "La integración con Tienda Nube era obligatoria por operaciones que ya dominaban, con margen para extender componentes donde la plantilla quedaba corta.",
        ],
      },
      objectives: [
        "Salir en ~6 semanas sin aflojar QA en casos borde del checkout.",
        "Diseñar PDP/PLP modulares que escalan a nuevas colecciones.",
        "Separar zonas editoriales (historias destacadas) de bloques transaccionales.",
      ],
      outcomes: {
        paragraphs: [
          "Tienda en producción con layout minimalista y catálogo estable. Ajustes en checkout redujeron fricción en pasos finales.",
          "Tokens de diseño documentados para que futuros drops reutilicen componentes sin rediseñar la grilla.",
        ],
        highlights: [
          "Trabajo junto a operaciones para reflejar reglas reales de stock.",
          "Paquete reutilizable para landings de campaña ligadas a mailings.",
        ],
      },
      process: [
        {
          phase: "Descubrimiento",
          text: "Mapeo de SKUs, políticas de cambio y picos de ventas; priorizamos flujos que tocan revenue primero.",
        },
        {
          phase: "Diseño",
          text: "Exploración mobile-first en PLP/PDP → grilla desktop; escala tipográfica y espacio alineados a fotos de prenda.",
        },
        {
          phase: "Desarrollo",
          text: "Superficies Next.js + Tienda Nube, QA en redes lentas, embudos de analytics verificados antes del corte.",
        },
        {
          phase: "Cierre",
          text: "Capacitación para merchandising en lookbooks, playbook para temporadas y backlog post-lanzamiento.",
        },
      ],
      stack: ["Next.js", "TypeScript", "Tienda Nube", "Figma"],
    },
  },

  vinorodante: {
    en: {
      tagline:
        "Wine e‑commerce with club logic, subscription nuance and a full brand system.",
      client: {
        paragraphs: [
          "Vino Rodante is a boutique wine distributor building direct-to-consumer relationships alongside curated wholesale partners. They needed a digital flagship that could carry a new visual identity as confidently as it handled club memberships.",
        ],
      },
      brief: {
        paragraphs: [
          "Beyond selling bottles, the platform had to communicate terroir and curation without feeling cluttered. Subscription rules, club tiers and educational content needed distinct patterns yet a single visual language.",
          "I owned identity direction in parallel with UX — logotype, palette, typographic pairing and digital application had to align before UI lock-in.",
        ],
      },
      objectives: [
        "Launch a cohesive brand system rolled into a Next.js storefront.",
        "Ship subscription and wine-club flows with transparent pricing and renewal clarity.",
        "Balance atmospheric photography with scannable product data (region, varietal, ABV).",
      ],
      outcomes: {
        paragraphs: [
          "A branded commerce experience that feels editorial at hero moments and transactional when users add to cart or manage subscriptions.",
          "CMS structure supports wine editors publishing tasting notes without developer involvement.",
        ],
        highlights: [
          "End-to-end brand + product design from naming moments to checkout microcopy.",
          "Modular tasting-note components for seasonal campaigns.",
        ],
      },
      process: [
        {
          phase: "Brand",
          text: "Iterations on mark, color accessibility against both light and dark photography, typographic tests for long-form copy.",
        },
        {
          phase: "UX",
          text: "Journey maps for first-time buyers vs club members; error states and replenishment prompts defined early.",
        },
        {
          phase: "UI + Build",
          text: "Component library in Figma mirrored in React; integrated payment and subscription providers with rollback plans.",
        },
        {
          phase: "Iterate",
          text: "Post-launch tuning on conversion hotspots guided by analytics and CS feedback.",
        },
      ],
      stack: ["Next.js", "TypeScript", "Figma", "Brand systems", "Subscriptions"],
    },
    es: {
      tagline:
        "E-commerce de vinos con club, suscripción e identidad completa.",
      client: {
        paragraphs: [
          "Vino Rodante es un distribuidor boutique que construye relación directa con consumidores y socios mayoristas curados. Necesitaban una sede digital que llevara una identidad nueva con la misma solidez que la lógica de clubes.",
        ],
      },
      brief: {
        paragraphs: [
          "Más que vender botellas, la plataforma tenía que comunicar terruño y curaduría sin saturar. Suscripciones, niveles de club y contenido educativo pedían patrones distintos pero una sola lengua visual.",
          "Lideré la identidad en paralelo al UX — marca, paleta, tipografía y aplicación digital debían converger antes de cerrar UI.",
        ],
      },
      objectives: [
        "Lanzar sistema de marca coherente aplicado a un storefront Next.js.",
        "Flujos de suscripción y club con precios transparentes y claridad de renovación.",
        "Equilibrar fotografía atmosférica con datos escaneables (región, varietal, graduación).",
      ],
      outcomes: {
        paragraphs: [
          "Experiencia de marca que se siente editorial en heroes y transaccional al agregar al carrito o gestionar suscripciones.",
          "Estructura de CMS permite a editores publicar notas de cata sin depender de desarrollo.",
        ],
        highlights: [
          "Brand + producto de punta a punta, desde naming periférico hasta microcopy de checkout.",
          "Bloques modulares de notas de cata para campañas estacionales.",
        ],
      },
      process: [
        {
          phase: "Marca",
          text: "Iteración de isotipo, accesibilidad cromática sobre fotografía clara/oscura, pruebas tipográficas para textos largos.",
        },
        {
          phase: "UX",
          text: "Mapas de journey para compradores nuevos vs socios de club; estados de error y recompras definidos temprano.",
        },
        {
          phase: "UI + build",
          text: "Librería Figma espejada en React; integración de pagos y suscripciones con planes de rollback.",
        },
        {
          phase: "Iteración",
          text: "Afinación post-lanzamiento en puntos calientes de conversión con analytics y feedback de soporte.",
        },
      ],
      stack: ["Next.js", "TypeScript", "Figma", "Identidad", "Suscripciones"],
    },
  },

  ursulabenavidez: {
    en: {
      tagline:
        "Gallery-forward portfolio for an art director — fast, quiet and content-first.",
      client: {
        paragraphs: [
          "Ursula Benavidez is an art director and set designer; her site needed to feel like a curated exhibition, not a marketing template. Every interaction should defer to photography and spatial work.",
        ],
      },
      brief: {
        paragraphs: [
          "The prior site mixed aspect ratios awkwardly and buried contact details. The new brief: large, uninterrupted image fields, typographic restraint, and zero third-party scripts that could compete with load performance.",
          "A11y and keyboard navigation still had to be impeccable despite the visual minimalism.",
        ],
      },
      objectives: [
        "Ship a Next.js portfolio with custom gallery behaviors (lazy, responsive art direction).",
        "Keep dependencies lean — no analytics SDKs unless essential, no embeds without consent.",
        "Provide a CMS model Ursula’s team can update between productions.",
      ],
      outcomes: {
        paragraphs: [
          "A fast, monochrome-leaning experience where projects read as sequences rather than cards. Contact routes stay one interaction away.",
          "Lighthouse performance budgets were treated as design constraints, not afterthoughts.",
        ],
        highlights: [
          "Custom image component set handling mixed orientations gracefully.",
          "Editorial captions and metadata patterns aligned with exhibition wall labels.",
        ],
      },
      process: [
        {
          phase: "Content audit",
          text: "Catalogued projects, media formats and licensing constraints before structuring routes.",
        },
        {
          phase: "Interaction design",
          text: "Prototype gallery flows focusing on keyboard and screen-reader order; reduced decorative motion for prefers-reduced-motion.",
        },
        {
          phase: "Build",
          text: "Next.js, static generation where possible, dynamic previews for draft content, smoke tests on real production assets.",
        },
        {
          phase: "Polish",
          text: "Micro-typography pass, meta tags for social sharing of specific projects, final accessibility sweep.",
        },
      ],
      stack: ["Next.js", "TypeScript", "React", "Figma"],
    },
    es: {
      tagline:
        "Portfolio tipo galería para una directora de arte — rápido, sobrio y contenido primero.",
      client: {
        paragraphs: [
          "Ursula Benavidez es directora de arte y diseñadora de escenografía; el sitio debía sentirse como una muestra curada, no como template comercial. Toda interacción debía ceder el protagonismo a la fotografía y al trabajo espacial.",
        ],
      },
      brief: {
        paragraphs: [
          "El sitio anterior mezclaba ratios incómodamente y escondía el contacto. El nuevo pedido: grandes campos de imagen sin interrupciones, tipografía comedida y cero scripts de terceros que compitan con el rendimiento.",
          "Accesibilidad y teclado debían ser impecables pese al minimalismo visual.",
        ],
      },
      objectives: [
        "Entregar portfolio Next.js con comportamiento de galería a medida (lazy, art direction).",
        "Mantener dependencias mínimas — sin SDKs salvo esenciales, sin embeds sin consentimiento.",
        "Modelo de CMS que el equipo actualice entre producciones.",
      ],
      outcomes: {
        paragraphs: [
          "Experiencia veloz, cromáticamente sobria, donde los proyectos se leen como secuencias en lugar de tarjetas. El contacto queda a un gesto.",
          "Los presupuestos Lighthouse se trataron como restricciones de diseño.",
        ],
        highlights: [
          "Set de componentes de imagen para orientaciones mixtas.",
          "Patrones de leyenda y metadata alineados a fichas de sala.",
        ],
      },
      process: [
        {
          phase: "Auditoría de contenido",
          text: "Inventario de proyectos, formatos de media y licencias antes de definir rutas.",
        },
        {
          phase: "Diseño de interacción",
          text: "Prototipo de galerías con foco en teclado y lector de pantalla; motion reducido con prefers-reduced-motion.",
        },
        {
          phase: "Desarrollo",
          text: "Next.js, estática donde se pudo, previews dinámicos para borradores, pruebas con assets reales.",
        },
        {
          phase: "Pulido",
          text: "Microtipografía, meta tags para compartir proyectos, barrido final de accesibilidad.",
        },
      ],
      stack: ["Next.js", "TypeScript", "React", "Figma"],
    },
  },

  templodetierra: {
    en: {
      tagline:
        "Sustainable tourism storytelling with mobile-first booking clarity.",
      client: {
        paragraphs: [
          "Templo de Tierra hosts ecological and experiential stays grounded in natural materials and slow travel values. Their website must communicate ethics and place without overwhelming practical booking questions.",
        ],
      },
      brief: {
        paragraphs: [
          "Mobile traffic dominated; hikers and international guests researched availability on poor connections. The experience needed emotional photography paired with scannable logistics (seasonality, access routes, what to bring).",
          "SEO for long-tail regional queries mattered as much as visual polish.",
        ],
      },
      objectives: [
        "Mobile-first UX with resilient media delivery in remote areas.",
        "Separate editorial storytelling pages from conversion-oriented availability info.",
        "Give the team a repeatable module kit for new experiences and workshops.",
      ],
      outcomes: {
        paragraphs: [
          "A calm, modular site where stories lead but pricing and contact remain obvious. Structured data supports discovery without gimmicks.",
          "Content editors can spin up new retreat modules without engineering for each launch.",
        ],
        highlights: [
          "Field-tested typography sizes for outdoor daylight screen glare contexts.",
          "Itinerary blocks reused across landing and detail templates.",
        ],
      },
      process: [
        {
          phase: "Field notes",
          text: "Interviews with hosts plus analysis of inbound guest FAQs to prioritize page order.",
        },
        {
          phase: "Prototype",
          text: "Clickable mobile prototype for booking inquiries; validated copy length with real guest scenarios.",
        },
        {
          phase: "Build",
          text: "Next.js, image CDN strategy, forms wired to operations email/CRM, analytics respecting consent defaults.",
        },
        {
          phase: "Grow",
          text: "Quarterly content playbook for seasonal campaigns and partner co-marketing modules.",
        },
      ],
      stack: ["Next.js", "TypeScript", "Figma", "SEO"],
    },
    es: {
      tagline:
        "Turismo sostenible con narrativa emocional y reservas claras en mobile.",
      client: {
        paragraphs: [
          "Templo de Tierra ofrece estadías ecológicas y experienciales ancladas en materiales naturales y turismo lento. El sitio debe transmitir ética y lugar sin tapar la información práctica de reserva.",
        ],
      },
      brief: {
        paragraphs: [
          "El tráfico móvil dominaba; visitantes e investigadores consultaban disponibilidad con conexión débil. Se buscaba fotografía emocional con logística escaneable (temporadas, accesos, qué llevar).",
          "SEO de colas largas regionales importaba tanto como el acabado visual.",
        ],
      },
      objectives: [
        "UX mobile-first con entrega de media resiliente.",
        "Separar relatos editoriales de la información orientada a conversión.",
        "Kit de módulos repetible para nuevas experiencias y talleres.",
      ],
      outcomes: {
        paragraphs: [
          "Sitio modular y sereno donde la historia lidera pero precios y contacto siguen obvios. Datos estructurados apoyan descubrimiento sin artificios.",
          "Editores pueden publicar nuevos retiros sin ingeniería por cada lanzamiento.",
        ],
        highlights: [
          "Tipografía probada para lectura bajo sol en exteriores.",
          "Bloques de itinerario reutilizados en landing y detalle.",
        ],
      },
      process: [
        {
          phase: "Notas de campo",
          text: "Entrevistas a anfitriones + análisis de FAQs reales para ordenar prioridades de página.",
        },
        {
          phase: "Prototipo",
          text: "Prototipo mobile para consultas de reserva; validación de extensión de copy con casos reales.",
        },
        {
          phase: "Desarrollo",
          text: "Next.js, estrategia CDN de imágenes, formularios a operaciones, analytics con consentimiento por defecto.",
        },
        {
          phase: "Crecimiento",
          text: "Playbook trimestral para campañas estacionales y módulos con socios.",
        },
      ],
      stack: ["Next.js", "TypeScript", "Figma", "SEO"],
    },
  },

  desenfreno: {
    en: {
      tagline:
        "Independent publishing house with custom catalog, CMS discipline and checkout.",
      client: {
        paragraphs: [
          "El Desenfreno is an independent publisher balancing limited print runs with digital discovery. They needed a site that respects editorial voice while powering commerce and back-office catalog hygiene.",
        ],
      },
      brief: {
        paragraphs: [
          "Off-the-shelf bookstore themes felt generic; the team wanted typographic authority, clearly separated imprints and a CMS that could model contributors, ISBN metadata and stock thresholds.",
          "Payment flows had to support both domestic and international buyers without fragmenting the brand experience.",
        ],
      },
      objectives: [
        "Ship a custom Next.js storefront with bespoke CMS schema for books and editions.",
        "Unify editorial essays, news and product pages without duplicate content penalties.",
        "Expose operational dashboards light enough for a small editorial staff.",
      ],
      outcomes: {
        paragraphs: [
          "A coherent publishing platform where each title page feels crafted, cart and fulfillment hooks stay reliable, and staff update inventory without developer bottlenecks.",
          "Checkout extensions align with regional tax realities while keeping UI calm.",
        ],
        highlights: [
          "Modular article system for long-form criticism adjacent to commerce paths.",
          "Reusable promo bands for fairs and crowdfunding pushes.",
        ],
      },
      process: [
        {
          phase: "Modeling",
          text: "Entity-relationship workshops for books, contributors, events and digital-only SKUs.",
        },
        {
          phase: "Design",
          text: "Grid derived from classic editorial margins; stress-tested dense tables for bibliographic data.",
        },
        {
          phase: "Engineering",
          text: "Next.js + custom CMS, Stripe paths, webhook monitoring for stock sync, hardening for payment edge cases.",
        },
        {
          phase: "Operate",
          text: "Runbooks for seasonal sales, training on CMS guardrails, backlog for community features.",
        },
      ],
      stack: ["Next.js", "TypeScript", "Custom CMS", "Stripe", "Figma"],
    },
    es: {
      tagline:
        "Editorial independiente con catálogo, CMS a medida y checkout integrado.",
      client: {
        paragraphs: [
          "El Desenfreno es una editorial independiente que equilibra tiradas acotadas con descubrimiento digital. Necesitaban un sitio que respete la voz editorial mientras sostiene comercio e integridad de catálogo.",
        ],
      },
      brief: {
        paragraphs: [
          "Los temas genéricos de librería no servían; buscaban autoridad tipográfica, sellos claramente separados y un CMS que modele colaboradores, metadatos tipo ISBN y umbrales de stock.",
          "Los pagos debían cubrir compradores locales e internacionales sin fragmentar la marca.",
        ],
      },
      objectives: [
        "Entregar tienda Next.js con CMS propio para libros y ediciones.",
        "Unificar ensayos editoriales, noticias y producto sin duplicar contenido punitivo.",
        "Paneles operativos livianos para un equipo editorial reducido.",
      ],
      outcomes: {
        paragraphs: [
          "Plataforma coherente donde cada ficha se siente artesanal, el carrito cumple y el staff actualiza inventario sin cuello de botón de desarrollo.",
          "Extensiones de checkout alineadas a impuestos regionales con interfaz sobria.",
        ],
        highlights: [
          "Sistema de artículos modulares para crítica larga junto a caminos de compra.",
          "Bandas promocionales reutilizables para ferias y campañas.",
        ],
      },
      process: [
        {
          phase: "Modelado",
          text: "Talleres entidad-relación para libros, colaboradores, eventos y SKUs solo digitales.",
        },
        {
          phase: "Diseño",
          text: "Grilla heredada de márgenes editoriales; tablas densas probadas para datos bibliográficos.",
        },
        {
          phase: "Ingeniería",
          text: "Next.js + CMS propio, Stripe, webhooks de stock, endurecimiento de pagos.",
        },
        {
          phase: "Operación",
          text: "Runbooks para ofertas estacionales, capacitación en guardarraíles del CMS.",
        },
      ],
      stack: ["Next.js", "TypeScript", "Custom CMS", "Stripe", "Figma"],
    },
  },

  grupofrali: {
    en: {
      tagline:
        "A bilingual corporate presence for a development group with flagship projects in Argentina, Uruguay and the United States.",
      client: {
        paragraphs: [
          "Grupo Frali is a diversified development company active in hospitality, premium residential, renewable energy and agricultural assets. The site had to convey scale and credibility to investors, partners and local communities without feeling like a static annual report.",
        ],
      },
      brief: {
        paragraphs: [
          "Stakeholders asked for an immediate read of the group’s footprint: developed hectares, built square metres, countries of operation and projects underway versus in planning — matching the storytelling rhythm they use in board and press contexts.",
          "The experience needed smooth language switching (EN/ES), large-format photography for flagship assets (e.g. Sofitel La Reserva Cardales, Septiembre, wind parks) and performance that holds up on mobile networks in field locations.",
        ],
      },
      objectives: [
        "Ship a Next.js marketing site with animated counters and modular project rails that mirror the live portfolio.",
        "Keep editorial typography assertive while supporting dense numeric metadata and bilingual routing.",
        "Expose each major venture with consistent templates so communications can add ventures without re-platforming.",
      ],
      outcomes: {
        paragraphs: [
          "A flagship digital layer that tracks the group’s narrative the same way their physical developments do — clear hierarchy, cinematic imagery and numbers that update without clutter.",
          "Editorial modules repeat across hospitality, residential and energy stories, reducing long-term maintenance load for the marketing team.",
        ],
        highlights: [
          "Bilingual UX with mirrored content architecture for EN/ES stakeholders.",
          "Motion-led metrics section aligned with investor-facing collateral.",
        ],
      },
      process: [
        {
          phase: "Immersion",
          text: "Workshops with leadership to map project taxonomy, country roll-outs and the priority hierarchy between corporate story vs. individual assets.",
        },
        {
          phase: "Experience",
          text: "Defined scroll narratives for counters and project carousels, prototyped transitions for language toggles, stress-tested long nomenclature in UI chrome.",
        },
        {
          phase: "Build",
          text: "Next.js implementation, CMS hooks for figures that marketing refreshes each quarter, media pipeline tuned for ultra-wide photography.",
        },
        {
          phase: "Launch",
          text: "Analytics baselines, accessibility and SEO checks for bilingual locales, training on updating metrics and adding future developments.",
        },
      ],
      stack: ["Next.js", "TypeScript", "React", "Figma", "Headless CMS"],
    },
    es: {
      tagline:
        "Presencia corporativa bilingüe para un grupo con proyectos insignia en Argentina, Uruguay y Estados Unidos.",
      client: {
        paragraphs: [
          "Grupo Frali es una empresa diversificada en desarrollo hotelero, residencial de alto estándar, energía renovable y activos agrícolas. El sitio debía transmitir escala y credibilidad frente a inversores, socios y comunidades sin parecer un informe estático.",
        ],
      },
      brief: {
        paragraphs: [
          "El pedido incluía una lectura inmediata del alcance del grupo: hectáreas, metros construidos, países de operación y estados de obra — alineado al discurso que usan en directorio y prensa.",
          "La experiencia requería cambio fluido EN/ES, fotografía a gran formato para activos clave (p. ej. Sofitel La Reserva Cardales, Septiembre, parques eólicos) y buen rendimiento en mobile en zonas de campo.",
        ],
      },
      objectives: [
        "Entregar sitio Next.js con métricas animadas y rieles de proyectos acordes al portfolio real.",
        "Tipografía editorial contundente con metadata numérica densa y ruteo bilingüe.",
        "Plantillas repetibles por vertical para sumar emprendimientos sin re-plataforma.",
      ],
      outcomes: {
        paragraphs: [
          "Capa digital insignia que cuenta la historia del grupo con la misma claridad que sus obras físicas — jerarquía clara, imagen con peso y números legibles.",
          "Módulos editoriales reutilizables en hotelería, residencial y energía, bajo mantenimiento para el equipo de comunicación.",
        ],
        highlights: [
          "UX bilingüe con espejo de contenidos EN/ES.",
          "Bloque de métricas con motion alineado a material para inversores.",
        ],
      },
      process: [
        {
          phase: "Inmersión",
          text: "Talleres con dirección para taxonomía de proyectos, despliegue por país y prioridad entre relato corporativo vs. activos puntuales.",
        },
        {
          phase: "Experiencia",
          text: "Narrativas de scroll para contadores y carruseles de proyectos; prototipo de cambio de idioma; pruebas de nomenclaturas largas en UI.",
        },
        {
          phase: "Desarrollo",
          text: "Implementación Next.js, CMS para cifras que marketing actualiza trimestralmente, pipeline de media para fotografía ultra wide.",
        },
        {
          phase: "Lanzamiento",
          text: "Analytics base, accesibilidad y SEO para locales bilingües, capacitación para métricas y altas de nuevos desarrollos.",
        },
      ],
      stack: ["Next.js", "TypeScript", "React", "Figma", "CMS headless"],
    },
  },
};

export function isCaseStudySlug(s: string): s is CaseStudySlug {
  return Object.prototype.hasOwnProperty.call(CASE_STUDIES, s);
}
