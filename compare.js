const fs = require('fs');

// Read website data
const tsContent = fs.readFileSync('d:/downloadss/shreeshyam mobiles/products-data.ts', 'utf8');
const regex = /name:\s*"([^"]+)",\s*brand:\s*"([^"]+)",\s*price:\s*(\d+),\s*ram:\s*"([^"]+)",\s*storage:\s*"([^"]+)"/g;
let match;
const webProducts = [];
while ((match = regex.exec(tsContent)) !== null) {
  webProducts.push({ 
    name: match[1].toLowerCase(), 
    brand: match[2].toLowerCase(), 
    price: parseInt(match[3]), 
    ram: match[4].replace(/gb/i, ''), 
    storage: match[5].replace(/gb/i, '') 
  });
}

// Read JSON data
const jsonContent = fs.readFileSync('d:/downloadss/shreeshyam mobiles/All_Brands_Price_List (1).json', 'utf8');
const jsonData = JSON.parse(jsonContent);

let matchCount = 0;
let mismatchCount = 0;
let notFoundInWeb = 0;
let notFoundInJson = 0;
let output = '';

output += '# Price Comparison Report\n\n';

// Normalize helper
const normalizeName = (name) => {
  return name.toLowerCase()
    .replace(/realme\s*/, '')
    .replace(/samsung\s*/, '')
    .replace(/oppo\s*/, '')
    .replace(/vivo\s*/, '')
    .replace(/\s+/g, ' ')
    .replace(/(\d+)\s*\+\s*(\d+)/, '') // remove ram+storage from name if any
    .replace(/\(.*?\)/g, '') // remove colors in brackets
    .trim();
};

const jsonFlat = [];
for (const brand in jsonData.brands) {
  jsonData.brands[brand].forEach(p => {
    jsonFlat.push({
      originalName: p.product_name,
      name: normalizeName(p.product_name),
      brand: brand.toLowerCase(),
      ram: String(p.ram_gb).toLowerCase(),
      storage: String(p.storage_gb).toLowerCase(),
      price: p.selling_price
    });
  });
}

const webFlat = webProducts.map(p => ({
  originalName: p.name,
  name: normalizeName(p.name),
  brand: p.brand,
  ram: p.ram.toLowerCase(),
  storage: p.storage.toLowerCase(),
  price: p.price
}));

// Compare JSON -> Web
output += '## Mismatches (JSON -> Website)\n\n';
output += '| JSON Product | RAM/Storage | JSON Price | Web Price | Status |\n';
output += '|---|---|---|---|---|\n';

jsonFlat.forEach(jp => {
  // Try to find matching product in web
  // We'll use a fuzzy match on name and exact match on RAM/Storage
  
  // Clean names for matching
  const jNameParts = jp.name.split(' ');
  
  const possibleMatches = webFlat.filter(wp => {
    // Check if RAM and Storage match
    if (wp.ram !== jp.ram && wp.ram !== 'null' && jp.ram !== 'null') return false;
    
    // Some products have storage like "1TB" which is 1024GB, let's keep it simple for now
    let wStorage = wp.storage;
    if (wStorage === '1tb') wStorage = '1024';
    
    if (wStorage !== jp.storage && wStorage !== 'null' && jp.storage !== 'null') return false;
    
    // Check brand
    if (wp.brand !== jp.brand) return false;
    
    // Check name inclusion
    let matches = true;
    for (let part of jNameParts) {
      if (part.length > 2 && !wp.name.includes(part)) {
        matches = false;
        break;
      }
    }
    return matches;
  });
  
  if (possibleMatches.length > 0) {
    // Check price of the first match
    const match = possibleMatches[0];
    if (match.price === jp.price) {
      matchCount++;
    } else {
      mismatchCount++;
      output += `| ${jp.originalName} | ${jp.ram}/${jp.storage} | ₹${jp.price} | ₹${match.price} | ❌ MISMATCH |\n`;
    }
  } else {
    notFoundInWeb++;
    // Too many "Not Found" to list them all, we'll just log mismatches
  }
});

output = `## Summary
- **Total in JSON:** ${jsonFlat.length}
- **Total in Website:** ${webFlat.length}
- **Perfect Matches:** ${matchCount}
- **Price Mismatches:** ${mismatchCount}
- **Could not match (JSON to Web):** ${notFoundInWeb}

*Note: "Could not match" means the script couldn't reliably link the JSON product to a Website product based on name, RAM, and storage.*

` + output;

fs.writeFileSync('d:/downloadss/shreeshyam mobiles/price-comparison.md', output, 'utf8');
console.log('Comparison complete. Summary:');
console.log(`Matches: ${matchCount}, Mismatches: ${mismatchCount}, Not Found: ${notFoundInWeb}`);
