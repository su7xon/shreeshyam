import { products as defaultProducts } from '@/lib/data';
import AdminProductFormClient from '@/components/AdminProductFormClient';

// This is required for static export with dynamic routes
export function generateStaticParams() {
  const params = defaultProducts.map((product) => ({
    id: product.id,
  }));
  // Also generate path for 'new' product
  params.push({ id: 'new' });
  return params;
}

export default async function AdminProductPage({ params }: { params: { id: string } }) {
  // In Next.js 15, params is a promise
  const { id } = await params;
  
  return <AdminProductFormClient id={id} />;
}
