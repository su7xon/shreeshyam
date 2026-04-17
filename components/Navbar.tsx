'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Search, Menu, X, User, MoreVertical, Settings, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import SearchAutocomplete from './SearchAutocomplete';
import MegaMenu from './MegaMenu';


export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const [mounted, setMounted] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const { totalItems } = useCartStore();
  const cartItemsCount = totalItems();
  const router = useRouter();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsMenuOpen(false);
    }
  };



  return (
    <nav className="bg-white/95 text-[#111] sticky top-0 z-50 border-b border-black/10 backdrop-blur">


      <div className="w-full px-2.5 sm:px-6 lg:px-8 py-2 sm:py-3">
        {showMobileSearch ? (
          /* Mobile Search View (Full Width Top) */
          <div className="md:hidden flex items-center gap-3 w-full animate-in slide-in-from-top duration-200">
            <button 
              onClick={() => setShowMobileSearch(false)}
              className="p-1 text-gray-500 hover:text-black"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div className="flex-1">
              <SearchAutocomplete
                value={searchQuery}
                onChange={setSearchQuery}
                onSearch={() => {
                  handleSearch();
                  setShowMobileSearch(false);
                }}
                className="h-10"
                autoFocus
              />
            </div>
          </div>
        ) : (
          /* Default Navbar View */
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink min-w-0 flex items-center gap-1 sm:gap-2">
              <Link href="/" className="flex items-center min-w-0">
                {logoError ? (
                  <div className="h-8 sm:h-11 px-2.5 sm:px-3 rounded bg-black flex items-center justify-center text-[10px] sm:text-sm font-bold text-white" aria-hidden="true">
                    SHYAM
                  </div>
                ) : (
                  <Image
                    src="/WhatsApp_Image_2026-04-09_at_8.37.15_PM-removebg-preview.png"
                    alt="श्री श्याम Mobiles Logo"
                    width={220}
                    height={64}
                    priority
                    onError={() => setLogoError(true)}
                    className="h-8 sm:h-11 w-auto max-w-[170px] sm:max-w-none object-contain"
                  />
                )}
              </Link>
            </div>

            {/* Desktop Search Center */}
            <div className="hidden md:flex flex-1 justify-center max-w-2xl mx-6">
              <div className="w-full max-w-2xl">
                <SearchAutocomplete
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onSearch={handleSearch}
                />
              </div>
            </div>

            {/* Desktop Right Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <MegaMenu />

              <Link href="/admin/dashboard" className="text-sm font-medium hover:text-black text-gray-500 transition-colors flex items-center gap-1" title="Admin Panel">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </Link>

              <button type="button" className="hover:text-black text-gray-600 transition-colors" aria-label="Account">
                <User className="h-5 w-5" />
              </button>

              <Link href="/cart" className="flex items-center gap-1.5 hover:text-black text-gray-700 transition-colors relative group">
                <div className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {mounted && cartItemsCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </div>
                <span className="text-sm font-medium">Cart</span>
              </Link>
            </div>

            {/* Mobile actions */}
            <div className="md:hidden flex items-center gap-1.5 min-w-0">
              <button
                onClick={() => setShowMobileSearch(true)}
                className="text-gray-700 hover:text-black focus:outline-none p-1"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
              <Link href="/cart" className="relative hover:text-black text-gray-700 transition-colors p-1">
                <ShoppingCart className="h-5 w-5" />
                {mounted && cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-black focus:outline-none p-1"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <MoreVertical className="h-5 w-5" />}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white px-4 pt-2 pb-4 space-y-4 border-t border-black/10 shadow-xl">
          <div className="flex flex-col space-y-2">

            <Link 
              href="/products" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-black hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              All Phones
            </Link>
            <Link 
              href="/accessories" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-black hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Accessories
            </Link>
            <Link 
              href="/admin/dashboard" 
              className="block px-3 py-2 rounded-md text-base font-medium text-purple-600 hover:bg-purple-50 flex items-center gap-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <Settings className="h-5 w-5" />
              Admin Panel
            </Link>
            <button className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-black hover:bg-gray-100 flex items-center gap-2">
              <User className="h-5 w-5" />
              Account &amp; Lists
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
