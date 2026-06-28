#!/usr/bin/env node
/**
 * Record a smooth scroll-through of the portfolio for fullscreen mockups.
 *
 * Prerequisites: `npm run dev` (http://localhost:3000/)
 *
 *   node scripts/record-portfolio-video.mjs
 *
 * Layout = viewport size (MacBook Pro 14" default: 1512×982).
 * Playwright must use deviceScaleFactor 1 and recordVideo.size === viewport
 * (DPR > 1 here causes gray letterboxing). Retina upscale is done in ffmpeg.
 */
import { chromium } from "playwright";
import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const ORIGIN = process.env.ORIGIN ?? "http://localhost:3000";
/** MacBook Pro 14" default window — controls site layout. */
const VIEWPORT_W = Number(process.env.WIDTH ?? 1512);
const VIEWPORT_H = Number(process.env.HEIGHT ?? 982);
/** Lanczos upscale after capture (2 = 3024×1964). Set 1 to keep viewport size. */
const UPSCALE = Number(process.env.UPSCALE ?? 2);
const OUT_W = VIEWPORT_W * UPSCALE;
const OUT_H = VIEWPORT_H * UPSCALE;
const HERO_HOLD_MS = Number(process.env.HERO_HOLD_MS ?? 1_400);
const SCROLL_MS = Number(process.env.SCROLL_MS ?? 7_500);
const HOLD_BOTTOM_MS = Number(process.env.HOLD_BOTTOM_MS ?? 350);
const SKIP_SPLASH = process.env.SKIP_SPLASH === "1";
const CRF = process.env.CRF ?? "8";
const MOUSE_INTERVAL_MS = Number(process.env.MOUSE_INTERVAL_MS ?? 33);

const OUT_DIR = path.resolve(ROOT, "public", "recordings");
const OUT_WEBM = path.join(OUT_DIR, "portfolio-fullscreen.webm");
const OUT_MP4 = path.join(OUT_DIR, "portfolio-fullscreen.mp4");

const SPLASH_KEY = "v2-splash-seen";

const LAUNCH_ARGS = [
  "--disable-background-timer-throttling",
  "--disable-backgrounding-occluded-windows",
  "--disable-renderer-backgrounding",
  "--disable-features=CalculateNativeWinOcclusion",
];

/** Smooth sine ease — less aggressive than cubic, reads more fluid on scroll. */
const easeScroll = (t) => -(Math.cos(Math.PI * t) - 1) / 2;

function mouseAtProgress(layout, width, height, progress, rowPhase) {
  const scrollY = layout.maxScroll * easeScroll(progress);
  const viewportMid = scrollY + height * 0.4;
  const inWork = scrollY >= layout.workStart * 0.7;

  let best = -1;
  let bestDist = Infinity;
  if (inWork) {
    for (let r = 0; r < layout.rows.length; r++) {
      const dist = Math.abs(layout.rows[r].docY - viewportMid);
      if (dist < bestDist) {
        bestDist = dist;
        best = r;
      }
    }
  }

  if (best >= 0 && bestDist < height * 0.2) {
    const row = layout.rows[best];
    const vy = row.docY - scrollY;
    const wobble = Math.sin(rowPhase / 180) * 28;
    return { x: row.x + wobble, y: vy - 10, onRow: true };
  }

  const towardWork =
    layout.workStart > 0 ? Math.min(1, scrollY / layout.workStart) : progress;
  return {
    x: width * (0.32 + 0.28 * towardWork),
    y: height * (0.3 + 0.45 * towardWork),
    onRow: false,
  };
}

/** Disable Lenis + drive scroll on a timer (rAF can stall in headless record). */
async function prepareNativeScroll(page) {
  await page.evaluate(() => {
    document.documentElement.classList.remove("lenis", "lenis-smooth");
    document.documentElement.style.height = "auto";
    document.body.style.height = "auto";
    document.body.style.overflow = "visible";
  });
}

/** rAF scroll in the page (60fps) + Playwright mouse in parallel. */
async function runScroll(page, layout, width, height, scrollMs) {
  const scrollPromise = page.evaluate(
    ({ duration, maxScroll }) =>
      new Promise((resolve) => {
        const ease = (t) => -(Math.cos(Math.PI * t) - 1) / 2;
        const t0 = performance.now();
        const tick = () => {
          const t = Math.min(1, (performance.now() - t0) / duration);
          window.scrollTo(0, maxScroll * ease(t));
          if (t < 1) window.setTimeout(tick, 1000 / 60);
          else resolve(undefined);
        };
        tick();
      }),
    { duration: scrollMs, maxScroll: layout.maxScroll },
  );

  const mousePromise = (async () => {
    const t0 = Date.now();
    let rowPhase = 0;
    while (Date.now() - t0 < scrollMs) {
      const progress = Math.min(1, (Date.now() - t0) / scrollMs);
      const { x, y, onRow } = mouseAtProgress(
        layout,
        width,
        height,
        progress,
        rowPhase,
      );
      if (onRow) rowPhase += MOUSE_INTERVAL_MS;
      else rowPhase = 0;
      await page.mouse.move(x, y);
      await page.waitForTimeout(MOUSE_INTERVAL_MS);
    }
  })();

  await Promise.all([scrollPromise, mousePromise]);
}

