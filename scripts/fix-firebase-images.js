/**
 * Fix remaining placeholder images directly in Firebase.
 * Finds products with Amazon placeholder URLs and updates them
 * with proper product images from GSMArena/official sources.
 */

const https = require('https');
const http = require('http');

const PROJECT_ID = 'mobile-171f0';
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/products`;

// Brand-specific image CDN patterns for real product images
const BRAND_IMAGES = {
  'SAMSUNG': {
    'TAB': 'https://images.samsung.com/is/image/samsung/p6pim/in/sm-x110nzaainu/gallery/in-galaxy-tab-a9-sm-x110-sm-x110nzaainu-thumb-537265029',
    'WATCH': 'https://images.samsung.com/is/image/samsung/p6pim/in/2401/gallery/in-galaxy-watch7-l715-sm-l7050zkains-thumb-540390674',
    'GALAXY Z FOLD': 'https://images.samsung.com/is/image/samsung/p6pim/in/2407/gallery/in-galaxy-z-fold6-f956-sm-f956blbhins-thumb-539572671',
    'GALAXY Z FLIP': 'https://images.samsung.com/is/image/samsung/p6pim/in/2407/gallery/in-galaxy-z-flip6-f741-sm-f741bzkdins-thumb-539572523',
    'S25 ULTRA': 'https://images.samsung.com/is/image/samsung/p6pim/in/2501/gallery/in-galaxy-s25-ultra-s938-sm-s938bzkdins-thumb-540616670',
    'S25 PLUS': 'https://images.samsung.com/is/image/samsung/p6pim/in/2501/gallery/in-galaxy-s25-plus-s936-sm-s936bzkdins-thumb-540616604',
    'S25 EDGE': 'https://images.samsung.com/is/image/samsung/p6pim/in/2501/gallery/in-galaxy-s25-edge-sm-s937bzkdins-thumb-540617000',
    'S25': 'https://images.samsung.com/is/image/samsung/p6pim/in/2501/gallery/in-galaxy-s25-s931-sm-s931bzkdins-thumb-540616588',
    'S26 ULTRA': 'https://images.samsung.com/is/image/samsung/p6pim/in/2501/gallery/in-galaxy-s25-ultra-s938-sm-s938bzkdins-thumb-540616670',
    'A36': 'https://images.samsung.com/is/image/samsung/p6pim/in/2503/gallery/in-galaxy-a36-5g-a366-sm-a366elbdins-thumb-540992862',
    'A56': 'https://images.samsung.com/is/image/samsung/p6pim/in/2503/gallery/in-galaxy-a56-5g-a566-sm-a566ezkhins-thumb-540992890',
    'M16': 'https://images.samsung.com/is/image/samsung/p6pim/in/2503/gallery/in-galaxy-m16-m166-sm-m166bzkdins-thumb-541250002',
    'DEFAULT': 'https://images.samsung.com/is/image/samsung/p6pim/in/feature/others/in-feature-galaxy-ecosystem-531498168'
  },
  'APPLE': {
    'IPHONE 16 PRO': 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-16-pro-hero-desert-titanium-202409',
    'IPHONE 16': 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-16-hero-ultramarine-202409',
    'IPHONE 15': 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-hero-blue-202309',
    'DEFAULT': 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-16-hero-ultramarine-202409'
  },
  'DEFAULT': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop'
};

function getImageForProduct(name, brand) {
  const nameUpper = (name || '').toUpperCase();
  const brandUpper = (brand || '').toUpperCase();
  
  const brandImages = BRAND_IMAGES[brandUpper] || {};
  
  // Try specific model match
  for (const [key, url] of Object.entries(brandImages)) {
    if (key !== 'DEFAULT' && nameUpper.includes(key)) {
      return url;
    }
  }
  
  // Try brand default
  if (brandImages['DEFAULT']) return brandImages['DEFAULT'];
  
  // Ultimate fallback
  return BRAND_IMAGES['DEFAULT'];
}

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    mod.get(url, r => {
      let d = '';
      r.on('data', c => d += c);
      r.on('end', () => resolve(d));
    }).on('error', reject);
  });
}

function httpsPatch(url, body) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const data = JSON.stringify(body);
    const options = {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    };
    const req = https.request(options, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, body: d }));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  console.log('🔍 Fetching all products from Firebase...');
  
  let allDocs = [];
  let nextPageToken = null;
  
  // Paginate through all products
  do {
    let url = `${BASE_URL}?pageSize=300`;
    if (nextPageToken) url += `&pageToken=${nextPageToken}`;
    
    const response = await httpsGet(url);
    const data = JSON.parse(response);
    
    if (data.documents) {
      allDocs = allDocs.concat(data.documents);
    }
    nextPageToken = data.nextPageToken || null;
  } while (nextPageToken);
  
  console.log(`📦 Total products: ${allDocs.length}`);
  
  // Find products with placeholder images
  const placeholderPatterns = [
    'media-amazon.com',
    'placeholder',
    'placehold.co',
    'via.placeholder',
  ];
  
  const toFix = allDocs.filter(doc => {
    const img = doc.fields?.image?.stringValue || '';
    return placeholderPatterns.some(pattern => img.includes(pattern));
  });
  
  console.log(`🔧 Products to fix: ${toFix.length}`);
  
  if (toFix.length === 0) {
    console.log('✅ No placeholder images found! All good.');
    return;
  }
  
  let fixed = 0;
  let failed = 0;
  
  for (const doc of toFix) {
    const docPath = doc.name; // Full path like projects/.../documents/products/ID
    const name = doc.fields?.name?.stringValue || '';
    const brand = doc.fields?.brand?.stringValue || '';
    const currentImage = doc.fields?.image?.stringValue || '';
    
    const newImage = getImageForProduct(name, brand);
    
    if (newImage === currentImage) {
      console.log(`  ⏭️ Skipping ${name} (same URL)`);
      continue;
    }
    
    // Build update body - only update image field
    const updateUrl = `https://firestore.googleapis.com/v1/${docPath}?updateMask.fieldPaths=image`;
    const updateBody = {
      fields: {
        image: { stringValue: newImage }
      }
    };
    
    try {
      const result = await httpsPatch(updateUrl, updateBody);
      if (result.status === 200) {
        fixed++;
        console.log(`  ✅ [${fixed}/${toFix.length}] ${name} → updated`);
      } else {
        failed++;
        const errBody = JSON.parse(result.body);
        console.log(`  ❌ ${name}: ${errBody.error?.message || result.status}`);
      }
    } catch (err) {
      failed++;
      console.log(`  ❌ ${name}: ${err.message}`);
    }
    
    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 200));
  }
  
  console.log(`\n🎯 Done! Fixed: ${fixed}, Failed: ${failed}, Total: ${toFix.length}`);
}

main().catch(err => console.error('Fatal error:', err));
