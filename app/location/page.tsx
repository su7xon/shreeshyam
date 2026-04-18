'use client';

import Link from 'next/link';
import { MapPin, Phone, Clock, ExternalLink, ArrowLeft } from 'lucide-react';

export default function LocationPage() {
  const handleOpenMaps = () => {
    window.open('https://maps.google.com/?q=Shri+Shyam+Mobiles+Khalapur+Raigad', '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Our Location</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Map Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="aspect-video bg-gray-100 relative">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.5!2d73.2!3d18.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sKhalapur%2C+Raigad!5e0!3m2!1sen!2sin!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0"
            />
          </div>
          <div className="p-4">
            <button
              onClick={handleOpenMaps}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
            >
              <ExternalLink className="h-4 w-4" />
              Open in Google Maps
            </button>
          </div>
        </div>

        {/* Address Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-red-50 rounded-xl">
              <MapPin className="h-6 w-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-900 mb-2">Shakha No. 1 & 2</h2>
              <p className="text-gray-600 leading-relaxed">
                Shop No. 7 & Shop No. 6, Yash Complex,<br />
                Gokul Nagari Rees, Mohopada,<br />
                Near New Posari Gate,<br />
                Taluka Khalapur, District Raigad
              </p>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-50 rounded-xl">
                <Phone className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Phone</p>
                <a href="tel:+919876543210" className="text-gray-900 font-medium hover:text-blue-600 transition-colors">
                  +91 98765 43210
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-xl">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Business Hours</p>
                <p className="text-gray-900 font-medium">
                  Mon - Sat: 10:00 AM - 9:00 PM<br />
                  Sunday: 11:00 AM - 8:00 PM
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleOpenMaps}
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
          >
            <MapPin className="h-6 w-6 text-blue-600" />
            <span className="text-sm font-medium text-gray-900">Get Directions</span>
          </button>
          
          <a
            href="tel:+919876543210"
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all"
          >
            <Phone className="h-6 w-6 text-green-600" />
            <span className="text-sm font-medium text-gray-900">Call Us</span>
          </a>
        </div>
      </div>
    </div>
  );
}
