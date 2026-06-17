const fs = require('fs');
const path = require('path');

// ─── CONFIG ──────────────────────────────────────
const PRODUCTS_FILE = path.resolve(__dirname, '../products-data.ts');

// I'll write exactly what the user gave, but I noticed the user code says '../products-data.ts'.
// Wait, I should literally write what the user gave.
const PROBLEMATIC_URLS = [
  // Amazon generic brand images (these are likely wrong for specific models)
  'https://m.media-amazon.com/images/I/71RVuS3q9QL._SX679_.jpg', // Samsung generic
  'https://m.media-amazon.com/images/I/81+GIkwqLIL._SX679_.jpg', // Apple generic (iPhone!)
  'https://m.media-amazon.com/images/I/61SOnZ8FidL._SX679_.jpg', // Vivo generic
  'https://m.media-amazon.com/images/I/71R2H9+tIOL._SX679_.jpg', // Oppo generic
  'https://m.media-amazon.com/images/I/71p0WfO8X9L._SX679_.jpg', // Realme generic
  'https://m.media-amazon.com/images/I/71S6d6-Gv3L._SX679_.jpg', // OnePlus generic
  'https://m.media-amazon.com/images/I/61Gg9Y6C03L._SX679_.jpg', // Xiaomi generic
  'https://m.media-amazon.com/images/I/71z7R+Xv+PL._SX679_.jpg', // Motorola generic
  'https://m.media-amazon.com/images/I/71S-J2fB79L._SX679_.jpg', // iQOO generic
  'https://m.media-amazon.com/images/I/51r2XG5XFDL._SX679_.jpg', // Poco generic
  'https://m.media-amazon.com/images/I/71Y7y31uJdL._SX679_.jpg', // Nothing generic
  'https://m.media-amazon.com/images/I/81shKcv8FSL._SX679_.jpg', // Google generic
  'https://m.media-amazon.com/images/I/61+Rsh-XqxL._SX679_.jpg', // Infinix generic
  'https://m.media-amazon.com/images/I/61id8-fS2fL._SX679_.jpg', // Tecno generic
  'https://m.media-amazon.com/images/I/71H7-N0BfAL._SX679_.jpg', // Lava generic
  'https://m.media-amazon.com/images/I/71s8p0yH61L._SX679_.jpg', // Itel generic
  'https://m.media-amazon.com/images/I/41O2466KqKL.jpg', // Nokia/HMD/Philips generic
];

// ─── MAIN ───────────────────────────────────────
const content = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
console.log('🔍 Scanning products-data.ts for problematic images...\n');

// Find all getProductImage() calls
const matches = [...content.matchAll(/getProductImage\("([^"]+)"\)/g)];
console.log(`📦 Total products found: ${matches.length}\n`);

const problematicProducts = [];
const okProducts = [];

matches.forEach((match, index) => {
  const productName = match[1];
  const fullMatch = match[0]; // getProductImage("...")

  // Find where this call appears in the file to check surrounding context
  const matchIndex = content.indexOf(fullMatch);
  const surrounding = content.substring(Math.max(0, matchIndex - 200), matchIndex + 200);

  // Check if this product is using a problematic URL (indirectly via brand fallback)
  // We'll check the product's brand from nearby context
  let brand = 'Unknown';

  // Look for brand in the same product object
  const productObjectMatch = surrounding.match(/brand:\s*['"]([^'"]+)['"]/i);
  if (productObjectMatch) {
    brand = productObjectMatch[1];
  }

  // Heuristic: If product name contains specific models but we're using generic brand image, it's likely wrong
  const isLikelyWrong =
    // Product has specific model indicators
    (/(pro|max|plus|ultra|lite|fe|note|series|\d+gb|\d+\.\d+)/i.test(productName)) &&
    // But we're likely falling back to generic brand image
    (PROBLEMATIC_URLS.some(url =>
      // Check if brand matches known problematic patterns
      ['Apple', 'Samsung', 'Vivo', 'Oppo', 'Realme', 'iQOO', 'OnePlus'].some(b =>
        brand.toLowerCase().includes(b.toLowerCase())
      )
    ));

  if (isLikelyWrong) {
    problematicProducts.push({ name: productName, brand });
  } else {
    okProducts.push({ name: productName, brand });
  }
});

// ─── RESULTS ─────────────────────────────────────
console.log('🚨 PRODUCTS LIKELY SHOWING WRONG IMAGES (iPhone 15/generic):');
console.log('═════════════════════════════════════════════════════');
if (problematicProducts.length === 0) {
  console.log('✅ No obviously problematic products detected via heuristics');
} else {
  problematicProducts.forEach((p, index) => {
    console.log(`${index + 1}. ${p.name} (Brand: ${p.brand})`);
  });
  console.log(`\n📊 Total: ${problematicProducts.length} products likely affected`);
}

console.log('\n✅ PRODUCTS APPEARING OK (specific/model-matched):');
console.log('═════════════════════════════════════════════════════');
console.log(`📊 Total: ${okProducts.length} products appear to have specific images\n`);

console.log('📋 NEXT STEPS:');
console.log('1. Focus on fixing the 🚨 PROBLEMATIC products listed above');
console.log('2. For each, get correct image from brand website/Flickr/Amazon');
console.log('3. Upload to Cloudinary, get URL');
console.log('4. Use the fix-images.js script to update them in batches');
console.log('\n💡 TIP: Start with top 10 problematic products to test your fix!');
