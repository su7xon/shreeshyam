'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ShoppingCart, ShieldCheck, Truck, RotateCcw, Check, Share2, Heart, ChevronDown, Zap } from 'lucide-react';
import { accessories } from '@/lib/accessories-data';
import { useCartStore } from '@/lib/store';
import { ProductDetailSkeleton } from '@/components/SkeletonLoader';
import { getAccessoryImage } from '@/lib/image-resolver';

interface AccessoryDetailClientProps {
  id: string;
}

export default function AccessoryDetailClient({ id }: AccessoryDetailClientProps) {
  const accessory = accessories.find((a) => a.id === id);
  const { addItem } = useCartStore();
  const [added, setAdded] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <ProductDetailSkeleton />;
  }

  if (!accessory) {
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
    // Adapt Accessory to CartItem interface extending Product
    const cartItem = {
      id: accessory.id,
      name: accessory.name,
      brand: accessory.brand,
      price: accessory.unitPrice,
      originalPrice: accessory.price,
      image: getAccessoryImage(accessory.id),
      images: [getAccessoryImage(accessory.id)],
      specs: { color: accessory.color },
      details: [accessory.description],
    };
    
    addItem(cartItem as any); 
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleShare = async () => {
    const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/accessories/${accessory.id}`;
    const shareData = {
      title: accessory.name,
      text: `Check out ${accessory.name} on श्री श्याम Mobiles`,
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
      }).catch(() => {});
    }
  };

  const discountValue = Math.round(((accessory.price - accessory.unitPrice) / accessory.price) * 100);

  return (
    <div className="bg-[#f7f7f8] min-h-screen pb-20 sm:pb-8">
      {/* Breadcrumb - Hidden on very small screens */}
      <div className="hidden sm:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex text-xs text-gray-500 font-medium">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/accessories" className="hover:text-black transition-colors">Accessories</Link>
          <span className="mx-2">/</span>
          <span className="text-black truncate uppercase">{accessory.brand}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="bg-white sm:rounded-3xl sm:shadow-lg sm:border border-gray-100 overflow-hidden flex flex-col md:flex-row">
          
          {/* LEFT: Image Gallery */}
          <div className="w-full md:w-1/2 p-4 sm:p-8 md:p-12 bg-white flex flex-col">
            <div className="relative aspect-square w-full max-w-[500px] mx-auto flex items-center justify-center mb-6 px-4">
              <Image
                src={getAccessoryImage(accessory.id)}
                alt={accessory.name}
                fill
                className="object-contain drop-shadow-xl"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                unoptimized
              />
              {discountValue > 0 && (
                <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm z-10">
                  {discountValue}% OFF
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Product Info */}
          <div className="w-full md:w-1/2 p-5 sm:p-8 md:p-12 bg-[#fafafa] flex flex-col">
            
            {/* Header: Title & Share */}
            <div className="flex justify-between items-start gap-4 mb-2">
              <div>
                <p className="text-xs font-bold tracking-[0.2em] text-gray-500 uppercase mb-2">
                  {accessory.brand}
                </p>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
                  {accessory.name}
                </h1>
              </div>
              <div className="flex gap-2 shrink-0 pt-1">
                <button 
                  onClick={handleShare}
                  className="p-2.5 rounded-full bg-white border border-gray-200 text-gray-600 hover:text-black hover:bg-gray-50 hover:shadow-sm transition-all"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button className="p-2.5 rounded-full bg-white border border-gray-200 text-gray-600 hover:text-red-500 hover:border-red-200 hover:bg-red-50 hover:shadow-sm transition-all">
                  <Heart className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Price */}
            <div className="mb-8">
              <div className="flex items-baseline gap-3 mb-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight">
                  {formatPrice(accessory.unitPrice)}
                </span>
                {accessory.price > accessory.unitPrice && (
                  <span className="text-lg text-gray-400 line-through font-medium">
                    {formatPrice(accessory.price)}
                  </span>
                )}
              </div>
              <p className="text-xs text-green-600 font-medium bg-green-50 inline-block px-2 py-1 rounded flex items-center gap-1 mt-1">
                <Zap className="h-3 w-3" /> Includes all taxes & fast shipping
              </p>
            </div>

            {/* Color Option */}
            <div className="mb-6">
              <h3 className="text-xs font-bold tracking-wide text-gray-900 uppercase mb-3">
                Color
              </h3>
              <div className="flex gap-3">
                <button className="border-2 rounded-xl p-1 border-[var(--color-primary)]">
                  <span className="block px-4 py-2 border border-gray-100 rounded-lg text-sm font-semibold bg-white text-gray-900 shadow-sm">
                    {accessory.color}
                  </span>
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8 p-5 bg-white border border-gray-100 rounded-2xl">
              <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                Overview
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed text-balance">
                {accessory.description}
              </p>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              <div className="flex flex-col items-center justify-center p-3 bg-white border border-gray-100 rounded-2xl text-center">
                <div className="bg-blue-50 text-blue-600 p-2 rounded-full mb-2"><ShieldCheck className="w-5 h-5" /></div>
                <span className="text-[10px] sm:text-xs font-semibold text-gray-700">1 Year<br/>Warranty</span>
              </div>
              <div className="flex flex-col items-center justify-center p-3 bg-white border border-gray-100 rounded-2xl text-center">
                <div className="bg-green-50 text-green-600 p-2 rounded-full mb-2"><RotateCcw className="w-5 h-5" /></div>
                <span className="text-[10px] sm:text-xs font-semibold text-gray-700">7 Days<br/>Replacement</span>
              </div>
              <div className="flex flex-col items-center justify-center p-3 bg-white border border-gray-100 rounded-2xl text-center">
                <div className="bg-amber-50 text-amber-600 p-2 rounded-full mb-2"><Truck className="w-5 h-5" /></div>
                <span className="text-[10px] sm:text-xs font-semibold text-gray-700">Free<br/>Delivery</span>
              </div>
            </div>

            {/* Add to Cart Sticky Mobile / Desktop Button */}
            <div className="mt-auto pt-4 sm:pt-0 pb-4 sm:pb-0 z-40 bg-[#fafafa]">
              <button
                onClick={handleAddToCart}
                disabled={added}
                className={`w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all duration-300 shadow-lg ${
                  added 
                    ? 'bg-green-500 text-white shadow-green-500/25' 
                    : 'bg-black text-white hover:bg-gray-900 hover:shadow-black/20 hover:-translate-y-0.5'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5" />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart • {formatPrice(accessory.unitPrice)}
                  </>
                )}
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
