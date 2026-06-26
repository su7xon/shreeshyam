import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

export async function POST(req: Request) {
  try {
    const { jsonProducts } = await req.json();
    
    // Fetch all existing products from Firestore
    const querySnapshot = await getDocs(collection(db, 'products'));
    const firestoreProducts = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        price: data.price,
        originalPrice: data.originalPrice,
        ram: data.ram,
        storage: data.storage
      };
    });

    let updatedCount = 0;
    let debugLogs: string[] = [];
    let errors: string[] = [];

    // To prevent updating the same document multiple times
    const updatedIds = new Set();

    for (const jp of jsonProducts) {
      // Strict matching logic
      const match = firestoreProducts.find((fp: any) => {
        const fpName = (fp.name || '').toLowerCase().trim();
        const jpName = (jp.name || '').toLowerCase().trim();
        
        const nameMatches = fpName.includes(jpName) || jpName.includes(fpName) || fpName === jpName;
        if (!nameMatches) return false;

        const fpRam = fp.ram ? fp.ram.toUpperCase().replace(/\s+/g, '') : null;
        const jpRam = jp.ram ? jp.ram.toUpperCase().replace(/\s+/g, '') : null;
        const ramMatches = (fpRam === jpRam) || (!fpRam && !jpRam);

        const fpStorage = fp.storage ? fp.storage.toUpperCase().replace(/\s+/g, '') : null;
        const jpStorage = jp.storage ? jp.storage.toUpperCase().replace(/\s+/g, '') : null;
        const storageMatches = (fpStorage === jpStorage) || (!fpStorage && !jpStorage);

        return ramMatches && storageMatches;
      });

      if (match) {
        if (!updatedIds.has(match.id)) {
          if (match.price !== jp.price || match.originalPrice !== jp.original_price) {
            const productRef = doc(db, 'products', match.id);
            try {
              await updateDoc(productRef, { 
                price: jp.price,
                originalPrice: jp.original_price
              });
              debugLogs.push(`Updated ${jp.name} (${jp.ram}/${jp.storage}) - Price: ${match.price} -> ${jp.price}`);
              updatedCount++;
              updatedIds.add(match.id);
            } catch (err: any) {
              errors.push(`Failed to update ${match.id} (${jp.name}): ${err.message}`);
            }
          }
        }
      }
    }

    return NextResponse.json({ success: true, updatedCount, logs: debugLogs, errors });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
