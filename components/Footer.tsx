'use client';

import Link from 'next/link';
import { Smartphone, Facebook, Twitter, Instagram, Youtube, Ruler, RefreshCw, Package, Truck, Crown, Wrench } from 'lucide-react';
import { openModal } from './ModalManager';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-gray-300 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-white mb-4">
              <Smartphone className="h-6 w-6 text-blue-400" />
              <span>Mobi<span className="text-blue-400">Mart</span></span>
            </Link>
            <p className="text-sm text-gray-400 mb-4">
              Your one-stop destination for the latest and greatest smartphones. Professional service, guaranteed quality.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="text-gray-400 hover:text-white"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="text-gray-400 hover:text-white"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="text-gray-400 hover:text-white"><Youtube className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-blue-400">Home</Link></li>
              <li><Link href="/products" className="hover:text-blue-400">All Phones</Link></li>
              <li><Link href="/products?brand=Apple" className="hover:text-blue-400">Apple iPhones</Link></li>
              <li><Link href="/products?brand=Samsung" className="hover:text-blue-400">Samsung Galaxy</Link></li>
              <li>
                <button onClick={() => openModal('bundle')} className="hover:text-blue-400 text-left">
                  Bundle Deals
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400">Contact Us</a></li>
              <li>
                <button onClick={() => openModal('orderTracking')} className="hover:text-blue-400 text-left">
                  Track Order
                </button>
              </li>
              <li><a href="#" className="hover:text-blue-400">Return Policy</a></li>
              <li><a href="#" className="hover:text-blue-400">FAQs</a></li>
              <li>
                <button onClick={() => openModal('premiumMembership')} className="hover:text-blue-400 text-left flex items-center gap-2">
                  <Crown className="h-3 w-3 text-yellow-500" /> Premium Membership
                </button>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => openModal('tradeIn')} className="hover:text-blue-400 text-left flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" /> Trade-in Calculator
                </button>
              </li>
              <li>
                <button onClick={() => openModal('sizeGuide')} className="hover:text-blue-400 text-left flex items-center gap-2">
                  <Ruler className="h-4 w-4" /> Size Guide
                </button>
              </li>
              <li>
                <button onClick={() => openModal('arView')} className="hover:text-blue-400 text-left flex items-center gap-2">
                  <Smartphone className="h-4 w-4" /> AR View
                </button>
              </li>
              <li>
                <button onClick={() => openModal('installationService')} className="hover:text-blue-400 text-left flex items-center gap-2">
                  <Wrench className="h-4 w-4" /> Installation Service
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} श्री श्याम Mobiles. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}