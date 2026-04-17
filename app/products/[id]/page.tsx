import { products as defaultProducts } from '@/lib/data';
import ProductDetailClient from '@/components/ProductDetailClient';

// This is required for static export with dynamic routes
export function generateStaticParams() {
  return defaultProducts.map((product) => ({
    id: product.id,
  }));
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  // In Next.js 15, params is a promise
  const { id } = await params;
  
  return <ProductDetailClient id={id} />;
}
