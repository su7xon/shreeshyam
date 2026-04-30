/**
 * PHONE IMAGE FIXER v4 — THE FINAL WORKING VERSION
 * ================================================
 * Uses Bing Image Search properly by parsing HTML entities.
 *
 *   node scripts/fix-product-images.js --dry-run --limit=5
 *   node scripts/fix-product-images.js --limit=50
 *   node scripts/fix-product-images.js
 *   node scripts/fix-product-images.js --brand=SAMSUNG
 */

const https = require('https');
const http  = require('http');

// ── CONFIG ──────────────────────────────────────────────────────────────────
const PROJECT_ID = 'mobile-171f0';
const API_KEY    = 'AIzaSyDcDWq9HncVfpy1yJyV3lNHZWxWWdlCJDI';
const DELAY_MS   = 1500;

const PLACEHOLDER_PATTERNS = [
  'unsplash.com',
  'picsum.photos',
  'via.placeholder',
  'placehold.co',
  'dummyimage',
];

// ── CLI ─────────────────────────────────────────────────────────────────────
const args    = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const ALL     = args.includes('--all');
const BRAND   = (args.find(a => a.startsWith('--brand=')) || '').replace('--brand=', '').toUpperCase();
const LIMIT   = parseInt((args.find(a => a.startsWith('--limit=')) || '--limit=600').replace('--limit=', ''));

// ── HELPERS ─────────────────────────────────────────────────────────────────
const sleep = ms => new Promise(r => setTimeout(r, ms));

function httpRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    const req = lib.request(url, {
      method: options.method || 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        ...options.headers,
      },
      timeout: 12000,
    }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return httpRequest(res.headers.location.startsWith('http') ? res.headers.location : 'https://www.bing.com' + res.headers.location, options).then(resolve).catch(reject);
      }
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, body: d }));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
    if (options.body) req.write(options.body);
    req.end();
  });
}

// ── NAME CLEANER ────────────────────────────────────────────────────────────
function cleanPhoneName(brand, rawName) {
  let name = rawName;

  // Remove model codes
  name = name.replace(/\b[A-Z]{2,4}-[A-Z0-9]{3,}[A-Z]?\/?(DS)?\b/gi, '');
  name = name.replace(/\b(RMX|CPH|LJ|RMP|MZB|SKU|LS|DEMO)\d{3,}[A-Z]?\b/gi, '');

  // Remove storage/RAM combos
  name = name.replace(/\d+\s*GB\s*\+\s*\d+\s*(GB|TB)?/gi, '');
  name = name.replace(/\d+\s*GB\s*RAM/gi, '');
  name = name.replace(/\b\d+(GB|TB)\b/gi, '');

  // Remove color in parens
  name = name.replace(/\([^)]*\)/g, '');

  // Remove known noise words
  name = name.replace(/\b(DEMO|DUAL SIM|DUAL-SIM|DS|IN)\b/gi, '');

  // Remove stray plus/commas/slashes
  name = name.replace(/[+,/]/g, ' ');

  // Collapse whitespace
  name = name.replace(/\s+/g, ' ').trim();

  // Deduplicate and ensure brand is at the start
  const bUp = brand.toUpperCase();
  const parts = name.split(/\s+/).filter(Boolean);
  const cleanParts = [];
  for (const p of parts) {
    if (p.toUpperCase() !== bUp) cleanParts.push(p);
  }
  
  const titleBrand = brand.charAt(0).toUpperCase() + brand.slice(1).toLowerCase();
  
  let finalName = titleBrand + ' ' + cleanParts.join(' ');
  
  // Add Galaxy prefix for Samsung if missing
  if (bUp === 'SAMSUNG' && !finalName.toUpperCase().includes('GALAXY')) {
    finalName = finalName.replace(/Samsung /i, 'Samsung Galaxy ');
  }
  
  return finalName.trim();
}

// ── FIRESTORE ────────────────────────────────────────────────────────────────
async function getAllProducts() {
  let allDocs = [];
  let pageToken = '';

  do {
    let url = 'https://firestore.googleapis.com/v1/projects/' + PROJECT_ID +
      '/databases/(default)/documents/products?key=' + API_KEY + '&pageSize=300';
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
    return { id: doc.name.split('/').pop(), name: get('name'), brand: get('brand'), image: get('image'), _docPath: doc.name };
  });
}

