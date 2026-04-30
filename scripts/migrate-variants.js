const https = require('https');

const PROJECT_ID = 'mobile-171f0';
const API_KEY = 'AIzaSyDcDWq9HncVfpy1yJyV3lNHZWxWWdlCJDI';

function httpRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, {
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

function extractSpecs(name) {
  const ramMatch = name.match(/(\d+)\s*GB\s*RAM/i) || name.match(/\b(\d+)\s*GB(?:\s*\+\s*\d+)?\b/i);
  const storageMatch = name.match(/\+\s*(\d+)\s*(GB|TB)/i) || name.match(/\b(\d+)\s*(GB|TB)\b/i);
  
  return {
    ram: ramMatch ? ramMatch[1] + 'GB' : '',
    storage: storageMatch ? storageMatch[1] + (storageMatch[2] || 'GB') : ''
  };
}

function cleanPhoneName(brand, rawName) {
  let name = rawName;
  // Strip common patterns
  name = name.replace(/\b[A-Z]{2,4}-[A-Z0-9]{3,}[A-Z]?\/?(DS)?\b/gi, '');
  name = name.replace(/\b(RMX|CPH|LJ|RMP|MZB|SKU|LS|DEMO)\d{3,}[A-Z]?\b/gi, '');
  // Strip RAM/Storage patterns
  name = name.replace(/\d+\s*GB\s*\+\s*\d+\s*(GB|TB)?/gi, '');
  name = name.replace(/\d+\s*GB\s*RAM/gi, '');
  name = name.replace(/\b\d+(GB|TB)\b/gi, '');
  // Strip colors in parentheses or after a dash
  name = name.replace(/\((?:BLACK|GOLD|BLUE|SILVER|WHITE|RED|GREEN|ORANGE|PURPLE|YELLOW|PINK|GREY|GRAY|CYAN|MAGENTA|BROWN|ROSE|MIDNIGHT|STARLIGHT|PEARL|DEEP|LIGHT|DARK|SHINY|MATTE|SPACE|OCEAN|SKY|LAKE|FOREST|DESERT|TITANIUM|BRONZE|COPPER|IRON|STEEL|METAL|WAVE|GLOW|PRISM|AURA|COSMIC|NEBULA|SUN|MOON|NIGHT|DAY|MINT|LAVENDER|CREAM|VANILLA|GRAPHITE|SLATE|PHANTOM|FROST|ICE|SNOW|CLOUD|MIST|RAIN|THUNDER|LIGHTNING|BOLT|FLASH|STORM|WIND|FIRE|EARTH|WATER|LAVA|MAGMA|STONE|ROCK|MARBLE|SAND|CLAY|OAK|PINE|CEDAR|WALNUT|MAPLE|CHERRY|BIRCH|BAMBOO|WOOD|CARBON|KEVLAR|LEATHER|VEGAN|SILK|VELVET|SATIN|CHROME|MIRROR|GLASS|CRYSTAL|DIAMOND|SAPPHIRE|EMERALD|RUBY|OPAL|QUARTZ|AMBER|JADE|TOPAZ|GARNET|CITRINE|AMETHYST|OBSIDIAN|ONYX|JET|EBONY|IVORY|MARBLE|ALABASTER|SNOW|ICE|FROST|WINTER|SPRING|SUMMER|AUTUMN|FALL)\)/gi, '');
  name = name.replace(/\([^)]*\)/g, '');
  name = name.replace(/\b(DEMO|DUAL SIM|DUAL-SIM|DS|IN)\b/gi, '');
  name = name.replace(/[+,/]/g, ' ');
  name = name.replace(/\s+/g, ' ').trim();

  const bUp = (brand || '').toUpperCase();
  const parts = name.split(/\s+/).filter(Boolean);
  const cleanParts = [];
  for (const p of parts) {
    if (p.toUpperCase() !== bUp) cleanParts.push(p);
  }
  
  const titleBrand = brand ? brand.charAt(0).toUpperCase() + brand.slice(1).toLowerCase() : '';
  let finalName = titleBrand + ' ' + cleanParts.join(' ');
  
  if (bUp === 'SAMSUNG' && !finalName.toUpperCase().includes('GALAXY')) {
    finalName = finalName.replace(/Samsung /i, 'Samsung Galaxy ');
  }
  return finalName.trim();
}

