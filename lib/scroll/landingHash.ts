/** ~2s at 60fps — covers Next soft-nav + dynamic PortfolioPageInner chunk. */
const MAX_HASH_SCROLL_ATTEMPTS = 120;

/** How far off (px) the target can be before we retry after Next scroll restoration. */
const HASH_SCROLL_TOLERANCE_PX = 48;

export function getLandingNavScrollOffsetPx(): number {
  if (typeof window === "undefined") return -64;
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--nav-height")
    .trim();
  if (!raw) return -64;

  const direct = parseFloat(raw);
  if (Number.isFinite(direct) && !raw.startsWith("calc") && !raw.includes("var(")) {
    return -Math.abs(direct);
  }

  // Resolve calc()/var() tokens (e.g. calc(.25rem * 16)).
  const probe = document.createElement("div");
  probe.style.cssText =
    "position:absolute;visibility:hidden;pointer-events:none;height:" + raw;
  document.body.appendChild(probe);
  const h = probe.getBoundingClientRect().height;
  probe.remove();
  return h > 0 ? -h : -64;
}

export function landingHashId(hash: string): string | null {
  const id = hash.replace(/^#/, "").trim();
  return id.length > 0 ? id : null;
}

function getNavHeightPx(): number {
  return Math.abs(getLandingNavScrollOffsetPx());
}

function isSectionNearNav(el: HTMLElement): boolean {
  return (
    Math.abs(el.getBoundingClientRect().top - getNavHeightPx()) <=
    HASH_SCROLL_TOLERANCE_PX
  );
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

  const { lenis, reducedMotion = false } = options;
  // Sections already use CSS scroll-margin-top: var(--nav-height). Lenis
  // respects that — stacking our nav offset on top lands ~2× too low.
  const cssMargin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
  const offset = cssMargin > 0 ? 0 : getLandingNavScrollOffsetPx();

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

/**
 * Soft-nav from /work/* → /#section races Next’s scroll-to-top against animated
 * Lenis. Prefer immediate scroll and re-assert after paint / a short delay.
 */
export function scrollToLandingHashReliable(
  hash: string,
  options: {
    lenis?: import("lenis").default | null;
    /** Prefer when Lenis may appear after the first attempt (async init). */
    getLenis?: () => import("lenis").default | null;
  } = {},
): () => void {
  const id = landingHashId(hash);
  if (!id) return () => {};

  let cancelled = false;
  const timers: ReturnType<typeof setTimeout>[] = [];

  const resolveLenis = () =>
    options.getLenis?.() ?? options.lenis ?? null;

  const attempt = () => {
    if (cancelled) return;
    scrollToLandingSection(hash, {
      lenis: resolveLenis(),
      reducedMotion: true,
    });
  };

  const verify = () => {
    if (cancelled) return;
    const el = document.getElementById(id);
    if (!el || isSectionNearNav(el)) return;
    attempt();
  };

  attempt();

  const raf = requestAnimationFrame(() => {
    requestAnimationFrame(verify);
  });

  // Next App Router often resets scroll after the first paint on soft-nav.
  timers.push(setTimeout(verify, 50));
  timers.push(setTimeout(verify, 200));
  timers.push(setTimeout(verify, 450));

  return () => {
    cancelled = true;
    cancelAnimationFrame(raf);
    for (const t of timers) clearTimeout(t);
  };
}

export function scrollToLandingHashWhenReady(
  hash: string,
  options: {
    lenis?: import("lenis").default | null;
    getLenis?: () => import("lenis").default | null;
    reducedMotion?: boolean;
    /** Soft-nav from another route — beat Next scroll restoration. */
    reliable?: boolean;
    onDone?: () => void;
  } = {},
): () => void {
  let attempts = 0;
  let frame = 0;
  let cancelReliable: (() => void) | undefined;

  const tick = () => {
    const id = landingHashId(hash);
    const el = id ? document.getElementById(id) : null;
    if (!el) {
      if (++attempts >= MAX_HASH_SCROLL_ATTEMPTS) return;
      frame = requestAnimationFrame(tick);
      return;
    }

    if (options.reliable) {
      cancelReliable = scrollToLandingHashReliable(hash, {
        lenis: options.lenis,
        getLenis: options.getLenis,
      });
    } else {
      scrollToLandingSection(hash, {
        lenis: options.getLenis?.() ?? options.lenis,
        reducedMotion: options.reducedMotion,
      });
    }
    options.onDone?.();
  };

  frame = requestAnimationFrame(tick);

  return () => {
    if (frame) cancelAnimationFrame(frame);
    cancelReliable?.();
  };
}
