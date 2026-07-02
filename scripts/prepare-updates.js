const fs = require('fs');
const cheerio = require('cheerio');
// node-fetch is already in node_modules? We can use native fetch since Node 18+
// Node v24 supports native fetch.

async function getGSMArenaImage(query) {
  try {
    const searchUrl = `https://m.gsmarena.com/res.php3?sSearch=${encodeURIComponent(query)}`;
    const searchRes = await fetch(searchUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    const searchHtml = await searchRes.text();
    const $ = cheerio.load(searchHtml);
    
    let firstResult = $('.makers ul li a').first().attr('href');
    if (!firstResult) {
       return null;
    }
    
    const phoneUrl = `https://m.gsmarena.com/${firstResult}`;
    const phoneRes = await fetch(phoneUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    const phoneHtml = await phoneRes.text();
    const $$ = cheerio.load(phoneHtml);
    
    const imgUrl = $$('.specs-photo-main a img').attr('src') || $$('.specs-photo-main img').attr('src');
    return imgUrl || null;
  } catch (e) {
    console.error(`Error fetching image for ${query}:`, e.message);
    return null;
  }
}

async function prepareUpdates() {
  const stock = JSON.parse(fs.readFileSync('public/parsed-stock.json', 'utf8'));
  
  // Read existing static products to match against
  // Using a regex to extract objects from products-data.ts
  const productsTs = fs.readFileSync('products-data.ts', 'utf8');
  const existingMobiles = Array.from(productsTs.matchAll(/id:\s*['"](.*?)['"].*?name:\s*['"](.*?)['"]/gs)).map(m => ({ id: m[1], name: m[2] }));
  
  // Read accessories-data.ts
  const accessoriesTs = fs.readFileSync('lib/accessories-data.ts', 'utf8');
  const existingAccessories = Array.from(accessoriesTs.matchAll(/id:\s*['"](.*?)['"].*?name:\s*['"](.*?)['"]/gs)).map(m => ({ id: m[1], name: m[2] }));
  
  const allExisting = [...existingMobiles, ...existingAccessories];
  
  const updates = {
    priceUpdates: [],
    newProducts: [],
    skipped: []
  };

  const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

  for (const item of stock) {
    // Generate a name from brand and model
    const name = `${item.brand} ${item.model}`.replace(/\s+/g, ' ').trim();
    const normalizedName = normalize(name);
    
    // Attempt to match
    // Simple matching: if model is in name or vice versa
    const match = allExisting.find(e => {
      const eName = normalize(e.name);
      // Let's use a very simple heuristic: if they share a lot of characters or substrings
      // Actually, if the existing name contains the model name
      return eName.includes(normalize(item.model)) || normalizedName.includes(eName);
    });

    if (match) {
      updates.priceUpdates.push({
        id: match.id,
        name: match.name,
        stockName: name,
        newPrice: item.price,
        qty: item.qty
      });
    } else {
      // It's a new product
      let imageUrl = '';
      if (item.category === 'MOBILE') {
        console.log(`Fetching image for new product: ${name}`);
        imageUrl = await getGSMArenaImage(name);
        // Throttle to avoid getting blocked
        await new Promise(r => setTimeout(r, 1000));
      }
      
      updates.newProducts.push({
        name: name,
        brand: item.brand,
        category: item.category,
        price: item.price,
        qty: item.qty,
        color: item.color,
        image: imageUrl || 'https://via.placeholder.com/400x500?text=No+Image'
      });
    }
  }

  fs.writeFileSync('public/stock-updates-prepared.json', JSON.stringify(updates, null, 2));
  console.log(`Prepared ${updates.priceUpdates.length} updates and ${updates.newProducts.length} new products.`);
}

prepareUpdates();
