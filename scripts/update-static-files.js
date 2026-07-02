const fs = require('fs');

function updateStaticFiles() {
  const updatesFile = 'public/stock-updates-prepared.json';
  if (!fs.existsSync(updatesFile)) {
    console.log('stock-updates-prepared.json not found. Run prepare-updates.js first.');
    return;
  }
  
  const updates = JSON.parse(fs.readFileSync(updatesFile, 'utf8'));
  console.log(`Processing ${updates.priceUpdates.length} updates and ${updates.newProducts.length} new products.`);
  
  let productsTs = fs.readFileSync('products-data.ts', 'utf8');
  let accessoriesTs = fs.readFileSync('lib/accessories-data.ts', 'utf8');
  
  let updatedCount = 0;
  
  // 1. Update prices in products-data.ts
  updates.priceUpdates.forEach(update => {
    // We need to find the product with the given id and replace its price.
    // The structure is usually:
    // {
    //   id: 'product-id',
    //   name: '...',
    //   ...
    //   price: 15999,
    //
    
    // We use a regex that finds the block for the specific ID and replaces the price
    // Since objects can span multiple lines, we can look for `id: '${update.id}'` and then the next `price: \d+,`
    const regex = new RegExp(`(id:\\s*['"]${update.id}['"][\\s\\S]*?price:\\s*)(\\d+)(,)`, 'g');
    
    if (regex.test(productsTs)) {
      productsTs = productsTs.replace(regex, `$1${update.newPrice}$3`);
      updatedCount++;
    } else if (regex.test(accessoriesTs)) {
      accessoriesTs = accessoriesTs.replace(regex, `$1${update.newPrice}$3`);
      updatedCount++;
    }
  });
  
  // 2. Add new products to the respective files
  let newMobilesStr = '';
  let newAccessoriesStr = '';
  
  updates.newProducts.forEach((prod, index) => {
    // Extract RAM/Storage from name if possible
    let ram = 'N/A';
    let storage = 'N/A';
    const ramMatch = prod.name.match(/(\d+)GB?\s*\+?\s*(\d+)GB?/i);
    if (ramMatch) {
      ram = `${ramMatch[1]}GB`;
      storage = `${ramMatch[2]}GB`;
    } else {
      const storageMatch = prod.name.match(/(\d+)GB/i);
      if (storageMatch) {
        storage = `${storageMatch[1]}GB`;
      }
    }
    
    const id = `new-${prod.category.toLowerCase()}-${Date.now()}-${index}`;
    
    const productObj = `
  {
    id: '${id}',
    name: '${prod.name.replace(/'/g, "\\'")}',
    description: 'Auto-added from stock report.',
    price: ${prod.price},
    originalPrice: ${Math.round(prod.price * 1.2)},
    brand: '${prod.brand.replace(/'/g, "\\'")}',
    image: '${prod.image}',
    category: '${prod.category.toLowerCase() === 'mobile' ? 'mobiles' : 'accessories'}',
    isNew: true,
    rating: 4.5,
    reviews: 0,
    inStock: ${prod.qty > 0},
    specs: {
      ram: '${ram}',
      storage: '${storage}',
      processor: 'N/A',
      battery: 'N/A',
      camera: 'N/A',
      display: 'N/A'
    }
  },`;

    if (prod.category === 'MOBILE') {
      newMobilesStr += productObj;
    } else {
      newAccessoriesStr += productObj;
    }
  });
  
  // Insert new mobiles into products-data.ts before the final export array closing brace
  if (newMobilesStr) {
    productsTs = productsTs.replace(/];\s*$/, `${newMobilesStr}\n];\n`);
  }
  
  // Insert new accessories into lib/accessories-data.ts before the final export array closing brace
  if (newAccessoriesStr) {
    accessoriesTs = accessoriesTs.replace(/];\s*$/, `${newAccessoriesStr}\n];\n`);
  }
  
  fs.writeFileSync('products-data.ts', productsTs);
  fs.writeFileSync('lib/accessories-data.ts', accessoriesTs);
  
  console.log(`Updated ${updatedCount} prices in static files.`);
  console.log(`Added ${updates.newProducts.filter(p => p.category === 'MOBILE').length} new mobiles.`);
  console.log(`Added ${updates.newProducts.filter(p => p.category !== 'MOBILE').length} new accessories.`);
}

updateStaticFiles();
