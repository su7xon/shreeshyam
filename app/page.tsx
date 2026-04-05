'use client';

import Image from 'next/image';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { products as defaultProducts, brands } from '@/lib/data';
import useAdminStore from '@/lib/admin-store';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const renderBrandLogo = (brand: string) => {
  switch (brand) {
    case 'Apple':
      return <Image src="https://cdn.simpleicons.org/apple/333333" alt="Apple" width={28} height={28} className="h-7 w-auto drop-shadow-sm" unoptimized />;
    case 'Samsung':
      return <Image src="https://cdn.simpleicons.org/samsung/1428A0" alt="Samsung" width={90} height={24} className="h-[18px] sm:h-5 w-auto select-none" unoptimized />;
    case 'Google':
      return (
        <div className="flex items-center select-none font-bold text-[22px] tracking-[-0.03em] font-sans">
          <span className="text-[#4285F4]">G</span>
          <span className="text-[#EA4335]">o</span>
          <span className="text-[#FBBC05]">o</span>
          <span className="text-[#4285F4]">g</span>
          <span className="text-[#34A853]">l</span>
          <span className="text-[#EA4335]">e</span>
        </div>
      );
    case 'OnePlus':
      return (
        <div className="flex items-center gap-1.5 select-none text-gray-900">
          <Image src="https://cdn.simpleicons.org/oneplus/F5010C" alt="OnePlus" width={24} height={24} className="h-[22px] w-auto drop-shadow-sm" unoptimized />
          <span className="font-semibold tracking-tight text-[17px] mt-[1px]">OnePlus</span>
        </div>
      );
    case 'Xiaomi':
      return (
        <div className="flex items-center gap-2 select-none text-gray-800">
          <Image src="https://cdn.simpleicons.org/xiaomi/FF6900" alt="Xiaomi" width={24} height={24} className="h-6 w-auto rounded-[6px] drop-shadow-sm" unoptimized />
          <span className="font-bold tracking-tight text-[17px]">Xiaomi</span>
        </div>
      );
    case 'Nothing':
      return <Image src="https://cdn.simpleicons.org/nothing/000000" alt="Nothing" width={90} height={24} className="h-[14px] sm:h-4 w-auto opacity-90 select-none" unoptimized />;
    case 'Vivo':
      return <Image src="https://cdn.simpleicons.org/vivo/0D152A" alt="Vivo" width={70} height={24} className="h-[18px] sm:h-5 w-auto select-none" unoptimized />;
    case 'Realme':
      return <Image src="https://cdn.simpleicons.org/realme/FFC915" alt="Realme" width={80} height={24} className="h-[14px] sm:h-4 w-auto select-none" unoptimized />;
    case 'Motorola':
      return (
        <div className="flex items-center gap-2 select-none text-gray-800 tracking-tight">
          <Image src="https://cdn.simpleicons.org/motorola/001489" alt="Motorola" width={24} height={24} className="h-[22px] w-auto" unoptimized />
          <span className="font-semibold text-[17px]">motorola</span>
        </div>
      );
    case 'iQOO':
      return <Image src="https://cdn.simpleicons.org/iqoo/EBB426" alt="iQOO" width={60} height={24} className="h-[18px] sm:h-5 w-auto select-none" unoptimized />;
    case 'Poco':
      return <Image src="https://cdn.simpleicons.org/poco/000000" alt="Poco" width={60} height={24} className="h-[14px] sm:h-4 w-auto opacity-90 select-none" unoptimized />;
    case 'Oppo':
      return <Image src="https://cdn.simpleicons.org/oppo/2C5940" alt="Oppo" width={70} height={24} className="h-[14px] sm:h-4 w-auto select-none" unoptimized />;
    default:
      return <span className="font-bold text-gray-600 text-sm tracking-wide">{brand}</span>;
  }
};

