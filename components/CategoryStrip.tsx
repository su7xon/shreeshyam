'use client';

import Link from 'next/link';
import Image from 'next/image';

import { useCategories } from '@/lib/hooks/useStoreData';
import { getProductImageUrl } from '@/lib/image-utils';

const defaultCategories = [
  { id: 'cat-1', name: 'Mobiles', image: '/categories/mobiles.png', active: true, order: 0 },
  { id: 'cat-2', name: 'Chargers', image: '/categories/chargers.png', active: true, order: 1 },
  { id: 'cat-3', name: 'Earbuds', image: '/categories/earbuds.png', active: true, order: 2 },
  { id: 'cat-4', name: 'Watches', image: '/categories/watches.png', active: true, order: 3 },
  { id: 'cat-5', name: 'Tablets', image: '/categories/tablets.png', active: true, order: 4 },
];

export default function CategoryStrip() {
  const { data: categories = [], isLoading } = useCategories();
  const storeCategories = categories.filter(c => c.active).sort((a, b) => a.order - b.order);
  
  if (isLoading) {
    return (
      <section className="bg-white py-6 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-3 sm:gap-8 overflow-x-auto no-scrollbar w-full pb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="group flex flex-col items-center gap-2.5 sm:gap-3 flex-shrink-0 min-w-[70px] sm:min-w-[100px]">
                <div className="h-16 w-16 sm:h-22 sm:w-22 rounded-2xl bg-gray-200 animate-pulse border border-[#e2e8f0]"></div>
                <div className="h-3 sm:h-4 w-12 sm:w-16 bg-gray-200 rounded animate-pulse mt-1"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const activeCategories = storeCategories.length > 0 ? storeCategories : defaultCategories;

  return (
    <section className="bg-white py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-3 sm:gap-8 overflow-x-auto no-scrollbar w-full pb-2">
          {activeCategories.map((cat, index) => {
            return (
              <Link
                key={cat.id}
                href={`/products?category=${encodeURIComponent(cat.name)}`}
                className="group flex flex-col items-center gap-2.5 sm:gap-3 flex-shrink-0 min-w-[70px] sm:min-w-[100px]"
              >
                <div className="relative h-16 w-16 sm:h-22 sm:w-22 rounded-2xl bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] border border-[#e2e8f0] flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:border-[#3b82f6]/30">
                  <Image
                    src={getProductImageUrl(cat.image, 'card')}
                    alt={cat.name}
                    fill
                    className="object-contain p-3"
                    sizes="88px"
                    priority={index < 5}
                  />
                  {/* Hover gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#3b82f6]/0 to-[#3b82f6]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="text-[12px] sm:text-[14px] font-semibold text-[#64748b] group-hover:text-[#111111] group-hover:font-bold transition-all text-center whitespace-nowrap">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}