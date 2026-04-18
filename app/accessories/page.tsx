'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { accessories, accessoryCategories } from '@/lib/accessories-data';
import { getAccessoryImage } from '@/lib/image-resolver';
import { ShoppingCart, Check } from 'lucide-react';

const categoryTabs = [
  { id: 'all', label: 'All', emoji: '🛍️' },
  { id: 'power-adapters', label: 'Power Adapters', emoji: '🔌' },
  { id: 'earbuds', label: 'Earbuds & Neckbands', emoji: '🎧' },
  { id: 'smartwatch', label: 'Smartwatches', emoji: '⌚' },
  { id: 'tablet', label: 'Tablets', emoji: '📱' },
];

export default function AccessoriesPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

  // Read hash on mount for deep linking
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.replace('#', '');
      const validCat = categoryTabs.find(c => c.id === hash);
      if (validCat) {
        setActiveCategory(hash);
        // Scroll to content after category change
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    }
  }, []);

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return accessories;
    return accessories.filter((a) => a.category === activeCategory);
  }, [activeCategory]);

  const handleAddToCart = (itemId: string) => {
    setAddedItems(prev => ({ ...prev, [itemId]: true }));
    setTimeout(() => setAddedItems(prev => ({ ...prev, [itemId]: false })), 2000);
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

  return (
    <div className="min-h-screen bg-[#f7f7f8]">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-gray-400 font-semibold mb-1.5">Collection</p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
            Accessories
          </h1>
          <p className="text-sm text-gray-500 mt-1.5">{filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} available</p>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="bg-white border-b border-gray-100 sticky top-[57px] z-30">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto no-scrollbar py-3">
            {categoryTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === tab.id
                    ? 'bg-black text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span>{tab.emoji}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid — same style as mobile products */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8">
        {/* Add section anchors for hash navigation */}
        {categoryTabs.filter(tab => tab.id !== 'all').map((tab) => (
          <div key={`anchor-${tab.id}`} id={tab.id} className="scroll-mt-32" />
        ))}
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3">
          {filteredProducts.map((item) => (
            <Link
              href={`/accessories/${item.id}`}
              key={item.id}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:-translate-y-1 hover:shadow-[0_26px_38px_-28px_rgba(0,0,0,0.08)] transition-all duration-500 flex flex-col h-full block"
            >
              {/* Image */}
              <div className="relative aspect-square p-5 sm:p-6 flex items-center justify-center overflow-hidden bg-[#fafafa]">
                <Image
                  src={getAccessoryImage(item.id)}
                  alt={item.name}
                  fill
                  className="object-contain p-4 group-hover:scale-[1.05] transition-transform duration-500 mix-blend-multiply"
                  sizes="(max-width: 480px) 45vw, (max-width: 768px) 30vw, (max-width: 1200px) 22vw, 18vw"
                  unoptimized
                />
              </div>

              {/* Content */}
              <div className="p-4 sm:p-5 flex flex-col flex-grow z-10 bg-white">
                {/* Brand */}
                <div className="text-[10px] sm:text-xs text-black font-bold tracking-[0.18em] uppercase mb-1">
                  {item.brand}
                </div>

                {/* Product Name */}
                <h3 className="text-sm sm:text-[1.05rem] font-semibold text-gray-900 mb-1 line-clamp-2 leading-tight group-hover:text-[var(--color-primary)] transition-colors min-h-[2.4rem]">
                  {item.name}
                </h3>

                {/* Color */}
                <p className="text-[11px] text-gray-500 mb-3">{item.color}</p>

                {/* Price & Action */}
                <div className="flex items-end justify-between border-t border-gray-100 pt-3 mt-auto">
                  <div>
                    <div className="font-extrabold text-base sm:text-lg text-gray-900 leading-none">
                      {formatPrice(item.unitPrice)}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleAddToCart(item.id);
                    }}
                    className={`h-9 w-9 sm:h-10 sm:w-10 rounded-full flex items-center justify-center transition-colors duration-500 shadow-sm ${
                      addedItems[item.id]
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-black hover:bg-black hover:text-white'
                    }`}
                    aria-label="Add to cart"
                  >
                    {addedItems[item.id] ? (
                      <Check className="h-4 w-4 sm:h-5 sm:w-5" />
                    ) : (
                      <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                    )}
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty state */}
        {filteredProducts.length === 0 && (
          <div className="bg-white p-12 rounded-2xl border border-gray-200/80 text-center shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 mb-6">Try selecting a different category.</p>
            <button
              onClick={() => setActiveCategory('all')}
              className="bg-black text-white px-6 py-2.5 rounded-full hover:bg-gray-800 transition-colors font-medium text-sm"
            >
              View All
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
