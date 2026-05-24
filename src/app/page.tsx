import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getBanners } from '@/lib/services/bannerService';
import { getCategories } from '@/lib/services/categoryService';
import { getProducts } from '@/lib/services/productService';
import { getActiveBrands } from '@/lib/services/brandService';
import HomeClient from './page-client';

const serialize = (obj: any) => JSON.parse(JSON.stringify(obj));

export default async function HomePage() {
  const queryClient = new QueryClient();

  try {
    // Prefetch critical above-the-fold data to prevent the 1-second loading delay
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: ['banners'],
        queryFn: async () => serialize(await getBanners()),
      }),
      queryClient.prefetchQuery({
        queryKey: ['categories'],
        queryFn: async () => serialize(await getCategories()),
      }),
      queryClient.prefetchQuery({
        queryKey: ['products'],
        queryFn: async () => serialize(await getProducts()),
      }),
      queryClient.prefetchQuery({
        queryKey: ['brands', 'active'],
        queryFn: async () => serialize(await getActiveBrands()),
      })
    ]);
  } catch (error) {
    console.error('Failed to prefetch homepage data:', error);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomeClient />
    </HydrationBoundary>
  );
}
