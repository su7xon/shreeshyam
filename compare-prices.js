const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
const fs = require('fs');

const firebaseConfig = {
  apiKey: "AIzaSyDcDWq9HncVfpy1yJyV3lNHZWxWWdlCJDI",
  authDomain: "mobile-171f0.firebaseapp.com",
  projectId: "mobile-171f0",
  storageBucket: "mobile-171f0.firebasestorage.app",
  messagingSenderId: "1047128087392",
  appId: "1:1047128087392:web:4be8e09c1a2ac507d55c05",
  measurementId: "G-5EMYPJN8G1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function normalizeName(name) {
  return (name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function comparePrices() {
  console.log('Fetching products from Firebase...');
  const snapshot = await getDocs(collection(db, 'products'));
  
  const fbProducts = [];
  snapshot.forEach(doc => {
    const data = doc.data();
    fbProducts.push({
      id: doc.id,
      name: data.name,
      normalizedName: normalizeName(data.name),
      price: data.price,
      ram: String(data.ram || '').toLowerCase().replace('gb', '').trim(),
      storage: String(data.storage || '').toLowerCase().replace('gb', '').trim(),
      variants: (data.variants || []).map(v => ({
        price: v.price,
        ram: String(v.ram || '').toLowerCase().replace('gb', '').trim(),
        storage: String(v.storage || '').toLowerCase().replace('gb', '').trim()
      }))
    });
  });

  console.log(`Found ${fbProducts.length} products in Firebase.`);

  console.log('Reading JSON file...');
  const jsonContent = fs.readFileSync('All_Brands_Price_List (1).json', 'utf8');
  const priceList = JSON.parse(jsonContent);

  const results = {
    samePrice: [],
    differentPrice: [],
    notFound: []
  };

  for (const brand in priceList.brands) {
    const items = priceList.brands[brand];
    for (const item of items) {
      const targetName = normalizeName(item.product_name);
      const targetRam = String(item.ram_gb || '');
      const targetStorage = String(item.storage_gb || '');
      const targetPrice = Number(item.selling_price);

      // Find all firebase products that match the name
      const matchingProducts = fbProducts.filter(p => p.normalizedName === targetName || p.normalizedName.includes(targetName) || targetName.includes(p.normalizedName));

      if (matchingProducts.length === 0) {
        results.notFound.push(item);
        continue;
      }

      let matched = false;

      for (const p of matchingProducts) {
        // Check main product
        if (p.ram === targetRam && p.storage === targetStorage) {
          if (p.price === targetPrice) {
            results.samePrice.push(item);
          } else {
            results.differentPrice.push({
              item,
              fbPrice: p.price,
              fbName: p.name
            });
          }
          matched = true;
          break;
        }

        // Check variants
        const variantMatch = p.variants.find(v => v.ram === targetRam && v.storage === targetStorage);
        if (variantMatch) {
          if (variantMatch.price === targetPrice) {
            results.samePrice.push(item);
          } else {
            results.differentPrice.push({
              item,
              fbPrice: variantMatch.price,
              fbName: p.name
            });
          }
          matched = true;
          break;
        }
      }

      if (!matched) {
        results.notFound.push(item);
      }
    }
  }

  console.log(`\n=== SUMMARY ===`);
  console.log(`Total items in JSON: ${Object.values(priceList.brands).flat().length}`);
  console.log(`Exact Matches (Same Price): ${results.samePrice.length}`);
  console.log(`Price Mismatches: ${results.differentPrice.length}`);
  console.log(`Not Found in DB (or RAM/Storage mismatch): ${results.notFound.length}`);

  fs.writeFileSync('price_comparison_summary.json', JSON.stringify(results, null, 2));
  console.log('Detailed results written to price_comparison_summary.json');
  process.exit(0);
}

comparePrices().catch(console.error);
