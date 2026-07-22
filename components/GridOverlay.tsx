"use client";

import { useLayoutEffect, useState } from "react";

interface GridOverlayProps {
  isVisible: boolean;
}

type TypeGuides = {
  navBottom: number;
  baseline: number;
  xHeight: number;
  capHeight: number;
  linkCap: number | null;
};

type Tick = { pos: number; size: "xs" | "sm" | "md" | "lg" };

function measureTypeGuides(): TypeGuides | null {
  const header = document.querySelector("header");
  if (!header) return null;

  const name =
    header.querySelector<HTMLElement>(".text-name-nav") ??
    [...header.querySelectorAll("a")].find((a) =>
      a.textContent?.includes("Ivan"),
    );

  if (!name) return null;

  const nameRect = name.getBoundingClientRect();
  const cs = getComputedStyle(name);
  const headerRect = header.getBoundingClientRect();

  const probe = (unit: "1ex" | "1cap") => {
    const el = document.createElement("span");
    el.style.cssText = `position:absolute;visibility:hidden;display:block;pointer-events:none;font-family:${cs.fontFamily};font-weight:${cs.fontWeight};font-size:${cs.fontSize};height:${unit}`;
    document.body.appendChild(el);
    const h = el.getBoundingClientRect().height;
    el.remove();
    return h;
  };

  const ex = probe("1ex");
  const cap = probe("1cap");
  const baseline = nameRect.bottom;
  const link = header.querySelector<HTMLElement>(
    "nav ul a, nav .nav-link-type",
  );

  return {
    navBottom: headerRect.bottom,
    baseline,
    xHeight: baseline - ex,
    capHeight: baseline - cap,
    linkCap: link ? link.getBoundingClientRect().top : null,
  };
}

/** Figma-like hierarchy: 10 / 50 / 100 — mapped to module subdivisions. */
function buildTicks(length: number, module: number): Tick[] {
  const step = Math.max(1, Math.round(module / 8)); // ~8px
  const mid = Math.max(step, Math.round(module / 2)); // ~32px
  const major = Math.round(module); // 64px
  const ticks: Tick[] = [];

  for (let p = 0; p <= length; p += step) {
    let size: Tick["size"] = "xs";
    if (p % major === 0) size = "lg";
    else if (p % mid === 0) size = "md";
    else if (p % (step * 2) === 0) size = "sm";
    ticks.push({ pos: p, size });
  }
  return ticks;
}

/** Tick lengths scaled to the slim ruler depth (--ruler-size: 11px). */
const TICK_H = { xs: 2, sm: 3, md: 5, lg: 7 } as const;

function GuideLine({
  y,
  label,
  accent = false,
}: {
  y: number;
  label: string;
  accent?: boolean;
}) {
  return (
    <div
      className={
        accent
          ? "grid-guide grid-guide--accent"
          : "grid-guide"
      }
      style={{ top: y }}
    >
      <span className="grid-guide__label">{label}</span>
    </div>
  );
}

export function GridOverlay({ isVisible }: GridOverlayProps) {
  const [viewport, setViewport] = useState({ w: 0, h: 0 });
  const [guides, setGuides] = useState<TypeGuides | null>(null);
  const [modulePx, setModulePx] = useState(64);

  useLayoutEffect(() => {
    if (!isVisible) return;

    const sync = () => {
      setViewport({ w: window.innerWidth, h: window.innerHeight });
      const row = getComputedStyle(document.documentElement)
        .getPropertyValue("--grid-row")
        .trim();
      const probe = document.createElement("div");
      probe.style.cssText = `position:absolute;visibility:hidden;height:${row || "64px"}`;
      document.body.appendChild(probe);
      setModulePx(probe.getBoundingClientRect().height || 64);
      probe.remove();
      setGuides(measureTypeGuides());
    };

    sync();
    window.addEventListener("resize", sync);
    window.addEventListener("scroll", sync, { passive: true });
    return () => {
      window.removeEventListener("resize", sync);
      window.removeEventListener("scroll", sync);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  const major = Math.round(modulePx);
  const hTicks = buildTicks(viewport.w, major);
  const vTicks = buildTicks(viewport.h, major);

  return (
    <div className="grid-overlay" aria-hidden>
      {/* Swiss hairline modules */}
      <div className="grid-overlay__modules" />

      {/* Spec margins */}
      <div
        className="grid-overlay__margin grid-overlay__margin--start"
        style={{ width: "var(--grid-spec-margin, 80px)" }}
      />
      <div
        className="grid-overlay__margin grid-overlay__margin--end"
        style={{ width: "var(--grid-spec-margin, 80px)" }}
      />

      {/* 12 columns — quiet fill */}
      <div className="grid-overlay__cols">
        <div className="grid-overlay__cols-inner">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={`col-${i}`} className="grid-overlay__col" />
          ))}
        </div>
      </div>

      {/* Type guides */}
      {guides ? (
        <>
          <GuideLine y={guides.navBottom} label="nav" />
          <GuideLine y={guides.capHeight} label="cap" />
          <GuideLine y={guides.xHeight} label="x-height" />
          <GuideLine y={guides.baseline} label="baseline" />
          {guides.linkCap != null ? (
            <GuideLine y={guides.linkCap} label="link cap" accent />
          ) : null}
        </>
      ) : null}

      {/* Figma / Illustrator rulers */}
      <div className="grid-ruler grid-ruler--corner" />
      <div className="grid-ruler grid-ruler--x">
        {hTicks.map(({ pos, size }) => (
          <div
            key={`hx-${pos}`}
            className={`grid-ruler__tick grid-ruler__tick--${size}`}
            style={{ left: pos, height: TICK_H[size] }}
          />
        ))}
        {hTicks
          .filter((t) => t.size === "lg" && t.pos > 0)
          .map(({ pos }) => (
            <span
              key={`hl-${pos}`}
              className="grid-ruler__num grid-ruler__num--x"
              style={{ left: pos + 2 }}
            >
              {pos}
            </span>
          ))}
      </div>
      <div className="grid-ruler grid-ruler--y">
        {vTicks.map(({ pos, size }) => (
          <div
            key={`vy-${pos}`}
            className={`grid-ruler__tick grid-ruler__tick--y grid-ruler__tick--${size}`}
            style={{ top: pos, width: TICK_H[size] }}
          />
        ))}
        {vTicks
          .filter((t) => t.size === "lg" && t.pos > 0)
          .map(({ pos }) => (
            <span
              key={`vl-${pos}`}
              className="grid-ruler__num grid-ruler__num--y"
              style={{ top: pos }}
            >
              {pos}
            </span>
          ))}
      </div>
    </div>
  );
}
