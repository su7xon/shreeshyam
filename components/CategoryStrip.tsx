'use client';

import Link from 'next/link';
import { Smartphone, Headphones, Zap, Watch, Tablet } from 'lucide-react';

const categories = [
  { name: 'Mobiles', href: '/products', icon: Smartphone },
  { name: 'Chargers', href: '/accessories#power-adapters', icon: Zap },
  { name: 'Earbuds', href: '/accessories#earbuds', icon: Headphones },
  { name: 'Watches', href: '/accessories#smartwatch', icon: Watch },
  { name: 'Tablets', href: '/accessories#tablet', icon: Tablet },
];

export default function CategoryStrip() {
  return (
    <section className="bg-white py-5 sm:py-8 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between sm:justify-center gap-3 sm:gap-12 overflow-x-auto no-scrollbar w-full">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                href={cat.href}
                className="group flex flex-col items-center gap-2 flex-shrink-0 min-w-[64px] sm:min-w-[80px]"
              >
                <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-gray-50 border border-gray-150 flex items-center justify-center transition-all duration-200 group-hover:bg-gray-100 group-hover:border-gray-300">
                  <Icon className="h-6 w-6 sm:h-7 sm:w-7 text-gray-700 group-hover:text-gray-900 transition-colors duration-200" strokeWidth={1.5} />
                </div>
                <span className="text-[11px] sm:text-xs font-medium text-gray-600 group-hover:text-gray-900 transition-colors text-center whitespace-nowrap">
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
