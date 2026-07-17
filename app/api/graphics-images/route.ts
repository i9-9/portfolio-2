import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg']);

export async function GET() {
  try {
    const dgPath = path.join(process.cwd(), 'public', 'dg');

    if (!fs.existsSync(dgPath)) {
      return NextResponse.json({ images: [] });
    }

    const imageFiles = fs
      .readdirSync(dgPath, { withFileTypes: true })
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((file) => IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase()));

    // Shuffle so each visit gets a fresh desktop layout seed set
    const shuffledImages = imageFiles.sort(() => Math.random() - 0.5);

    return NextResponse.json({ images: shuffledImages });
  } catch (error) {
    console.error('Error reading graphics images:', error);
    return NextResponse.json({ images: [] }, { status: 500 });
  }
}
