import sharp from 'sharp';
import { mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const publicDir = './public';

// Ensure directory exists
if (!existsSync(publicDir)) {
  mkdirSync(publicDir, { recursive: true });
}

// Create a simple icon with the app name
async function createIcon(size, filename) {
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#000000"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.35}" 
            font-weight="bold" fill="white" text-anchor="middle" dy=".35em">SD</text>
    </svg>
  `;
  
  await sharp(Buffer.from(svg))
    .png()
    .toFile(join(publicDir, filename));
  
  console.log(`Created ${filename}`);
}

async function main() {
  await createIcon(192, 'icon-192.png');
  await createIcon(512, 'icon-512.png');
  console.log('PWA icons created successfully!');
}

main().catch(console.error);