/**
 * Hero hold at scroll 0, then one continuous eased scroll to the footer.
 */
async function journey(page, width, height, layout, heroHoldMs, scrollMs) {
  const heroSteps = Math.max(10, Math.round(heroHoldMs / MOUSE_INTERVAL_MS));

  for (let i = 0; i <= heroSteps; i++) {
    const t = i / heroSteps;
    const x = width * (0.22 + 0.56 * (0.5 + 0.5 * Math.sin(t * Math.PI * 2)));
    const y = height * (0.28 + 0.38 * (0.5 + 0.5 * Math.sin(t * Math.PI * 4)));
    await page.mouse.move(x, y);
    await page.waitForTimeout(MOUSE_INTERVAL_MS);
  }

  await runScroll(page, layout, width, height, scrollMs);
}

async function waitForSplash(page) {
  await page.waitForFunction(
    (key) => window.sessionStorage.getItem(key) === "1",
    SPLASH_KEY,
    { timeout: 12_000 },
  );
  await page.waitForTimeout(550);
}

async function readLayout(page) {
  return page.evaluate(() => {
    const maxScroll = Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight,
    );
    const workEl = document.querySelector("#work");
    const workStart = workEl
      ? workEl.getBoundingClientRect().top + window.scrollY
      : maxScroll * 0.4;

    const rows = [...document.querySelectorAll("#work a[href^='/work/']")].map(
      (el) => {
        const r = el.getBoundingClientRect();
        return {
          docY: r.top + window.scrollY + r.height / 2,
          x: r.left + r.width * 0.38,
        };
      },
    );

    return { maxScroll, workStart, rows };
  });
}

(async () => {
  await fs.mkdir(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    args: LAUNCH_ARGS,
  });

  const context = await browser.newContext({
    viewport: { width: VIEWPORT_W, height: VIEWPORT_H },
    deviceScaleFactor: 1,
    reducedMotion: "no-preference",
    hasTouch: false,
    isMobile: false,
    recordVideo: {
      dir: OUT_DIR,
      size: { width: VIEWPORT_W, height: VIEWPORT_H },
    },
    colorScheme: "light",
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
      "(KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  });

  await context.addInitScript((key) => {
    try {
      window.sessionStorage.removeItem(key);
    } catch {
      /* ignore */
    }
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      get: () => "visible",
    });
    Object.defineProperty(document, "hidden", {
      configurable: true,
      get: () => false,
    });
  }, SPLASH_KEY);

  if (SKIP_SPLASH) {
    await context.addInitScript((key) => {
      try {
        window.sessionStorage.setItem(key, "1");
      } catch {
        /* ignore */
      }
    }, SPLASH_KEY);
  }

  const page = await context.newPage();
  console.log(
    `→ ${ORIGIN} (capture ${VIEWPORT_W}×${VIEWPORT_H}, export ${OUT_W}×${OUT_H}, crf=${CRF})`,
  );

  await page.goto(ORIGIN, { waitUntil: "domcontentloaded", timeout: 60_000 });

  if (!SKIP_SPLASH) {
    console.log("  waiting for splash…");
    await waitForSplash(page);
  }

  await page.evaluate(() => document.fonts?.ready?.catch(() => undefined));
  await page.waitForTimeout(400);

  const layout = await readLayout(page);
  console.log(
    `  journey: hero ${HERO_HOLD_MS / 1000}s → scroll ${SCROLL_MS / 1000}s (${layout.rows.length} rows)…`,
  );

  await prepareNativeScroll(page);
  await page.mouse.move(VIEWPORT_W * 0.5, VIEWPORT_H * 0.42);
  await journey(page, VIEWPORT_W, VIEWPORT_H, layout, HERO_HOLD_MS, SCROLL_MS);
  await page.waitForTimeout(HOLD_BOTTOM_MS);

  const video = page.video();
  await page.close();
  await context.close();
  await browser.close();

  if (!video) throw new Error("No video recorded");

  const rawPath = await video.path();
  await fs.rename(rawPath, OUT_WEBM);
  console.log(`  webm → ${OUT_WEBM}`);

  const ffArgs = [
    "-y",
    "-i",
    OUT_WEBM,
    ...(UPSCALE !== 1
      ? ["-vf", `scale=${OUT_W}:${OUT_H}:flags=lanczos`]
      : []),
    "-c:v",
    "libx264",
    "-preset",
    "slow",
    "-profile:v",
    "high",
    "-level",
    "5.1",
    "-pix_fmt",
    "yuv420p",
    "-crf",
    String(CRF),
    "-movflags",
    "+faststart",
    OUT_MP4,
  ];

  const ff = spawnSync("ffmpeg", ffArgs, { stdio: "inherit" });
  if (ff.status !== 0) {
    console.warn("  ffmpeg failed — webm is still available");
  } else {
    const { size } = await fs.stat(OUT_MP4);
    console.log(
      `  mp4  → ${OUT_MP4} (${(size / 1024 / 1024).toFixed(1)} MB, ${OUT_W}×${OUT_H})`,
    );
  }
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
