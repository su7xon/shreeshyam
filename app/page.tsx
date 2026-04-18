'use client';

import Image from 'next/image';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { products as defaultProducts, brands } from '@/lib/data';
import useAdminStore from '@/lib/admin-store';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState, Suspense, useRef } from 'react';
import { ProductSkeleton, BannerSkeleton, CategorySkeleton, TestimonialSkeleton } from '@/components/SkeletonLoader';
import CategoryStrip from '@/components/CategoryStrip';

const testimonials = [
  {
    name: 'Neha Sharma',
    text: 'Cover ki quality ekदम premium hai, phone pe fit bhi perfect aaya. Real me photos se bhi zyada classy lag raha hai.',
    initials: 'NS',
  },
  {
    name: 'Rohit Verma',
    text: 'Delivery kaafi fast thi aur finishing next level nikli. Next time bhi yahin se order karunga, no doubt.',
    initials: 'RV',
  },
  {
    name: 'Priya Nair',
    text: 'Finally aisa design mila jo unique feel deta hai. Generic look se totally alag aur stylish hai.',
    initials: 'PN',
  },
  {
    name: 'Aman Singh',
    text: 'Support team ka response mast tha aur styling bhi top notch. Pura buying experience smooth aur premium laga.',
    initials: 'AS',
  },
];

const renderBrandLogo = (brandObj: any | string) => {
  const name = typeof brandObj === 'string' ? brandObj : brandObj.name;
  const logo = typeof brandObj === 'object' && brandObj.logo ? brandObj.logo : null;

  if (logo) {
    return <Image src={logo} alt={name} width={80} height={80} className="w-full h-full object-contain" unoptimized />;
  }

  switch (name) {
    case 'Apple':
      return <Image src="https://cdn.simpleicons.org/apple/333333" alt="Apple" width={48} height={48} className="w-3/4 h-3/4 object-contain drop-shadow-sm" unoptimized />;
    case 'Samsung':
      return <span className="font-extrabold text-[#1428A0] tracking-tighter text-[16px] sm:text-[18px] select-none">SAMSUNG</span>;
    case 'Google':
      return (
        <div className="flex items-center select-none font-bold text-[18px] sm:text-[20px] tracking-[-0.03em] font-sans">
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
        <div className="flex items-center gap-1 select-none text-gray-900">
          <Image src="https://cdn.simpleicons.org/oneplus/F5010C" alt="OnePlus" width={36} height={36} className="h-8 w-8 object-contain drop-shadow-sm" unoptimized />
          <span className="font-semibold tracking-tight text-[14px] sm:text-[16px]">OnePlus</span>
        </div>
      );
    case 'Xiaomi':
      return (
        <div className="flex items-center gap-1.5 select-none text-gray-800">
          <Image src="https://cdn.simpleicons.org/xiaomi/FF6900" alt="Xiaomi" width={36} height={36} className="h-8 w-8 object-contain rounded-[6px] drop-shadow-sm" unoptimized />
          <span className="font-bold tracking-tight text-[14px] sm:text-[16px]">Xiaomi</span>
        </div>
      );
    case 'Nothing':
      return <span className="font-black text-black tracking-[0.1em] text-[16px] sm:text-[18px] uppercase select-none">NOTHING</span>;
    case 'Vivo':
      return <span className="font-extrabold text-[#415FFF] tracking-tight text-[20px] sm:text-[22px] select-none">vivo</span>;
    case 'Realme':
      return <span className="font-bold text-[#FFC915] tracking-tight text-[18px] sm:text-[20px] select-none">realme</span>;
    case 'Motorola':
      return (
        <div className="flex items-center gap-1.5 select-none text-gray-800 tracking-tight">
          <Image src="https://cdn.simpleicons.org/motorola/001489" alt="Motorola" width={36} height={36} className="h-8 w-8 object-contain" unoptimized />
          <span className="font-semibold text-[14px] sm:text-[16px]">motorola</span>
        </div>
      );
    case 'iQOO':
      return <span className="font-extrabold text-black tracking-tighter text-[18px] sm:text-[20px] italic select-none">i<span className="text-[#EBB426]">QOO</span></span>;
    case 'Poco':
      return <span className="font-extrabold text-[#FED100] tracking-tight text-[18px] sm:text-[20px] select-none">POCO</span>;
    case 'Oppo':
      return <span className="font-extrabold text-[#007656] tracking-tighter text-[18px] sm:text-[20px] select-none">OPPO</span>;
    default:
      return <span className="font-bold text-gray-600 text-sm tracking-wide">{name}</span>;
  }
};

