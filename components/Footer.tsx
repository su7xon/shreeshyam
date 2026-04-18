'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Smartphone, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { openModal } from './ModalManager';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  // Hide on admin pages
  if (pathname?.startsWith('/admin')) return null;

  return (
    <footer className="bg-black text-gray-300 pt-10 sm:pt-14 pb-[84px] md:pb-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 md:row-span-2 text-center md:text-left">
            <Link href="/" className="inline-flex items-center mb-4 mx-auto md:mx-0">
              <Image
                src="/WhatsApp_Image_2026-04-09_at_8.37.15_PM-removebg-preview.png"
                alt="Shyam Mobile"
                width={260}
                height={76}
                className="h-8 sm:h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-gray-400 mb-5 leading-relaxed max-w-xs mx-auto md:mx-0">
              Curated smartphones and accessories for people who want performance with personality.
            </p>
            <div className="flex space-x-4 justify-center md:justify-start">
              <a href="#" className="text-gray-500 hover:text-white transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors"><Twitter className="h-5 w-5" /></a>
              <a href="https://www.instagram.com/shree__shyam__mobile_?igsh=MXZ0bjluZDVqZGx3dg==" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors"><Instagram className="h-5 w-5" /></a>
              <a href="https://m.youtube.com/@shreeshyammobile5050" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors"><Youtube className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-white font-semibold mb-3 uppercase tracking-[0.14em] text-xs">Shop</h3>
            <ul className="space-y-1.5 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/products" className="hover:text-white transition-colors">All Phones</Link></li>
              <li><Link href="/products?brand=Apple" className="hover:text-white transition-colors">Apple iPhones</Link></li>
              <li><Link href="/products?brand=Samsung" className="hover:text-white transition-colors">Samsung Galaxy</Link></li>
              <li>
                <button onClick={() => openModal('bundle')} className="hover:text-white transition-colors text-left">
                  Bundle Deals
                </button>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-3 uppercase tracking-[0.14em] text-xs">Support</h3>
            <ul className="space-y-1.5 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li>
                <button onClick={() => openModal('orderTracking')} className="hover:text-white transition-colors text-left">
                  Track Order
                </button>
              </li>
              <li><a href="#" className="hover:text-white transition-colors">Return Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 gap-2">
          <p className="text-center md:text-left">&copy; {new Date().getFullYear()} श्री श्याम Mobiles. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}