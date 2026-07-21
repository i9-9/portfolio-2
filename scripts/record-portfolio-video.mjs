#!/usr/bin/env node
/**
 * Record a smooth scroll-through of the portfolio for fullscreen mockups.
 *
 * Prerequisites: `npm run dev` (http://localhost:3000/)
 *
 *   node scripts/record-portfolio-video.mjs [desktop|mobile|both]
 *
 * Hybrid capture:
 *   1) Splash — Playwright recordVideo (smooth Framer Motion lines)
 *   2) Journey — retina JPEG frames (sharp scroll / type)
 *   then ffmpeg concat.
 */
import { chromium } from "playwright";
import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const ORIGIN = process.env.ORIGIN ?? "http://localhost:3000";
const HERO_HOLD_MS = Number(process.env.HERO_HOLD_MS ?? 1_600);
const SCROLL_MS = Number(process.env.SCROLL_MS ?? 10_000);
const HOLD_BOTTOM_MS = Number(process.env.HOLD_BOTTOM_MS ?? 1_200);
const SKIP_SPLASH = process.env.SKIP_SPLASH === "1";
/** Matches PageReveal SPLASH_EXIT_MS — keep recording through the fade-out. */
const SPLASH_EXIT_MS = Number(process.env.SPLASH_EXIT_MS ?? 950);
const SPLASH_SETTLE_MS = Number(process.env.SPLASH_SETTLE_MS ?? 400);
const CRF = process.env.CRF ?? "4";
const X264_PRESET = process.env.X264_PRESET ?? "veryslow";
const FPS = Number(process.env.FPS ?? 30);
const JPEG_Q = Number(process.env.JPEG_Q ?? 92);

const OUT_DIR = path.resolve(ROOT, "public", "recordings");

