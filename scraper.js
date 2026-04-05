const fs = require('fs');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

const brands = [
  'Samsung Galaxy S23 FE', 'iPhone 14', 'Realme GT 6T', 'Motorola Edge 50 Pro',
  'iQOO 12', 'POCO F6 5G', 'Samsung Galaxy A55 5G', 'Oppo Reno 12 Pro 5G',
  'Redmi Note 13 Pro+ 5G', 'OnePlus Nord CE 4', 'Samsung Galaxy Z Flip 5',
  'Samsung Galaxy Z Fold 5', 'Realme 12 Pro+ 5G', 'Vivo V30 Pro',
  'Motorola Razr 40 Ultra', 'iPhone 13', 'iQOO Neo 9 Pro', 'POCO X6 Pro 5G',
  'Samsung Galaxy M55 5G', 'Redmi Note 13 Pro 5G'
];

async function searchImage(query) {
  try {
    const res = await fetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query + ' smartphone amazon.in')}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const html = await res.text();
    // find first amazon image
    const match = html.match(/https:\/\/m\.media-amazon\.com\/images\/I\/[a-zA-Z0-9_\-\.]+\.jpg/);
    return match ? match[0] : null;
  } catch (e) {
    return null;
  }
}

async function run() {
  const results = {};
  for(let b of brands) {
    console.log('Fetching', b);
    let img = await searchImage(b);
    results[b] = img;
    await new Promise(r => setTimeout(r, 1000));
  }
  fs.writeFileSync('images.json', JSON.stringify(results, null, 2));
  console.log('Done!');
}
run();
