const https = require('https');
const brands = [
  'Samsung Galaxy S23 FE', 'iPhone 14', 'Realme GT 6T', 'Motorola Edge 50 Pro',
  'iQOO 12', 'POCO F6 5G', 'Samsung Galaxy A55 5G', 'Oppo Reno 12 Pro 5G',
  'Redmi Note 13 Pro+ 5G', 'OnePlus Nord CE 4', 'Samsung Galaxy Z Flip 5',
  'Samsung Galaxy Z Fold 5', 'Realme 12 Pro+ 5G', 'Vivo V30 Pro',
  'Motorola Razr 40 Ultra', 'iPhone 13', 'iQOO Neo 9 Pro', 'POCO X6 Pro 5G',
  'Samsung Galaxy M55 5G', 'Redmi Note 13 Pro 5G'
];

async function search(query) {
  return new Promise(resolve => {
    https.get('https://html.duckduckgo.com/html/?q=' + encodeURIComponent('site:amazon.in ' + query), { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        const matches = data.match(/https:\/\/m\.media-amazon\.com\/images\/I\/[a-zA-Z0-9_\-\.]+\.jpg/g);
        resolve(matches ? [...new Set(matches)][0] : null);
      });
    }).on('error', () => resolve(null));
  });
}

async function run() {
  for(let b of brands) {
    let img = await search(b);
    console.log(b + '|' + img);
    await new Promise(r => setTimeout(r, 600));
  }
}
run();
