'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Smartphone, Instagram, Youtube } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  // Hide on admin pages
  if (pathname?.startsWith('/admin')) return null;

  return (
    <footer className="bg-[#0a0a0a] text-gray-400 pt-12 sm:pt-16 pb-[84px] md:pb-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 md:row-span-2 text-center md:text-left">
            <Link href="/" className="inline-flex items-center mb-4 mx-auto md:mx-0">
              <Image
                src="/WhatsApp_Image_2026-04-09_at_8.37.15_PM-removebg-preview.png"
                alt="Shree Shyam Mobiles"
                width={260}
                height={76}
                className="h-8 sm:h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-gray-400 mb-5 leading-relaxed max-w-xs mx-auto md:mx-0">
              Yash Complex, Gokul Nagari Rees, Mohopada, Khalapur, Raigad. Trusted since years for genuine smartphones &amp; accessories.
            </p>
            <div className="flex space-x-3 justify-center md:justify-start">
              <a href="https://www.instagram.com/shree__shyam__mobile_?igsh=MXZ0bjluZDVqZGx3dg==" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:bg-gradient-to-r hover:from-[#833ab4] hover:via-[#fd1d1d] hover:to-[#fcb045] hover:text-white transition-all">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="https://m.youtube.com/@shreeshyammobile5050" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#ff0000] hover:text-white transition-all">
                <Youtube className="h-4 w-4" />
              </a>
              <a href="https://wa.me/919309415594" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#25d366] hover:text-white transition-all">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
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
              <li><Link href="/accessories" className="hover:text-white transition-colors">Accessories</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-3 uppercase tracking-[0.14em] text-xs">Support</h3>
            <ul className="space-y-1.5 text-sm">
              <li><Link href="/location" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><a href="https://wa.me/919309415594" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">WhatsApp Support</a></li>
              <li><a href="tel:+919309415594" className="hover:text-white transition-colors">Call: +91 93094 15594</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 gap-2">
          <p className="text-center md:text-left">&copy; {new Date().getFullYear()} श्री श्याम Mobiles. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}