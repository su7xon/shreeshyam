'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Package, Plus, Check } from 'lucide-react';

interface Bundle {
  id: string;
  name: string;
  phone: { name: string; image: string; price: number };
  case: { name: string; price: number };
  earbuds: { name: string; price: number };
  totalPrice: number;
  discount: number;
}

const bundles: Bundle[] = [
  {
    id: '1',
    name: 'Essential Combo',
    phone: { name: 'Samsung Galaxy S24', image: '/samsung-s25-hero-2.jpeg', price: 55000 },
    case: { name: 'Premium Clear Case', price: 499 },
    earbuds: { name: 'Basic Earphones', price: 799 },
    totalPrice: 56298,
    discount: 10,
  },
  {
    id: '2',
    name: 'Premium Pack',
    phone: { name: 'iPhone 14', image: '/samsung-s25-hero-2.jpeg', price: 65000 },
    case: { name: 'MagSafe Case', price: 1299 },
    earbuds: { name: 'AirPods SE', price: 2999 },
    totalPrice: 69298,
    discount: 15,
  },
  {
    id: '3',
    name: 'Ultimate Bundle',
    phone: { name: 'iPhone 15 Pro Max', image: '/samsung-s25-hero-2.jpeg', price: 140000 },
    case: { name: 'Designer Leather Case', price: 2499 },
    earbuds: { name: 'AirPods Pro 2', price: 7999 },
    totalPrice: 150498,
    discount: 20,
  },
];

export default function BundleModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [selectedBundle, setSelectedBundle] = useState<string | null>(null);

  if (!isOpen) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] rounded-xl flex items-center justify-center">
              <Package className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Bundle Deals</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <p className="text-gray-600 mb-6 text-sm">
            Save more with our curated bundles. Get phone + case + earbuds at exclusive discounted prices.
          </p>

          <div className="space-y-4">
            {bundles.map((bundle) => {
              const savings = Math.round(bundle.totalPrice * (bundle.discount / 100));
              const finalPrice = bundle.totalPrice - savings;

              return (
                <div
                  key={bundle.id}
                  className={`p-5 rounded-xl border-2 transition-all cursor-pointer ${
                    selectedBundle === bundle.id
                      ? 'border-[#8B5CF6] bg-[#8B5CF6]/5'
                      : 'border-gray-200 hover:border-[#8B5CF6]/50'
                  }`}
                  onClick={() => setSelectedBundle(selectedBundle === bundle.id ? null : bundle.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-gray-900">{bundle.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs bg-[#8B5CF6]/20 text-[#8B5CF6] px-2 py-0.5 rounded-full font-medium">
                          Save ₹{savings.toLocaleString('en-IN')} ({bundle.discount}% off)
                        </span>
                      </div>
                    </div>
                    {selectedBundle === bundle.id && (
                      <div className="w-6 h-6 bg-[#8B5CF6] rounded-full flex items-center justify-center">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center">
                      <div className="relative w-16 h-16 mx-auto mb-2 bg-gray-100 rounded-lg overflow-hidden">
                        <Image src={bundle.phone.image} alt={bundle.phone.name} fill className="object-contain p-2" />
                      </div>
                      <p className="text-xs font-medium text-gray-900 line-clamp-1">{bundle.phone.name}</p>
                      <p className="text-xs text-gray-500">{formatPrice(bundle.phone.price)}</p>
                    </div>
                    <div className="flex items-center justify-center">
                      <Plus className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-2 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">📱</span>
                      </div>
                      <p className="text-xs font-medium text-gray-900">{bundle.case.name}</p>
                      <p className="text-xs text-gray-500">₹{bundle.case.price}</p>
                    </div>
                    <div className="flex items-center justify-center">
                      <Plus className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-2 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">🎧</span>
                      </div>
                      <p className="text-xs font-medium text-gray-900">{bundle.earbuds.name}</p>
                      <p className="text-xs text-gray-500">₹{bundle.earbuds.price}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                    <div>
                      <span className="text-sm text-gray-500 line-through">{formatPrice(bundle.totalPrice)}</span>
                      <span className="ml-2 text-lg font-bold text-gray-900">{formatPrice(finalPrice)}</span>
                    </div>
                    <Link
                      href="/products"
                      className="px-4 py-2 bg-[#8B5CF6] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                    >
                      View Bundle
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}