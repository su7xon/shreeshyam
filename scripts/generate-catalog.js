const fs = require('fs');
const path = require('path');

const rawText = `
OPPO (36 Models)
A6 5G (4+128GB, 6+128GB, 6+256GB variants)
A6 Pro 5G (8+128GB, 8+256GB)
A6S 5G (4+128GB, 6+128GB)
A6X 5G (4+64GB, 4+128GB, 6+128GB)
F29 Pro 5G (12+256GB)
Reno 14 Pro 5G (12+256GB)
Reno 15 5G (12+512GB)
Reno 15 Pro (12+256GB)
Reno 15 Pro Mini 5G (12+256GB)
Reno 15C 5G (8+256GB, 12+256GB)
F31 5G (8+128GB, 8+256GB)
F31 Pro 5G (8+128GB, 8+256GB, 12+256GB)
F31 Pro+ 5G (8+256GB, 12+256GB)
K13 Turbo Pro 5G (8+256GB)
A6X 4G (4+64GB)
A6 Pro 5G (8GB)
F27
F29
K12
K13
K14X 5G
A3

REALME (33 Models)
15 5G (8+128GB)
15 Pro (8+128GB, 8+256GB)
15 Pro+ 5G (8+256GB)
15T 5G (8+256GB)
15X (8+128GB, 8+256GB)
16 5G (8+256GB, 12+256GB)
16 Pro 5G (8+128GB, 8+256GB)
16 Pro+ 5G (8+256GB)
C73 5G (4+128GB)
C83 5G (4+64GB, 4+128GB, 6+128GB)
C85 5G (4+128GB, 6+128GB)
C71 (4+64GB)
GT 7T (8+256GB)
Narzo 90 5G (8+128GB)
Narzo 90X 5G (6+128GB)
P3X 5G (8+128GB)
P4X 5G (8+128GB)
P3 Pro 8GB
Realme 16 Pro
Realme P4 5G
RMX3933
RMX3990 13
RMX5000

SAMSUNG (52 Models)
Galaxy A06 (4+64GB, 4+128GB)
Galaxy A06 5G (4+64GB, 4+128GB)
Galaxy A07 5G (4+128GB)
Galaxy A07 4G (4+64GB)
Galaxy A16 5G (6+128GB, 8+128GB)
Galaxy A17 5G (6+128GB, 8+128GB, 8+256GB)
Galaxy A26 5G (8+128GB)
Galaxy A35 5G (8+256GB)
Galaxy A36 5G (8+128GB)
Galaxy A37 5G (8+128GB, 8+256GB)
Galaxy A56 5G (12+256GB)
Galaxy A57 5G (8+256GB)
Galaxy F16 5G (4+128GB)
Galaxy F17 5G (4+128GB, 6+128GB, 8+128GB)
Galaxy F36 5G (6+128GB)
Galaxy F56 5G (8+128GB, 8+256GB)
Galaxy M06 5G (4+128GB)
Galaxy M16 5G (4+128GB)
Galaxy M35 5G (6+128GB)
Galaxy M36 5G (8+128GB)
Galaxy M56 5G (8+128GB)
Galaxy S25 (12+256GB)
Galaxy S25 FE (8+512GB)
Galaxy S26 Ultra (12+256GB)
Galaxy Z Fold7 (12+256GB)
Galaxy Tab A11+ 5G (6+128GB)
Galaxy A06 (Black)
Galaxy A16 (Gold)

VIVO (47 Models)
X200 Pro (16+512GB)
X200T 5G (12+256GB)
X300 5G (12+256GB)
V50E (8+256GB)
V60 (8+256GB)
V60E (8+256GB)
V70 5G (8+256GB)
V70 Elite 5G (8+256GB)
V70 Elite 5G Demo (8+256GB)
V70 FE 5G (8+256GB, 12+256GB)
Y19E (4+64GB)
Y19 5G (6+128GB)
Y19S 4G (4+128GB)
Y19S 5G (6+128GB)
Y21 5G (4+128GB, 8+128GB)
Y29 5G (4+128GB)
Y31 5G (4+128GB, 6+128GB)
Y400 5G (8+128GB, 8+256GB)
Y400 Pro 5G (8+128GB, 8+256GB)
Y51 Pro 5G (8+128GB, 8+256GB)
T4X 5G (6+128GB)
T3 Pro
T4 5G
T4 Lite
T4R 5G
T4X
T5X 5G

TECNO (26 Models)
Spark 20 Pro 5G (8+128GB)
Spark 30C 5G (8+128GB)
Spark 50 5G (4+128GB, 6+128GB)
Spark Go 2 (4+64GB)
Spark Go 3 (4+64GB)
Spark Go 5G (4+128GB)
Pova 6 Neo 5G (6+128GB)
Pova 6 Pro 5G (8+256GB)
Pova 7 5G (8+256GB)
Pova Curve 5G (8+128GB, 8+256GB)
Pova Curve 2 (8+128GB, 8+256GB)

INFINIX (6 Models)
Hot 60 (6+128GB)
Hot 60i 5G (4+128GB)
GT 30 5G (8+128GB)
GT 30 Pro (8+256GB)
Smart 8 series
Hot 40
Note 40
Note 50

IQOO (3 Models)
Z10 5G (8+256GB)
Z10 Lite (6+128GB)
Z10X 5G (8+128GB)
Z10R (8+128GB)

ITEL (14 Models)
Ace 2L Heera
Ace 3 Shine
IT 2165C
IT 2181A
IT 5032 (IT5027Slim)
IT 5262
IT 9020 SuperGuru 4G
A100 (3+64GB, 4+64GB)
Vista Tab 30 (4+128GB)
ITEL A50C

LAVA (7 Models)
A1 Tejas
A1 Music Dual SIM
Hero Shakti 2025
H10 Hero Shakti 2025
LAVA Hero Shakti

MOTOROLA (5 Models)
Moto A200
Moto A300 2G FP
Edge 70 Fusion 5G (12+256GB)
G67 Power (8+128GB)
G57 Power
G04 (4+64GB)
G31 (4GB)
G32 (4GB)
G35 5G
G96 5G
Edge 70 Fusion
Various 2024-2025 XT models

NOKIA (11 Models)
101 4G Dual SIM
105 Dual SIM / 4G
106 4G
HMD 100 Single SIM
HMD 101 Dual SIM / 4G
HMD 102 Dual SIM / 4G
105 4G TA-1657 DS
110 4G TA-1664

PHILIPS (3 Models)
E2102
E2103
E2221

POCO (1 Model)
M7 Pro 5G (6+128GB)
C71 4G
C75 5G
C85X 5G
M7 5G
M7 Plus

XIAOMI (1 Model)
Redmi Note 13 5G (8+256GB)
Redmi Note 15 5G
Redmi 12 4G
Redmi 13 5G
Redmi 14C 5G
Redmi 15 5G (4GB, 8GB)
Redmi 15C (4G, 5G)
Redmi A3X
Redmi A4 (4G, 5G)
Redmi A5 4G
Redmi Note (Crimson)

NOTHING (6 Models)
Phone (3A) Light 5G
Phone (3A)
Phone (4A)
Phone (3)

ONEPLUS (8 Models)
Nord 4 5G (8+128GB)
Nord CE 4 5G (8+256GB)
Nord CE 5 Lite
OnePlus 13 (12+256GB)
OnePlus 13R

OTHERS
JioPhone JBV191M2
`;

