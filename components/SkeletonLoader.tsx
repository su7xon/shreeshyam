'use client';

import { memo } from 'react';

export function ProductSkeleton() {
  return (
    <div className="premium-surface rounded-2xl overflow-hidden animate-pulse h-full flex flex-col">
      {/* Image shimmer */}
      <div className="relative aspect-square bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] p-6"></div>

      {/* Content shimmer */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded w-24 mb-3"></div>
        <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded w-4/5 mb-4"></div>
        <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded w-3/5 mb-auto"></div>
        <div className="flex items-center justify-between pt-3 border-t border-gray-200 border-dashed">
          <div className="h-7 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded-full w-20"></div>
          <div className="h-10 w-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

export function BannerSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 animate-pulse h-[300px] sm:h-[380px]">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
    </div>
  );
}

export function CartSkeleton() {
  return (
    <div className="space-y-4">
      {/* Cart items skeleton */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-200 p-3 sm:p-5 flex flex-row gap-3 sm:gap-5 animate-pulse">
          {/* Image skeleton */}
          <div className="w-16 h-16 sm:w-24 sm:h-28 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded-lg flex-shrink-0"></div>
          
          {/* Content skeleton */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded w-1/2 mb-3"></div>
              <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded w-1/3"></div>
            </div>
            <div className="flex items-center justify-between mt-2 sm:mt-4">
              <div className="h-10 w-28 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded-md"></div>
              <div className="h-5 w-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function CartSummarySkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
      <div className="h-7 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded w-1/2 mb-6"></div>
      <div className="space-y-4 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex justify-between">
            <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded w-1/3"></div>
            <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded w-1/4"></div>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-200 pt-4 mb-6">
        <div className="flex justify-between items-center">
          <div className="h-7 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded w-1/4"></div>
          <div className="h-9 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded w-1/3"></div>
        </div>
      </div>
      <div className="h-14 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded-lg"></div>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="bg-white min-h-screen animate-pulse">
      {/* Breadcrumbs skeleton */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded w-16"></div>
                {i < 4 && <div className="h-3 w-3 bg-gray-300 rounded"></div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* LEFT: Image Gallery skeleton */}
          <div className="w-full lg:w-[45%]">
            <div className="lg:sticky lg:top-20">
              <div className="flex flex-row gap-3">
                {/* Thumbnails skeleton */}
                <div className="hidden sm:flex flex-col gap-2 w-16 flex-shrink-0">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-16 h-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded-lg"></div>
                  ))}
                </div>

                {/* Main Image skeleton */}
                <div className="flex-1 relative">
                  <div className="aspect-square bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Product Info skeleton */}
          <div className="w-full lg:w-[55%]">
            {/* Title skeleton */}
            <div className="h-7 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded w-3/4 mb-2"></div>
            <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded w-1/2 mb-6"></div>

            {/* Price skeleton */}
            <div className="flex items-baseline gap-3 mb-6">
              <div className="h-9 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded w-1/3"></div>
              <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded w-1/4"></div>
            </div>

            {/* EMI skeleton */}
            <div className="h-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded-lg mb-6"></div>

            {/* RAM selector skeleton */}
            <div className="mb-6">
              <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded w-16 mb-3"></div>
              <div className="flex gap-2">
                <div className="h-10 w-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded-lg"></div>
              </div>
            </div>

            {/* Storage selector skeleton */}
            <div className="mb-6">
              <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded w-20 mb-3"></div>
              <div className="flex gap-2">
                <div className="h-10 w-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded-lg"></div>
              </div>
            </div>

            {/* Buttons skeleton */}
            <div className="flex gap-3 mb-6">
              <div className="flex-1 h-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded-lg"></div>
              <div className="flex-1 h-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded-lg"></div>
            </div>
          </div>
        </div>

        {/* Specs & Offers skeleton */}
        <div className="mt-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-gray-200 rounded-lg mb-6">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded w-1/3"></div>
              </div>
              <div className="p-4 space-y-3">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="flex gap-4">
                    <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded w-1/4"></div>
                    <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Related products skeleton */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <div className="h-7 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg overflow-hidden animate-pulse">
                <div className="aspect-square bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%]"></div>
                <div className="p-3">
                  <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded w-1/4 mb-2"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded w-3/4 mb-2"></div>
                  <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function FilterSkeleton() {
  return (
    <div className="bg-white p-4 sm:p-5 rounded-lg border border-gray-200 animate-pulse">
      <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded w-1/3 mb-6"></div>
      
      {/* Price filter skeleton */}
      <div className="mb-6">
        <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded w-2/3 mb-3"></div>
        <div className="h-2 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded w-full mb-2"></div>
        <div className="flex justify-between">
          <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded w-12"></div>
          <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded w-12"></div>
        </div>
      </div>

      {/* Brand filter skeleton */}
      <div className="mb-6 space-y-2">
        <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded w-1/4 mb-3"></div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="h-4 w-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded"></div>
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded w-20"></div>
          </div>
        ))}
      </div>

      {/* RAM filter skeleton */}
      <div className="mb-6 space-y-2">
        <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded w-1/4 mb-3"></div>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="h-4 w-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded"></div>
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded w-12"></div>
          </div>
        ))}
      </div>

      {/* Storage filter skeleton */}
      <div className="space-y-2">
        <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded w-1/4 mb-3"></div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="h-4 w-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded"></div>
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded w-14"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TestimonialSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 animate-pulse">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-10 w-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded-full flex-shrink-0"></div>
        <div>
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded w-24 mb-1"></div>
          <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded w-20"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded w-full"></div>
        <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded w-5/6"></div>
        <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded w-2/3"></div>
      </div>
    </div>
  );
}

export function CategorySkeleton() {
  return (
    <div className="group relative min-h-[180px] sm:min-h-[220px] rounded-xl overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse min-w-[82%] sm:min-w-[72%] md:min-w-0 snap-start">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
    </div>
  );
}

function Shimmer() {
  return (
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_1.5s_infinite]"></div>
  );
}

// Add to globals.css later: @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
export default { 
  ProductSkeleton, 
  BannerSkeleton,
  CartSkeleton,
  CartSummarySkeleton,
  ProductDetailSkeleton,
  FilterSkeleton,
  TestimonialSkeleton,
  CategorySkeleton
};


