import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const dgPath = path.join(process.cwd(), 'public', 'dg');
    
    // Check if directory exists
    if (!fs.existsSync(dgPath)) {
      return NextResponse.json({ images: [] });
    }

    // Read directory contents
    const files = fs.readdirSync(dgPath);
    
    // Filter for image files only
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'];
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return imageExtensions.includes(ext);
    });

    // Shuffle the images array
    const shuffledImages = imageFiles.sort(() => Math.random() - 0.5);

    return NextResponse.json({ images: shuffledImages });
  } catch (error) {
    console.error('Error reading graphics images:', error);
    return NextResponse.json({ images: [] }, { status: 500 });
  }
}
