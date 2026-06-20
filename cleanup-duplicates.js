const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, deleteDoc } = require('firebase/firestore');

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

async function cleanupDuplicates() {
  console.log('Fetching products to find duplicates...');
  const snapshot = await getDocs(collection(db, 'products'));
  
  const fbProducts = [];
  snapshot.forEach(d => {
    const data = d.data();
    fbProducts.push({
      id: d.id,
      name: data.name || '',
      normalizedName: normalizeName(data.name),
      hasImage: !!data.image || !!data.imageUrl,
      variantsCount: data.variants ? data.variants.length : 0,
      isProductPrefix: d.id.startsWith('product-')
    });
  });

  const nameGroups = {};
  fbProducts.forEach(p => {
    if (p.normalizedName === '') return;
    if (!nameGroups[p.normalizedName]) {
      nameGroups[p.normalizedName] = [];
    }
    nameGroups[p.normalizedName].push(p);
  });

  let deletedCount = 0;

  for (const [normName, items] of Object.entries(nameGroups)) {
    if (items.length > 1) {
      // Sort to keep the "best" one at index 0.
      // Criteria: 1. Has image. 2. Has more variants. 3. starts with 'product-' 
      items.sort((a, b) => {
        if (a.hasImage && !b.hasImage) return -1;
        if (!a.hasImage && b.hasImage) return 1;
        
        if (a.variantsCount > b.variantsCount) return -1;
        if (a.variantsCount < b.variantsCount) return 1;

        if (a.isProductPrefix && !b.isProductPrefix) return -1;
        if (!a.isProductPrefix && b.isProductPrefix) return 1;

        return 0; // fallback
      });

      const bestItem = items[0];
      console.log(`\nKeeping "${bestItem.name}" [ID: ${bestItem.id}]`);
      
      // Delete the rest
      for (let i = 1; i < items.length; i++) {
        const itemToDelete = items[i];
        console.log(`  Deleting duplicate: [ID: ${itemToDelete.id}]`);
        try {
          await deleteDoc(doc(db, 'products', itemToDelete.id));
          deletedCount++;
        } catch (error) {
          console.error(`  Failed to delete ${itemToDelete.id}:`, error);
        }
      }
    }
  }

  console.log(`\n=== CLEANUP SUMMARY ===`);
  console.log(`Successfully deleted ${deletedCount} duplicate products.`);
  process.exit(0);
}

cleanupDuplicates().catch(console.error);
