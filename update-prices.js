const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, updateDoc } = require('firebase/firestore');
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

async function updatePrices() {
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
      variants: data.variants || [],
      originalData: data
    });
  });

  console.log(`Found ${fbProducts.length} products in Firebase.`);

  console.log('Reading JSON file...');
  const jsonContent = fs.readFileSync('All_Brands_Price_List (1).json', 'utf8');
  const priceList = JSON.parse(jsonContent);

  let updatedCount = 0;

  for (const brand in priceList.brands) {
    const items = priceList.brands[brand];
    for (const item of items) {
      const targetName = normalizeName(item.product_name);
      const targetRam = String(item.ram_gb || '').toLowerCase().replace('gb', '').trim();
      const targetStorage = String(item.storage_gb || '').toLowerCase().replace('gb', '').trim();
      const targetPrice = Number(item.selling_price);

      // Find all firebase products that match the name
      const matchingProducts = fbProducts.filter(p => p.normalizedName === targetName || p.normalizedName.includes(targetName) || targetName.includes(p.normalizedName));

      if (matchingProducts.length === 0) continue;

      for (const p of matchingProducts) {
        let needsUpdate = false;
        let updateData = {};

        // Check main product
        if (p.ram === targetRam && p.storage === targetStorage) {
          if (p.price !== targetPrice) {
            console.log(`[UPDATE] ${p.name} (Main): ${p.price} -> ${targetPrice}`);
            updateData.price = targetPrice;
            needsUpdate = true;
          }
        }

        // Check variants
        let newVariants = [...p.variants];
        let variantsChanged = false;
        
        for (let i = 0; i < newVariants.length; i++) {
          const v = newVariants[i];
          const vRam = String(v.ram || '').toLowerCase().replace('gb', '').trim();
          const vStorage = String(v.storage || '').toLowerCase().replace('gb', '').trim();
          
          if (vRam === targetRam && vStorage === targetStorage) {
            if (v.price !== targetPrice) {
              console.log(`[UPDATE] ${p.name} (Variant ${v.ram}/${v.storage}): ${v.price} -> ${targetPrice}`);
              newVariants[i] = { ...v, price: targetPrice };
              variantsChanged = true;
              needsUpdate = true;
            }
          }
        }

        if (variantsChanged) {
          updateData.variants = newVariants;
        }

        if (needsUpdate) {
          try {
            await updateDoc(doc(db, 'products', p.id), updateData);
            
            // Also update our local cache so we don't update it again if there are duplicate matches
            if (updateData.price !== undefined) p.price = updateData.price;
            if (updateData.variants !== undefined) p.variants = updateData.variants;
            
            updatedCount++;
          } catch (e) {
            console.error(`Failed to update ${p.name}:`, e);
          }
        }
      }
    }
  }

  console.log(`\n=== SUMMARY ===`);
  console.log(`Successfully updated ${updatedCount} product documents.`);
  process.exit(0);
}

updatePrices().catch(console.error);
