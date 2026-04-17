'use client';

import { useCartStore } from '@/lib/store';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CartSkeleton, CartSummarySkeleton } from '@/components/SkeletonLoader';

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    // Simulate loading for better UX
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (!mounted || isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="h-9 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded w-48 mb-8"></div>
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-8">
          <div className="lg:w-2/3">
            <CartSkeleton />
          </div>
          <div className="lg:w-1/3">
            <CartSummarySkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven&apos;t added any smartphones to your cart yet.</p>
          <Link 
            href="/products" 
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-bold rounded-xl text-white bg-black hover:bg-gray-800 transition-all shadow-lg shadow-gray-200"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
      <h1 className="text-xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-8">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-8">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {items.map((item) => (
                <li key={item.id} className="p-3 sm:p-5 flex flex-row gap-3 sm:gap-5">
                  <div className="relative w-16 h-16 sm:w-24 sm:h-28 bg-gray-50 rounded-lg flex-shrink-0">
                    {/* @ts-ignore React 19 type mismatch */}
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-2"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                      <div>
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-0.5 line-clamp-2">
                          <Link href={`/products/${item.id}`} className="hover:text-blue-600">
                            {item.name}
                          </Link>
                        </h3>
                        <p className="text-[10px] sm:text-sm text-gray-500 mb-1">{item.ram} | {item.storage}</p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-sm sm:text-base font-bold text-gray-900">{formatPrice(item.price)}</p>
                        {item.originalPrice && (
                          <p className="text-xs sm:text-sm text-gray-500 line-through">{formatPrice(item.originalPrice)}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 sm:mt-4">
                      <div className="flex items-center border border-gray-300 rounded-md">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-l-md transition-colors"
                          disabled={item.quantity <= 1}
                          suppressHydrationWarning
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-4 py-2 text-gray-900 font-medium border-x border-gray-300">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-r-md transition-colors"
                          suppressHydrationWarning
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm font-medium transition-colors"
                        suppressHydrationWarning
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Remove</span>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-xl border border-gray-200 p-6 lg:sticky lg:top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({items.length} items)</span>
                <span>{formatPrice(totalPrice())}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping Estimate</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax Estimate</span>
                <span>Calculated at checkout</span>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-extrabold text-gray-900">{formatPrice(totalPrice())}</span>
              </div>
            </div>
            
            <Link 
              href="/checkout"
              className="w-full flex items-center justify-center gap-2 bg-black text-white border border-black py-4 px-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-all shadow-lg shadow-gray-200"
            >
              Proceed to Checkout <ArrowRight className="h-5 w-5" />
            </Link>
            
            <div className="mt-6 text-center">
              <Link href="/products" className="text-blue-600 hover:underline font-medium">
                or Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