async function updateProductImage(docPath, imageUrl) {
  const body = JSON.stringify({ fields: { image: { stringValue: imageUrl } } });
  const fullUrl = 'https://firestore.googleapis.com/v1/' + docPath + '?updateMask.fieldPaths=image&key=' + API_KEY;
  const urlObj = new URL(fullUrl);
  
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(res.statusCode));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ── BING IMAGE SEARCH ───────────────────────────────────────────────────────
async function searchBingImages(query) {
  try {
    const url = 'https://www.bing.com/images/search?q=' + encodeURIComponent(query) + '&qft=+filterui:imagesize-large&form=IRFLTR&first=1';
    const { status, body } = await httpRequest(url);
    if (status !== 200) return null;

    // Pattern: &quot;murl&quot;:&quot;https://...&quot;
    const matches = [];
    const regex = /&quot;murl&quot;:&quot;([^&]+)&quot;/g;
    let match;
    while ((match = regex.exec(body)) !== null) {
      const imgUrl = decodeURIComponent(match[1]);
      // Skip shopping sites and tiny icons
      if (imgUrl.includes('amazon.') || imgUrl.includes('flipkart.') || imgUrl.includes('aliexpress.')) continue;
      matches.push(imgUrl);
    }

    return matches.length > 0 ? matches[0] : null;
  } catch (e) {
    return null;
  }
}

// ── MAIN ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n🖼️  SHREESHYAM MOBILES — PHONE IMAGE FIXER v4');
  console.log('===============================================');
  if (DRY_RUN) console.log('⚠️  DRY RUN MODE\n');

  console.log('📥 Loading products...');
  const products = await getAllProducts();
  console.log('   Total: ' + products.length + '\n');

  let toFix = products.filter(p => {
    if (ALL) return true;
    const img = p.image || '';
    return !img || PLACEHOLDER_PATTERNS.some(pat => img.includes(pat));
  });
  if (BRAND) toFix = toFix.filter(p => p.brand.toUpperCase().includes(BRAND));
  toFix = toFix.slice(0, LIMIT);

  console.log('🎯 To fix: ' + toFix.length + ' products');
  console.log('⏱️  ~' + Math.ceil(toFix.length * DELAY_MS / 60000) + ' minutes\n');

  if (toFix.length === 0) return console.log('✅ Nothing to fix!');

  let fixed = 0, notFound = 0, failed = 0;

  for (let i = 0; i < toFix.length; i++) {
    const p = toFix[i];
    const clean = cleanPhoneName(p.brand, p.name);
    console.log(`[${i + 1}/${toFix.length}] ${clean}`);

    const queries = [
      clean + ' official phone image',
      clean + ' smartphone png',
    ];

    let finalUrl = null;
    for (const q of queries) {
      process.stdout.write('   🔍 "' + q + '" ...');
      finalUrl = await searchBingImages(q);
      if (finalUrl) {
        console.log(' ✅');
        break;
      }
      console.log(' ⚠️');
      await sleep(1000);
    }

    if (!finalUrl) {
      notFound++;
      await sleep(DELAY_MS);
      continue;
    }

    console.log('   🔗 ' + finalUrl.slice(0, 85) + (finalUrl.length > 85 ? '...' : ''));

    if (DRY_RUN) {
      console.log('   🧪 [DRY RUN]\n');
      fixed++;
    } else {
      try {
        const status = await updateProductImage(p._docPath, finalUrl);
        if (status >= 200 && status < 300) {
          console.log('   💾 Saved!\n');
          fixed++;
        } else {
          console.log('   ❌ HTTP ' + status + '\n');
          failed++;
        }
      } catch (e) {
        console.log('   ❌ ' + e.message + '\n');
        failed++;
      }
    }

    await sleep(DELAY_MS);
  }

  console.log('===============================================');
  console.log('📊 RESULTS');
  console.log('   ✅ Fixed     : ' + fixed + '/' + toFix.length);
  console.log('   ⚠️  Not found : ' + notFound);
  console.log('   ❌ Failed    : ' + failed);
  console.log('===============================================\n');
}

main().catch(console.error);
