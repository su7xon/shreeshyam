'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingCart } from 'lucide-react';
import { Product } from '@/lib/data';
import { useCartStore } from '@/lib/store';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();

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
      <div className="premium-surface rounded-2xl overflow-hidden transition-all duration-500 h-full flex flex-col relative hover:-translate-y-1 hover:shadow-[0_26px_38px_-28px_rgba(32,27,22,0.5)]">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#f2ece4]/40 pointer-events-none"></div>

        {/* Image */}
        <div className="relative aspect-square p-5 sm:p-6 flex items-center justify-center overflow-hidden mix-blend-multiply">
          {discount > 0 && (
            <div className="absolute top-3 left-3 bg-[var(--color-success)] text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full z-10 shadow-sm">
              {discount}% OFF
            </div>
          )}
          {/* @ts-ignore */}
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-4 group-hover:scale-[1.07] group-hover:-translate-y-1 transition-all duration-500 drop-shadow-md"
            sizes="(max-width: 480px) 45vw, (max-width: 768px) 30vw, (max-width: 1200px) 22vw, 18vw"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 flex flex-col flex-grow z-10 bg-[#fffdfa]/60 backdrop-blur-sm">
          {/* Brand */}
          <div className="text-[10px] sm:text-xs text-[var(--color-primary)] font-bold tracking-[0.18em] uppercase mb-1">
            {product.brand}
          </div>

          {/* Product Name */}
          <h3 className="text-base sm:text-[1.05rem] font-semibold text-[var(--color-text)] mb-2 line-clamp-2 leading-tight group-hover:text-[var(--color-primary)] transition-colors">
            {product.name}
          </h3>

          {/* Price & Action */}
          <div className="flex items-end justify-between border-t border-[var(--color-border)] pt-3 mt-auto">
            <div>
              <div className="font-extrabold text-base sm:text-lg text-[var(--color-text)] leading-none mb-1">
                {formatPrice(product.price)}
              </div>
              {product.originalPrice && (
                <div className="text-[11px] sm:text-xs text-[var(--color-text-muted)] line-through">
                  {formatPrice(product.originalPrice)}
                </div>
              )}
            </div>
            
            <button
              onClick={handleAddToCart}
              className="bg-[#f2ece4] text-[var(--color-text)] hover:bg-[var(--color-primary)] hover:text-white h-9 w-9 sm:h-10 sm:w-10 rounded-full flex items-center justify-center transition-colors duration-500 shadow-sm"
              aria-label="Add to cart"
              suppressHydrationWarning
            >
              <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
