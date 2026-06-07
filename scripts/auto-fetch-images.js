/**
 * AUTO IMAGE FETCHER FOR PHONE PRODUCTS
 * =======================================
 * Yeh script automatically phone images dhundhti hai aur Firestore mein update karti hai.
 * 
 * HOW IT WORKS:
 * 1. Firestore se saare products fetch karta hai
 * 2. Jo products ki image missing/empty hai unke liye DuckDuckGo se image search karta hai
 * 3. Best image URL ko Firestore mein save karta hai
 * 
 * RUN: node scripts/auto-fetch-images.js
 * 
 * OPTIONAL FLAGS:
 *   --all          : Image wale products bhi update karo
 *   --dry-run      : Sirf dekho kya hoga, Firestore update mat karo
 *   --brand=Samsung: Sirf ek brand ke products update karo
 *   --limit=50     : Maximum 50 products process karo
 */

const https = require('https');
const http = require('http');

// ─── CONFIG ────────────────────────────────────────────────────────────────
const FIREBASE_PROJECT_ID = 'mobile-171f0';
const FIREBASE_API_KEY    = 'AIzaSyDcDWq9HncVfpy1yJyV3lNHZWxWWdlCJDI';
const CLOUDINARY_CLOUD    = 'dizfvdrzk';
const CLOUDINARY_PRESET   = 'ml_default';

// Parse CLI args
const args = process.argv.slice(2);
const DRY_RUN  = args.includes('--dry-run');
const ALL      = args.includes('--all');
const BRAND    = (args.find(a => a.startsWith('--brand=')) || '').replace('--brand=', '');
const LIMIT    = parseInt((args.find(a => a.startsWith('--limit=')) || '--limit=999').replace('--limit=', ''));
const DELAY_MS = 1500; // delay between requests to avoid rate limiting

// ─── HELPERS ───────────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function fetchJSON(url, options = {}) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    const req = lib.request(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        ...options.headers
      },
      method: options.method || 'GET',
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch(e) { resolve({ _raw: data, _status: res.statusCode }); }
      });
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

function postJSON(url, body, headers = {}) {
  const bodyStr = JSON.stringify(body);
  return new Promise((resolve, reject) => {
    const req = https.request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(bodyStr),
        ...headers
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch(e) { resolve({ _raw: data, _status: res.statusCode }); }
      });
    });
    req.on('error', reject);
    req.write(bodyStr);
    req.end();
  });
}

// ─── FIRESTORE REST API ────────────────────────────────────────────────────

const FIRESTORE_BASE = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents`;

async function getFirestoreProducts() {
  console.log('📥 Fetching products from Firestore...');
  const url = `${FIRESTORE_BASE}/products?key=${FIREBASE_API_KEY}&pageSize=500`;
  const data = await fetchJSON(url);
  
  if (!data.documents) {
    console.error('❌ No documents found. Check Firebase config.');
    console.log('Response:', JSON.stringify(data).slice(0, 300));
    return [];
  }

  return data.documents.map(doc => {
    const id = doc.name.split('/').pop();
    const fields = doc.fields || {};
    const get = (key) => {
      const f = fields[key];
      if (!f) return '';
      return f.stringValue || f.integerValue || f.doubleValue || f.booleanValue || '';
    };
    return {
      id,
      name: get('name'),
      brand: get('brand'),
      image: get('image'),
      _docPath: doc.name
    };
  });
}

async function updateFirestoreImage(docPath, imageUrl) {
  const url = `${FIRESTORE_BASE.replace('/documents', '')}/${docPath.replace(`projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/`, 'documents/')}?updateMask.fieldPaths=image&key=${FIREBASE_API_KEY}`;
  
  // Use PATCH to update only the image field
  const fullUrl = `https://firestore.googleapis.com/v1/${docPath}?updateMask.fieldPaths=image&key=${FIREBASE_API_KEY}`;
  
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      fields: {
        image: { stringValue: imageUrl }
      }
    });
    
    const req = https.request(fullUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(res.statusCode));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ─── IMAGE SEARCH ──────────────────────────────────────────────────────────

const google = require('googlethis');

/**
 * Main image finder - uses googlethis to search GSMArena
 */
async function findPhoneImage(product) {
  const { name, brand } = product;
  
  const query = `${brand} ${name} phone site:gsmarena.com`;
  console.log(`   🔍 Searching Google Images for: "${query}"`);
  
  try {
    const options = { page: 0, safe: false, additional_params: { hl: 'en' } };
    const response = await google.image(query, options);
    
    if (response && response.length > 0) {
      for (const img of response) {
        if (img.url && (img.url.includes('gsmarena.com') || img.url.includes('fdn'))) {
          console.log(`   ✅ Found: ${img.url.slice(0, 80)}...`);
          return img.url;
        }
      }
      // Fallback to first image
      console.log(`   ✅ Fallback Found: ${response[0].url.slice(0, 80)}...`);
      return response[0].url;
    }
  } catch (e) {
    console.error(`   ⚠️ Search failed: ${e.message}`);
  }
  
  return null;
}

