'use client';

import Link from 'next/link';
import Image from 'next/image';

import useAdminStore from '@/lib/admin-store';

const defaultCategories = [
  { id: 'cat-1', name: 'Mobiles', image: '/categories/mobiles.png', active: true, order: 0 },
  { id: 'cat-2', name: 'Chargers', image: '/categories/chargers.png', active: true, order: 1 },
  { id: 'cat-3', name: 'Earbuds', image: '/categories/earbuds.png', active: true, order: 2 },
  { id: 'cat-4', name: 'Watches', image: '/categories/watches.png', active: true, order: 3 },
  { id: 'cat-5', name: 'Tablets', image: '/categories/tablets.png', active: true, order: 4 },
];

export default function CategoryStrip() {
  const { categories } = useAdminStore();
  const storeCategories = categories.filter(c => c.active).sort((a, b) => a.order - b.order);
  const activeCategories = storeCategories.length > 0 ? storeCategories : defaultCategories;

  return (
    <section className="bg-white py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between sm:justify-center gap-4 sm:gap-14 overflow-x-auto no-scrollbar w-full pb-2">
          {activeCategories.map((cat) => {
            return (
              <Link
                key={cat.id}
                href={`/products?category=${encodeURIComponent(cat.name)}`}
                className="group flex flex-col items-center gap-3 flex-shrink-0 min-w-[70px] sm:min-w-[100px]"
              >
                <div className="relative h-16 w-16 sm:h-24 sm:w-24 rounded-full bg-[#f3f6ff] border border-blue-50/50 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-md">
                  <div className="relative w-[80%] h-[80%] transition-transform duration-300 group-hover:scale-110">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                <span className="text-[12px] sm:text-[15px] font-semibold text-gray-800 group-hover:text-blue-600 transition-colors text-center whitespace-nowrap">
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
