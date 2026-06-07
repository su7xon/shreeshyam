'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Search, Menu, X, User, MoreVertical, Settings, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import SearchAutocomplete from './SearchAutocomplete';
import { useAuth } from '@/lib/auth-context';



export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDesktopMenu, setShowDesktopMenu] = useState(false);

  const [mounted, setMounted] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const { totalItems } = useCartStore();
  const cartItemsCount = totalItems();
  const router = useRouter();
  const { user, profile, logout } = useAuth();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showDesktopMenu && !target.closest('[aria-label="Menu"]') && !target.closest('.absolute')) {
        setShowDesktopMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showDesktopMenu]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsMenuOpen(false);
    }
  };



  return (
    <nav className="bg-white/95 text-[#111] fixed top-0 left-0 right-0 md:sticky md:top-0 z-50 border-b border-[#e5e7eb] backdrop-blur-md">


      <div className="w-full px-3 sm:px-6 lg:px-8 py-3 sm:py-3">
        <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-2 sm:gap-2">
              <Link href="/" className="flex items-center">
                {logoError ? (
                  <div className="h-8 sm:h-10 px-2.5 sm:px-3 rounded bg-black flex items-center justify-center text-[10px] sm:text-sm font-bold text-white" aria-hidden="true">
                    SHYAM
                  </div>
                ) : (
                  <Image
                    src="/WhatsApp_Image_2026-04-09_at_8.37.15_PM-removebg-preview.png"
                    alt="Shyam Mobiles Logo"
                    width={220}
                    height={64}
                    priority
                    onError={() => setLogoError(true)}
                    className="h-8 sm:h-10 w-auto object-contain"
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
              {/* Top Nav Links */}
              <div className="flex items-center gap-6">
                <Link
                  href="/products"
                  className="text-[12px] font-semibold tracking-[0.22em] text-gray-700 hover:text-black transition-colors"
                >
                  SHOP
                </Link>
                <Link
                  href="/about"
                  className="text-[12px] font-semibold tracking-[0.22em] text-gray-700 hover:text-black transition-colors"
                >
                  STORY
                </Link>
                <Link
                  href="/location"
                  className="text-[12px] font-semibold tracking-[0.22em] text-gray-700 hover:text-black transition-colors"
                >
                  CONTACT
                </Link>
              </div>

              {/* Desktop Dropdown Menu */}
              <div className="relative">
                <button 
                  type="button"
                  onClick={() => setShowDesktopMenu(!showDesktopMenu)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Menu"
                  suppressHydrationWarning
                >
                  <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>

                {/* Dropdown - Modern Glass Effect */}
                {showDesktopMenu && (
                  <div className="absolute right-0 mt-3 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-[#e5e7eb] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">


                    <Link 
                      href="/about" 
                      className="flex items-center gap-3 px-4 py-3 mx-2 rounded-xl hover:bg-[#f3f4f6] transition-colors"
                      onClick={() => setShowDesktopMenu(false)}
                    >
                      <div className="w-9 h-9 rounded-xl bg-[#f3f4f6] flex items-center justify-center">
                        <svg className="h-4 w-4 text-[#6b7280]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <circle cx="12" cy="12" r="10"/>
                          <path d="M12 16v-4"/>
                          <path d="M12 8h.01"/>
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-[#111111]">About</span>
                    </Link>

                    <div className="border-t border-[#f3f4f6] my-2 mx-2"></div>

                    <div className="px-4 py-3 mx-2">
                      <div className="flex items-start gap-3 p-3 bg-[#fef2f2] rounded-xl">
                        <div className="w-9 h-9 rounded-xl bg-[#ef4444]/10 flex items-center justify-center shrink-0">
                          <svg className="h-4 w-4 text-[#ef4444]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#111111] mb-1">Visit Our Store</p>
                          <p className="text-xs text-[#6b7280] leading-relaxed">
                            Yash Complex, Gokul Nagari Rees, Mohopada, Raigad
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/cart"
                className="relative text-gray-600 hover:text-black transition-colors"
                aria-label="Cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {mounted && cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 h-5 min-w-[20px] px-1 rounded-full bg-black text-white text-[10px] font-bold flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Link>

              <button
                type="button"
                onClick={() => user ? router.push('/account') : router.push('/auth')}
                className="flex items-center gap-2 hover:text-black text-gray-600 transition-colors"
                aria-label="Account"
                title={user ? 'My Account' : 'Login / Sign Up'}
              >
                {user?.photoURL ? (
                  <img src={user.photoURL} alt={profile?.displayName || "User"} className="h-6 w-6 rounded-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <User className="h-5 w-5" />
                )}
                <span className="text-[12px] font-semibold tracking-[0.18em]">
                  {user ? (profile?.displayName?.split(' ')[0] || 'ACCOUNT').toUpperCase() : 'ACCOUNT'}
                </span>
              </button>
            </div>

            {/* Mobile search + actions */}
            <div className="md:hidden flex items-center gap-2.5 flex-1 min-w-0 pl-2">
              <div className="flex-1 min-w-0">
                <SearchAutocomplete
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onSearch={handleSearch}
                  className="h-10"
                />
              </div>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-black focus:outline-none p-2"
                aria-label="Menu"
                suppressHydrationWarning
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/98 backdrop-blur-xl px-3 py-3 mx-2 my-2 space-y-3 rounded-2xl border border-[#e5e7eb] shadow-[0_18px_40px_-18px_rgba(0,0,0,0.25)] max-h-[80vh] overflow-y-auto">
          <div className="flex flex-col space-y-1">
            <p className="px-3 pt-1 text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider">Shop</p>

            <Link 
              href="/products" 
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[15px] font-semibold text-[#111111] hover:bg-[#f3f4f6] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              All Phones
            </Link>
            
            <Link 
              href="/accessories" 
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[15px] font-semibold text-[#111111] hover:bg-[#f3f4f6] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Accessories
            </Link>

            <div className="h-px bg-[#f3f4f6] my-2"></div>
            <p className="px-3 text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider">Info</p>

            <Link 
              href="/about" 
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[15px] font-semibold text-[#111111] hover:bg-[#f3f4f6] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4"/>
                <path d="M12 8h.01"/>
              </svg>
              About Us
            </Link>

            <Link 
              href="/location" 
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[15px] font-semibold text-[#111111] hover:bg-[#f3f4f6] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Our Location
            </Link>

            <div className="h-px bg-[#f3f4f6] my-2"></div>
            <p className="px-3 text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider">Account</p>

            {user ? (
              <>
                <Link 
                  href="/account" 
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[15px] font-semibold text-[#111111] hover:bg-[#f3f4f6] transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt={profile?.displayName || "User"} className="h-8 w-8 rounded-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                      {(profile?.displayName || user.email || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{profile?.displayName || 'My Account'}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </Link>
                <button 
                  onClick={async () => {
                    await logout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[15px] font-semibold text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </>
            ) : (
              <Link 
                href="/auth" 
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[15px] font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Login / Sign Up
              </Link>
            )}


          </div>
        </div>
      )}
    </nav>
  );
}
