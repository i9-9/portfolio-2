/**
 * Full-height PNG of the main landing (`/`) at 1440px wide.
 *
 * Prerequisites: `npm run dev` (http://localhost:3000/)
 *
 *   node scripts/screenshot-v2-full.mjs
 */

import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const ORIGIN = "http://localhost:3000/";
const OUT = path.resolve("portfolio-v2-full-site-desktop.png");

/** Seconds after tall viewport applies (IO triggers + Framer lines + marquee + WebGL warmup).
 *  Uses `reducedMotion: "reduce"`: Hero halftone renders a CSS dot grid fallback (see HeroHalftoneP5).
 */
const FREEZE_SECONDS = 8;

async function unsetViewportMinHeights(page) {
  await page.evaluate(() => {
    document.querySelectorAll(".min-h-screen").forEach((el) => {
      el.style.minHeight = "unset";
    });
    document.querySelectorAll("section").forEach((el) => {
      if (
        typeof el.className === "string" &&
        el.className.includes("min-h-[calc(100vh-6rem)]")
      ) {
        el.style.minHeight = "unset";
      }
    });
  });
}

async function measureFullHeight(page) {
  return page.evaluate(() =>
    Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
    ),
  );
}

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();

  await page.goto(ORIGIN, { waitUntil: "networkidle", timeout: 60_000 });
  await page.waitForTimeout(2000);

  await unsetViewportMinHeights(page);
  await page.waitForTimeout(200);

  const height = await measureFullHeight(page);
  await page.setViewportSize({ width: 1440, height });

  await page.evaluate(() =>
    window.scrollTo({ top: 0, behavior: "instant" }),
  );
  await page.waitForTimeout(Math.round(FREEZE_SECONDS * 1000));

  await page.waitForTimeout(500);

  const buf = await page.screenshot({ fullPage: false, type: "png" });

  await browser.close();

  await fs.writeFile(OUT, buf);

  console.log(`Wrote ${OUT} (${buf.length} bytes)`);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
