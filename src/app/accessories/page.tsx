'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { accessories, accessoryCategories, Accessory } from '@/lib/accessories-data';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/lib/store';

export default function AccessoriesPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const { addItem } = useCartStore();
  const [addedId, setAddedId] = useState<string | null>(null);

  const filtered = activeCategory === 'all'
    ? accessories
    : accessories.filter(a => a.category === activeCategory);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

  const handleAdd = (accessory: Accessory) => {
    addItem({
      id: accessory.id,
      name: accessory.name,
      brand: accessory.brand,
      price: accessory.price,
      image: accessory.image,
      ram: '',
      storage: '',
      processor: '',
      battery: '',
      camera: '',
      display: '',
      description: accessory.description,
    } as any);
    setAddedId(accessory.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div className="min-h-screen bg-[#f7f7f8]">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex text-sm text-gray-500 gap-2 items-center">
            <Link href="/" className="hover:text-black">Home</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Accessories</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Accessories</h1>
        <p className="text-gray-600 mb-6">Power adapters, earbuds, smartwatches, and more.</p>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeCategory === 'all' ? 'bg-black text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            All ({accessories.length})
          </button>
          {accessoryCategories.map(cat => {
            const count = accessories.filter(a => a.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeCategory === cat.id ? 'bg-black text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {cat.emoji} {cat.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Products Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {filtered.map(accessory => (
              <div key={accessory.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow group">
                <div className="relative aspect-square bg-gray-50 p-4 flex items-center justify-center">
                  <Image
                    src={accessory.image || '/placeholder.png'}
                    alt={accessory.name}
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition-transform"
                    sizes="(max-width: 768px) 50vw, 20vw"
                  />
                </div>
                <div className="p-3">
                  <p className="text-[10px] text-gray-400 uppercase font-medium">{accessory.brand}</p>
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">{accessory.name}</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-base font-bold text-gray-900">{formatPrice(accessory.price)}</p>
                    <button
                      onClick={() => handleAdd(accessory)}
                      className={`p-2 rounded-lg transition-colors ${
                        addedId === accessory.id
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-black hover:text-white'
                      }`}
                      aria-label="Add to cart"
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500">No accessories found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
