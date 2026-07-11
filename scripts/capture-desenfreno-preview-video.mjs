#!/usr/bin/env node
/**
 * Record El Desenfreno homepage at desktop + mobile viewports for portfolio previews.
 * Full viewport — sidebar + catalog on desktop, ticker + catalog on mobile.
 * Run: node scripts/capture-desenfreno-preview-video.mjs [desktop|mobile|both]
 */
import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, "..", "public", "projects-v2");
const URL = "https://eldesenfreno.com";

const PRESETS = {
  desktop: {
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    outFile: "eldesenfreno-preview-desktop.mp4",
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
      "(KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  },
  mobile: {
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    outFile: "eldesenfreno-preview-mobile.mp4",
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 " +
      "(KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    isMobile: true,
  },
};

const TRIM_DURATION_SEC = 7;
const TRIM_BUFFER_SEC = 1.5;

fs.mkdirSync(OUT_DIR, { recursive: true });

async function dismissPopups(page) {
  const selectors = [
    '[aria-label="Close" i]',
    '[aria-label="Cerrar" i]',
    'button:has-text("Accept")',
    'button:has-text("Aceptar")',
    'button:has-text("×")',
  ];

  for (const sel of selectors) {
    try {
      const btn = page.locator(sel).first();
      if (await btn.isVisible({ timeout: 400 })) {
        await btn.click({ timeout: 1500 });
        await page.waitForTimeout(400);
        break;
      }
    } catch {}
  }
}

async function waitForHomepage(page, presetKey) {
  if (presetKey === "mobile") {
    await page.waitForSelector(".rfm-marquee-container", {
      state: "visible",
      timeout: 30_000,
    });
    console.log("  mobile ticker visible");
  } else {
    await page.waitForSelector("aside", {
      state: "visible",
      timeout: 30_000,
    });
    console.log("  desktop sidebar visible");
  }

  await page.waitForSelector('a[href*="/product"], a[href*="/tienda"]', {
    timeout: 30_000,
  });
  console.log("  catalog content visible");

  await page.waitForTimeout(1500);
}

function hasFfmpeg() {
  try {
    execSync("ffmpeg -version", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

/** High-quality H.264 for portfolio previews (single encode from WebM). */
const H264_ARGS = [
  "-an",
  "-c:v libx264",
  "-crf 18",
  "-preset medium",
  "-pix_fmt yuv420p",
  "-movflags +faststart",
];

function trimToPreview(input, output, trimStartSec) {
  execSync(
    [
      "ffmpeg -y",
      `-ss ${trimStartSec.toFixed(2)}`,
      `-i ${JSON.stringify(input)}`,
      `-t ${TRIM_DURATION_SEC}`,
      ...H264_ARGS,
      JSON.stringify(output),
    ].join(" "),
    { stdio: "inherit" },
  );
}

async function capturePreset(presetKey) {
  const preset = PRESETS[presetKey];
  const { width, height } = preset.viewport;

  const browser = await chromium.launch();
  const recordingStartedAt = Date.now();
  // recordVideo.size must match viewport CSS size — a larger canvas
  // letterboxes the page into a corner (Playwright does not upscale-fill).
  const context = await browser.newContext({
    viewport: preset.viewport,
    deviceScaleFactor: preset.deviceScaleFactor,
    recordVideo: {
      dir: OUT_DIR,
      size: { width, height },
    },
    userAgent: preset.userAgent,
    isMobile: preset.isMobile ?? false,
    hasTouch: preset.isMobile ?? false,
  });

  const page = await context.newPage();

  console.log(`→ Recording ${presetKey} ${URL} at ${width}×${height}`);
  try {
    await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 60_000 });
  } catch (err) {
    console.warn(`  domcontentloaded timed out, continuing: ${err.message}`);
  }

  await dismissPopups(page);
  await waitForHomepage(page, presetKey);
  await page.evaluate(() => window.scrollTo(0, 0));

  const trimStartSec =
    (Date.now() - recordingStartedAt) / 1000 + TRIM_BUFFER_SEC;
  console.log(`  trim starts at ${trimStartSec.toFixed(1)}s`);

  await page.waitForTimeout(10_000);

  const webmTemp = await page.video()?.path();
  await context.close();
  await browser.close();

  if (!webmTemp || !fs.existsSync(webmTemp)) {
    throw new Error(`No video file produced for ${presetKey}.`);
  }

  const webmFull = path.join(
    OUT_DIR,
    `eldesenfreno-preview-${presetKey}-full.webm`,
  );
  fs.renameSync(webmTemp, webmFull);

  const mp4Out = path.join(OUT_DIR, preset.outFile);
  trimToPreview(webmFull, mp4Out, trimStartSec);

  fs.unlinkSync(webmFull);

  console.log(
    `  saved ${mp4Out} (${(fs.statSync(mp4Out).size / 1024).toFixed(0)}kb, ${TRIM_DURATION_SEC}s loop)`,
  );
}

(async () => {
  if (!hasFfmpeg()) {
    console.error("ffmpeg is required.");
    process.exit(1);
  }

  const mode = process.argv[2] ?? "both";
  const targets =
    mode === "both"
      ? ["desktop", "mobile"]
      : mode === "desktop" || mode === "mobile"
        ? [mode]
        : null;

  if (!targets) {
    console.error(
      "Usage: node scripts/capture-desenfreno-preview-video.mjs [desktop|mobile|both]",
    );
    process.exit(1);
  }

  for (const presetKey of targets) {
    await capturePreset(presetKey);
  }
})();
