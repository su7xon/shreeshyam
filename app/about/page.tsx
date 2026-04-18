import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'About Us | Shree Shyam Mobile',
  description: 'Your ultimate destination for all mobile needs in Mohopada & Rasayani! 📍📱',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f9f9f9] pt-6 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation / Breacrumbs */}
        <div className="mb-8">
          <Link href="/" className="text-sm font-medium text-gray-500 hover:text-black flex items-center gap-1 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Back to Home
          </Link>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-[24px] shadow-sm border border-black/5 overflow-hidden">
          {/* Top Banner / Color Block */}
          <div className="h-32 sm:h-40 bg-gradient-to-br from-purple-600 to-indigo-800 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute top-10 -right-10 w-40 h-40 bg-purple-400/20 rounded-full blur-2xl"></div>
          </div>

          <div className="px-6 sm:px-10 pb-10 sm:pb-12 relative -mt-12 sm:-mt-16 text-center">
            {/* Logo */}
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-full shadow-lg border-4 border-white flex items-center justify-center mx-auto mb-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-purple-50 rounded-full"></div>
              <Image 
                src="/WhatsApp_Image_2026-04-09_at_8.37.15_PM-removebg-preview.png" 
                alt="Shree Shyam Mobile Logo" 
                width={80} 
                height={80} 
                className="object-contain relative z-10 w-3/4 h-3/4" 
              />
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight font-satoshi mb-2">
              Shree Shyam Mobile
            </h1>
            <p className="text-gray-500 font-medium text-sm sm:text-base flex items-center justify-center gap-1.5 mb-8">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              Mohopada & Rasayani
            </p>

            {/* Content Body */}
            <div className="max-w-2xl mx-auto space-y-6 text-gray-600 text-base sm:text-lg leading-relaxed text-left">
              <p>
                Your ultimate destination for all mobile needs! 📍📱
              </p>
              
              <div className="bg-gray-50/50 p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-inner my-8">
                <p>
                  Explore a vast selection of the <strong className="text-gray-900">latest new and reliable used iPhones & Androids</strong>, along with a comprehensive range of <strong className="text-gray-900">accessories</strong>. 
                </p>
                <p className="mt-4">
                  We pride ourselves on offering <strong className="text-gray-900">expert mobile solutions</strong>, the <strong className="text-gray-900">best prices</strong>, convenient <strong className="text-gray-900">EMI options</strong>, and seamless <strong className="text-gray-900">exchange facilities</strong> to ensure you always stay connected with the latest tech.
                </p>
              </div>
            </div>

            {/* Footer Profile */}
            <div className="mt-10 pt-8 border-t border-gray-100 flex flex-col items-center justify-center">
              <div className="flex flex-col items-center gap-1">
                <p className="text-xl font-bold text-gray-900 font-satoshi">Surendra</p>
                <p className="text-sm font-semibold text-purple-600 tracking-widest uppercase">Business Lover</p>
              </div>
              
              <div className="mt-6 inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full font-medium text-sm">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Visit us today for quality, value, and exceptional service!
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <a 
                href="https://wa.me/917756935635" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#20bd5a] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/></svg>
                Chat with me
              </a>
              <Link 
                href="/products" 
                className="flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors"
              >
                Browse Phones
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
