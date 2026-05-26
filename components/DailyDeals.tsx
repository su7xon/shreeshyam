'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Zap } from 'lucide-react';
import { useDailyDeals, useProducts } from '@/lib/hooks/useStoreData';
import { getProductImageUrl } from '@/lib/image-utils';

const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return {
    h: h.toString().padStart(2, '0'),
    m: m.toString().padStart(2, '0'),
    s: s.toString().padStart(2, '0'),
  };
};

export default function DailyDeals() {
  const { data: dailyDeals = [] } = useDailyDeals();
  const { data: products = [] } = useProducts();
  const [timeLeft, setTimeLeft] = useState(8 * 3600 + 45 * 60 + 32); // Default to roughly 8h for initial render

  useEffect(() => {
    // Reset timer to 24h cycle
    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);
    
    const calculateTimeLeft = () => {
      const diff = Math.floor((endOfDay.getTime() - new Date().getTime()) / 1000);
      return diff > 0 ? diff : 0;
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const time = formatTime(timeLeft);

  // Filter and join daily deals with product data
  const dealProducts = dailyDeals
    .filter(deal => deal.active)
    .map(deal => {
      const product = products.find(p => p.id === deal.productId);
      return product ? { ...product, dealId: deal.id } : null;
    })
    .filter(Boolean); // Removed limit to allow unlimited horizontal scrolling

  if (dealProducts.length === 0) return null;

  return (
    <section className="py-8 sm:py-12 reveal-fade-up">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-row items-center justify-between gap-2 mb-6 sm:mb-8">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <h2 className="text-lg sm:text-3xl font-semibold text-gray-900 leading-tight">Deals of the Day</h2>
            <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500 fill-yellow-500 shrink-0" />
          </div>

          <div className="flex items-center gap-2 sm:gap-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="hidden xs:inline text-[10px] sm:text-xs uppercase tracking-widest text-gray-400">Ends in</span>
              <div className="flex items-center gap-1 sm:gap-2">
                {[time.h, time.m, time.s].map((val, i) => (
                  <div key={i} className="flex items-center gap-1 sm:gap-2">
                    <div className="bg-gray-100 text-black font-bold px-1 sm:px-2 py-0.5 sm:py-1 rounded text-sm sm:text-lg min-w-[24px] sm:min-w-[32px] text-center border border-gray-200">
                      {val}
                    </div>
                    {i < 2 && <span className="text-black font-bold text-xs sm:text-base">:</span>}
                  </div>
                ))}
              </div>
            </div>
            <Link 
              href="/products" 
              className="hidden sm:flex items-center gap-1 text-[var(--color-primary)] font-medium text-sm"
            >
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>

        {/* Products Scroll Container */}
        <div className="flex gap-3 sm:gap-6 overflow-x-auto no-scrollbar pb-6 -mx-2.5 sm:mx-0 px-2.5 sm:px-0">
          {dealProducts.map((product: any) => {
            const discount = 20; 
            return (
              <Link 
                key={product.id} 
                href={`/products/${product.id}`}
                className="w-[160px] sm:w-[220px] lg:w-[calc((100%-96px)/5)] bg-white border border-gray-100 rounded-[20px] overflow-hidden transition-all duration-300 group flex flex-col h-full shrink-0 hover:-translate-y-1 hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.08)]"
              >
                {/* Image Section */}
                <div className="relative aspect-square bg-[#fafafa] flex items-center justify-center p-3 sm:p-4">
                  <div className="absolute top-2.5 left-2.5 bg-[#ff8c00] text-black text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full z-10 shadow-sm uppercase tracking-wider">
                    {discount}% OFF
                  </div>
                  <Image
                    src={product.image ? getProductImageUrl(product.image, 'card') : `https://placehold.co/400x400/f3f4f6/9ca3af?text=${encodeURIComponent(product.brand)}`}
                    alt={product.name}
                    fill
                    className="object-contain p-3 group-hover:scale-[1.05] transition-transform duration-500 mix-blend-multiply"
                    sizes="(max-width: 640px) 160px, (max-width: 1024px) 220px, 20vw"
                    referrerPolicy="no-referrer"
                    unoptimized={product.image?.includes('amazon') || product.image?.includes('media-amazon')}
                  />
                </div>

                {/* Content Section */}
                <div className="p-3 sm:p-5 flex flex-col flex-grow bg-white z-10">
                  <div className="text-[10px] sm:text-xs text-[var(--color-primary)] font-bold tracking-[0.18em] uppercase mb-1">
                    {product.brand}
                  </div>
                  <h3 className="text-sm sm:text-[1.05rem] font-semibold text-[var(--color-text)] mb-3 line-clamp-2 leading-tight group-hover:text-[var(--color-primary)] transition-colors min-h-[2.5rem] sm:min-h-[2.8rem]">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-end justify-between border-t border-[var(--color-border)] pt-3 mt-auto">
                    <div>
                      <div className="font-extrabold text-base sm:text-lg text-black leading-none mb-1">
                        ₹{product.price.toLocaleString()}
                      </div>
                      <div className="text-[11px] sm:text-xs text-gray-400 line-through">
                        ₹{(product.price * 1.2).toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="bg-gray-100 text-black hover:bg-black hover:text-white h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center transition-all duration-500 shadow-sm border border-gray-200">
                      <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="w-full text-center py-2.5 sm:py-3 rounded-xl bg-black text-white text-[11px] sm:text-xs font-bold hover:bg-gray-900 transition-colors">
                      Shop Now
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