const resolveBannerHref = (link?: string) => {
  if (!link) return '/products';
  return link.trim() || '/products';
};

export default function Home() {
  const admin = useAdminStore();
  const isLoading = admin.isLoading;
  const products = admin.products.length > 0 ? admin.products : defaultProducts;
  const activeBanners = admin.banners.filter((b) => b.active);
  const heroBanners = activeBanners
    .filter((b) => (b.placement || 'hero') === 'hero')
    .sort((a, b) => a.order - b.order);
  const smallCardBanners = activeBanners
    .filter((b) => (b.placement || 'hero') === 'small-cards')
    .sort((a, b) => a.order - b.order)
    .slice(0, 3);
  const trendingBanner = activeBanners
    .filter((b) => (b.placement || 'hero') === 'trending')
    .sort((a, b) => a.order - b.order)[0];
  const beforeAboutBanner = activeBanners
    .filter((b) => (b.placement || 'hero') === 'before-about')
    .sort((a, b) => b.order - a.order)[0];
  const featuredProducts = products.filter((p) => p.featured).slice(0, 8);
  const trendingProducts = featuredProducts.length > 0 ? featuredProducts.slice(0, 5) : products.slice(0, 5);
  const newArrivals = [...products].slice(-10).reverse();
  const activeBrands = admin.brands.filter(b => b.active);
  const scrollingBrands = activeBrands.length > 0 ? [...activeBrands, ...activeBrands] : [];
  const scrollingTestimonials = [...testimonials, ...testimonials];
  const [currentBanner, setCurrentBanner] = useState(0);
  
  // Refs for manual scroll control
  const brandsRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const bannersRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    if (currentBanner >= heroBanners.length && heroBanners.length > 0) {
      setCurrentBanner(0);
    }
  }, [currentBanner, heroBanners.length]);

  const nextBanner = () => {
    if (heroBanners.length > 1) {
      setCurrentBanner((prev) => (prev + 1) % heroBanners.length);
    }
  };

  const prevBanner = () => {
    if (heroBanners.length > 1) {
      setCurrentBanner((prev) => (prev - 1 + heroBanners.length) % heroBanners.length);
    }
  };

  // Touch handlers for swipeability
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;
    
    if (distance > minSwipeDistance) {
      nextBanner();
    } else if (distance < -minSwipeDistance) {
      prevBanner();
    }
  };

  // Mouse drag handlers for marquee sections
  const handleMouseDown = (e: React.MouseEvent, ref: React.RefObject<HTMLDivElement | null>) => {
    if (!ref.current) return;
    isDragging.current = true;
    startX.current = e.pageX - ref.current.offsetLeft;
    scrollLeft.current = ref.current.scrollLeft;
    // Pause animation while dragging
    const track = ref.current.querySelector('[class*="marquee-track"]');
    if (track) {
      (track as HTMLElement).style.animationPlayState = 'paused';
    }
  };

  const handleMouseMove = (e: React.MouseEvent, ref: React.RefObject<HTMLDivElement | null>) => {
    if (!isDragging.current || !ref.current) return;
    e.preventDefault();
    const x = e.pageX - ref.current.offsetLeft;
    const walk = (x - startX.current) * 2; // Scroll speed multiplier
    ref.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleMouseUp = (ref: React.RefObject<HTMLDivElement | null>) => {
    isDragging.current = false;
    // Resume animation
    if (ref.current) {
      const track = ref.current.querySelector('[class*="marquee-track"]');
      if (track) {
        (track as HTMLElement).style.animationPlayState = 'running';
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Banner Carousel */}
      <section className="relative pt-2 sm:pt-4 pb-4 sm:pb-8 px-2 sm:px-6 lg:px-4 reveal-fade-up">
        <div className="max-w-[82rem] lg:max-w-none mx-auto relative">
          <Suspense fallback={<BannerSkeleton />}>
            {heroBanners.length > 0 ? (
            <div 
              className="relative touch-pan-y"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Banner Cards */}
              <div className="overflow-hidden relative min-h-[50vw] sm:min-h-0">
                {heroBanners.map((banner, index) => (
                  <div
                    key={banner.id}
                    className={`transition-all duration-700 ease-in-out ${
                      index === currentBanner ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'
                    }`}
                  >
                    <div className="relative w-full aspect-[16/9] sm:aspect-[21/8] bg-[#211c17] overflow-hidden">
                      {banner.image && (
                        <>
                          {banner.image && (
                            <Image
                              src={banner.image}
                              alt={banner.title}
                              fill
                              className="object-cover object-center"
                              priority={index === 0}
                              unoptimized
                            />
                          )}
                        </>
                      )}

                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Arrows */}
              {heroBanners.length > 1 && (
                <>
                  <button
                    onClick={prevBanner}
                    className="hidden sm:flex absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 h-10 w-10 sm:h-12 sm:w-12 bg-white/90 hover:bg-white rounded-full shadow-lg items-center justify-center transition-all z-20"
                    aria-label="Previous banner"
                  >
                    <ChevronLeft className="h-6 w-6 text-[#1a1a2e]" />
                  </button>
                  <button
                    onClick={nextBanner}
                    className="hidden sm:flex absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 h-10 w-10 sm:h-12 sm:w-12 bg-white/90 hover:bg-white rounded-full items-center justify-center transition-all z-20"
                    aria-label="Next banner"
                  >
                    <ChevronRight className="h-6 w-6 text-[#1a1a2e]" />
                  </button>

                  {/* Dots Indicator */}
                  <div className="flex items-center justify-center gap-2 mt-3 sm:mt-4">
                    {heroBanners.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentBanner(index)}
                        className={`h-2 rounded-full transition-all ${
                          index === currentBanner ? 'w-8 bg-black' : 'w-2 bg-gray-300 hover:bg-gray-400'
                        }`}
                        aria-label={`Go to banner ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            /* Default Hero — premium gradient, no admin banners needed */
            <div className="relative w-full aspect-[16/9] sm:aspect-[21/8] overflow-hidden rounded-none bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
              {/* Decorative blobs */}
              <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-red-600/20 to-transparent" />
              <div className="absolute -bottom-10 -left-10 w-72 h-72 rounded-full bg-red-600/10 blur-3xl" />
              <div className="absolute -top-10 right-1/3 w-56 h-56 rounded-full bg-white/5 blur-2xl" />
              {/* Content */}
              {/* Content removed by user request */}
              {/* Right side phone mockup decoration */}
              <div className="absolute right-4 sm:right-12 lg:right-20 top-1/2 -translate-y-1/2 opacity-20 sm:opacity-30 select-none pointer-events-none text-[120px] sm:text-[180px] lg:text-[220px] leading-none">📱</div>
            </div>
            )}
          </Suspense>
        </div>
      </section>

      {/* Category Icons Strip */}
      <CategoryStrip />
      <section className="pb-8 sm:pb-12 reveal-fade-up" style={{ animationDelay: '90ms' }}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mb-4 sm:mb-6">
          <h2 className="text-[18px] sm:text-2xl font-bold text-[var(--color-text)] tracking-tight">Watch Out For This</h2>
        </div>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <Suspense fallback={
            <div className="flex gap-3 sm:gap-5 overflow-hidden pb-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-[45vw] sm:w-[220px] shrink-0 aspect-[9/14] sm:aspect-[4/5]"><CategorySkeleton /></div>
              ))}
            </div>
          }>
            {(() => {
              const renderedBanners = smallCardBanners.length > 0
                ? smallCardBanners.map((banner) => (
                    <Link
                      key={banner.id}
                      href={resolveBannerHref(banner.link)}
                      className="group relative rounded-[14px] sm:rounded-[18px] overflow-hidden bg-[#121212] w-[45vw] sm:w-[220px] shrink-0 flex flex-col items-center aspect-[9/14] sm:aspect-[4/5] border border-gray-800"
                    >
                      {banner.image && (
                        <Image
                          src={banner.image}
                          alt={banner.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 50vw, 25vw"
                          unoptimized
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 pointer-events-none" />
                    </Link>
                  ))
                : (
                    <>
                      <Link href="/products?brand=Apple" className="group relative rounded-[14px] sm:rounded-[18px] overflow-hidden bg-black w-[42vw] sm:w-[220px] shrink-0 flex flex-col border border-gray-800 aspect-[9/14] sm:aspect-[4/5] text-center">
                        <div className="absolute -bottom-8 sm:-bottom-12 right-0 left-0 w-full flex justify-center opacity-60 group-hover:opacity-80 transition-opacity">
                          <div className="text-[110px] sm:text-[160px] drop-shadow-2xl">📱</div>
                        </div>
                      </Link>
                      
                      <Link href="/products?brand=Samsung" className="group relative rounded-[14px] sm:rounded-[18px] overflow-hidden bg-gradient-to-b from-[#bda3e2] to-[#7f5db0] w-[42vw] sm:w-[220px] shrink-0 flex flex-col border border-[#9b76cc] aspect-[9/14] sm:aspect-[4/5] text-center">
                        <div className="absolute -bottom-6 sm:-bottom-8 right-0 left-0 w-full flex justify-center opacity-90 group-hover:opacity-100 transition-transform group-hover:scale-105 duration-300">
                          <div className="text-[120px] sm:text-[170px] drop-shadow-2xl">🌌</div>
                        </div>
                      </Link>

                      <Link href="/accessories" className="group relative rounded-[14px] sm:rounded-[18px] overflow-hidden bg-[#0A0A0A] w-[42vw] sm:w-[220px] shrink-0 flex flex-col border border-gray-800 aspect-[9/14] sm:aspect-[4/5] text-center">
                        <div className="absolute -bottom-6 sm:-bottom-10 right-0 left-0 w-full flex justify-center opacity-50 group-hover:opacity-70 transition-opacity">
                          <div className="text-[110px] sm:text-[160px]">🎧</div>
                        </div>
                      </Link>
                      
                      <Link href="/products?brand=OnePlus" className="group relative rounded-[14px] sm:rounded-[18px] overflow-hidden bg-gradient-to-b from-[#cd1619] to-[#800709] w-[42vw] sm:w-[220px] shrink-0 flex flex-col border border-[#ff373a]/30 aspect-[9/14] sm:aspect-[4/5] text-center">
                        <div className="absolute -bottom-8 sm:-bottom-12 right-0 left-0 w-full flex justify-center opacity-80 group-hover:scale-105 transition-transform duration-300">
                          <div className="text-[120px] sm:text-[170px] drop-shadow-xl">🕹️</div>
                        </div>
                      </Link>
                    </>
                  );

              return (
                <div 
                  ref={bannersRef}
                  className="relative w-full overflow-x-auto overflow-y-hidden no-scrollbar pb-4 cursor-grab active:cursor-grabbing"
                  onMouseDown={(e) => handleMouseDown(e, bannersRef)}
                  onMouseMove={(e) => handleMouseMove(e, bannersRef)}
                  onMouseUp={() => handleMouseUp(bannersRef)}
                  onMouseLeave={() => handleMouseUp(bannersRef)}
                >
                  <div className="flex w-max animate-marquee gap-3 sm:gap-5">
                    {renderedBanners}
                    {renderedBanners}
                    {/* Render a third time to ensure it bridges perfectly on very wide screens */}
                    {renderedBanners}
                  </div>
                </div>
              );
            })()}
          </Suspense>
        </div>
      </section>

      {/* WhatsApp Floating Button (Homepage Only) */}
      <a 
        href="https://wa.me/917756935635" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-[90] bg-[#25D366] text-white p-2.5 sm:p-3 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all cursor-pointer flex items-center justify-center"
        aria-label="Chat on WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 sm:w-7 sm:h-7">
          <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
          <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
        </svg>
      </a>

      {/* Top Trending */}
      <section className="py-6 sm:py-12 reveal-fade-up" style={{ animationDelay: '140ms' }}>
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-5 sm:mb-8">
            <div>
              <p className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-1">Curated now</p>
              <h2 className="text-xl sm:text-3xl font-semibold text-[var(--color-text)]">What's Hot</h2>
            </div>
            <Link href="/products" className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium flex items-center text-sm">
              View All
            </Link>
          </div>
          {/* Trending Banner - horizontal on desktop, stacked on mobile */}
          <Link
            href={resolveBannerHref(trendingBanner?.link)}
            className="group relative overflow-hidden rounded-2xl border border-[var(--color-border)] block mb-4 sm:mb-6"
          >
            <div className="relative w-full aspect-[16/9] sm:aspect-[21/8]">
              {trendingBanner ? (
              <Image
                src={trendingBanner.image}
                alt={trendingBanner.title || 'Explore all smartphones'}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="100vw"
                priority
                unoptimized
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-text)] to-[var(--color-text-muted)]" />
            )}
              {/* Text content removed by user request */}
            </div>
          </Link>

          {/* Products Grid */}
          <Suspense fallback={
            <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6 overflow-x-auto sm:overflow-visible no-scrollbar -mx-2.5 sm:mx-0 px-2.5 sm:px-0 pb-2 sm:pb-0">
              {Array.from({length: 5}).map((_, i) => <div key={i} className="w-[160px] sm:w-auto shrink-0 sm:shrink"><ProductSkeleton /></div>)}
            </div>
          }>
          <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6 overflow-x-auto sm:overflow-visible no-scrollbar -mx-2.5 sm:mx-0 px-2.5 sm:px-0 pb-2 sm:pb-0">
            {trendingProducts.map((product) => (
              <div key={product.id} className="w-[160px] sm:w-auto shrink-0 sm:shrink">
                <ProductCard product={product} variant="editorial" />
              </div>
            ))}
          </div>
          </Suspense>
        </div>
      </section>

      {/* Top Brands - Clean Visual Logos */}
      {scrollingBrands.length > 0 && (
      <section className="py-7 sm:py-12 reveal-fade-up" style={{ animationDelay: '180ms' }}>
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-5 sm:mb-8">
            <h2 className="text-xl sm:text-3xl font-semibold text-[var(--color-text)]">Shop by Brand</h2>
          </div>
          <div 
            ref={brandsRef}
            className="brand-marquee-mask"
            onMouseDown={(e) => handleMouseDown(e, brandsRef)}
            onMouseMove={(e) => handleMouseMove(e, brandsRef)}
            onMouseUp={() => handleMouseUp(brandsRef)}
            onMouseLeave={() => handleMouseUp(brandsRef)}
          >
            <div className="brand-marquee-track">
              {scrollingBrands.map((brand, index) => (
              <Link 
                key={`${brand.id || brand.name || brand}-${index}`}
                href={`/products?brand=${brand.name || brand}`}
                className="bg-white rounded-[16px] sm:rounded-[20px] h-[6rem] sm:h-[7.5rem] w-[6rem] sm:w-[7.5rem] shrink-0 flex items-center justify-center p-3 sm:p-4 shadow-[0_2px_12px_-4px_rgb(0,0,0,0.06)] hover:shadow-[0_8px_20px_-4px_rgb(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1 hover:border-[#3B82F6]/20 border border-transparent overflow-hidden"
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
      )}

      {/* Brand Story */}
      <section className="py-6 sm:py-12 reveal-fade-up" style={{ animationDelay: '220ms' }}>
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-center">
            {beforeAboutBanner ? (
              <Link
                href={resolveBannerHref(beforeAboutBanner.link)}
                className="group relative min-h-[260px] sm:min-h-[320px] rounded-2xl overflow-hidden bg-[#efefef] border border-[var(--color-border)] block"
              >
                <Image
                  src={beforeAboutBanner.image}
                  alt={beforeAboutBanner.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  unoptimized
                />
              </Link>
            ) : (
              <div className="relative min-h-[260px] sm:min-h-[320px] rounded-2xl overflow-hidden bg-[var(--color-surface-soft)] border border-[var(--color-border)] flex items-center justify-center">
                <p className="text-sm sm:text-base text-[var(--color-text-muted)] font-medium">Add a banner in "Banner Before About Us"</p>
              </div>
            )}
            <div>
              <p className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-2">About us</p>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--color-text)] leading-tight">
                Built for people who want their phones to look as sharp as they perform.
              </h2>
              <p className="text-sm sm:text-base text-[var(--color-text-muted)] mt-4 leading-relaxed max-w-xl">
                We blend performance-first smartphones with expressive style. From flagship hardware to statement finishes,
                our catalog is curated for users who do not want boring tech.
              </p>
              <Link
                href="/products"
                className="inline-flex mt-6 px-5 py-2.5 text-sm font-semibold bg-black text-white rounded hover:bg-[#1f1f1f] transition-colors"
              >
                Browse Collection
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="pb-9 sm:pb-16 reveal-fade-up" style={{ animationDelay: '260ms' }}>
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-5 sm:mb-8">
            <div>
              <p className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-1">Just landed</p>
              <h2 className="text-xl sm:text-3xl font-semibold text-[var(--color-text)]">New Arrivals</h2>
            </div>
            <Link href="/products" className="text-xs sm:text-sm text-[var(--color-primary)] font-semibold hover:underline">
              Browse All Phones
            </Link>
          </div>

          <Suspense fallback={
            <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6 overflow-x-auto sm:overflow-visible no-scrollbar -mx-2.5 sm:mx-0 px-2.5 sm:px-0 pb-2 sm:pb-0">
              {Array.from({ length: 10 }).map((_, i) => <div key={i} className="w-[160px] sm:w-auto shrink-0 sm:shrink"><ProductSkeleton /></div>)}
            </div>
          }>
            <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6 overflow-x-auto sm:overflow-visible no-scrollbar -mx-2.5 sm:mx-0 px-2.5 sm:px-0 pb-2 sm:pb-0">
              {newArrivals.map((product) => (
                <div key={`all-${product.id}`} className="w-[160px] sm:w-auto shrink-0 sm:shrink">
                  <ProductCard product={product} variant="editorial" />
                </div>
              ))}
            </div>
          </Suspense>
        </div>
      </section>

      {/* Happy Customers */}
      <section className="py-8 sm:py-14 bg-[#f2f2f2] reveal-fade-up" style={{ animationDelay: '300ms' }}>
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-3xl font-semibold text-[var(--color-text)] mb-6 sm:mb-8 text-center">Happy Customers</h2>
          <Suspense fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <TestimonialSkeleton key={i} />
              ))}
            </div>
          }>
          <div 
            ref={testimonialsRef}
            className="testimonial-marquee-mask"
            onMouseDown={(e) => handleMouseDown(e, testimonialsRef)}
            onMouseMove={(e) => handleMouseMove(e, testimonialsRef)}
            onMouseUp={() => handleMouseUp(testimonialsRef)}
            onMouseLeave={() => handleMouseUp(testimonialsRef)}
          >
            <div className="testimonial-marquee-track">
              {scrollingTestimonials.map((item, index) => (
                <article key={`${item.name}-${index}`} className="bg-white border border-gray-200 rounded-xl p-4 w-[17rem] sm:w-[18rem] shrink-0">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white font-semibold text-sm">
                      {item.initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                      <p className="text-[11px] text-gray-500">Verified Buyer</p>
                    </div>
                  </div>
                  <p className="text-xs leading-relaxed text-gray-700">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
          </Suspense>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-9 sm:py-16 reveal-fade-up" style={{ animationDelay: '340ms' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-2">Offer zone</p>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--color-text)]">Get 10% Off Your Order</h2>
          <p className="text-sm text-[var(--color-text-muted)] mt-3">Sign up for updates and receive a launch-week coupon instantly.</p>
          <form className="mt-6 flex flex-col sm:flex-row items-stretch gap-2 sm:gap-0 max-w-xl mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 h-11 px-4 border border-gray-300 rounded-md sm:rounded-r-none focus:outline-none"
            />
            <button
              type="button"
              className="h-11 px-5 bg-black text-white text-sm font-semibold rounded-md sm:rounded-l-none hover:bg-[#1f1f1f] transition-colors"
            >
              Join Now
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}