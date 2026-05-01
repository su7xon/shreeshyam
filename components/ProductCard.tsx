'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart, ShoppingBag } from 'lucide-react';
import { Product } from '@/lib/data';
import { useCartStore } from '@/lib/store';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'editorial';
}

export default function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const { addItem } = useCartStore();
  const fallbackImg = `https://placehold.co/400x400/f3f4f6/9ca3af?text=${encodeURIComponent(product.brand)}`;
  const [imgSrc, setImgSrc] = useState(product.image || fallbackImg);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  return (
    <Link href={`/products/${product.id}`} className="group block h-full">
      <div className="bg-white rounded-xl overflow-hidden transition-all duration-300 h-full flex flex-col relative border border-gray-100 hover:shadow-md">
        
        {/* Top Actions */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={handleAddToCart}
            className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-500 hover:text-black shadow-sm transition-colors"
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>
        <div className="absolute top-3 right-3 z-10">
          <button className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 shadow-sm transition-colors">
            <Heart className="h-4 w-4" />
          </button>
        </div>

        {/* Image Section */}
        <div className="relative aspect-[4/5] p-4 flex items-center justify-center overflow-hidden bg-white">
          {/* @ts-ignore */}
          <Image
            src={imgSrc}
            alt={product.name}
            fill
            className="object-contain p-4 transition-transform duration-500"
            sizes="(max-width: 480px) 45vw, (max-width: 768px) 30vw, (max-width: 1200px) 22vw, 18vw"
            onError={() => setImgSrc(fallbackImg)}
            unoptimized
          />
          
          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute bottom-2 left-2 bg-[#ff8c00] text-black text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
              {discount}% OFF
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-3 sm:p-4 flex flex-col flex-grow text-center bg-white border-t border-gray-50">
          <h3 className="text-xs sm:text-[13px] font-medium text-gray-800 mb-2 line-clamp-2 leading-tight min-h-[2.5rem]">
            {product.name}
          </h3>

          <div className="mt-auto">
            <div className="flex flex-col items-center gap-0.5">
               {product.originalPrice && (
                <span className="text-[10px] sm:text-[11px] text-gray-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              <span className="text-sm sm:text-[15px] font-bold text-black">
                {formatPrice(product.price)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