const lines = rawText.split('\n').map(l => l.trim()).filter(l => l);

const products = [];
let currentBrand = 'Unknown';

const brandImages = {
  'OPPO': 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?q=80&w=600',
  'REALME': 'https://images.unsplash.com/photo-1593922687593-9c8da13eacb1?q=80&w=600',
  'SAMSUNG': 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=600',
  'VIVO': 'https://images.unsplash.com/photo-1589492477829-5e65395b66ea?q=80&w=600',
  'TECNO': 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?q=80&w=600',
  'INFINIX': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600',
  'IQOO': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600',
  'ONEPLUS': 'https://images.unsplash.com/photo-1616012437893-6bbf243b74db?q=80&w=600',
  'NOTHING': 'https://images.unsplash.com/photo-1683050479155-23c21a4fdbce?q=80&w=600',
  'XIAOMI': 'https://images.unsplash.com/photo-1598327105854-c9c4cfbe3271?q=80&w=600',
  'POCO': 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?q=80&w=600',
};

const getBasePrice = (name, ram, storage) => {
  let base = 15000;
  
  if (name.toLowerCase().includes('pro') || name.toLowerCase().includes('ultra') || name.toLowerCase().includes('plus') || name.toLowerCase().includes('fold')) {
    base += 30000;
    if (name.toLowerCase().includes('ultra')) base += 50000;
    if (name.toLowerCase().includes('fold')) base += 80000;
  }
  
  const ramNum = parseInt(ram) || 4;
  const storeNum = parseInt(storage) || 64;
  
  base += (ramNum - 4) * 1500;
  base += (storeNum - 64) * 50;
  
  if (['SAMSUNG', 'ONEPLUS', 'NOTHING', 'APPLE'].includes(currentBrand)) {
    base = Math.floor(base * 1.3);
  } else if (['ITEL', 'LAVA', 'NOKIA', 'PHILIPS'].includes(currentBrand)) {
    base = Math.floor(Math.random() * 4000) + 1500;
  }
  
  // Make it pretty (e.g. 14999)
  return Math.floor(base / 1000) * 1000 - 1;
};

