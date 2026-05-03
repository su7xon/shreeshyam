import sharp from 'sharp';
import { existsSync } from 'fs';
import { join } from 'path';

const publicDir = './public';
const logoPath = './public/WhatsApp_Image_2026-04-09_at_8.37.15_PM-removebg-preview.png';

// Check if logo exists
if (!existsSync(logoPath)) {
  console.error('Logo file not found at:', logoPath);
  process.exit(1);
}

async function createIcon(size, filename) {
  try {
    await sharp(logoPath)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .png()
      .toFile(join(publicDir, filename));
    
    console.log(`Created ${filename} (${size}x${size})`);
  } catch (error) {
    console.error(`Error creating ${filename}:`, error);
  }
}

async function main() {
  console.log('Generating PWA icons from logo...');
  await createIcon(192, 'icon-192.png');
  await createIcon(512, 'icon-512.png');
  console.log('PWA icons created successfully!');
}

main().catch(console.error);