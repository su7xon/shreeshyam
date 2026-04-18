import { products as defaultProducts } from '@/lib/data';
import AdminProductFormClient from '@/components/AdminProductFormClient';

import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

// This is required for static export with dynamic routes
export async function generateStaticParams() {
  const params = defaultProducts.map((product) => ({
    id: product.id,
  }));
  
  // Also generate path for 'new' product
  params.push({ id: 'new' });
  
  // Fetch all Firebase products during build time
  if (db) {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      querySnapshot.forEach((doc) => {
        // Avoid duplicates
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

export default async function AdminProductPage({ params }: { params: Promise<{ id: string }> }) {
  // In Next.js 15, params is a promise
  const { id } = await params;
  
  return <AdminProductFormClient id={id} />;
}
