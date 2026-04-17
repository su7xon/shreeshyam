'use client';

import { use, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Star, ShoppingCart, ShieldCheck, Truck, RotateCcw, Check, Zap, ChevronRight, Heart, Share2, CreditCard, Percent, Gift, ChevronDown, ChevronUp } from 'lucide-react';
import { products as defaultProducts } from '@/lib/data';
import { useCartStore } from '@/lib/store';
import useAdminStore from '@/lib/admin-store';
import { ProductDetailSkeleton } from '@/components/SkeletonLoader';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const admin = useAdminStore();
  const products = admin.products.length > 0 ? admin.products : defaultProducts;
  const directMatch = products.find((p) => p.id === id);
  const numericIndex = Number.parseInt(id, 10);
  const indexMatch = Number.isFinite(numericIndex) && numericIndex > 0
    ? products[numericIndex - 1]
    : undefined;
  const product = directMatch ?? indexMatch;
  const { addItem } = useCartStore();
  const [added, setAdded] = useState(false);
  const [selectedThumb, setSelectedThumb] = useState(0);
  const [showAllSpecs, setShowAllSpecs] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading for better UX
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    notFound();
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleShare = async () => {
    const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/products/${product.id}`;
    const shareData = {
      title: product.name,
      text: `Check out ${product.name} on श्री श्याम Mobiles`,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          copyToClipboard(shareUrl);
        }
      }
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = (text: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        alert('Link copied to clipboard!');
      }).catch(() => {
        fallbackCopy(text);
      });
    } else {
      fallbackCopy(text);
    }
  };

  const fallbackCopy = (text: string) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      alert('Link copied to clipboard!');
    } catch (err) {
      prompt('Copy this link:', text);
    }
    document.body.removeChild(textarea);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const savings = product.originalPrice ? product.originalPrice - product.price : 0;

  // Generate thumbnail variations (simulating multiple angles)
  const thumbnails = ('images' in product && Array.isArray(product.images) && (product.images as string[]).length > 0)
    ? product.images as string[]
    : [product.image, `${product.image}?v=2`, `${product.image}?v=3`, `${product.image}?v=4`];

  // EMI calculation (approx 12 months)
  const emiPerMonth = Math.round(product.price / 12);

  // Related products (all other products)
  const relatedProducts = products.filter(p => p.id !== product.id);

  // Colors
  const colors = ('colors' in product && Array.isArray(product.colors)) ? product.colors as string[] : [];

  // Offers from admin store
  const adminOffers = admin.offers.filter((o) => o.active);

  const specs = [
    { label: 'RAM', value: product.ram },
    { label: 'Internal Storage', value: product.storage },
    { label: 'Processor', value: product.processor },
    { label: 'Display', value: product.display },
    { label: 'Rear Camera', value: product.camera },
    { label: 'Battery', value: product.battery },
    { label: 'Brand', value: product.brand },
  ];

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

          {/* LEFT: Image Gallery — Croma style with vertical thumbnails */}
          <div className="w-full lg:w-[45%]">
            <div className="lg:sticky lg:top-20">
              <div className="flex flex-row gap-3">
                {/* Vertical Thumbnails */}
                <div className="hidden sm:flex flex-col gap-2 w-16 flex-shrink-0">
                  {thumbnails.map((thumb, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedThumb(i)}
                      className={`w-16 h-16 rounded-lg border-2 overflow-hidden flex items-center justify-center bg-gray-50 transition-all ${
                        selectedThumb === i
                          ? 'border-blue-600 shadow-md'
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      {/* @ts-ignore React 19 type mismatch */}
                      <Image
                        src={thumb}
                        alt={`${product.name} view ${i + 1}`}
                        width={56}
                        height={56}
                        className="object-contain p-1"
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  ))}
                </div>

                {/* Main Image */}
                <div className="flex-1 relative">
                  <div className="relative aspect-square bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
                    {discount > 0 && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
                        {discount}% OFF
                      </div>
                    )}
                    {/* Action buttons — top right */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
                      <button className="bg-white border border-gray-200 rounded-full p-2 hover:bg-gray-50 shadow-sm transition-colors" aria-label="Wishlist">
                        <Heart className="h-4 w-4 text-gray-500" />
                      </button>
                      <button onClick={handleShare} className="bg-white border border-gray-200 rounded-full p-2 hover:bg-gray-50 shadow-sm transition-colors" aria-label="Share">
                        <Share2 className="h-4 w-4 text-gray-500" />
                      </button>
                    </div>
                    {/* @ts-ignore React 19 type mismatch */}
                    <Image
                      src={thumbnails[selectedThumb]}
                      alt={product.name}
                      fill
                      className="object-contain p-6 sm:p-10"
                      priority
                      sizes="(max-width: 768px) 100vw, 45vw"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Mobile horizontal thumbnails */}
                  <div className="flex sm:hidden gap-2 mt-3 overflow-x-auto pb-2">
                    {thumbnails.map((thumb, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedThumb(i)}
                        className={`w-14 h-14 rounded-lg border-2 overflow-hidden flex-shrink-0 flex items-center justify-center bg-gray-50 ${
                          selectedThumb === i ? 'border-blue-600' : 'border-gray-200'
                        }`}
                      >
                        {/* @ts-ignore React 19 type mismatch */}
                        <Image src={thumb} alt="" width={48} height={48} className="object-contain p-1" referrerPolicy="no-referrer" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Product Info — Croma style */}
          <div className="w-full lg:w-[55%]">
            {/* Product Title */}
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 leading-tight mb-2">
              {product.name} ({product.ram} RAM, {product.storage})
            </h1>

            {/* Price Block — Croma style */}
            <div className="mb-5">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-2xl sm:text-3xl font-extrabold text-gray-900">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-sm text-gray-400 line-through">MRP: {formatPrice(product.originalPrice)}</span>
                    <span className="text-sm font-semibold text-green-600">(Save {formatPrice(savings)}, {discount}% off)</span>
                  </>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">(Incl. all Taxes)</p>
            </div>

            {/* EMI Option — Croma style */}
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 mb-5">
              <CreditCard className="h-4 w-4 text-gray-500 flex-shrink-0" />
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">OR</span>
                <span className="font-bold text-gray-900">{formatPrice(emiPerMonth)}/mo*</span>
                <Link href="#" className="text-blue-600 text-xs hover:underline">EMI Options</Link>
              </div>
            </div>

            {/* RAM Selector — Croma style bordered pills */}
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">RAM</h3>
              <div className="flex flex-wrap gap-2">
                <button className="px-4 py-2 rounded-lg border-2 border-gray-900 bg-gray-900 text-white text-sm font-medium">
                  {product.ram}
                </button>
              </div>
            </div>

            {/* Storage Selector — Croma style bordered pills */}
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Internal Storage</h3>
              <div className="flex flex-wrap gap-2">
                <button className="px-4 py-2 rounded-lg border-2 border-gray-900 bg-gray-900 text-white text-sm font-medium">
                  {product.storage}
                </button>
              </div>
            </div>

            {/* Color Selector */}
            {colors.length > 0 && (
              <div className="mb-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  Color: <span className="font-normal text-gray-600">{colors[selectedColor]}</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color, index) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(index)}
                      className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                        selectedColor === index
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-row gap-2 sm:gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={added}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 sm:px-6 rounded-lg font-bold text-[13px] sm:text-base transition-all ${
                  added
                    ? 'bg-green-500 text-white'
                    : 'bg-black text-white hover:bg-gray-800 transition-all'
                }`}
                suppressHydrationWarning
              >
                {added ? (
                  <><Check className="h-4 w-4 sm:h-5 sm:w-5" /> Added</>
                ) : (
                  <><ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" /> Add to Cart</>
                )}
              </button>
              <Link
                href="/checkout"
                onClick={() => { if (!added) addItem(product); }}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-2 sm:px-6 rounded-lg font-bold text-[13px] sm:text-base bg-[#F7E493] text-[#453008] hover:bg-[#f0d87a] transition-all"
                suppressHydrationWarning
              >
                <Zap className="h-4 w-4 sm:h-5 sm:w-5 fill-current" /> Buy Now
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-2 lg:mt-8">
          {/* Super Savings / Bank Offers — full width to avoid empty left column space */}
          {adminOffers.length > 0 && (
            <div className="border border-gray-200 rounded-lg mb-6">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h3 className="text-sm font-bold text-gray-900">Super Savings ({adminOffers.length} OFFERS)</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {adminOffers.map((offer) => (
                  <div key={offer.id} className="flex items-start gap-3 px-4 py-3">
                    <div className="bg-red-50 p-1.5 rounded-full flex-shrink-0 mt-0.5">
                      <span className="text-sm">{offer.icon || '🎁'}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-gray-900">{offer.title}</p>
                      <p className="text-xs text-gray-600 mt-0.5">{offer.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Delivery & Services — now full width */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="flex flex-col items-center text-center bg-gray-50 rounded-lg px-2 py-3 border border-gray-200">
              <ShieldCheck className="h-5 w-5 text-blue-600 mb-1.5" />
              <span className="text-[10px] sm:text-xs font-medium text-gray-700 leading-tight">1 Year Warranty</span>
            </div>
            <div className="flex flex-col items-center text-center bg-gray-50 rounded-lg px-2 py-3 border border-gray-200">
              <RotateCcw className="h-5 w-5 text-blue-600 mb-1.5" />
              <span className="text-[10px] sm:text-xs font-medium text-gray-700 leading-tight">7 Days Return</span>
            </div>
            <div className="flex flex-col items-center text-center bg-gray-50 rounded-lg px-2 py-3 border border-gray-200">
              <Truck className="h-5 w-5 text-blue-600 mb-1.5" />
              <span className="text-[10px] sm:text-xs font-medium text-gray-700 leading-tight">Free Delivery</span>
            </div>
          </div>

          {/* Key Specifications — now full width */}
          <div className="border border-gray-200 rounded-lg mb-6">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h3 className="text-sm font-bold text-gray-900">Key Specifications</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {(showAllSpecs ? specs : specs.slice(0, 5)).map((spec, i) => (
                <div key={i} className="flex px-4 py-2.5">
                  <span className="text-xs text-gray-500 w-1/3 flex-shrink-0">{spec.label}</span>
                  <span className="text-xs font-medium text-gray-900">{spec.value}</span>
                </div>
              ))}
            </div>
            {specs.length > 5 && (
              <button
                onClick={() => setShowAllSpecs(!showAllSpecs)}
                className="w-full py-2.5 text-xs text-blue-600 font-medium hover:bg-gray-50 border-t border-gray-200 flex items-center justify-center gap-1"
              >
                {showAllSpecs ? (<>Show Less <ChevronUp className="h-3 w-3" /></>) : (<>View All Specifications <ChevronDown className="h-3 w-3" /></>)}
              </button>
            )}
          </div>

          {/* Description — now full width */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-900 mb-2">Description</h3>
            <p className="text-xs text-gray-600 leading-relaxed">{product.description}</p>
          </div>
        </div>

        {/* Related Products — below the fold */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 border-t border-gray-200 pt-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">You May Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {relatedProducts.map((rp) => {
                const rpDiscount = rp.originalPrice ? Math.round(((rp.originalPrice - rp.price) / rp.originalPrice) * 100) : 0;
                return (
                  <div key={rp.id} className="min-w-0">
                    <Link href={`/products/${rp.id}`} className="group block h-full">
                      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
                        <div className="relative aspect-square bg-gray-50 p-3">
                          {rpDiscount > 0 && (
                            <div className="absolute top-2 left-2 bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded z-10">{rpDiscount}% off</div>
                          )}
                          {/* @ts-ignore React 19 type mismatch */}
                          <Image src={rp.image} alt={rp.name} fill className="object-contain p-3" sizes="(max-width: 768px) 45vw, 22vw" referrerPolicy="no-referrer" />
                        </div>
                        <div className="p-2.5 flex flex-col flex-grow">
                          <p className="text-[10px] text-gray-400 uppercase">{rp.brand}</p>
                          <h4 className="text-xs font-medium text-gray-800 line-clamp-2 mb-1 group-hover:text-blue-600">{rp.name}</h4>
                          <div className="mt-auto">
                            <p className="text-sm font-bold text-gray-900">{formatPrice(rp.price)}</p>
                            {rp.originalPrice && (
                              <p className="text-[10px] text-gray-400 line-through">{formatPrice(rp.originalPrice)}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
