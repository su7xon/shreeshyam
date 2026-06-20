const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc } = require('firebase/firestore');

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

async function checkDocs() {
  const ids = ['029UJsk0XDS5dOkQOm8s', 'FVnVkeup7nwVjrGatDrV', 'product-1780833717515-h3d9mvl'];
  
  for (const id of ids) {
    const d = await getDoc(doc(db, 'products', id));
    if (d.exists()) {
      const data = d.data();
      console.log(`\n=== DOCUMENT ID: ${id} ===`);
      console.log(`Name: ${data.name}`);
      console.log(`Price: ${data.price}`);
      console.log(`RAM: ${data.ram}`);
      console.log(`Storage: ${data.storage}`);
      console.log(`Variants count: ${data.variants ? data.variants.length : 0}`);
      if (data.variants && data.variants.length > 0) {
        data.variants.forEach((v, i) => {
           console.log(`  Variant ${i}: RAM=${v.ram}, Storage=${v.storage}, Color=${v.color}, Price=${v.price}`);
        });
      }
    } else {
      console.log(`Doc ${id} not found.`);
    }
  }
  process.exit(0);
}

checkDocs().catch(console.error);