async function main() {
  console.log('Fetching products...');
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

  const products = allDocs.map(doc => {
    const f = doc.fields || {};
    const getS = key => (f[key] && f[key].stringValue) || '';
    const getN = key => (f[key] && (f[key].integerValue || f[key].doubleValue)) ? Number(f[key].integerValue || f[key].doubleValue) : 0;
    
    return { 
      id: doc.name.split('/').pop(), 
      name: getS('name'), 
      brand: getS('brand'), 
      ram: getS('ram'),
      storage: getS('storage'),
      price: getN('price'),
      originalPrice: getN('originalPrice'),
      _docPath: doc.name,
      _doc: doc
    };
  });

  console.log(`Loaded ${products.length} products.`);

  const groups = {};
  for (const p of products) {
    const clean = cleanPhoneName(p.brand, p.name);
    const key = clean.toLowerCase();
    if (!groups[key]) groups[key] = { baseName: clean, items: [] };
    groups[key].items.push(p);
  }

  const groupedCount = Object.keys(groups).length;
  console.log(`Found ${groupedCount} unique base models.`);

  let migrated = 0;
  for (const [key, groupData] of Object.entries(groups)) {
    const { baseName, items } = groupData;
    if (items.length <= 1 && (!items[0].variants || items[0].variants.length <= 1)) {
      // If it's already a single product with 0 or 1 variant, and no other products match, skip
      continue;
    }

    console.log(`\nProcessing: ${baseName} (${items.length} docs found)`);
    
    // Collect ALL variants from all docs in this group
    let allVariants = [];
    for (const item of items) {
      if (item._doc.fields.variants?.arrayValue?.values) {
        // Doc already has variants
        const existing = item._doc.fields.variants.arrayValue.values.map(v => {
          const vf = v.mapValue.fields;
          return {
            ram: vf.ram?.stringValue || '',
            storage: vf.storage?.stringValue || '',
            price: Number(vf.price?.integerValue || vf.price?.doubleValue || 0),
            originalPrice: vf.originalPrice?.integerValue || vf.originalPrice?.doubleValue ? Number(vf.originalPrice.integerValue || vf.originalPrice.doubleValue) : null
          };
        });
        allVariants = allVariants.concat(existing);
      } else {
        // Doc is flat, extract specs from name if fields are empty
        let r = item.ram;
        let s = item.storage;
        if (!r || !s) {
          const extracted = extractSpecs(item.name);
          if (!r) r = extracted.ram;
          if (!s) s = extracted.storage;
        }
        allVariants.push({
          ram: r,
          storage: s,
          price: item.price,
          originalPrice: item.originalPrice
        });
      }
    }

    // Deduplicate variants (same RAM/Storage/Price)
    const uniqueVariants = [];
    const seen = new Set();
    for (const v of allVariants) {
      const vKey = `${v.ram}-${v.storage}-${v.price}`;
      if (!seen.has(vKey)) {
        seen.add(vKey);
        uniqueVariants.push(v);
      }
    }

    // Sort by price
    uniqueVariants.sort((a, b) => a.price - b.price);

    const parent = items[0];
    const firestoreVariants = uniqueVariants.map((v, index) => ({
      mapValue: {
        fields: {
          id: { stringValue: `v-${index}` },
          ram: { stringValue: v.ram || '' },
          storage: { stringValue: v.storage || '' },
          price: { integerValue: String(Math.round(v.price)) },
          originalPrice: v.originalPrice ? { integerValue: String(Math.round(v.originalPrice)) } : { nullValue: 'NULL_VALUE' }
        }
      }
    }));

    // Update parent
    const updateBody = JSON.stringify({
      fields: {
        ...parent._doc.fields,
        name: { stringValue: baseName },
        price: { integerValue: String(Math.round(uniqueVariants[0].price)) },
        ram: { stringValue: uniqueVariants[0].ram || '' },
        storage: { stringValue: uniqueVariants[0].storage || '' },
        variants: {
          arrayValue: {
            values: firestoreVariants
          }
        }
      }
    });

    const updateUrl = 'https://firestore.googleapis.com/v1/' + parent._docPath + '?updateMask.fieldPaths=name&updateMask.fieldPaths=price&updateMask.fieldPaths=ram&updateMask.fieldPaths=storage&updateMask.fieldPaths=variants&key=' + API_KEY;
    const { status, body: updateResBody } = await httpRequest(updateUrl, { method: 'PATCH', body: updateBody });
    
    if (status === 200) {
      console.log(`  ✅ Parent updated (${parent.id}) with ${uniqueVariants.length} variants`);
      migrated++;
      
      // Delete other docs in the group
      for (let i = 1; i < items.length; i++) {
        const child = items[i];
        const delUrl = 'https://firestore.googleapis.com/v1/' + child._docPath + '?key=' + API_KEY;
        const delRes = await httpRequest(delUrl, { method: 'DELETE' });
        if (delRes.status === 200) {
          console.log(`  🗑️ Deleted duplicate doc: ${child.id}`);
        }
      }
    } else {
      console.log(`  ❌ Failed to update ${parent.id}: ${status}`);
    }
  }

  console.log(`\nDone! Re-organized ${migrated} products.`);
}

main().catch(console.error);
