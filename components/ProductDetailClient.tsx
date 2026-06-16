'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, ShieldCheck, Truck, RotateCcw, Check, Zap, Heart, Share2, CreditCard, ChevronDown, ChevronUp } from 'lucide-react';
import { expandedProducts } from '@/lib/expanded-catalog';
import { useCartStore } from '@/lib/store';
import { ProductDetailSkeleton } from '@/components/SkeletonLoader';
import useAdminStore from '@/lib/admin-store';
import { deduplicateProducts } from '@/lib/utils';
import { useProduct } from '@/lib/hooks/useStoreData';

import { accessories } from '@/lib/accessories-data';

interface ProductDetailClientProps {
  id: string;
  initialProduct?: any;
}

export default function ProductDetailClient({ id, initialProduct }: ProductDetailClientProps) {
  const admin = useAdminStore();
  const { addItem, items } = useCartStore();
  
  // Use React Query to fetch product by ID — handles loading, caching, retries
  const { data: queryProduct, isLoading: isQueryLoading } = useProduct(id);
  
  // ALL STATE HOOKS MUST BE AT THE TOP - BEFORE ANY RETURNS
  const [added, setAdded] = useState(false);
  const [selectedThumb, setSelectedThumb] = useState(0);
  const [showAllSpecs, setShowAllSpecs] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Initialize admin store on mount
  useEffect(() => {
    const unsub = admin.initialize();
    return () => {
      if (typeof unsub === 'function') {
        unsub();
      }
    };
  }, []);

  const products = useMemo(() => {
    // Combine all potential product sources
    const combined = [...expandedProducts, ...accessories, ...admin.products];
    // Add query product if available
    if (queryProduct) {
      combined.push(queryProduct);
    }
    // Deduplicate by ID but prioritize objects with data
    const unique = new Map();
    combined.forEach(p => {
      if (!p) return;
      const existing = unique.get(p.id);
      // If the existing one has a name, and the new one doesn't, keep the existing one!
      if (existing && existing.name && !p.name) {
        return; 
      }
      unique.set(p.id, p);
    });
    return Array.from(unique.values()) as any[];
  }, [admin.products, queryProduct]);
  
  const decodedId = decodeURIComponent(id);
  const lowerId = id.toLowerCase();
  const lowerDecodedId = decodedId.toLowerCase();
  
  // Find the matching product, but explicitly skip any empty ghost objects (must have a name)
  const directMatch = products.find(
    (p) => (p.id === id || 
           p.id === decodedId || 
           (p.id || '').toLowerCase() === lowerId || 
           (p.id || '').toLowerCase() === lowerDecodedId) && 
           p.name
  );
  
  const numericIndex = Number.parseInt(id, 10);
  const indexMatch = Number.isFinite(numericIndex) && numericIndex > 0
    ? products[numericIndex - 1]
    : undefined;
    
  // Filter candidates to only those that actually have data to avoid empty ghost objects
  const candidates = [initialProduct, queryProduct, directMatch, indexMatch]
    .filter(p => p && typeof p === 'object' && Object.keys(p).length > 0);
    
  // Priority: Pick the first candidate with a name, or fallback to the first available object
  const product = candidates.find(p => p.name) || candidates[0];

  useEffect(() => {
    console.log('[DEBUG] decodedId:', decodedId, 'lowerId:', lowerId);
    console.log('[DEBUG] candidates:', candidates);
    console.log('[DEBUG] final product:', product);
    console.log('[DEBUG] admin.products length:', admin.products.length);
  }, [decodedId, lowerId, candidates, product, admin.products.length]);

  // Find products with same model name to show as variants
  const getModelKey = (p: any) => {
    if (!p || !p.name) return '';
    // Normalize name: lowercase, remove parenthetical text (colors etc.)
    let cleaned = p.name.toLowerCase()
      .replace(/\(.*?\)/g, ' ')       // remove (COLOR) info
      .replace(/\b\d+\s*[+/]\s*\d+\b/g, ' ')  // remove specs like 8+256, 8/128
      .replace(/\b\d+\s*gb\b/gi, ' ')    // remove RAM like 8gb, 4gb
      .replace(/\b\d+\s*g\b/gi, ' ')     // remove storage like 256g
      .replace(/\b(black|white|blue|green|red|gold|silver|grey|gray|purple|cyan|yellow|pink|titanium|dynamic|marble|aurora|glacier|awesome|skyline|cloud|desert|gemstone|navy|iceblue|ice blue|light blue|light green|pulse green|safran|knight)\b/gi, ' ')
      .replace(/\b(demo|ds|ss|dual sim|single sim|singal sim)\b/gi, ' ');
      
    // Remove isolated typical RAM/Storage numbers
    cleaned = cleaned.replace(/\b(2|3|4|6|8|12|16|32|64|128|256|512|1024)\b/g, ' ');

    cleaned = cleaned.replace(/[^a-z0-9]/g, '').trim();
    // Use brand + cleaned model name as key
    return `${(p.brand || '').toLowerCase()}::${cleaned}`;
  };

  const siblingVariants = useMemo(() => {
    if (!product) return [];
    const modelKey = getModelKey(product);
    const variants = products.filter(p => 
      p.brand === product.brand && 
      getModelKey(p) === modelKey
    );

    // Deduplicate by RAM + Storage to prevent redundancy
    const uniqueVariants = new Map();
    variants.forEach(v => {
      const variantKey = `${v.ram || ''}-${v.storage || ''}`.trim() || 'Standard';
      // If duplicate, prioritize the one that matches current product
      if (uniqueVariants.has(variantKey)) {
        if (v.id === product.id) {
          uniqueVariants.set(variantKey, v);
        }
      } else {
        uniqueVariants.set(variantKey, v);
      }
    });

    return Array.from(uniqueVariants.values()).sort((a, b) => (a.price || 0) - (b.price || 0));
  }, [product, products]);

  // Refined related products logic
  const relatedBase = deduplicateProducts(products as any[]);
  const currentModelKey = product ? getModelKey(product) : '';
  const relatedProducts = useMemo(() => {
    return [...relatedBase]
      .filter(p => p.id !== product?.id && getModelKey(p) !== currentModelKey)
      .sort((a, b) => {
        // 1. Same brand is higher priority
        const aSameBrand = a.brand === product?.brand;
        const bSameBrand = b.brand === product?.brand;
        if (aSameBrand && !bSameBrand) return -1;
        if (!aSameBrand && bSameBrand) return 1;

        // 2. Similar price range
        const aPriceDiff = Math.abs(a.price - (product?.price || 0));
        const bPriceDiff = Math.abs(b.price - (product?.price || 0));
        return aPriceDiff - bPriceDiff;
      });
  }, [relatedBase, product, currentModelKey]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show skeleton while loading
  if (!mounted || (isQueryLoading && !initialProduct && !product)) {
    return <ProductDetailSkeleton />;
  }

  // Product not found - show proper message
  if (!product) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <ShoppingCart className="h-10 w-10 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
          <p className="text-gray-600 mb-6">The product you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 bg-[#1a3a5c] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#142d48] transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    const safePrice = typeof price === 'number' && !isNaN(price) ? price : 0;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(safePrice);
  };

  const displayPrice = Number(product.price) || 0;
  const displayOriginalPrice = product.originalPrice ? Number(product.originalPrice) : undefined;
  const displayRam = product.ram === 'nullGB' ? 'N/A' : (product.ram || 'N/A');
  const displayStorage = product.storage === 'nullGB' ? 'N/A' : (product.storage || 'N/A');

  const cleanProductName = (name: string) => {
    return (name || '').replace(/null\+null/g, '').replace(/\([^)]*\)/g, '').trim();
  };

  const RELATED_PER_PAGE = 12; // 3 rows x 4 columns on desktop
  const productToAdd = { ...product };

  const handleAddToCart = () => {
    addItem(productToAdd);
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

  const discount = displayOriginalPrice
    ? Math.round(((displayOriginalPrice - displayPrice) / displayOriginalPrice) * 100)
    : 0;

  const savings = displayOriginalPrice ? displayOriginalPrice - displayPrice : 0;

  const thumbnails = ('images' in product && Array.isArray(product.images) && (product.images as string[]).length > 0)
    ? product.images as string[]
    : [product.image];

  // EMI: Use admin-configured values if available, else auto-calculate
  const emiMonths = product.emiMonths || 12;
  const emiPerMonth = product.emiPerMonth || Math.round(displayPrice / emiMonths);
  const emiAvailable = product.emiAvailable !== false; // default true
  const emiNote = product.emiNote || '';
  
  const totalPages = Math.ceil(relatedProducts.length / RELATED_PER_PAGE);
  const currentRelated = relatedProducts.slice(
    (currentPage - 1) * RELATED_PER_PAGE,
    currentPage * RELATED_PER_PAGE
  );

  const colors = ('colors' in product && Array.isArray(product.colors)) ? product.colors as string[] : [];

  const adminOffers = [
    { id: 'offer-1', title: 'HDFC Bank Offer', description: '10% instant discount up to ₹7,500 on HDFC Bank Credit Card EMI Transactions.', icon: '🏦', active: true },
    { id: 'offer-2', title: 'No Cost EMI', description: 'No Cost EMI available on select credit cards.', icon: '💳', active: true },
    { id: 'offer-3', title: 'Exchange Offer', description: 'Save up to ₹20,000 when you exchange your old phone.', icon: '🔄', active: true },
  ].filter((o) => o.active);

  const specs = [
    { label: 'RAM', value: displayRam },
    { label: 'Internal Storage', value: displayStorage },
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
          {/* LEFT: Image Gallery */}
          <div className="w-full lg:w-[45%]">
            <div className="lg:sticky lg:top-20">
              <div className="flex flex-row gap-3">
                {thumbnails.length > 1 && (
                  <div className="hidden sm:flex flex-col gap-2 w-16 flex-shrink-0">
                    {thumbnails.map((thumb, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedThumb(i)}
                        className={`w-16 h-16 rounded-lg border-2 overflow-hidden flex items-center justify-center bg-gray-50 transition-all ${
                          selectedThumb === i ? 'border-blue-600 shadow-md' : 'border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        <Image src={thumb || '/placeholder.png'} alt={`${product.name} view ${i + 1}`} width={56} height={56} className="object-contain p-1" referrerPolicy="no-referrer" unoptimized={thumb?.includes('amazon') || thumb?.includes('media-amazon')} />
                      </button>
                    ))}
                  </div>
                )}
                <div className="flex-1 relative">
                  <div className="relative aspect-square bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
                    {discount > 0 && <div className="absolute top-3 left-3 bg-[#ff8c00] text-black text-xs font-bold px-2 py-1 rounded z-10">{discount}% OFF</div>}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
                      <button className="bg-white border border-gray-200 rounded-full p-2 hover:bg-gray-50 shadow-sm transition-colors" aria-label="Wishlist">
                        <Heart className="h-4 w-4 text-gray-500" />
                      </button>
                      <button onClick={handleShare} className="bg-white border border-gray-200 rounded-full p-2 hover:bg-gray-50 shadow-sm transition-colors" aria-label="Share">
                        <Share2 className="h-4 w-4 text-gray-500" />
                      </button>
                    </div>
                    <Image src={thumbnails[selectedThumb] || '/placeholder.png'} alt={product.name || 'Product'} fill className="object-contain p-6 sm:p-10" priority sizes="(max-width: 768px) 100vw, 45vw" referrerPolicy="no-referrer" unoptimized={thumbnails[selectedThumb]?.includes('amazon') || thumbnails[selectedThumb]?.includes('media-amazon')} />
                  </div>
                  {thumbnails.length > 1 && (
                    <div className="flex sm:hidden gap-2 mt-3 overflow-x-auto pb-2">
                      {thumbnails.map((thumb, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedThumb(i)}
                          className={`w-14 h-14 rounded-lg border-2 overflow-hidden flex-shrink-0 flex items-center justify-center bg-gray-50 ${
                            selectedThumb === i ? 'border-blue-600' : 'border-gray-200'
                          }`}
                        >
                           <Image src={thumb || '/placeholder.png'} alt="" width={48} height={48} className="object-contain p-1" referrerPolicy="no-referrer" unoptimized={thumb?.includes('amazon') || thumb?.includes('media-amazon')} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Product Info */}
          <div className="w-full lg:w-[55%]">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 leading-tight mb-2">
              {cleanProductName(product.name || 'Unknown Product')}
            </h1>
            <div className="mb-5">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-2xl sm:text-3xl font-extrabold text-gray-900">{formatPrice(displayPrice)}</span>
                {displayOriginalPrice && (
                  <>
                    <span className="text-sm text-gray-400 line-through">MRP: {formatPrice(displayOriginalPrice)}</span>
                    <span className="text-sm font-semibold text-green-600">(Save {formatPrice(savings)}, {discount}% off)</span>
                  </>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">(Incl. all Taxes)</p>
            </div>
            {emiAvailable && (
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 mb-5">
                <CreditCard className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <div className="flex items-center gap-2 text-sm flex-wrap">
                  <span className="text-gray-600">OR</span>
                  <span className="font-bold text-gray-900">{formatPrice(emiPerMonth)}/mo*</span>
                  {emiNote && <span className="text-[10px] text-gray-500">({emiNote})</span>}
                  <Link href="#" className="text-blue-600 text-xs hover:underline">EMI Options</Link>
                </div>
              </div>
            )}
 
            {/* Variants Selector */}
            {siblingVariants.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  Select Variant <span className="text-xs font-normal text-gray-500">(RAM / Storage)</span>
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {siblingVariants.map((v) => (
                    <Link
                      key={v.id}
                      href={`/products/${v.id}`}
                      scroll={false}
                      className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-lg border transition-all ${
                        product.id === v.id
                          ? 'border-black bg-black text-white shadow-sm'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <span className="text-[13px] font-bold leading-tight">
                        {[v.ram, v.storage]
                          .filter(Boolean)
                          .filter((val, i, arr) => arr.indexOf(val) === i)
                          .join(' / ') || 'Standard'}
                      </span>
                      <span className={`text-[10px] mt-0.5 ${product.id === v.id ? 'text-gray-300' : 'text-gray-500'}`}>
                        {formatPrice(v.price)}
                      </span>
                      {product.id === v.id && (
                        <div className="absolute inset-0 border border-black rounded-lg pointer-events-none" />
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}

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

            <div className="flex flex-row gap-2 sm:gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={added}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 sm:px-6 rounded-lg font-bold text-[13px] sm:text-base transition-all ${
                  added ? 'bg-green-500 text-white' : 'bg-[#ff8c00] text-white hover:bg-[#e67e00] shadow-md'
                }`}
              >
                {added ? <><Check className="h-4 w-4 sm:h-5 sm:w-5" /> Added</> : <><ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" /> Add to Cart</>}
              </button>
              <Link
                href="/checkout"
                onClick={() => {
                  const existingItem = items.find(i => i.id === product.id);
                  if (!existingItem) {
                    addItem(product);
                  }
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-2 sm:px-6 rounded-lg font-bold text-[13px] sm:text-base bg-[#1a3a5c] text-white hover:bg-[#142d48] shadow-md transition-all"
              >
                <Zap className="h-4 w-4 sm:h-5 sm:w-5 fill-current" /> Buy Now
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-2 lg:mt-8">
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
              <button onClick={() => setShowAllSpecs(!showAllSpecs)} className="w-full py-2.5 text-xs text-blue-600 font-medium hover:bg-gray-50 border-t border-gray-200 flex items-center justify-center gap-1">
                {showAllSpecs ? (<>Show Less <ChevronUp className="h-3 w-3" /></>) : (<>View All Specifications <ChevronDown className="h-3 w-3" /></>)}
              </button>
            )}
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-900 mb-2">Description</h3>
            <p className="text-xs text-gray-600 leading-relaxed">{product.description}</p>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-12 border-t border-gray-200 pt-8" id="related-products">
            <h2 className="text-lg font-bold text-gray-900 mb-4">You May Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {currentRelated.map((rp) => {
                const rpDiscount = rp.originalPrice ? Math.round(((rp.originalPrice - rp.price) / rp.originalPrice) * 100) : 0;
                return (
                  <div key={rp.id} className="min-w-0">
                    <Link href={`/products/${rp.id}`} className="group block h-full">
                      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
                        <div className="relative aspect-square bg-gray-50 p-3">
                          {rpDiscount > 0 && (
                            <div className="absolute top-2 left-2 bg-[#ff8c00] text-black text-[10px] font-bold px-1.5 py-0.5 rounded z-10">{rpDiscount}% off</div>
                          )}
                           <Image src={rp.image || '/placeholder.png'} alt={rp.name} fill className="object-contain p-3" sizes="(max-width: 768px) 45vw, 22vw" referrerPolicy="no-referrer" unoptimized={rp.image?.includes('amazon') || rp.image?.includes('media-amazon')} />
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
            
            {/* Pagination Controls - single line with smart truncation */}
            {totalPages > 1 && (() => {
              // Build smart page numbers: 1 ... (current-1) current (current+1) ... last
              const pages: (number | '...')[] = [];
              if (totalPages <= 7) {
                for (let i = 1; i <= totalPages; i++) pages.push(i);
              } else {
                pages.push(1);
                if (currentPage > 3) pages.push('...');
                const start = Math.max(2, currentPage - 1);
                const end = Math.min(totalPages - 1, currentPage + 1);
                for (let i = start; i <= end; i++) pages.push(i);
                if (currentPage < totalPages - 2) pages.push('...');
                pages.push(totalPages);
              }
              return (
                <div className="flex items-center justify-center gap-1.5 mt-8">
                  <button
                    onClick={() => { 
                      setCurrentPage(p => Math.max(1, p - 1)); 
                      document.getElementById('related-products')?.scrollIntoView({ behavior: 'smooth' }); 
                    }}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-lg text-sm font-medium bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    ←
                  </button>
                  {pages.map((page, idx) => 
                    page === '...' ? (
                      <span key={`dots-${idx}`} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">…</span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => { 
                          setCurrentPage(page as number); 
                          document.getElementById('related-products')?.scrollIntoView({ behavior: 'smooth' }); 
                        }}
                        className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all ${
                          page === currentPage
                            ? 'bg-black text-white shadow-sm'
                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                  <button
                    onClick={() => { 
                      setCurrentPage(p => Math.min(totalPages, p + 1)); 
                      document.getElementById('related-products')?.scrollIntoView({ behavior: 'smooth' }); 
                    }}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded-lg text-sm font-medium bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    →
                  </button>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
