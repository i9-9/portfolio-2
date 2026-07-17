/**
 * Generates retina card thumbnails for public/dg → public/dg/thumbs/*.jpg
 * Card max CSS width is ~220px; 440px covers 2x displays.
 *
 * Usage: node scripts/generate-dg-thumbs.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const dgDir = path.join(root, "public", "dg");
const thumbsDir = path.join(dgDir, "thumbs");

const IMAGE_EXT = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp"]);
const THUMB_WIDTH = 440;
const JPEG_QUALITY = 82;

function stem(filename) {
  return filename.replace(/\.[^.]+$/, "");
}

async function main() {
  if (!fs.existsSync(dgDir)) {
    console.error("Missing", dgDir);
    process.exit(1);
  }

  fs.mkdirSync(thumbsDir, { recursive: true });

  const files = fs
    .readdirSync(dgDir, { withFileTypes: true })
    .filter((d) => d.isFile())
    .map((d) => d.name)
    .filter((name) => IMAGE_EXT.has(path.extname(name).toLowerCase()));

  for (const name of files) {
    const src = path.join(dgDir, name);
    const out = path.join(thumbsDir, `${stem(name)}.jpg`);
    const before = fs.statSync(src).size;

    await sharp(src)
      .rotate()
      .resize({
        width: THUMB_WIDTH,
        withoutEnlargement: true,
        fit: "inside",
      })
      .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
      .toFile(out);

    const after = fs.statSync(out).size;
    console.log(
      `${name}  ${(before / 1024).toFixed(0)}KB → ${(after / 1024).toFixed(0)}KB`,
    );
  }

  console.log(`Done — ${files.length} thumbs in public/dg/thumbs/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