// ─── CLOUDINARY UPLOAD ────────────────────────────────────────────────────

async function uploadToCloudinary(imageUrl) {
  const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`;
  const body = JSON.stringify({
    file: imageUrl,
    upload_preset: CLOUDINARY_PRESET,
    folder: 'products'
  });

  return new Promise((resolve, reject) => {
    const req = https.request(uploadUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.secure_url) resolve(json.secure_url);
          else reject(new Error(json.error?.message || 'Cloudinary upload failed'));
        } catch(e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ─── MAIN ─────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🚀 SHREESHYAM MOBILES - AUTO IMAGE FETCHER');
  console.log('==========================================');
  if (DRY_RUN) console.log('⚠️  DRY RUN MODE - No Firestore updates will be made\n');
  
  // Fetch all products
  const allProducts = await getFirestoreProducts();
  
  if (allProducts.length === 0) {
    console.log('\n❌ No products found in Firestore!');
    console.log('   Make sure you have deployed products to Firestore first.');
    return;
  }
  
  console.log(`\n📦 Total products in Firestore: ${allProducts.length}`);
  
  // Filter which products need images
  let toProcess = allProducts.filter(p => {
    if (ALL) return true;  // --all flag: update everything
    // Only process products with missing/empty/placeholder images
    const img = p.image || '';
    return !img || img.includes('placeholder') || img.includes('picsum') || img.includes('via.placeholder') || img.startsWith('/images/products/') || img.includes('amazon.com');
  });
  
  // Filter by brand if specified
  if (BRAND) {
    toProcess = toProcess.filter(p => p.brand.toLowerCase().includes(BRAND.toLowerCase()));
    console.log(`🏷️  Filtering by brand: ${BRAND}`);
  }
  
  // Apply limit
  toProcess = toProcess.slice(0, LIMIT);
  
  console.log(`🎯 Products to process: ${toProcess.length}`);
  console.log(`⏱️  Estimated time: ~${Math.ceil(toProcess.length * DELAY_MS / 60000)} minutes\n`);
  
  if (toProcess.length === 0) {
    console.log('✅ All products already have images! Use --all to force update.');
    return;
  }

  let success = 0, failed = 0, skipped = 0;

  for (let i = 0; i < toProcess.length; i++) {
    const product = toProcess[i];
    const progress = `[${i + 1}/${toProcess.length}]`;
    
    console.log(`\n${progress} 📱 ${product.brand} ${product.name}`);
    console.log(`   Current image: ${product.image ? product.image.slice(0, 60) + '...' : '(none)'}`);
    
    try {
      // Find image URL
      const imageUrl = await findPhoneImage(product);
      
      if (!imageUrl) {
        console.log(`   ⚠️  No image found - skipping`);
        skipped++;
        await sleep(DELAY_MS);
        continue;
      }
      
      let finalUrl = imageUrl;
      
      // Upload to Cloudinary (optional - comment out if you want to use direct URLs)
      // console.log(`   ☁️  Uploading to Cloudinary...`);
      // try {
      //   finalUrl = await uploadToCloudinary(imageUrl);
      //   console.log(`   ✅ Cloudinary URL: ${finalUrl.slice(0, 60)}...`);
      // } catch (e) {
      //   console.log(`   ⚠️  Cloudinary upload failed, using direct URL`);
      // }
      
      if (DRY_RUN) {
        console.log(`   🧪 [DRY RUN] Would update image to: ${finalUrl.slice(0, 80)}`);
        success++;
      } else {
        // Update Firestore
        const status = await updateFirestoreImage(product._docPath, finalUrl);
        if (status >= 200 && status < 300) {
          console.log(`   💾 Firestore updated! (HTTP ${status})`);
          success++;
        } else {
          console.log(`   ❌ Firestore update failed (HTTP ${status})`);
          failed++;
        }
      }
      
    } catch (err) {
      console.log(`   ❌ Error: ${err.message}`);
      failed++;
    }
    
    // Rate limit delay
    await sleep(DELAY_MS);
  }
  
  // Summary
  console.log('\n==========================================');
  console.log('📊 SUMMARY');
  console.log(`   ✅ Success:  ${success}`);
  console.log(`   ⚠️  Skipped:  ${skipped}`);
  console.log(`   ❌ Failed:   ${failed}`);
  console.log(`   Total:      ${toProcess.length}`);
  console.log('==========================================\n');
  
  if (!DRY_RUN && success > 0) {
    console.log('🎉 Done! Refresh your website to see the updated images.');
  }
}

main().catch(console.error);
