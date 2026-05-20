import sharp from 'sharp';
import { existsSync } from 'fs';
import { join } from 'path';

const publicDir = './public';
const logoPath = './public/mobileeee - new.jpeg';

// Check if logo exists
if (!existsSync(logoPath)) {
  console.error('Logo file not found at:', logoPath);
  process.exit(1);
}

async function createIcon(size, filename, format = 'png') {
  try {
    let pipeline = sharp(logoPath)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      });
    
    if (format === 'jpeg') {
      pipeline = pipeline.jpeg({ quality: 95 });
    } else {
      pipeline = pipeline.png();
    }
    
    await pipeline.toFile(join(publicDir, filename));
    console.log(`Created ${filename} (${size}x${size}, format: ${format})`);
  } catch (error) {
    console.error(`Error creating ${filename}:`, error);
  }
}

async function main() {
  console.log('Generating PWA icons from "mobileeee - new.jpeg"...');
  
  // Create PNG icons for standard/Android PWAs
  await createIcon(192, 'icon-192.png', 'png');
  await createIcon(512, 'icon-512.png', 'png');
  
  // Create JPEG icon which is referenced in manifest.json and layout.tsx
  await createIcon(1024, 'pwa-icon.jpeg', 'jpeg');
  
  console.log('All PWA icons created successfully!');
}

main().catch(console.error);