const PRESETS = {
  desktop: {
    viewport: { width: 1512, height: 982 },
    dpr: Number(process.env.DESKTOP_DPR ?? 2),
    isMobile: false,
    hasTouch: false,
    outBase: "portfolio-desktop",
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
      "(KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  },
  mobile: {
    viewport: { width: 390, height: 844 },
    dpr: Number(process.env.MOBILE_DPR ?? 3),
    isMobile: true,
    hasTouch: true,
    outBase: "portfolio-mobile",
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 " +
      "(KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  },
};

const SPLASH_KEY = "v2-splash-seen";

const LAUNCH_ARGS = [
  "--disable-background-timer-throttling",
  "--disable-backgrounding-occluded-windows",
  "--disable-renderer-backgrounding",
  "--disable-features=CalculateNativeWinOcclusion",
];

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

async function prepareNativeScroll(page) {
  await page.evaluate(() => {
    document.documentElement.classList.remove("lenis", "lenis-smooth");
    document.documentElement.style.height = "auto";
    document.body.style.height = "auto";
    document.body.style.overflow = "visible";
  });
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

function applyVisibilityInit(context) {
  return context.addInitScript((key) => {
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
}

function applySkipSplash(context) {
  return context.addInitScript((key) => {
    try {
      window.sessionStorage.setItem(key, "1");
    } catch {
      /* ignore */
    }
  }, SPLASH_KEY);
}

function encodeX264(inputArgs, outMp4) {
  const pixFmt = process.env.PIX_FMT ?? "yuv420p";
  const ffArgs = [
    "-y",
    ...inputArgs,
    "-c:v",
    "libx264",
    "-preset",
    X264_PRESET,
    "-profile:v",
    pixFmt === "yuv444p" ? "high444" : "high",
    "-pix_fmt",
    pixFmt,
    "-crf",
    String(CRF),
    "-tune",
    "animation",
    "-movflags",
    "+faststart",
    outMp4,
  ];
  const ff = spawnSync("ffmpeg", ffArgs, { stdio: "inherit" });
  if (ff.status !== 0) throw new Error(`ffmpeg failed → ${outMp4}`);
}

async function grabFrame(page, framesDir, index) {
  const file = path.join(
    framesDir,
    `frame-${String(index).padStart(5, "0")}.jpg`,
  );
  await page.screenshot({
    path: file,
    type: "jpeg",
    quality: JPEG_Q,
    animations: "allow",
  });
  return index + 1;
}

async function captureJourneyFrames(
  page,
  framesDir,
  startIndex,
  width,
  height,
  layout,
  movePointer,
) {
  let index = startIndex;
  const frameMs = 1000 / FPS;
  const heroFrames = Math.max(1, Math.round(HERO_HOLD_MS / frameMs));
  const scrollFrames = Math.max(1, Math.round(SCROLL_MS / frameMs));
  const holdFrames = Math.max(1, Math.round(HOLD_BOTTOM_MS / frameMs));

  for (let i = 0; i <= heroFrames; i++) {
    const t = i / heroFrames;
    if (movePointer) {
      const x = width * (0.22 + 0.56 * (0.5 + 0.5 * Math.sin(t * Math.PI * 2)));
      const y = height * (0.28 + 0.38 * (0.5 + 0.5 * Math.sin(t * Math.PI * 4)));
      await page.mouse.move(x, y);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    index = await grabFrame(page, framesDir, index);
  }

  let rowPhase = 0;
  for (let i = 0; i <= scrollFrames; i++) {
    const progress = i / scrollFrames;
    const scrollY = layout.maxScroll * easeScroll(progress);
    await page.evaluate((y) => window.scrollTo(0, y), scrollY);
    if (movePointer) {
      const { x, y, onRow } = mouseAtProgress(
        layout,
        width,
        height,
        progress,
        rowPhase,
      );
      if (onRow) rowPhase += frameMs;
      else rowPhase = 0;
      await page.mouse.move(x, y);
    }
    index = await grabFrame(page, framesDir, index);
  }

  // Hard-land on the true bottom, then hold so the ending doesn’t feel cut.
  await page.evaluate((y) => window.scrollTo(0, y), layout.maxScroll);
  for (let i = 0; i < holdFrames; i++) {
    index = await grabFrame(page, framesDir, index);
  }

  return index;
}

/** Smooth splash via Chromium screencast (Framer Motion stays real-time). */
async function recordSplashClip(preset, splashMp4) {
  const { width, height } = preset.viewport;
  const dpr = preset.dpr;
  const outW = width * dpr;
  const outH = height * dpr;
  const tmpDir = path.join(OUT_DIR, `.splash-${preset.outBase}`);
  await fs.rm(tmpDir, { recursive: true, force: true });
  await fs.mkdir(tmpDir, { recursive: true });

  const browser = await chromium.launch({ headless: true, args: LAUNCH_ARGS });
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: dpr,
    reducedMotion: "no-preference",
    hasTouch: preset.hasTouch,
    isMobile: preset.isMobile,
    colorScheme: "light",
    userAgent: preset.userAgent,
    recordVideo: {
      dir: tmpDir,
      size: { width: outW, height: outH },
    },
  });
  await applyVisibilityInit(context);

  const page = await context.newPage();
  console.log("  splash: recording live screencast…");
  await page.goto(ORIGIN, { waitUntil: "domcontentloaded", timeout: 60_000 });

  await page.waitForFunction(
    (key) => window.sessionStorage.getItem(key) === "1",
    SPLASH_KEY,
    { timeout: 15_000 },
  );
  // PageReveal sets the key then fades out for SPLASH_EXIT_MS — keep rolling.
  await page.waitForTimeout(SPLASH_EXIT_MS + SPLASH_SETTLE_MS);

  // Confirm overlay is gone (or nearly) before cutting.
  await page
    .waitForFunction(
      () => !document.querySelector('[aria-label="Loading"]'),
      null,
      { timeout: 3_000 },
    )
    .catch(() => undefined);

  const video = page.video();
  await page.close();
  await context.close();
  await browser.close();

  if (!video) throw new Error("No splash video");
  const webm = await video.path();
  const stableWebm = path.join(tmpDir, "splash.webm");
  await fs.rename(webm, stableWebm);

  encodeX264(["-i", stableWebm, "-r", String(FPS)], splashMp4);
  await fs.rm(tmpDir, { recursive: true, force: true });

  const probe = spawnSync(
    "ffprobe",
    [
      "-v",
      "error",
      "-show_entries",
      "format=duration",
      "-of",
      "default=noprint_wrappers=1:nokey=1",
      splashMp4,
    ],
    { encoding: "utf8" },
  );
  console.log(`  splash: ${splashMp4} (~${Number(probe.stdout).toFixed(1)}s)`);
}

async function recordJourneyClip(preset, journeyMp4) {
  const { width, height } = preset.viewport;
  const dpr = preset.dpr;
  const outW = width * dpr;
  const outH = height * dpr;
  const framesDir = path.join(OUT_DIR, `.frames-${preset.outBase}`);
  const movePointer = !preset.isMobile;

  await fs.rm(framesDir, { recursive: true, force: true });
  await fs.mkdir(framesDir, { recursive: true });

  const browser = await chromium.launch({ headless: true, args: LAUNCH_ARGS });
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: dpr,
    reducedMotion: "no-preference",
    hasTouch: preset.hasTouch,
    isMobile: preset.isMobile,
    colorScheme: "light",
    userAgent: preset.userAgent,
  });
  await applyVisibilityInit(context);
  await applySkipSplash(context);

  const page = await context.newPage();
  console.log("  journey: capturing retina frames…");
  await page.goto(ORIGIN, { waitUntil: "domcontentloaded", timeout: 60_000 });
  await page.evaluate(() => document.fonts?.ready?.catch(() => undefined));
  // Let hero canvas / layout settle after skipped splash.
  await page.waitForTimeout(800);

  await prepareNativeScroll(page);
  let layout = await readLayout(page);
  // Re-measure once more after a tick — images/fonts can still grow the page.
  await page.waitForTimeout(300);
  layout = await readLayout(page);

  if (layout.maxScroll < 100) {
    throw new Error(
      `Journey maxScroll too small (${layout.maxScroll}) — page may not have loaded`,
    );
  }

  console.log(
    `  journey: maxScroll=${Math.round(layout.maxScroll)}px, ${layout.rows.length} rows, hero ${HERO_HOLD_MS}ms + scroll ${SCROLL_MS}ms + hold ${HOLD_BOTTOM_MS}ms`,
  );

  if (movePointer) {
    await page.mouse.move(width * 0.5, height * 0.42);
  }

  const frameCount = await captureJourneyFrames(
    page,
    framesDir,
    0,
    width,
    height,
    layout,
    movePointer,
  );

  await page.close();
  await context.close();
  await browser.close();

  const pattern = path.join(framesDir, "frame-%05d.jpg");
  encodeX264(["-framerate", String(FPS), "-i", pattern], journeyMp4);
  await fs.rm(framesDir, { recursive: true, force: true });

  console.log(
    `  journey: ${frameCount} frames @${FPS}fps → ${journeyMp4} (${outW}×${outH})`,
  );
}

async function concatClips(splashMp4, journeyMp4, outMp4) {
  const listFile = path.join(OUT_DIR, `.concat-${path.basename(outMp4)}.txt`);
  // Re-encode concat so timebases/fps match cleanly (copy can glitch at the join).
  const absSplash = splashMp4.replaceAll("'", "'\\''");
  const absJourney = journeyMp4.replaceAll("'", "'\\''");
  await fs.writeFile(
    listFile,
    `file '${absSplash}'\nfile '${absJourney}'\n`,
    "utf8",
  );

  const pixFmt = process.env.PIX_FMT ?? "yuv420p";
  const ff = spawnSync(
    "ffmpeg",
    [
      "-y",
      "-f",
      "concat",
      "-safe",
      "0",
      "-i",
      listFile,
      "-c:v",
      "libx264",
      "-preset",
      X264_PRESET,
      "-profile:v",
      "high",
      "-pix_fmt",
      pixFmt,
      "-crf",
      String(CRF),
      "-tune",
      "animation",
      "-r",
      String(FPS),
      "-movflags",
      "+faststart",
      outMp4,
    ],
    { stdio: "inherit" },
  );
  await fs.rm(listFile, { force: true });
  if (ff.status !== 0) throw new Error(`ffmpeg concat failed → ${outMp4}`);
}

async function recordPreset(presetKey) {
  const preset = PRESETS[presetKey];
  const { width, height } = preset.viewport;
  const dpr = preset.dpr;
  const outW = width * dpr;
  const outH = height * dpr;
  const outMp4 = path.join(OUT_DIR, `${preset.outBase}.mp4`);
  const splashMp4 = path.join(OUT_DIR, `.${preset.outBase}-splash.mp4`);
  const journeyMp4 = path.join(OUT_DIR, `.${preset.outBase}-journey.mp4`);

  console.log(
    `→ ${presetKey}: ${ORIGIN} (css ${width}×${height} @${dpr}x → ${outW}×${outH}, ${FPS}fps, crf=${CRF})`,
  );

  if (!SKIP_SPLASH) {
    await recordSplashClip(preset, splashMp4);
  }
  await recordJourneyClip(preset, journeyMp4);

  if (SKIP_SPLASH) {
    await fs.copyFile(journeyMp4, outMp4);
  } else {
    console.log("  concat splash + journey…");
    await concatClips(splashMp4, journeyMp4, outMp4);
  }

  await fs.rm(splashMp4, { force: true });
  await fs.rm(journeyMp4, { force: true });

  const { size } = await fs.stat(outMp4);
  const probe = spawnSync(
    "ffprobe",
    [
      "-v",
      "error",
      "-show_entries",
      "format=duration",
      "-of",
      "default=noprint_wrappers=1:nokey=1",
      outMp4,
    ],
    { encoding: "utf8" },
  );
  console.log(
    `  mp4 → ${outMp4} (${(size / 1024 / 1024).toFixed(1)} MB, ${outW}×${outH}, ~${Number(probe.stdout).toFixed(1)}s)`,
  );

  if (presetKey === "desktop") {
    const legacyMp4 = path.join(OUT_DIR, "portfolio-fullscreen.mp4");
    await fs.copyFile(outMp4, legacyMp4);
    console.log(`  also → ${legacyMp4}`);
  }
}

(async () => {
  const arg = (process.argv[2] ?? "both").toLowerCase();
  const keys =
    arg === "both"
      ? ["desktop", "mobile"]
      : arg === "desktop" || arg === "mobile"
        ? [arg]
        : null;

  if (!keys) {
    console.error(
      "Usage: node scripts/record-portfolio-video.mjs [desktop|mobile|both]",
    );
    process.exit(1);
  }

  await fs.mkdir(OUT_DIR, { recursive: true });

  for (const key of keys) {
    await recordPreset(key);
  }
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
