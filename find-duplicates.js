const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

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

async function checkDuplicates() {
  console.log('Fetching products from Firebase...');
  const snapshot = await getDocs(collection(db, 'products'));
  
  const fbProducts = [];
  let emptyNameCount = 0;
  
  snapshot.forEach(doc => {
    const data = doc.data();
    if (!data.name || data.name.trim() === '') {
      emptyNameCount++;
    }

    let createdAtStr = 'Unknown';
    if (data.createdAt) {
      if (data.createdAt.seconds) {
        createdAtStr = new Date(data.createdAt.seconds * 1000).toISOString();
      } else if (typeof data.createdAt === 'string') {
        createdAtStr = data.createdAt;
      } else if (data.createdAt.toDate) {
        createdAtStr = data.createdAt.toDate().toISOString();
      }
    }

    fbProducts.push({
      id: doc.id,
      name: data.name || '<EMPTY>',
      normalizedName: normalizeName(data.name),
      price: data.price || 0,
      hasImage: !!data.image || !!data.imageUrl,
      createdAt: createdAtStr
    });
  });

  console.log(`Total documents fetched: ${fbProducts.length}`);
  console.log(`Documents with empty name: ${emptyNameCount}`);

  // Group by normalized name
  const nameGroups = {};
  fbProducts.forEach(p => {
    if (p.normalizedName === '') return; // Skip empty names for duplicate grouping by name
    if (!nameGroups[p.normalizedName]) {
      nameGroups[p.normalizedName] = [];
    }
    nameGroups[p.normalizedName].push(p);
  });

  let duplicateGroupsCount = 0;
  let totalDuplicatesCount = 0;

  for (const [normName, items] of Object.entries(nameGroups)) {
    if (items.length > 1) {
      duplicateGroupsCount++;
      totalDuplicatesCount += (items.length - 1);
    }
  }

  console.log(`\n=== DUPLICATE ANALYSIS ===`);
  console.log(`Unique product names: ${Object.keys(nameGroups).length}`);
  console.log(`Groups of products with the exact same name: ${duplicateGroupsCount}`);
  console.log(`Total duplicate documents (if we kept 1 per name): ${totalDuplicatesCount}`);

  console.log(`\n=== EXAMPLES OF DUPLICATES ===`);
  let examplesShown = 0;
  for (const [normName, items] of Object.entries(nameGroups)) {
    if (items.length > 1 && examplesShown < 5) {
      console.log(`\nProduct Name: "${items[0].name}" appears ${items.length} times:`);
      items.forEach(item => {
        console.log(`  - ID: ${item.id} | Price: ${item.price} | Image: ${item.hasImage ? 'Yes' : 'No'} | CreatedAt: ${item.createdAt}`);
      });
      examplesShown++;
    }
  }

  process.exit(0);
}

checkDuplicates().catch(console.error);
