'use client';

import Image from 'next/image';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { products as defaultProducts, brands } from '@/lib/data';
import useAdminStore from '@/lib/admin-store';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState, Suspense } from 'react';
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
    return <Image src={logo} alt={name} width={40} height={40} className="max-h-8 max-w-[100px] sm:max-h-10 sm:max-w-[120px] object-contain drop-shadow-sm" unoptimized />;
  }

  switch (name) {
    case 'Apple':
      return <Image src="https://cdn.simpleicons.org/apple/333333" alt="Apple" width={32} height={32} className="h-7 sm:h-8 w-auto drop-shadow-sm" unoptimized />;
    case 'Samsung':
      return <span className="font-extrabold text-[#1428A0] tracking-tighter text-[20px] sm:text-[24px] select-none">SAMSUNG</span>;
    case 'Google':
      return (
        <div className="flex items-center select-none font-bold text-[22px] sm:text-[24px] tracking-[-0.03em] font-sans">
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
          <Image src="https://cdn.simpleicons.org/oneplus/F5010C" alt="OnePlus" width={28} height={28} className="h-6 sm:h-7 w-auto drop-shadow-sm" unoptimized />
          <span className="font-semibold tracking-tight text-[18px] sm:text-[20px] mt-[1px]">OnePlus</span>
        </div>
      );
    case 'Xiaomi':
      return (
        <div className="flex items-center gap-2 select-none text-gray-800">
          <Image src="https://cdn.simpleicons.org/xiaomi/FF6900" alt="Xiaomi" width={28} height={28} className="h-6 sm:h-7 w-auto rounded-[6px] drop-shadow-sm" unoptimized />
          <span className="font-bold tracking-tight text-[18px] sm:text-[20px]">Xiaomi</span>
        </div>
      );
    case 'Nothing':
      return <span className="font-black text-black tracking-[0.1em] text-[20px] sm:text-[22px] uppercase select-none">NOTHING</span>;
    case 'Vivo':
      return <span className="font-extrabold text-[#415FFF] tracking-tight text-[26px] sm:text-[28px] select-none">vivo</span>;
    case 'Realme':
      return <span className="font-bold text-[#FFC915] tracking-tight text-[22px] sm:text-[24px] select-none">realme</span>;
    case 'Motorola':
      return (
        <div className="flex items-center gap-2 select-none text-gray-800 tracking-tight">
          <Image src="https://cdn.simpleicons.org/motorola/001489" alt="Motorola" width={28} height={28} className="h-6 sm:h-7 w-auto" unoptimized />
          <span className="font-semibold text-[18px] sm:text-[20px]">motorola</span>
        </div>
      );
    case 'iQOO':
      return <span className="font-extrabold text-black tracking-tighter text-[24px] sm:text-[28px] italic select-none">i<span className="text-[#EBB426]">QOO</span></span>;
    case 'Poco':
      return <span className="font-extrabold text-[#FED100] tracking-tight text-[22px] sm:text-[26px] select-none">POCO</span>;
    case 'Oppo':
      return <span className="font-extrabold text-[#007656] tracking-tighter text-[24px] sm:text-[26px] select-none">OPPO</span>;
    default:
      return <span className="font-bold text-gray-600 text-lg tracking-wide">{name}</span>;
  }
};

const resolveBannerHref = (link?: string) => {
  if (!link) return '/products';
  return link.trim() || '/products';
};

