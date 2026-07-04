#!/usr/bin/env node
/**
 * Record Hey Bristol fullscreen hero video for portfolio previews.
 * Run: node scripts/capture-heybristol-preview-video.mjs [desktop|mobile|both]
 */
import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, "..", "public", "projects-v2");
const URL = "https://heybristol.com";

const PRESETS = {
  desktop: {
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    outFile: "heybristol-preview-desktop.mp4",
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
      "(KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  },
  mobile: {
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    outFile: "heybristol-preview-mobile.mp4",
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 " +
      "(KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    isMobile: true,
  },
};

const TRIM_DURATION_SEC = 7;
const TRIM_BUFFER_SEC = 2;

fs.mkdirSync(OUT_DIR, { recursive: true });

async function waitForHeroVideo(page) {
  await page.waitForFunction(() => {
    function isFullscreenHero(video) {
      const rect = video.getBoundingClientRect();
      const style = getComputedStyle(video);

      if (style.display === "none" || style.visibility === "hidden") return false;
      if (rect.top > 8) return false;
      if (rect.width < window.innerWidth * 0.92) return false;
      if (rect.height < window.innerHeight * 0.92) return false;

      return (
        video.classList.contains("absolute") ||
        video.className.includes("absolute inset-0")
      );
    }

    for (const video of document.querySelectorAll("video")) {
      if (isFullscreenHero(video)) return true;
    }
    return false;
  }, { timeout: 30_000 });
  console.log("  fullscreen hero video visible");

  await page.evaluate(() => {
    function isFullscreenHero(video) {
      const rect = video.getBoundingClientRect();
      const style = getComputedStyle(video);

      if (style.display === "none" || style.visibility === "hidden") return false;
      if (rect.top > 8) return false;
      if (rect.width < window.innerWidth * 0.92) return false;
      if (rect.height < window.innerHeight * 0.92) return false;

      return (
        video.classList.contains("absolute") ||
        video.className.includes("absolute inset-0")
      );
    }

    for (const video of document.querySelectorAll("video")) {
      if (isFullscreenHero(video)) {
        video.muted = true;
        video.loop = true;
        void video.play();
      }
    }
  });

  await page.waitForTimeout(2000);
}

function hasFfmpeg() {
  try {
    execSync("ffmpeg -version", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function trimToPreview(input, output, trimStartSec) {
  execSync(
    [
      "ffmpeg -y",
      `-ss ${trimStartSec.toFixed(2)}`,
      `-i ${JSON.stringify(input)}`,
      `-t ${TRIM_DURATION_SEC}`,
      "-an",
      "-c:v libx264",
      "-pix_fmt yuv420p",
      "-movflags +faststart",
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

  await waitForHeroVideo(page);
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

  const webmFull = path.join(OUT_DIR, `heybristol-preview-${presetKey}-full.webm`);
  fs.renameSync(webmTemp, webmFull);

  const mp4Full = path.join(OUT_DIR, `heybristol-preview-${presetKey}-full.mp4`);
  execSync(
    `ffmpeg -y -i ${JSON.stringify(webmFull)} -an -c:v libx264 -pix_fmt yuv420p ${JSON.stringify(mp4Full)}`,
    { stdio: "inherit" },
  );

  const mp4Out = path.join(OUT_DIR, preset.outFile);
  trimToPreview(mp4Full, mp4Out, trimStartSec);

  fs.unlinkSync(webmFull);
  fs.unlinkSync(mp4Full);

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
      "Usage: node scripts/capture-heybristol-preview-video.mjs [desktop|mobile|both]",
    );
    process.exit(1);
  }

  for (const presetKey of targets) {
    await capturePreset(presetKey);
  }
})();
