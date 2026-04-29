#!/usr/bin/env node
/**
 * Capture real screenshots of each project site at 1440x900.
 * Uses Playwright (auto-installs Chromium on first run).
 *
 * Run: node scripts/capture-project-screenshots.mjs
 */
import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR  = path.resolve(__dirname, "..", "public", "projects-v2");
fs.mkdirSync(OUT_DIR, { recursive: true });

// [name, url, extraWaitMs (optional), closeSelector (optional)]
const SITES = [
  ["heybristol",      "https://heybristol.com",              3000],
  ["kostume",         "https://www.kostumeweb.net/home/",    6000],
  ["vinorodante",     "https://vinorodante.com",             5000],
  ["ursulabenavidez", "https://www.ursulabenavidez.com/",    5000],
  ["templodetierra",  "https://templodetierra.com",          5000],
  ["eldesenfreno",    "https://eldesenfreno.com",            5000],
];

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport:          { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
      "(KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  });

  for (const [name, url, waitMs = 4000] of SITES) {
    const page = await context.newPage();
    console.log(`→ ${name}: ${url}`);
    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 30_000 });
    } catch (err) {
      console.warn(`  networkidle timed out, continuing: ${err.message}`);
    }

    // Give it extra time for animations / lazy images / popups
    await page.waitForTimeout(waitMs);

    // Try to dismiss common newsletter/cookie popups
    for (const sel of [
      '[aria-label="Close" i]',
      '[aria-label="Cerrar" i]',
      'button:has-text("Close")',
      'button:has-text("Cerrar")',
      'button:has-text("Accept")',
      'button:has-text("Aceptar")',
      'button:has-text("×")',
      '.close',
      '.modal-close',
    ]) {
      try {
        const btn = page.locator(sel).first();
        if (await btn.isVisible({ timeout: 500 })) {
          await btn.click({ timeout: 1000 });
          await page.waitForTimeout(500);
          break;
        }
      } catch {}
    }

    const file = path.join(OUT_DIR, `${name}.png`);
    await page.screenshot({ path: file, fullPage: false });
    const { size } = fs.statSync(file);
    console.log(`  saved ${file} (${(size / 1024).toFixed(0)}kb)`);
    await page.close();
  }

  await browser.close();
})();