lines.forEach(line => {
  // If line has ' (XX Models)' it's a brand header
  if (line.match(/^[A-Z\s\/]+(\s\(\d+\sModels?\))?$/) && !line.includes('+')) {
    currentBrand = line.split('(')[0].trim().replace(' / ', '/');
    console.log('Set brand to', currentBrand);
    return;
  }
  if (line === 'OTHERS') {
    currentBrand = 'Other';
    return;
  }

  // Parse variations inside (...)
  const match = line.match(/(.*?)(?:\((.+?)\))?$/);
  if (!match) {
    console.log('Skipping line, no match:', line);
    return;
  }

  let baseName = match[1].trim();
  const variantsRaw = match[2] || '';
  
  // Some lines have brand in name already, clean it up
  if (baseName.toLowerCase().startsWith(currentBrand.toLowerCase())) {
     baseName = baseName.substring(currentBrand.length).trim();
  }
  const cleanName = `${currentBrand === 'XIAOMI' || currentBrand === 'XIAOMI/REDMI' ? '' : currentBrand} ${baseName}`.trim();

  let variants = [];
  
  // Try to parse "8+128GB, 12+256GB" format
  if (variantsRaw) {
    const parts = variantsRaw.split(',').map(p => p.trim());
    
    parts.forEach(p => {
      // Look for X+YGB
      const varMatch = p.match(/(\d+)\+(\d+)GB/i);
      if (varMatch) {
         variants.push({ ram: `${varMatch[1]}GB`, storage: `${varMatch[2]}GB` });
      } else if (p.match(/(\d+)GB/i)) {
         variants.push({ ram: p, storage: '128GB' }); // Default 128 if only RAM/Storage is stated
      } else {
         // It's some text like "Black" or "4G"
         if (p.toLowerCase().includes('black') || p.toLowerCase().includes('gold') || p.toLowerCase().includes('crimson')) {
            // Ignored as variation for now
         }
      }
    });
  }

  if (variants.length === 0) {
    // Default fallback variant
    let defRam = '4GB';
    let defStore = '64GB';
    if (baseName.toLowerCase().includes('pro') || baseName.toLowerCase().includes('ultra')) {
       defRam = '8GB'; defStore = '256GB';
    } else if (['ITEL', 'LAVA', 'NOKIA', 'PHILIPS'].includes(currentBrand)) {
       defRam = 'N/A'; defStore = 'N/A';
    }
    variants.push({ ram: defRam, storage: defStore });
  }

  variants.forEach((v, index) => {
    let price = getBasePrice(cleanName, v.ram, v.storage);
    const brandKey = Object.keys(brandImages).find(k => currentBrand.includes(k)) || 'OPPO';
    
    const isFeaturePhone = ['ITEL', 'LAVA', 'NOKIA', 'PHILIPS'].includes(currentBrand);

    products.push({
      id: `${cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${v.ram}-${v.storage}`.replace(/-(na|-g|gb)/g, ''),
      name: `${cleanName} ${v.ram !== 'N/A' ? `(${v.ram} RAM, ${v.storage})` : ''}`.trim(),
      brand: currentBrand,
      price: price,
      originalPrice: Math.floor(price * 1.15),
      image: brandImages[brandKey] || brandImages['OPPO'],
      colors: ['Midnight Black', 'Ocean Blue'],
      ram: v.ram,
      storage: v.storage,
      battery: isFeaturePhone ? '1000mAh' : '5000mAh',
      camera: isFeaturePhone ? 'VGA' : '50MP + 2MP',
      display: isFeaturePhone ? '1.8" TFT' : '6.5" FHD+ AMOLED',
      processor: isFeaturePhone ? 'Basic' : 'Octa-core 5G Processor',
      description: `Experience the ${cleanName} with ${v.ram} RAM and ${v.storage} storage. The perfect blend of performance and style.`,
      featured: index === 0 && !isFeaturePhone && (cleanName.includes('Pro') || cleanName.includes('Ultra'))
    });
  });
});

const output = `// Auto-generated Massive Catalog based on user request
export const expandedProducts = ${JSON.stringify(products, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, '../lib/expanded-catalog.ts'), output);
console.log(`Successfully generated ${products.length} products!`);
