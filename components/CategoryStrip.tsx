'use client';

import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Smartphone, Headphones, Plug, Watch, Tablet } from 'lucide-react';

const categories = [
  { name: 'Mobiles', href: '/products', icon: Smartphone },
  { name: 'Power Adapters', href: '/accessories#power-adapters', icon: Plug },
  { name: 'Earbuds & Earphones', href: '/accessories#earbuds', icon: Headphones },
  { name: 'Smartwatches', href: '/accessories#smartwatch', icon: Watch },
  { name: 'Tablets', href: '/accessories#tablet', icon: Tablet },
];

export default function CategoryStrip() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 5);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 5);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll);
    }
    return () => {
      el?.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.6;
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <section className="relative bg-white border-b border-gray-100 py-3 sm:py-4">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 relative">
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/95 hover:bg-white shadow-lg border border-gray-200 rounded-full h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center transition-all hover:scale-105"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4 text-gray-700" />
          </button>
        )}

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/95 hover:bg-white shadow-lg border border-gray-200 rounded-full h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center transition-all hover:scale-105"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4 text-gray-700" />
          </button>
        )}

        {/* Scrollable Strip */}
        <div
          ref={scrollRef}
          className="flex gap-2 sm:gap-6 overflow-x-auto no-scrollbar px-6 sm:px-8 lg:justify-center"
        >
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                href={cat.href}
                className="group flex flex-col items-center gap-1.5 sm:gap-2 min-w-[72px] sm:min-w-[88px] py-1"
              >
                <div className="relative h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 flex items-center justify-center transition-all duration-300 group-hover:border-black/20 group-hover:shadow-md group-hover:-translate-y-0.5 group-hover:from-gray-100 group-hover:to-gray-200">
                  <Icon className="h-6 w-6 sm:h-7 sm:w-7 text-gray-600 group-hover:text-black transition-colors duration-300" strokeWidth={1.5} />
                </div>
                <span className="text-[10px] sm:text-xs font-medium text-gray-600 group-hover:text-black transition-colors text-center leading-tight max-w-[80px] line-clamp-2">
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
