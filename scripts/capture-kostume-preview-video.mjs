#!/usr/bin/env node
/**
 * Record Kostüme hero Vimeo playback for portfolio previews.
 * Run: node scripts/capture-kostume-preview-video.mjs [desktop|mobile|both]
 */
import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, "..", "public", "projects-v2");
const URL = "https://www.kostumeweb.net/home/";

const PRESETS = {
  desktop: {
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    outFile: "kostume-preview-desktop.mp4",
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
      "(KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  },
  mobile: {
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    outFile: "kostume-preview-mobile.mp4",
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 " +
      "(KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    isMobile: true,
  },
};

/** Clip length for hover / hero loop. */
const TRIM_DURATION_SEC = 7;
/** Extra seconds of settled playback before the clip starts. */
const TRIM_BUFFER_SEC = 1;

fs.mkdirSync(OUT_DIR, { recursive: true });

async function popupVisible(page) {
  const overlay = page.locator(".fixed.inset-0.z-50").first();
  try {
    return await overlay.isVisible({ timeout: 300 });
  } catch {
    return false;
  }
}

async function dismissPopups(page) {
  const selectors = [
    ".fixed.inset-0.z-50 button.absolute.top-4.right-4",
    ".fixed.inset-0.z-50",
  ];

  for (let attempt = 0; attempt < 8; attempt++) {
    if (!(await popupVisible(page))) break;

    let dismissed = false;
    for (const sel of selectors) {
      try {
        const target = page.locator(sel).first();
        if (await target.isVisible({ timeout: 800 })) {
          await target.click({ timeout: 2000, force: true });
          await page.waitForTimeout(400);
          dismissed = true;
          break;
        }
      } catch {}
    }

    if (!dismissed) {
      await page.evaluate(() => {
        document
          .querySelectorAll(".fixed.inset-0.z-50")
          .forEach((el) => el.remove());
      });
      await page.waitForTimeout(300);
    }

    if (!(await popupVisible(page))) break;
  }

  try {
    await page.keyboard.press("Escape");
  } catch {}
}

/** Wait until the visible hero Vimeo iframe has real frames playing (not the loader). */
async function waitForVimeoPlaying(page) {
  // Site mounts desktop + mobile iframes; only one is laid out.
  await page.waitForFunction(
    () => {
      for (const iframe of document.querySelectorAll(
        'iframe[src*="player.vimeo.com"]',
      )) {
        const rect = iframe.getBoundingClientRect();
        const style = getComputedStyle(iframe);
        if (
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          rect.width > 100 &&
          rect.height > 100
        ) {
          return true;
        }
      }
      return false;
    },
    { timeout: 45_000 },
  );
  console.log("  Vimeo iframe laid out");

  await page.waitForTimeout(800);

  const frameInfo = await page.evaluate(() => {
    for (const iframe of document.querySelectorAll(
      'iframe[src*="player.vimeo.com"]',
    )) {
      const rect = iframe.getBoundingClientRect();
      const style = getComputedStyle(iframe);
      if (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        rect.width > 100 &&
        rect.height > 100
      ) {
        return { src: iframe.src, name: iframe.name || null };
      }
    }
    return null;
  });

  if (!frameInfo?.src) {
    throw new Error("Visible Vimeo iframe not found.");
  }

  let vimeoFrame = null;
  for (let i = 0; i < 40; i++) {
    vimeoFrame = page.frames().find((f) => {
      const url = f.url();
      return (
        url.includes("player.vimeo.com") &&
        (url.includes("1183457699") || url.includes("video/"))
      );
    });
    // Prefer the frame whose URL matches the visible iframe src closely.
    const exact = page.frames().find((f) => f.url().startsWith(frameInfo.src.split("?")[0]));
    if (exact) {
      vimeoFrame = exact;
      break;
    }
    if (vimeoFrame) break;
    await page.waitForTimeout(500);
  }

  // If multiple player frames exist, pick the one whose element is visible.
  if (!vimeoFrame || page.frames().filter((f) => f.url().includes("player.vimeo.com")).length > 1) {
    const candidates = page.frames().filter((f) =>
      f.url().includes("player.vimeo.com"),
    );
    for (const frame of candidates) {
      const el = await frame.frameElement().catch(() => null);
      if (!el) continue;
      const box = await el.boundingBox().catch(() => null);
      if (box && box.width > 100 && box.height > 100) {
        vimeoFrame = frame;
        break;
      }
    }
  }

  if (!vimeoFrame) {
    throw new Error("Vimeo player frame not attached.");
  }
  console.log(`  using frame ${vimeoFrame.url().slice(0, 80)}…`);

  // Force muted play inside the player (autoplay policies).
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      await vimeoFrame.evaluate(() => {
        const video = document.querySelector("video");
        if (!video) return;
        video.muted = true;
        video.loop = true;
        void video.play();
      });
    } catch {}
    await page.waitForTimeout(400);
  }

  await vimeoFrame.waitForFunction(
    () => {
      const video = document.querySelector("video");
      if (!video) return false;
      return (
        video.readyState >= 2 &&
        video.videoWidth > 16 &&
        video.currentTime > 0.5 &&
        !video.paused
      );
    },
    { timeout: 60_000 },
  );

  await vimeoFrame.evaluate(() => {
    const video = document.querySelector("video");
    if (!video) return;
    video.muted = true;
    video.loop = true;
    if (video.paused) void video.play();
  });

  console.log("  Vimeo video playing");
  await page.waitForTimeout(500);
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

  console.log("  waiting for newsletter popup…");
  try {
    await page.waitForSelector(".fixed.inset-0.z-50", { timeout: 12_000 });
  } catch {
    console.warn("  popup overlay not detected — continuing");
  }
  await page.waitForTimeout(400);
  await dismissPopups(page);

  if (await popupVisible(page)) {
    console.warn("  popup still visible — removing from DOM");
    await page.evaluate(() => {
      document
        .querySelectorAll(".fixed.inset-0.z-50")
        .forEach((el) => el.remove());
    });
  } else {
    console.log("  popup dismissed");
  }

  await waitForVimeoPlaying(page);
  await page.evaluate(() => window.scrollTo(0, 0));

  // Trim only after Vimeo is actually playing — not while the loader shows.
  const trimStartSec =
    (Date.now() - recordingStartedAt) / 1000 + TRIM_BUFFER_SEC;
  console.log(`  trim starts at ${trimStartSec.toFixed(1)}s`);

  await page.waitForTimeout((TRIM_DURATION_SEC + TRIM_BUFFER_SEC + 1) * 1000);

  const webmTemp = await page.video()?.path();
  await context.close();
  await browser.close();

  if (!webmTemp || !fs.existsSync(webmTemp)) {
    throw new Error(`No video file produced for ${presetKey}.`);
  }

  const webmFull = path.join(OUT_DIR, `kostume-preview-${presetKey}-full.webm`);
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
    console.error('Usage: node scripts/capture-kostume-preview-video.mjs [desktop|mobile|both]');
    process.exit(1);
  }

  for (const presetKey of targets) {
    await capturePreset(presetKey);
  }
})();
