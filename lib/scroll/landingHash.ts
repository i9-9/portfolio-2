/** ~2s at 60fps — covers Next soft-nav + dynamic PortfolioPageInner chunk. */
const MAX_HASH_SCROLL_ATTEMPTS = 120;

export function getLandingNavScrollOffsetPx(): number {
  if (typeof window === "undefined") return -64;
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--nav-height")
    .trim();
  const parsed = parseFloat(raw);
  return Number.isFinite(parsed) ? -parsed : -64;
}

export function landingHashId(hash: string): string | null {
  const id = hash.replace(/^#/, "").trim();
  return id.length > 0 ? id : null;
}

export function scrollToLandingSection(
  hash: string,
  options: {
    lenis?: import("lenis").default | null;
    reducedMotion?: boolean;
  } = {},
): boolean {
  const id = landingHashId(hash);
  if (!id) return false;

  const el = document.getElementById(id);
  if (!el) return false;

  const offset = getLandingNavScrollOffsetPx();
  const { lenis, reducedMotion = false } = options;

  if (lenis && !reducedMotion) {
    lenis.resize();
    lenis.scrollTo(el, { offset, duration: 1.1 });
    return true;
  }

  if (lenis && reducedMotion) {
    lenis.resize();
    lenis.scrollTo(el, { offset, immediate: true });
    return true;
  }

  el.scrollIntoView({
    behavior: reducedMotion ? "auto" : "smooth",
    block: "start",
  });
  return true;
}

export function scrollToLandingHashWhenReady(
  hash: string,
  options: {
    lenis?: import("lenis").default | null;
    reducedMotion?: boolean;
    onDone?: () => void;
  } = {},
): () => void {
  let attempts = 0;
  let frame = 0;

  const tick = () => {
    if (scrollToLandingSection(hash, options)) {
      options.onDone?.();
      return;
    }
    if (++attempts >= MAX_HASH_SCROLL_ATTEMPTS) return;
    frame = requestAnimationFrame(tick);
  };

  frame = requestAnimationFrame(tick);

  return () => {
    if (frame) cancelAnimationFrame(frame);
  };
}
