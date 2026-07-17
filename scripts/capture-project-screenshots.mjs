#!/usr/bin/env node
/**
 * Capture real screenshots of each project site at desktop and mobile viewports.
 * Uses Playwright (auto-installs Chromium on first run).
 *
 * Run: node scripts/capture-project-screenshots.mjs
 */
import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, "..", "public", "projects-v2");
fs.mkdirSync(OUT_DIR, { recursive: true });

// [name, url, extraWaitMs (optional)]
const SITES = [
  ["heybristol", "https://heybristol.com", 3000],
  ["kostume", "https://www.kostumeweb.net/home/", 6000],
  ["ursulabenavidez", "https://www.ursulabenavidez.com/", 5000],
  ["eldesenfreno", "https://eldesenfreno.com", 5000],
  ["grupofrali", "https://www.grupofrali.com/", 8000],
];

const VIEWPORTS = [
  {
    key: "desktop",
    suffix: "",
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
      "(KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  },
  {
    key: "mobile",
    suffix: "-mobile",
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 " +
      "(KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    isMobile: true,
  },
];

/** Drop uniform 1px artifact rows Playwright sometimes captures at the top. */
function trimScreenshotTop(file) {
  execSync("python3 -", {
    input: `
from PIL import Image
path = ${JSON.stringify(file)}
im = Image.open(path)
w, h = im.size
crop = 0
for y in range(min(12, h - 1)):
    row = [im.getpixel((x, y))[:3] for x in range(w)]
    if len(set(row)) <= 4:
        below = [im.getpixel((x, y + 1))[:3] for x in range(w)]
        avg = tuple(sum(p[i] for p in row) // w for i in range(3))
        avg_b = tuple(sum(p[i] for p in below) // w for i in range(3))
        if sum(abs(avg[i] - avg_b[i]) for i in range(3)) > 40:
            crop = y + 1
            continue
    break
if crop:
    im.crop((0, crop, w, h)).save(path)
    print(f'  trimmed {crop}px top artifact')
`,
    stdio: ["pipe", "inherit", "inherit"],
  });
}

async function dismissPopups(page) {
  const selectors = [
    // Kostüme newsletter modal (full-screen overlay, X button top-right)
    ".fixed.inset-0.z-50 button.absolute.top-4.right-4",
    "div.fixed.inset-0 button.absolute.top-4.right-4",
    '[aria-label="Close" i]',
    '[aria-label="Cerrar" i]',
    'button:has-text("Close")',
    'button:has-text("Cerrar")',
    'button:has-text("No thanks")',
    'button:has-text("No, gracias")',
    'button:has-text("Accept")',
    'button:has-text("Aceptar")',
    'button:has-text("×")',
    ".close",
    ".modal-close",
  ];

  for (let attempt = 0; attempt < 3; attempt++) {
    let dismissed = false;
    for (const sel of selectors) {
      try {
        const btn = page.locator(sel).first();
        if (await btn.isVisible({ timeout: 400 })) {
          await btn.click({ timeout: 1500 });
          await page.waitForTimeout(600);
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

async function captureSite(browser, name, url, waitMs, viewportConfig) {
  const context = await browser.newContext({
    viewport: viewportConfig.viewport,
    deviceScaleFactor: viewportConfig.deviceScaleFactor,
    userAgent: viewportConfig.userAgent,
    isMobile: viewportConfig.isMobile ?? false,
    hasTouch: viewportConfig.isMobile ?? false,
  });
  const page = await context.newPage();

  await page.addInitScript(() => {
    const style = document.createElement("style");
    style.textContent =
      "*, *::before, *::after { animation: none !important; transition: none !important; }";
    document.documentElement.appendChild(style);
  });

  console.log(`→ ${name} (${viewportConfig.key}): ${url}`);
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 30_000 });
  } catch (err) {
    console.warn(`  networkidle timed out, continuing: ${err.message}`);
  }

  await page.waitForTimeout(waitMs);
  await dismissPopups(page);

  const file = path.join(OUT_DIR, `${name}${viewportConfig.suffix}.png`);
  await page.screenshot({ path: file, fullPage: false, animations: "disabled" });
  trimScreenshotTop(file);
  const { size } = fs.statSync(file);
  console.log(`  saved ${file} (${(size / 1024).toFixed(0)}kb)`);

  await context.close();
}

const onlyMobile = process.argv.includes("--mobile-only");
const onlySite = process.argv.find((a) => a.startsWith("--only="))?.slice(7);

(async () => {
  const browser = await chromium.launch();
  const viewports = onlyMobile
    ? VIEWPORTS.filter((v) => v.key === "mobile")
    : VIEWPORTS;
  const sites = onlySite
    ? SITES.filter(([name]) => name === onlySite)
    : SITES;

  if (onlySite && sites.length === 0) {
    console.error(`Unknown site "${onlySite}". Available: ${SITES.map(([n]) => n).join(", ")}`);
    process.exit(1);
  }

  for (const [name, url, waitMs = 4000] of sites) {
    for (const viewportConfig of viewports) {
      await captureSite(browser, name, url, waitMs, viewportConfig);
    }
  }

  await browser.close();
})();
