const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Firebase Config
const PROJECT_ID = 'mobile-171f0';
const API_KEY    = 'AIzaSyDcDWq9HncVfpy1yJyV3lNHZWxWWdlCJDI';
const DELAY_MS   = 200;

function httpRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    const req = lib.request(url, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, body: d }));
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

async function getAllProducts() {
  let allDocs = [];
  let pageToken = '';

  do {
    let url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/products?key=${API_KEY}&pageSize=300`;
    if (pageToken) url += '&pageToken=' + encodeURIComponent(pageToken);

    const { body } = await httpRequest(url);
    const data = JSON.parse(body);

    if (!data.documents) break;
    allDocs = allDocs.concat(data.documents);
    pageToken = data.nextPageToken || '';
  } while (pageToken);

  return allDocs.map(doc => {
    const f = doc.fields || {};
    const get = key => (f[key] && (f[key].stringValue || '')) || '';
    return { 
      id: doc.name.split('/').pop(), 
      name: get('name'), 
      brand: get('brand'), 
      image: get('image'), 
      _docPath: doc.name 
    };
  });
}

async function updateProductImage(docPath, imageUrl) {
  const body = JSON.stringify({ fields: { image: { stringValue: imageUrl } } });
  const fullUrl = `https://firestore.googleapis.com/v1/${docPath}?updateMask.fieldPaths=image&key=${API_KEY}`;
  
  const { status } = await httpRequest(fullUrl, {
    method: 'PATCH',
    body
  });
  return status;
}

async function main() {
  console.log('🔄 Loading local products-data.ts...');
  const content = fs.readFileSync(path.resolve(__dirname, '../products-data.ts'), 'utf-8');
  
  // Extract all { name, brand, image } from products-data.ts
  const localProducts = new Map();
  const regex = /\{\s*name:\s*"([^"]+)",\s*brand:\s*"([^"]+)",[^}]+image:\s*"([^"]+)"\s*\}/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const name = match[1];
    const image = match[3];
    localProducts.set(name.toLowerCase().trim(), image);
  }
  
  console.log(`✅ Loaded ${localProducts.size} local products with images.`);

  console.log('🔄 Fetching products from Firestore...');
  const firestoreProducts = await getAllProducts();
  console.log(`✅ Fetched ${firestoreProducts.length} products from Firestore.`);

  let updatedCount = 0;
  for (const fp of firestoreProducts) {
    const localImage = localProducts.get(fp.name.toLowerCase().trim());
    
    // Check if the firestore image is a placeholder AND we have a better local image
    const isPlaceholder = fp.image.includes('media-amazon.com') || 
                          fp.image.includes('placeholder') || 
                          fp.image.includes('placehold.co') ||
                          fp.image === '';

    const isLocalRealImage = localImage && !localImage.includes('media-amazon.com');

    if (isPlaceholder && isLocalRealImage && fp.image !== localImage) {
      console.log(`🔄 Updating: ${fp.name}`);
      console.log(`   Old: ${fp.image}`);
      console.log(`   New: ${localImage}`);
      
      const status = await updateProductImage(fp._docPath, localImage);
      if (status === 200) {
        console.log(`   ✅ Success`);
        updatedCount++;
      } else {
        console.log(`   ❌ Failed with status ${status}`);
      }
      await new Promise(r => setTimeout(r, DELAY_MS));
    }
  }

  console.log(`\n🎉 Finished! Updated ${updatedCount} products in Firestore.`);
}

main().catch(console.error);
