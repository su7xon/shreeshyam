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
  const [showMobileSearch, setShowMobileSearch] = useState(false);
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
              {/* Desktop Dropdown Menu */}
              <div className="relative">
                <button 
                  type="button"
                  onClick={() => setShowDesktopMenu(!showDesktopMenu)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Menu"
                >
                  <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>

                {/* Dropdown */}
                {showDesktopMenu && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50">
                    <Link 
                      href="/admin/dashboard" 
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowDesktopMenu(false)}
                    >
                      <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-700">Admin Panel</span>
                    </Link>

                    <Link 
                      href="/about" 
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowDesktopMenu(false)}
                    >
                      <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 16v-4"/>
                        <path d="M12 8h.01"/>
                      </svg>
                      <span className="text-sm font-medium text-gray-700">About</span>
                    </Link>

                    <div className="border-t border-gray-200 my-2"></div>

                    <div className="px-4 py-3">
                      <div className="flex items-start gap-3">
                        <svg className="h-5 w-5 text-red-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 mb-1">Our Address</p>
                          <p className="text-xs text-gray-600 leading-relaxed">
                            <span className="font-medium">Shakha No. 1 & 2</span><br />
                            Shop No. 7 & Shop No. 6, Yash Complex,<br />
                            Gokul Nagari Rees, Mohopada,<br />
                            Near New Posari Gate, Taluka Khalapur,<br />
                            District Raigad
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button 
                type="button" 
                onClick={() => user ? router.push('/account') : router.push('/auth')}
                className="hover:text-black text-gray-600 transition-colors"
                aria-label="Account"
                title={user ? 'My Account' : 'Login / Sign Up'}
              >
                <User className="h-5 w-5" />
              </button>
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
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-black focus:outline-none p-1"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white px-4 pt-2 pb-4 space-y-3 border-t border-black/10 shadow-xl max-h-[80vh] overflow-y-auto">
          <div className="flex flex-col space-y-1">

            <Link 
              href="/products" 
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-gray-700 hover:text-black hover:bg-gray-100 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              All Phones
            </Link>
            
            <Link 
              href="/accessories" 
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-gray-700 hover:text-black hover:bg-gray-100 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Accessories
            </Link>

            <div className="border-t border-gray-200 my-2"></div>

            <Link 
              href="/about" 
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-gray-700 hover:text-black hover:bg-gray-100 transition-colors"
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
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-gray-700 hover:text-black hover:bg-gray-100 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Our Location
            </Link>

            <div className="border-t border-gray-200 my-2"></div>

            {user ? (
              <>
                <Link 
                  href="/account" 
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-gray-700 hover:text-black hover:bg-gray-100 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                    {(profile?.displayName || user.email || 'U').charAt(0).toUpperCase()}
                  </div>
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
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 transition-colors w-full text-left"
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
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Login / Sign Up
              </Link>
            )}

            <div className="border-t border-gray-200 my-2"></div>

            <Link 
              href="/admin/dashboard" 
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-purple-600 hover:bg-purple-50 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Admin Panel
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
