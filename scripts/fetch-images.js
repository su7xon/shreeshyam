const fs = require('fs');
const https = require('https');

const productsData = [
  // OPPO Models
  { name: "OPPO A6 5G", query: "OPPO A6 5G phone amazon.in" },
  { name: "OPPO A6 Pro 5G", query: "OPPO A6 Pro 5G phone amazon.in" },
  { name: "OPPO A6S 5G", query: "OPPO A6S 5G phone amazon.in" },
  { name: "OPPO A6X 5G", query: "OPPO A6X 5G phone amazon.in" },
  { name: "OPPO F29 Pro 5G", query: "OPPO F29 Pro 5G phone amazon.in" },
  { name: "OPPO Reno 14 Pro 5G", query: "OPPO Reno 14 Pro 5G phone amazon.in" },
  { name: "OPPO Reno 15 5G", query: "OPPO Reno 15 5G phone amazon.in" },
  { name: "OPPO Reno 15 Pro", query: "OPPO Reno 15 Pro phone amazon.in" },
  { name: "OPPO Reno 15 Pro Mini 5G", query: "OPPO Reno 15 Pro Mini 5G phone amazon.in" },
  { name: "OPPO Reno 15C 5G", query: "OPPO Reno 15C 5G phone amazon.in" },
  { name: "OPPO F31 5G", query: "OPPO F31 5G phone amazon.in" },
  { name: "OPPO F31 Pro 5G", query: "OPPO F31 Pro 5G phone amazon.in" },
  { name: "OPPO F31 Pro+ 5G", query: "OPPO F31 Pro+ 5G phone amazon.in" },
  { name: "OPPO K13 Turbo Pro 5G", query: "OPPO K13 Turbo Pro 5G phone amazon.in" },
  { name: "OPPO A6X 4G", query: "OPPO A6X 4G phone amazon.in" },

  // Realme Models  
  { name: "Realme 15 5G", query: "Realme 15 5G phone amazon.in" },
  { name: "Realme 15 Pro", query: "Realme 15 Pro phone amazon.in" },
  { name: "Realme 15 Pro+ 5G", query: "Realme 15 Pro+ 5G phone amazon.in" },
  { name: "Realme 15T 5G", query: "Realme 15T 5G phone amazon.in" },
  { name: "Realme 15X", query: "Realme 15X phone amazon.in" },
  { name: "Realme 16 5G", query: "Realme 16 5G phone amazon.in" },
  { name: "Realme 16 Pro 5G", query: "Realme 16 Pro 5G phone amazon.in" },
  { name: "Realme 16 Pro+ 5G", query: "Realme 16 Pro+ 5G phone amazon.in" },
  { name: "Realme C73 5G", query: "Realme C73 5G phone amazon.in" },
  { name: "Realme C83 5G", query: "Realme C83 5G phone amazon.in" },
  { name: "Realme C85 5G", query: "Realme C85 5G phone amazon.in" },
  { name: "Realme C71", query: "Realme C71 phone amazon.in" },
  { name: "Realme GT 7T", query: "Realme GT 7T phone amazon.in" },
  { name: "Realme Narzo 90 5G", query: "Realme Narzo 90 5G phone amazon.in" },
  { name: "Realme Narzo 90X 5G", query: "Realme Narzo 90X 5G phone amazon.in" },
  { name: "Realme P3X 5G", query: "Realme P3X 5G phone amazon.in" },
  { name: "Realme P4X 5G", query: "Realme P4X 5G phone amazon.in" },

  // Samsung Models
  { name: "Samsung Galaxy A06", query: "Samsung Galaxy A06 phone amazon.in" },
  { name: "Samsung Galaxy A06 5G", query: "Samsung Galaxy A06 5G phone amazon.in" },
  { name: "Samsung Galaxy A07 5G", query: "Samsung Galaxy A07 5G phone amazon.in" },
  { name: "Samsung Galaxy A07 4G", query: "Samsung Galaxy A07 4G phone amazon.in" },
  { name: "Samsung Galaxy A16 5G", query: "Samsung Galaxy A16 5G phone amazon.in" },
  { name: "Samsung Galaxy A17 5G", query: "Samsung Galaxy A17 5G phone amazon.in" },
  { name: "Samsung Galaxy A26 5G", query: "Samsung Galaxy A26 5G phone amazon.in" },
  { name: "Samsung Galaxy A35 5G", query: "Samsung Galaxy A35 5G phone amazon.in" },
  { name: "Samsung Galaxy A36 5G", query: "Samsung Galaxy A36 5G phone amazon.in" },
  { name: "Samsung Galaxy A37 5G", query: "Samsung Galaxy A37 5G phone amazon.in" },
  { name: "Samsung Galaxy A56 5G", query: "Samsung Galaxy A56 5G phone amazon.in" },
  { name: "Samsung Galaxy A57 5G", query: "Samsung Galaxy A57 5G phone amazon.in" },
  { name: "Samsung Galaxy F16 5G", query: "Samsung Galaxy F16 5G phone amazon.in" },
  { name: "Samsung Galaxy F17 5G", query: "Samsung Galaxy F17 5G phone amazon.in" },
  { name: "Samsung Galaxy F36 5G", query: "Samsung Galaxy F36 5G phone amazon.in" },
  { name: "Samsung Galaxy F56 5G", query: "Samsung Galaxy F56 5G phone amazon.in" },
  { name: "Samsung Galaxy M06 5G", query: "Samsung Galaxy M06 5G phone amazon.in" },
  { name: "Samsung Galaxy M16 5G", query: "Samsung Galaxy M16 5G phone amazon.in" },
  { name: "Samsung Galaxy M35 5G", query: "Samsung Galaxy M35 5G phone amazon.in" },
  { name: "Samsung Galaxy M36 5G", query: "Samsung Galaxy M36 5G phone amazon.in" },
  { name: "Samsung Galaxy M56 5G", query: "Samsung Galaxy M56 5G phone amazon.in" },
  { name: "Samsung Galaxy S25", query: "Samsung Galaxy S25 phone amazon.in" },
  { name: "Samsung Galaxy S25 FE", query: "Samsung Galaxy S25 FE phone amazon.in" },
  { name: "Samsung Galaxy S26 Ultra", query: "Samsung Galaxy S26 Ultra phone amazon.in" },
  { name: "Samsung Galaxy Z Fold7", query: "Samsung Galaxy Z Fold7 phone amazon.in" },
  { name: "Samsung Galaxy Tab A11+ 5G", query: "Samsung Galaxy Tab A11+ 5G amazon.in" },

  // Vivo Models
  { name: "Vivo X200 Pro", query: "Vivo X200 Pro phone amazon.in" },
  { name: "Vivo X200T 5G", query: "Vivo X200T 5G phone amazon.in" },
  { name: "Vivo X300 5G", query: "Vivo X300 5G phone amazon.in" },
  { name: "Vivo V50E", query: "Vivo V50E phone amazon.in" },
  { name: "Vivo V60", query: "Vivo V60 phone amazon.in" },
  { name: "Vivo V60E", query: "Vivo V60E phone amazon.in" },
  { name: "Vivo V70 5G", query: "Vivo V70 5G phone amazon.in" },
  { name: "Vivo V70 Elite 5G", query: "Vivo V70 Elite 5G phone amazon.in" },
  { name: "Vivo V70 FE 5G", query: "Vivo V70 FE 5G phone amazon.in" },
  { name: "Vivo Y19E", query: "Vivo Y19E phone amazon.in" },
  { name: "Vivo Y19 5G", query: "Vivo Y19 5G phone amazon.in" },
  { name: "Vivo Y19S 4G", query: "Vivo Y19S 4G phone amazon.in" },
  { name: "Vivo Y19S 5G", query: "Vivo Y19S 5G phone amazon.in" },
  { name: "Vivo Y21 5G", query: "Vivo Y21 5G phone amazon.in" },
  { name: "Vivo Y29 5G", query: "Vivo Y29 5G phone amazon.in" },
  { name: "Vivo Y31 5G", query: "Vivo Y31 5G phone amazon.in" },
  { name: "Vivo Y400 5G", query: "Vivo Y400 5G phone amazon.in" },
  { name: "Vivo Y400 Pro 5G", query: "Vivo Y400 Pro 5G phone amazon.in" },
  { name: "Vivo Y51 Pro 5G", query: "Vivo Y51 Pro 5G phone amazon.in" },
  { name: "Vivo T4X 5G", query: "Vivo T4X 5G phone amazon.in" },

  // Tecno Models
  { name: "Tecno Spark 20 Pro 5G", query: "Tecno Spark 20 Pro 5G phone amazon.in" },
  { name: "Tecno Spark 30C 5G", query: "Tecno Spark 30C 5G phone amazon.in" },
  { name: "Tecno Spark 50 5G", query: "Tecno Spark 50 5G phone amazon.in" },
  { name: "Tecno Spark Go 2", query: "Tecno Spark Go 2 phone amazon.in" },
  { name: "Tecno Spark Go 3", query: "Tecno Spark Go 3 phone amazon.in" },
  { name: "Tecno Spark Go 5G", query: "Tecno Spark Go 5G phone amazon.in" },
  { name: "Tecno Pova 6 Neo 5G", query: "Tecno Pova 6 Neo 5G phone amazon.in" },
  { name: "Tecno Pova 6 Pro 5G", query: "Tecno Pova 6 Pro 5G phone amazon.in" },
  { name: "Tecno Pova 7 5G", query: "Tecno Pova 7 5G phone amazon.in" },
  { name: "Tecno Pova Curve 5G", query: "Tecno Pova Curve 5G phone amazon.in" },
  { name: "Tecno Pova Curve 2", query: "Tecno Pova Curve 2 phone amazon.in" },

  // Infinix Models
  { name: "Infinix Hot 60", query: "Infinix Hot 60 phone amazon.in" },
  { name: "Infinix Hot 60i 5G", query: "Infinix Hot 60i 5G phone amazon.in" },
  { name: "Infinix GT 30 5G", query: "Infinix GT 30 5G phone amazon.in" },
  { name: "Infinix GT 30 Pro", query: "Infinix GT 30 Pro phone amazon.in" },

  // iQOO Models
  { name: "iQOO Z10 5G", query: "iQOO Z10 5G phone amazon.in" },
  { name: "iQOO Z10 Lite", query: "iQOO Z10 Lite phone amazon.in" },
  { name: "iQOO Z10X 5G", query: "iQOO Z10X 5G phone amazon.in" },
  { name: "iQOO Z10R", query: "iQOO Z10R phone amazon.in" },

  // Motorola Models
  { name: "Motorola Moto A200", query: "Motorola Moto A200 phone amazon.in" },
  { name: "Motorola Moto A300", query: "Motorola Moto A300 phone amazon.in" },
  { name: "Motorola Edge 70 Fusion 5G", query: "Motorola Edge 70 Fusion 5G phone amazon.in" },
  { name: "Motorola G67 Power", query: "Motorola G67 Power phone amazon.in" },

  // POCO Models
  { name: "POCO M7 Pro 5G", query: "POCO M7 Pro 5G phone amazon.in" },

  // Xiaomi Models
  { name: "Xiaomi Redmi Note 13 5G", query: "Xiaomi Redmi Note 13 5G phone amazon.in" },
];

const images = {};

async function searchImage(query) {
  return new Promise((resolve) => {
    const url = 'https://www.google.com/search?q=' + encodeURIComponent(query) + '&tbm=isch';
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const matches = data.match(/https:\/\/encrypted-tbn[0-9]*.googleusercontent.com\/[a-zA-Z0-9_\-\.]+/g);
        if (matches && matches.length > 0) {
          resolve(matches[0]);
        } else {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

async function run() {
  console.log('Fetching images for', productsData.length, 'products...');
  
  for (let i = 0; i < productsData.length; i++) {
    const product = productsData[i];
    console.log(`[${i+1}/${productsData.length}] Fetching: ${product.name}...`);
    
    const image = await searchImage(product.query);
    if (image) {
      images[product.name] = image;
      console.log('  Found:', image.substring(0, 50) + '...');
    } else {
      images[product.name] = null;
      console.log('  Not found');
    }
    
    await new Promise(r => setTimeout(r, 1500));
  }
  
  fs.writeFileSync('product-images.json', JSON.stringify(images, null, 2));
  console.log('Done! Saved to product-images.json');
}

run();