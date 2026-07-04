#!/usr/bin/env node
/**
 * Record Kostüme hero Vimeo playback for portfolio hover preview.
 * Run: node scripts/capture-kostume-preview-video.mjs
 */
import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, "..", "public", "projects-v2");
const URL = "https://www.kostumeweb.net/home/";

/** 16:10 — matches hover preview aspect (w-96 aspect-[16/10]) at 2× density. */
const WIDTH = 768;
const HEIGHT = 480;
/** Seconds to skip (popup + player spin-up), then clip length for hover loop. */
const TRIM_START_SEC = 5;
const TRIM_DURATION_SEC = 7;

fs.mkdirSync(OUT_DIR, { recursive: true });

async function dismissPopups(page) {
  const selectors = [
    ".fixed.inset-0.z-50 button.absolute.top-4.right-4",
    "div.fixed.inset-0 button.absolute.top-4.right-4",
    '[aria-label="Close" i]',
    '[aria-label="Cerrar" i]',
    'button:has-text("×")',
  ];

  for (let attempt = 0; attempt < 4; attempt++) {
    let dismissed = false;
    for (const sel of selectors) {
      try {
        const btn = page.locator(sel).first();
        if (await btn.isVisible({ timeout: 500 })) {
          await btn.click({ timeout: 1500 });
          await page.waitForTimeout(500);
          dismissed = true;
          break;
        }
      } catch {}
    }
    if (!dismissed) break;
  }

  try {
    await page.keyboard.press("Escape");
    await page.waitForTimeout(300);
  } catch {}
}

function hasFfmpeg() {
  try {
    execSync("ffmpeg -version", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function trimToPreview(input, output) {
  execSync(
    [
      "ffmpeg -y",
      `-ss ${TRIM_START_SEC}`,
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

(async () => {
  if (!hasFfmpeg()) {
    console.error("ffmpeg is required.");
    process.exit(1);
  }

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 1,
    recordVideo: {
      dir: OUT_DIR,
      size: { width: WIDTH, height: HEIGHT },
    },
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
      "(KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  });

  const page = await context.newPage();

  console.log(`→ Recording ${URL} at ${WIDTH}×${HEIGHT}`);
  try {
    await page.goto(URL, { waitUntil: "networkidle", timeout: 60_000 });
  } catch (err) {
    console.warn(`  networkidle timed out, continuing: ${err.message}`);
  }

  await dismissPopups(page);

  try {
    await page.waitForSelector('iframe[src*="vimeo"]', { timeout: 25_000 });
    console.log("  Vimeo iframe loaded");
  } catch {
    console.warn("  Vimeo iframe not found — recording anyway");
  }

  // Hero Vimeo loop — hold through one readable beat.
  await page.waitForTimeout(8000);

  const webmTemp = await page.video()?.path();
  await context.close();
  await browser.close();

  if (!webmTemp || !fs.existsSync(webmTemp)) {
    console.error("No video file produced.");
    process.exit(1);
  }

  const webmFull = path.join(OUT_DIR, "kostume-preview-full.webm");
  fs.renameSync(webmTemp, webmFull);

  const mp4Full = path.join(OUT_DIR, "kostume-preview-full.mp4");
  execSync(
    `ffmpeg -y -i ${JSON.stringify(webmFull)} -an -c:v libx264 -pix_fmt yuv420p ${JSON.stringify(mp4Full)}`,
    { stdio: "inherit" },
  );

  const mp4Out = path.join(OUT_DIR, "kostume-preview.mp4");
  trimToPreview(mp4Full, mp4Out);

  fs.unlinkSync(webmFull);
  fs.unlinkSync(mp4Full);

  console.log(
    `  saved ${mp4Out} (${(fs.statSync(mp4Out).size / 1024).toFixed(0)}kb, ${TRIM_DURATION_SEC}s loop)`,
  );
})();