export default function Home() {
  const admin = useAdminStore();
  const products = admin.products.length > 0 ? admin.products : defaultProducts;
  const banners = admin.banners.filter((b) => b.active).sort((a, b) => a.order - b.order);
  const featuredProducts = products.filter((p) => p.featured).slice(0, 8);
  const scrollingBrands = [...brands, ...brands];
  const [currentBanner, setCurrentBanner] = useState(0);

  const nextBanner = () => {
    if (banners.length > 1) {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }
  };

  const prevBanner = () => {
    if (banners.length > 1) {
      setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Banner Carousel */}
      <section className="relative pt-3 sm:pt-4 pb-6 sm:pb-8 px-2.5 sm:px-6 lg:px-8">
        <div className="max-w-[82rem] mx-auto relative">
          {banners.length > 0 ? (
            <div className="relative">
              {/* Banner Cards */}
              <div className="overflow-hidden rounded-[1.25rem] sm:rounded-[2rem]">
                {banners.map((banner, index) => (
                  <div
                    key={banner.id}
                    className={`transition-all duration-700 ease-in-out ${
                      index === currentBanner ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'
                    }`}
                  >
                    <div className="bg-gradient-to-br from-[#211c17] via-[#2a241f] to-[#17130f] pt-6 pb-8 sm:pt-10 sm:pb-12 px-3.5 sm:px-6 lg:px-8 relative overflow-hidden">
                      <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_16%_20%,#d4b78a_0%,transparent_25%),radial-gradient(circle_at_88%_50%,#a37949_0%,transparent_32%)] pointer-events-none" />

                      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center relative z-10 gap-5 sm:gap-6 lg:gap-10">
                        <div className="flex-1">
                          {banner.subtitle && (
                            <p className="text-[#b78b57] text-sm sm:text-base font-medium mb-2">{banner.subtitle}</p>
                          )}
                          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                            {banner.title}
                          </h2>
                          {banner.link && (
                            <Link
                              href={banner.link}
                              className="inline-block mt-5 px-6 py-3 bg-[#b78b57] hover:bg-[#d4a76a] text-white font-semibold rounded-xl transition-colors shadow-lg"
                            >
                              Shop Now →
                            </Link>
                          )}
                        </div>
                        <div className="flex-1 w-full relative h-[220px] sm:h-[300px] md:h-[330px] lg:h-[380px]">
                          {/* @ts-ignore */}
                          <Image
                            src={banner.image}
                            alt={banner.title}
                            fill
                            className="object-contain object-center drop-shadow-2xl"
                            priority={index === 0}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Arrows */}
              {banners.length > 1 && (
                <>
                  <button
                    onClick={prevBanner}
                    className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 h-10 w-10 sm:h-12 sm:w-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all z-20"
                    aria-label="Previous banner"
                  >
                    <ChevronLeft className="h-6 w-6 text-[#1a1a2e]" />
                  </button>
                  <button
                    onClick={nextBanner}
                    className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 h-10 w-10 sm:h-12 sm:w-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all z-20"
                    aria-label="Next banner"
                  >
                    <ChevronRight className="h-6 w-6 text-[#1a1a2e]" />
                  </button>

                  {/* Dots Indicator */}
                  <div className="flex items-center justify-center gap-2 mt-4">
                    {banners.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentBanner(index)}
                        className={`h-2 rounded-full transition-all ${
                          index === currentBanner ? 'w-8 bg-[#b78b57]' : 'w-2 bg-gray-300 hover:bg-gray-400'
                        }`}
                        aria-label={`Go to banner ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            // Fallback when no banners configured
            <div className="bg-gradient-to-br from-[#211c17] via-[#2a241f] to-[#17130f] pt-6 pb-8 sm:pt-10 sm:pb-12 px-3.5 sm:px-6 lg:px-8 relative rounded-[1.25rem] sm:rounded-[2rem] overflow-hidden">
              <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_16%_20%,#d4b78a_0%,transparent_25%),radial-gradient(circle_at_88%_50%,#a37949_0%,transparent_32%)] pointer-events-none" />

              <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center relative z-10 gap-5 sm:gap-6 lg:gap-10">
                <div className="flex-1"></div>
                <div className="flex-1 w-full relative h-[220px] sm:h-[300px] md:h-[330px] lg:h-[380px]">
                  {/* @ts-ignore */}
                  <Image
                    src="/samsung-s25-hero-2.jpeg"
                    alt="Samsung Galaxy S25 Ultra"
                    fill
                    className="object-cover object-center rounded-xl sm:rounded-2xl shadow-2xl"
                    priority
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Top Brands - Clean Visual Logos */}
      <section className="py-8 sm:py-12 bg-gradient-to-b from-[#fdfaf5] to-[#f6efe6]">
        <div className="max-w-[75rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-5 sm:mb-8">
            <h2 className="text-xl sm:text-3xl font-semibold text-[var(--color-text)]">Shop by Brand</h2>
          </div>
          <div className="brand-marquee-mask">
            <div className="brand-marquee-track">
              {scrollingBrands.map((brand, index) => (
              <Link 
                key={`${brand}-${index}`}
                href={`/products?brand=${brand}`}
                className="bg-white rounded-[14px] sm:rounded-[18px] h-[3.6rem] sm:h-[4.5rem] w-[10rem] sm:w-[11.5rem] shrink-0 flex items-center justify-center p-2.5 sm:p-3 shadow-[0_2px_12px_-4px_rgb(0,0,0,0.06)] hover:shadow-[0_8px_20px_-4px_rgb(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1 hover:border-[#3B82F6]/20 border border-transparent"
              >
                <div className="opacity-[0.85] hover:opacity-100 transition-opacity flex items-center justify-center w-full h-full">
                  {renderBrandLogo(brand)}
                </div>
              </Link>
            ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-5 sm:mb-8">
            <h2 className="text-xl sm:text-3xl font-semibold text-[var(--color-text)]">Featured Smartphones</h2>
            <Link href="/products" className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium flex items-center text-sm">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}