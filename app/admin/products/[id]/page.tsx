export const dynamic = 'force-dynamic';
import AdminProductFormClient from '@/components/AdminProductFormClient';

export async function generateStaticParams() {
  return [{ id: 'new' }];
}

export default async function AdminProductPage({ params }: { params: Promise<{ id: string }> }) {
  // In Next.js 15, params is a promise
  const { id } = await params;
  
  return <AdminProductFormClient id={id} />;
}
