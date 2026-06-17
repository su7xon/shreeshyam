/**
 * FIX ALL PLACEHOLDER IMAGES IN products-data.ts
 * Replaces any remaining `getProductImage(...)` calls with actual image URLs using Bing Image Search.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const PRODUCTS_FILE = path.resolve(__dirname, '../products-data.ts');
const DELAY_MS = 1500;

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

function cleanPhoneName(brand, rawName) {
  let name = rawName;
  name = name.replace(/\b[A-Z]{2,4}-[A-Z0-9]{3,}[A-Z]?\/?(DS)?\b/gi, '');
  name = name.replace(/\b(RMX|CPH|LJ|RMP|MZB|SKU|LS|DEMO)\d{3,}[A-Z]?\b/gi, '');
  name = name.replace(/\d+\s*GB\s*\+\s*\d+\s*(GB|TB)?/gi, '');
  name = name.replace(/\d+\s*GB\s*RAM/gi, '');
  name = name.replace(/\b\d+(GB|TB)\b/gi, '');
  name = name.replace(/\([^)]*\)/g, '');
  name = name.replace(/\b(DEMO|DUAL SIM|DUAL-SIM|DS|IN)\b/gi, '');
  name = name.replace(/[+,/]/g, ' ');
  name = name.replace(/\s+/g, ' ').trim();
  const bUp = brand.toUpperCase();
  const parts = name.split(/\s+/).filter(Boolean);
  const cleanParts = [];
  for (const p of parts) {
    if (p.toUpperCase() !== bUp) cleanParts.push(p);
  }
  const titleBrand = brand.charAt(0).toUpperCase() + brand.slice(1).toLowerCase();
  let finalName = titleBrand + ' ' + cleanParts.join(' ');
  if (bUp === 'SAMSUNG' && !finalName.toUpperCase().includes('GALAXY')) {
    finalName = finalName.replace(/Samsung /i, 'Samsung Galaxy ');
  }
  return finalName.trim();
}

async function searchBingImages(query) {
  try {
    const url = 'https://www.bing.com/images/search?q=' + encodeURIComponent(query) + '&qft=+filterui:imagesize-large&form=IRFLTR&first=1';
    const { status, body } = await httpRequest(url);
    if (status !== 200) return null;
    const matches = [];
    const regex = /&quot;murl&quot;:&quot;([^&]+)&quot;/g;
    let match;
    while ((match = regex.exec(body)) !== null) {
      const imgUrl = decodeURIComponent(match[1]);
      if (imgUrl.includes('amazon.') || imgUrl.includes('flipkart.') || imgUrl.includes('aliexpress.')) continue;
      matches.push(imgUrl);
    }
    return matches.length > 0 ? matches[0] : null;
  } catch (e) {
    return null;
  }
}

async function main() {
  console.log('🔄 Loading products-data.ts...');
  let content = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
  
  // Find all remaining getProductImage(...) calls
  const matches = [...content.matchAll(/getProductImage\("([^"]+)"\)/g)];
  const toFix = [];

  for (const match of matches) {
    const productName = match[1];
    const fullMatch = match[0];
    const matchIndex = content.indexOf(fullMatch);
    const surrounding = content.substring(Math.max(0, matchIndex - 200), matchIndex + 200);
    
    let brand = 'Unknown';
    const productObjectMatch = surrounding.match(/brand:\s*['"]([^'"]+)['"]/i);
    if (productObjectMatch) brand = productObjectMatch[1];

    toFix.push({ name: productName, brand, fullMatch });
  }

  console.log(`🎯 Found ${toFix.length} placeholder image calls. Starting update...`);
  
  let fixedCount = 0;

  for (let i = 0; i < toFix.length; i++) {
    const p = toFix[i];
    const clean = cleanPhoneName(p.brand, p.name);
    console.log(`\n[${i + 1}/${toFix.length}] Fixing: ${p.name}`);
    console.log(`   Cleaned search query: ${clean}`);

    const queries = [
      clean + ' official smartphone image transparent background',
      clean + ' mobile phone high res',
      clean + ' official phone image png'
    ];

    let finalUrl = null;
    for (const q of queries) {
      process.stdout.write(`   🔍 Searching Bing for "${q}" ...`);
      finalUrl = await searchBingImages(q);
      if (finalUrl) {
        console.log(' ✅ Found!');
        break;
      }
      console.log(' ⚠️ Not found');
      await sleep(1000);
    }

    if (finalUrl) {
      console.log(`   🔗 URL: ${finalUrl}`);
      const replacementStr = `"${finalUrl}"`;
      // Replace the exact match
      content = content.replace(p.fullMatch, replacementStr);
      console.log(`   💾 Replaced in content!`);
      fixedCount++;
    }

    await sleep(DELAY_MS);
  }

  // Save the file
  fs.writeFileSync(PRODUCTS_FILE, content, 'utf-8');
  console.log(`\n✅ Saved products-data.ts! Replaced ${fixedCount}/${toFix.length} placeholders with real images!`);
}

main().catch(console.error);
