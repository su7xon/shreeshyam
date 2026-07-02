const fs = require('fs');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function verify() {
  const stockJson = JSON.parse(fs.readFileSync('public/parsed-stock.json', 'utf8'));
  
  const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  const querySnapshot = await getDocs(collection(db, 'products'));
  const dbProducts = [];
  querySnapshot.forEach((doc) => {
    dbProducts.push({ id: doc.id, ...doc.data() });
  });

  let report = `# Side-by-Side Price Comparison\n\n`;
  report += `This table compares the prices of the products from your Excel file with the actual prices stored in the website database.\n\n`;
  report += `| Product Name (From Excel) | Price (Excel) | Price (Website) | Status |\n`;
  report += `| :--- | :--- | :--- | :--- |\n`;

  for (const item of stockJson) {
    const name = `${item.brand} ${item.model}`.replace(/\s+/g, ' ').trim();
    const normalizedName = normalize(name);
    
    // Find all matching products in DB (exact match)
    const matches = dbProducts.filter(p => p.name && normalize(p.name) === normalizedName);
    
    // Fallback logic
    let finalMatches = matches;
    if (finalMatches.length === 0) {
        finalMatches = dbProducts.filter(p => {
            if (!p.name) return false;
            const pName = normalize(p.name);
            return (pName.includes(normalizedName) || normalizedName.includes(pName)) && Math.abs(pName.length - normalizedName.length) < 5;
        });
    }

    if (finalMatches.length > 0) {
        const dbPrices = finalMatches.map(m => Math.round(m.price));
        const itemPrice = Math.round(item.price);
        
        // If the excel price exists in any of the DB matches, it's a success
        if (dbPrices.includes(itemPrice)) {
            report += `| **${name}** | ₹${itemPrice} | ₹${itemPrice} | ✅ Match |\n`;
        } else {
            // Mismatch
            report += `| **${name}** | ₹${itemPrice} | ₹${dbPrices.join(', ')} | ⚠️ Mismatch |\n`;
        }
    } else {
        report += `| **${name}** | ₹${Math.round(item.price)} | *Not Found* | ❌ Missing |\n`;
    }
  }

  fs.writeFileSync('C:\\Users\\LENOVO\\.gemini\\antigravity-ide\\brain\\2c7594ec-f376-401b-826e-7d8f654db442\\side_by_side_report.md', report);
  console.log('Side-by-side report generated.');
  process.exit(0);
}

verify().catch(console.error);
