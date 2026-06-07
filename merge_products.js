const fs = require('fs');

function run() {
  const tsContent = fs.readFileSync('products-data.ts', 'utf-8');
  const priceList = JSON.parse(fs.readFileSync('All_Brands_Price_List.json', 'utf-8'));

  // parse existing products roughly using regex
  const existingMatches = [...tsContent.matchAll(/\{ name: "([^"]+)", brand: "([^"]+)", price: ([0-9]+), ram: "([^"]+)", storage: "([^"]+)", image: getProductImage\("([^"]+)"\) \}/g)];
  
  const existingProducts = existingMatches.map(m => ({
    name: m[1],
    brand: m[2],
    price: parseInt(m[3]),
    ram: m[4],
    storage: m[5],
    image: m[6]
  }));

  const existingKeys = new Set(existingProducts.map(p => `${p.brand}|${p.name}|${p.ram}|${p.storage}`.toLowerCase()));

  // also let's define a looser key just in case name formatting is slightly different
  // if an existing product contains the new product's name, ram and storage, it might be redundant
  const existingLooseKeys = existingProducts.map(p => ({
    searchStr: `${p.brand} ${p.name} ${p.ram} ${p.storage}`.toLowerCase(),
    brand: p.brand.toLowerCase(),
    ram: p.ram.toLowerCase(),
    storage: p.storage.toLowerCase(),
    price: p.price
  }));

  const brandsMap = {
    'realme': 'REALME',
    'samsung_mobile': 'SAMSUNG',
    'samsung_tab_wearables': 'SAMSUNG',
    'oppo': 'OPPO',
    'tecno': 'TECNO',
    'vivo': 'VIVO'
  };

  const newLines = [];
  let addedCount = 0;

  for (const [brandKey, items] of Object.entries(priceList.brands)) {
    const brand = brandsMap[brandKey] || brandKey.toUpperCase();

    for (const item of items) {
      const ramStr = `${item.ram_gb}GB`;
      const storageStr = `${item.storage_gb}GB`;
      
      let productNameBase = item.product_name.toUpperCase();
      // Ensure product name starts with brand if we want, or just leave it
      // actually let's just use what's in the json
      
      let colorStr = item.color ? ` (${item.color.toUpperCase()})` : '';
      let fullName = `${productNameBase} ${item.ram_gb}+${item.storage_gb}${colorStr}`;

      let isRedundant = false;
      
      // Strict check
      const strictKey = `${brand}|${fullName}|${ramStr}|${storageStr}`.toLowerCase();
      if (existingKeys.has(strictKey)) {
        isRedundant = true;
      }

      // Loose check
      if (!isRedundant) {
        for (const ep of existingLooseKeys) {
          if (ep.brand === brand.toLowerCase() && ep.ram === ramStr.toLowerCase() && ep.storage === storageStr.toLowerCase()) {
             // check if product name is inside existing name
             if (ep.searchStr.includes(item.product_name.toLowerCase())) {
                 isRedundant = true;
                 break;
             }
          }
        }
      }

      if (!isRedundant) {
        let imageArg = productNameBase;
        // sometimes existing code has brand prepended in image, we'll just use productNameBase
        const newLine = `  { name: "${fullName}", brand: "${brand}", price: ${item.selling_price}, ram: "${ramStr}", storage: "${storageStr}", image: getProductImage("${imageArg}") },`;
        newLines.push(newLine);
        addedCount++;
        
        // Add to existingKeys to prevent duplicates within the JSON itself
        existingKeys.add(strictKey);
        existingLooseKeys.push({
           searchStr: `${brand} ${fullName} ${ramStr} ${storageStr}`.toLowerCase(),
           brand: brand.toLowerCase(),
           ram: ramStr.toLowerCase(),
           storage: storageStr.toLowerCase(),
           price: item.selling_price
        });
      }
    }
  }

  if (newLines.length > 0) {
    const insertionPoint = tsContent.lastIndexOf('];');
    if (insertionPoint !== -1) {
      const updatedContent = tsContent.slice(0, insertionPoint) + newLines.join('\n') + '\n' + tsContent.slice(insertionPoint);
      fs.writeFileSync('products-data.ts', updatedContent, 'utf-8');
      console.log(`Successfully added ${addedCount} new products.`);
    } else {
      console.error('Could not find insertion point "];" in products-data.ts');
    }
  } else {
    console.log('No new products to add (all were redundant).');
  }
}

run();
