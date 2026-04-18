import { products as defaultProducts } from '@/lib/data';
import ProductDetailClient from '@/components/ProductDetailClient';

import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

// This is required for static export with dynamic routes
export async function generateStaticParams() {
  const params = defaultProducts.map((product) => ({
    id: product.id,
  }));
  
  // Also fetch all dynamic products from Firebase during build time
  // so Next.js static export knows about their IDs and doesn't crash.
  if (db) {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      querySnapshot.forEach((doc) => {
        if (!params.find(p => p.id === doc.id)) {
          params.push({ id: doc.id });
        }
      });
    } catch (e) {
      console.warn("Could not fetch products for static generation", e);
    }
  }

  return params;
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // In Next.js 15, params is a promise
  const { id } = await params;
  
  return <ProductDetailClient id={id} />;
}
