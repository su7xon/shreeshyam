// lib/hooks/useStoreData.ts
// Centralized React Query hooks for all public-facing data fetching.
// These replace the "fetch everything on init" pattern in admin-store.
// Admin-only data (orders, bulk ops) stays in admin-store.

'use client';

import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import * as productService from '@/lib/services/productService';
import * as bannerService from '@/lib/services/bannerService';
import * as brandService from '@/lib/services/brandService';
import * as categoryService from '@/lib/services/categoryService';
import * as dailyDealService from '@/lib/services/dailyDealService';
import * as offerService from '@/lib/services/offerService';
import { AdminProduct } from '@/lib/admin-store';
import { DailyDeal } from '@/lib/services/dailyDealService';
import { QueryDocumentSnapshot } from 'firebase/firestore';

// ==================== Query Keys ====================
// Centralized keys prevent cache collisions and enable targeted invalidation

export const queryKeys = {
  products: {
    all: ['products'] as const,
    featured: ['products', 'featured'] as const,
    newArrivals: ['products', 'new-arrivals'] as const,
    detail: (id: string) => ['products', id] as const,
    paginated: (filters?: Record<string, unknown>) =>
      ['products', 'paginated', filters] as const,
  },
  banners: {
    all: ['banners'] as const,
    byPlacement: (placement: string) => ['banners', placement] as const,
  },
  brands: {
    all: ['brands'] as const,
    active: ['brands', 'active'] as const,
  },
  categories: {
    all: ['categories'] as const,
  },
  dailyDeals: ['dailyDeals'] as const,
  offers: ['offers'] as const,
};

// ==================== Product Hooks ====================

/**
 * Fetch all products (lightweight version — for product listing page).
 * Uses staleTime of 5 minutes to prevent re-fetching on navigation.
 */
export function useProducts() {
  return useQuery({
    queryKey: queryKeys.products.all,
    queryFn: () => productService.getProducts(),
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
}

/**
 * Infinite query for products — used for infinite scrolling / pagination.
 */
export function usePaginatedProducts(filters: productService.ProductFilters = {}) {
  return useInfiniteQuery({
    queryKey: queryKeys.products.paginated(filters),
    queryFn: ({ pageParam }) => 
      productService.getPaginatedProducts(filters, pageParam as QueryDocumentSnapshot | null),
    initialPageParam: null as QueryDocumentSnapshot | null,
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.lastVisible : undefined,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Fetch featured products for the homepage.
 * Small dataset, long cache.
 */
export function useFeaturedProducts(limit = 8) {
  return useQuery({
    queryKey: queryKeys.products.featured,
    queryFn: () => productService.getFeaturedProducts(limit),
    staleTime: 10 * 60 * 1000, // 10 min — featured rarely changes
    gcTime: 30 * 60 * 1000,
  });
}

/**
 * Fetch new arrivals for the homepage.
 */
export function useNewArrivals(limit = 10) {
  return useQuery({
    queryKey: queryKeys.products.newArrivals,
    queryFn: () => productService.getNewArrivals(limit),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

/**
 * Fetch single product by ID — used on product detail page.
 * Short staleTime since pricing might change.
 */
export function useProduct(id: string) {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => productService.getProductById(id),
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    enabled: !!id, // Don't fetch if no ID
  });
}

// ==================== Banner Hooks ====================

/**
 * Fetch all banners — used by homepage and admin.
 */
export function useBanners() {
  return useQuery({
    queryKey: queryKeys.banners.all,
    queryFn: () => bannerService.getBanners(),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

// ==================== Brand Hooks ====================

/**
 * Fetch active brands — used by homepage brand strip and nav.
 */
export function useActiveBrands() {
  return useQuery({
    queryKey: queryKeys.brands.active,
    queryFn: () => brandService.getActiveBrands(),
    staleTime: 30 * 60 * 1000, // 30 min — brands rarely change
    gcTime: 60 * 60 * 1000,
  });
}

// ==================== Category Hooks ====================

/**
 * Fetch active categories — used by category strip.
 */
export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: () => categoryService.getCategories(),
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
}

// ==================== Daily Deals Hooks ====================

/**
 * Fetch active daily deals.
 */
export function useDailyDeals() {
  return useQuery<DailyDeal[]>({
    queryKey: queryKeys.dailyDeals,
    queryFn: () => dailyDealService.getDailyDeals(),
    staleTime: 2 * 60 * 1000, // 2 min — deals are time-sensitive
    gcTime: 10 * 60 * 1000,
  });
}

// ==================== Offers Hooks ====================

/**
 * Fetch active offers.
 */
export function useOffers() {
  return useQuery({
    queryKey: queryKeys.offers,
    queryFn: () => offerService.getOffers(),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}
