import { accessories } from '@/lib/accessories-data';
import AccessoryDetailClient from '@/components/AccessoryDetailClient';

// This is required for static export with dynamic routes
export function generateStaticParams() {
  return accessories.map((acc) => ({
    id: acc.id,
  }));
}

export default async function AccessoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // In Next.js 15, params is a promise
  const { id } = await params;
  
  return <AccessoryDetailClient id={id} />;
}
