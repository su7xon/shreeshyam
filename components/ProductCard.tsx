'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';
import { Product } from '@/lib/data';
import { useCartStore } from '@/lib/store';
import { useState, useEffect } from 'react';
import { getProductImageUrl } from '@/lib/image-utils';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'editorial';
  priority?: boolean;
}

export default function ProductCard({ product, variant = 'default', priority = false }: ProductCardProps) {
  const { addItem } = useCartStore();
  const fallbackImg = `https://placehold.co/400x400/f5f5f7/9ca3af?text=${encodeURIComponent(product.brand)}`;
  const optimizedSrc = product.image ? getProductImageUrl(product.image, 'card') : fallbackImg;
  
  // Use robust hasError & isImageLoaded states
  const [hasError, setHasError] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Sync state when product or product.image changes
  useEffect(() => {
    setHasError(false);
    setIsImageLoaded(false);
  }, [product.id, product.image]);

  const imgSrc = hasError ? fallbackImg : optimizedSrc;

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
    <Link 
      href={`/products/${product.id}`} 
      className="group block h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative bg-white rounded-2xl overflow-hidden transition-all duration-400 h-full flex flex-col border border-[#f3f4f6] hover:border-[#e5e7eb] hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.1)] hover:-translate-y-1">
        
        {/* Top Actions - Glass effect */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          <button 
            onClick={handleAddToCart}
            className="w-9 h-9 rounded-xl bg-white/90 backdrop-blur-sm border border-white/50 flex items-center justify-center text-[#6b7280] hover:text-[#111111] hover:scale-110 shadow-lg shadow-black/5 transition-all duration-200 group-hover:opacity-100 opacity-100 sm:opacity-0"
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>
        <div className="absolute top-3 right-3 z-10">
          <button className="w-9 h-9 rounded-xl bg-white/90 backdrop-blur-sm border border-white/50 flex items-center justify-center text-[#9ca3af] hover:text-[#ef4444] hover:scale-110 shadow-lg shadow-black/5 transition-all duration-200 group-hover:opacity-100 opacity-100 sm:opacity-0">
            <Heart className="h-4 w-4" />
          </button>
        </div>

        {/* Image Section - With subtle gradient */}
        <div className="relative aspect-[1/1] p-2 flex items-center justify-center overflow-hidden bg-gradient-to-b from-white to-[#fafafa]">
          <Image
            src={imgSrc}
            alt={product.name}
            fill
            className={`object-contain p-2 transition-opacity duration-300 ${(isImageLoaded || hasError) ? 'opacity-100' : 'opacity-0'}`}
            sizes="(max-width: 480px) 45vw, (max-width: 768px) 30vw, (max-width: 1200px) 22vw, 18vw"
            onLoad={() => setIsImageLoaded(true)}
            onError={() => {
              setHasError(true);
            }}
            priority={priority}
            referrerPolicy="no-referrer"
            unoptimized={imgSrc.includes('amazon') || imgSrc.includes('media-amazon')}
          />
          {/* Skeleton overlay */}
          {!isImageLoaded && !hasError && (
            <div className="absolute inset-0 p-5 flex items-center justify-center">
              <div className="w-full h-full rounded-xl bg-gray-100 animate-pulse" />
            </div>
          )}

          {/* Quick view overlay on hover */}
          <div className={`absolute inset-0 bg-black/5 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
        </div>

        {/* Content Section */}
        <div className="p-1.5 flex flex-col flex-grow text-center bg-white border-t border-[#f3f4f6]">
          {discount > 0 && (
            <div className="mb-1 text-left">
              <span className="inline-flex items-center px-1.5 py-0.5 bg-[#f59e0b] text-[#111111] text-[8px] font-semibold rounded-md shadow">
                {discount}% OFF
              </span>
            </div>
          )}

          <div className="mb-1">
            <span className="text-[7px] font-medium text-[#3b82f6] uppercase tracking-wider bg-[#eff6ff] px-1.5 py-0.5 rounded">
              {product.brand}
            </span>
          </div>
          
          <h3 className="text-[10px] sm:text-[11px] font-semibold text-[#111111] mb-1.5 line-clamp-2 leading-snug min-h-[2rem]">
            {product.name}
          </h3>

          <div className="mt-auto">
            <div className="flex flex-col items-center gap-1">
               {product.originalPrice && (
                 <span className="text-[9px] text-[#9ca3af] line-through">
                   ₹{product.originalPrice.toLocaleString('en-IN')}
                 </span>
               )}
               <span className="text-[13px] font-bold text-[#111111]">
                 ₹{product.price.toLocaleString('en-IN')}
               </span>
            </div>
          </div>
        </div>

        {/* Bottom gradient line on hover */}
        <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] transition-transform duration-300 origin-left ${isHovered ? 'scale-x-100' : 'scale-x-0'}`} />
      </div>
    </Link>
  );
}