'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Search, Menu, X, MapPin, User, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('Bhwadi 263152');
  const [mounted, setMounted] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const { totalItems } = useCartStore();
  const cartItemsCount = totalItems();
  const router = useRouter();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsMenuOpen(false);
    }
  };

  const handleUpdateLocation = () => {
    const nextLocation = window.prompt('Enter delivery location / pincode', deliveryLocation);
    if (nextLocation && nextLocation.trim()) {
      setDeliveryLocation(nextLocation.trim());
    }
  };

  return (
    <nav className="bg-[#1A1829] text-white sticky top-0 z-50">
      <div className="w-full px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-1.5 sm:gap-2">
            <Link href="/" className="flex items-center gap-2 min-w-0">
              {logoError ? (
                <div className="h-9 w-9 sm:h-11 sm:w-11 rounded-full bg-[#3B82F6] flex items-center justify-center text-xs sm:text-sm font-bold text-white" aria-hidden="true">
                  SS
                </div>
              ) : (
                <Image
                  src="/logo.jpeg"
                  alt="श्री श्याम Mobiles Logo"
                  width={44}
                  height={44}
                  priority
                  onError={() => setLogoError(true)}
                  className="h-9 w-9 sm:h-11 sm:w-11 rounded-full object-cover bg-white/5 p-0.5"
                />
              )}
              <span className="inline text-[1.02rem] sm:text-xl font-semibold tracking-tight leading-none truncate">
                <span className="text-white">श्री श्याम </span>
                <span className="text-[#60A5FA]">Mobiles</span>
              </span>
            </Link>
          </div>

          {/* Desktop Search Center */}
          <div className="hidden md:flex flex-1 justify-center max-w-2xl mx-6">
            <form onSubmit={handleSearch} className="flex flex-1 items-stretch rounded-full bg-white text-gray-900 shadow-sm overflow-hidden h-10">
              <div className="flex items-center px-4 bg-gray-50 border-r border-gray-200 text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-100">
                Mobiles <ChevronDown className="h-4 w-4 ml-1 opacity-60" />
              </div>
              <input
                type="text"
                placeholder="Search for smartphones..."
                className="w-full bg-white text-sm py-2 px-4 focus:outline-none placeholder-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                suppressHydrationWarning
              />
              <button
                type="submit"
                className="bg-[#F59E0B] hover:bg-[#D97706] w-12 flex justify-center items-center transition-colors text-white"
                suppressHydrationWarning
                aria-label="Search"
              >
                <Search className="h-5 w-5 text-gray-900" />
              </button>
            </form>
          </div>

          {/* Desktop Right Navigation */}
          <div className="hidden md:flex items-center gap-6">
            
            <button
              onClick={handleUpdateLocation}
              className="flex items-center gap-1.5 hover:opacity-80 transition-opacity text-left"
            >
              <MapPin className="h-5 w-5 text-gray-300" />
              <div className="leading-tight">
                <span className="block text-[10px] text-gray-400">Delivering to {deliveryLocation}</span>
                <span className="block text-sm font-medium">Update location</span>
              </div>
            </button>

            <Link href="/products" className="text-sm font-medium hover:text-white text-gray-200 transition-colors">
              All Phones
            </Link>

            <Link href="/admin/dashboard" className="text-sm font-medium hover:text-white text-gray-400 transition-colors flex items-center gap-1" title="Admin Panel">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Link>

            <button type="button" className="hover:text-white text-gray-200 transition-colors" aria-label="Account">
              <User className="h-5 w-5" />
            </button>

            <Link href="/cart" className="flex items-center gap-1.5 hover:text-white text-gray-200 transition-colors relative group">
              <div className="relative">
                <ShoppingCart className="h-5 w-5" />
                {mounted && cartItemsCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#10B981] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </div>
              <span className="text-sm font-medium">Cart</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={() => router.push('/products')}
              className="text-gray-300 hover:text-white transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            <Link href="/cart" className="relative hover:text-white text-gray-200 transition-colors">
              <ShoppingCart className="h-5 w-5" />
              {mounted && cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#10B981] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#1f1d33] px-4 pt-2 pb-4 space-y-4 border-t border-gray-700 shadow-xl">
          <div className="flex flex-col space-y-2">
            <button
              onClick={handleUpdateLocation}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800"
            >
              Delivering to {deliveryLocation} - Update location
            </button>
            <Link 
              href="/products" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800"
              onClick={() => setIsMenuOpen(false)}
            >
              All Phones
            </Link>
            <button className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800">
              Account &amp; Lists
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