export default function Home() {
  const admin = useAdminStore();
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

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Banner Carousel */}
      <section className="relative pt-2 sm:pt-4 pb-4 sm:pb-8 px-2 sm:px-6 lg:px-4 reveal-fade-up">
        <div className="max-w-[82rem] lg:max-w-none mx-auto relative">
          <Suspense fallback={<BannerSkeleton />}>
            {heroBanners.length > 0 ? (
            <div className="relative">
              {/* Banner Cards */}
              <div className="overflow-hidden">
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
            <div className="relative w-full aspect-[16/9] sm:aspect-[21/8] overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
              {/* Decorative blobs */}
              <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-red-600/20 to-transparent" />
              <div className="absolute -bottom-10 -left-10 w-72 h-72 rounded-full bg-red-600/10 blur-3xl" />
              <div className="absolute -top-10 right-1/3 w-56 h-56 rounded-full bg-white/5 blur-2xl" />
              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 lg:px-16">
                <p className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-red-400 font-semibold mb-2 sm:mb-3">Premium Collection 2025</p>
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-2 sm:mb-4 max-w-lg">
                  The Best Phones.<br />
                  <span className="text-red-400">Best Prices.</span>
                </h1>
                <p className="text-sm sm:text-base text-gray-300 max-w-sm mb-5 sm:mb-7 hidden sm:block">
                  Explore the latest smartphones from Apple, Samsung, OnePlus & more — all at unbeatable prices.
                </p>
                <div className="flex items-center gap-3">
                  <Link href="/products" className="inline-flex items-center gap-2 bg-white text-gray-900 hover:bg-gray-100 font-bold px-5 py-2.5 rounded-full text-sm transition-all hover:scale-105 shadow-lg">
                    Shop Now
                  </Link>
                  <Link href="/accessories" className="inline-flex items-center gap-2 border border-white/30 text-white hover:bg-white/10 font-medium px-5 py-2.5 rounded-full text-sm transition-all">
                    Accessories
                  </Link>
                </div>
              </div>
              {/* Right side phone mockup decoration */}
              <div className="absolute right-4 sm:right-12 lg:right-20 top-1/2 -translate-y-1/2 opacity-20 sm:opacity-30 select-none pointer-events-none text-[120px] sm:text-[180px] lg:text-[220px] leading-none">📱</div>
            </div>
            )}
          </Suspense>
        </div>
      </section>

      {/* Category Icons Strip */}
      <CategoryStrip />
      <section className="pb-6 sm:pb-12 px-2 sm:px-6 lg:px-8 reveal-fade-up" style={{ animationDelay: '90ms' }}>
        <Suspense fallback={
          <div className="max-w-7xl mx-auto md:grid md:grid-cols-3 md:gap-5 flex md:block gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <CategorySkeleton key={i} />
            ))}
          </div>
        }>
        <div className="max-w-7xl mx-auto md:grid md:grid-cols-3 md:gap-5 flex md:block gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-1">
          {smallCardBanners.length > 0
            ? smallCardBanners.map((banner) => (
                <Link
                  key={banner.id}
                  href={resolveBannerHref(banner.link)}
                  className="group relative min-h-[180px] sm:min-h-[220px] rounded-xl overflow-hidden bg-white border border-[var(--color-border)] min-w-[82%] sm:min-w-[72%] md:min-w-0 snap-start"
                >
                  <Image
                    src={banner.image}
                    alt={banner.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 z-10 p-4 sm:p-5 text-white">
                    <h3 className="text-xl sm:text-2xl font-extrabold leading-tight">{banner.title}</h3>
                    {banner.subtitle && <p className="text-xs sm:text-sm text-white/90 mt-1">{banner.subtitle}</p>}
                  </div>
                </Link>
              ))
            : smallCardBanners.length === 0 && (
                /* Default promo cards — show even without admin banners */
                <>
                  <Link href="/products?brand=Apple" className="group relative min-h-[180px] sm:min-h-[220px] rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-700 min-w-[82%] sm:min-w-[72%] md:min-w-0 snap-start flex flex-col justify-end p-5 sm:p-6 border border-gray-200">
                    <div className="absolute top-4 right-4 text-5xl sm:text-6xl opacity-25 select-none">🍎</div>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Featured</p>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">iPhone Series</h3>
                    <p className="text-xs text-gray-400 mt-1">Explore all Apple iPhones →</p>
                  </Link>
                  <Link href="/products?brand=Samsung" className="group relative min-h-[180px] sm:min-h-[220px] rounded-xl overflow-hidden bg-gradient-to-br from-[#1428A0] to-[#0a1670] min-w-[82%] sm:min-w-[72%] md:min-w-0 snap-start flex flex-col justify-end p-5 sm:p-6">
                    <div className="absolute top-4 right-4 text-5xl sm:text-6xl opacity-20 select-none">🌌</div>
                    <p className="text-[10px] uppercase tracking-widest text-blue-300 mb-1">Galaxy</p>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">Samsung Galaxy</h3>
                    <p className="text-xs text-blue-300 mt-1">AI-powered flagship phones →</p>
                  </Link>
                  <Link href="/accessories" className="group relative min-h-[180px] sm:min-h-[220px] rounded-xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 min-w-[82%] sm:min-w-[72%] md:min-w-0 snap-start flex flex-col justify-end p-5 sm:p-6">
                    <div className="absolute top-4 right-4 text-5xl sm:text-6xl opacity-25 select-none">🎧</div>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">New</p>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">Accessories</h3>
                    <p className="text-xs text-gray-400 mt-1">Earbuds, chargers & more →</p>
                  </Link>
                </>
              )}
        </div>
        </Suspense>
      </section>

      {/* Top Brands - Clean Visual Logos */}
      {scrollingBrands.length > 0 && (
      <section className="py-7 sm:py-12 reveal-fade-up" style={{ animationDelay: '140ms' }}>
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-5 sm:mb-8">
            <h2 className="text-xl sm:text-3xl font-semibold text-[var(--color-text)]">Shop by Brand</h2>
          </div>
          <div className="brand-marquee-mask">
            <div className="brand-marquee-track">
              {scrollingBrands.map((brand, index) => (
              <Link 
                key={`${brand.id || brand.name || brand}-${index}`}
                href={`/products?brand=${brand.name || brand}`}
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
      )}

      {/* Top Trending */}
      <section className="py-6 sm:py-12 reveal-fade-up" style={{ animationDelay: '180ms' }}>
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
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
              <div className="absolute inset-y-0 left-0 flex flex-col justify-end p-4 sm:p-6 lg:p-8 text-white max-w-xl">
                <p className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-black mb-1">Drop Of The Week</p>
                <h3 className="text-lg sm:text-2xl lg:text-3xl font-bold leading-tight">
                  {trendingBanner?.title || 'Define Yourself. Be Different.'}
                </h3>
                <p className="text-xs sm:text-sm mt-1 text-white/90">
                  {trendingBanner?.subtitle || 'Explore standout designs and flagship phones'}
                </p>
              </div>
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
          <div className="testimonial-marquee-mask">
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