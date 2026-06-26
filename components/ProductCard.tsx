'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
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
  
  // Clean up "null+null" or "nullGB" that might be stuck in the database
  const displayName = product.name ? product.name.replace(/null\+null/g, '').trim() : '';
  const displayRam = product.ram === 'nullGB' ? null : product.ram;
  const displayStorage = product.storage === 'nullGB' ? null : product.storage;
  // Use placehold.co with .png to avoid SVG blocking in next.config.ts
  const fallbackImg = `https://placehold.co/400x400/f5f5f7/9ca3af.png?text=${encodeURIComponent(product.brand || 'Product')}`;
  
  // Use product.images[0] if available to perfectly sync with ProductDetailClient, otherwise product.image
  const primaryImage = (product.images && product.images.length > 0) ? product.images[0] : product.image;
  const optimizedSrc = primaryImage ? getProductImageUrl(primaryImage, 'card') : fallbackImg;
  
  // Use robust hasError & isImageLoaded states
  const [hasError, setHasError] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  // Sync state when product or product.image changes
  useEffect(() => {
    setHasError(false);
    setIsImageLoaded(false);
  }, [product.id, product.image]);

  const imgSrc = hasError ? fallbackImg : optimizedSrc;

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 900);
  };

  return (
    <Link 
      href={`/products/${product.id}`} 
      className="group block h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative bg-white rounded-2xl overflow-hidden transition-all duration-400 h-full flex flex-col border border-[#f3f4f6] hover:border-[#e5e7eb] hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.1)] hover:-translate-y-1">
        
        {/* Discount badge */}
        {discount > 0 && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <span className="inline-flex items-center px-2 py-0.5 bg-[#f59e0b] text-[#111111] text-[9px] sm:text-[10px] font-bold rounded-lg shadow-sm">
              {discount}% OFF
            </span>
          </div>
        )}

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
        <div className="p-2.5 sm:p-3 flex flex-col flex-grow bg-white border-t border-[#f3f4f6]">
          <div className="mb-1.5">
            <span className="text-[9px] sm:text-[10px] font-semibold text-[#3b82f6] uppercase tracking-wider bg-[#eff6ff] px-1.5 py-0.5 rounded">
              {product.brand}
            </span>
          </div>
          
          <h3 className="text-[12px] sm:text-[13px] font-semibold text-[#111111] mb-2 line-clamp-2 leading-snug min-h-[2.2rem]">
            {displayName}{displayRam && displayStorage ? ` ${displayRam}+${displayStorage}` : ''}
          </h3>

          {/* Reserve space to prevent grid layout shift when RAM/Storage is missing */}
          <div className="h-[1px] w-full" />

          <div className="mt-auto">
            <div className="flex items-end justify-between gap-2">
              <div className="flex flex-col">
                {product.originalPrice ? (
                  <span className="text-[10px] sm:text-[11px] text-[#9ca3af] line-through min-h-[1.2rem] flex items-center">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                ) : (
                  <span className="text-[10px] sm:text-[11px] text-transparent line-through min-h-[1.2rem] flex items-center">
                    ₹0
                  </span>
                )}
                <span className="text-[15px] sm:text-[17px] font-bold text-[#111111]">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
              </div>
              
              {/* Always visible Add to Cart button */}
              <button 
                onClick={handleAddToCart}
                className={`flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg text-[9px] sm:text-[10px] font-bold uppercase tracking-wider transition-all duration-200 ${
                  addedToCart 
                    ? 'bg-green-500 text-white scale-95' 
                    : 'bg-[#111111] text-white hover:bg-[#333] active:scale-95'
                }`}
              >
                <ShoppingBag className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                {addedToCart ? '✓' : 'Add'}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom gradient line on hover */}
        <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] transition-transform duration-300 origin-left ${isHovered ? 'scale-x-100' : 'scale-x-0'}`} />
      </div>
    </Link>
  );
}