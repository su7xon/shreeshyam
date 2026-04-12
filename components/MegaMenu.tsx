'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { brands } from '@/lib/data';
import { ChevronDown, ChevronRight, Phone, Smartphone, Battery, Camera } from 'lucide-react';

const categories = [
  { name: 'iPhones', href: '/products?brand=Apple', icon: Phone, image: '/samsung-s25-hero.jpeg' },
  { name: 'Samsung Galaxy', href: '/products?brand=Samsung', icon: Smartphone, image: '/samsung-s25-hero-2.jpeg' },
  { name: 'Google Pixel', href: '/products?brand=Google', icon: Phone, image: '' },
  { name: 'OnePlus', href: '/products?brand=OnePlus', icon: Smartphone, image: '' },
  { name: 'Gaming Phones', href: '/products?ram=12GB', icon: Battery, image: '' },
  { name: 'Camera Phones', href: '/products?camera=48MP', icon: Camera, image: '' },
];

export default function MegaMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMenu = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const closeMenu = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 100);
  };

  useEffect(() => () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  return (
    <div className="relative" onMouseEnter={openMenu} onMouseLeave={closeMenu}>
      <button className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-black transition-colors">
        Browse All
        <ChevronDown className="h-4 w-4 transition-transform" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-[min(92vw,72rem)] bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-w-7xl mx-auto px-6 py-8 grid md:grid-cols-3 gap-8">
            {/* Left: Categories */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Shop by Category</h3>
              {categories.map((cat) => (
                <Link
                  key={cat.name}
                  href={cat.href}
                  className="group flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition-all group-hover:translate-x-2"
                >
                  <cat.icon className="h-5 w-5 text-gray-500 group-hover:text-[var(--color-primary)] shrink-0" />
                  <span className="font-medium text-gray-900">{cat.name}</span>
                </Link>
              ))}
            </div>

            {/* Center: Brands */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-6">Top Brands</h3>
              <div className="grid grid-cols-2 gap-4">
                {brands.slice(0, 6).map((brand) => (
                  <Link
                    key={brand}
                    href={`/products?brand=${brand}`}
                    className="group flex items-center gap-2 p-3 rounded-xl hover:bg-gray-100 transition-all"
                  >
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors">
                      <span className="font-bold text-sm uppercase tracking-wide">{brand.slice(0,3)}</span>
                    </div>
                    <span className="font-semibold text-gray-900">{brand}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Right: Promo Banner */}
            <div className="md:col-span-1 relative h-48 rounded-2xl overflow-hidden bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-hover)] group">
              <div className="absolute inset-0 bg-[url('/samsung-s25-hero.jpeg')] bg-cover bg-center opacity-20"></div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

