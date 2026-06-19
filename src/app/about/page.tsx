import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Shree Shyam Mobiles - your trusted destination for smartphones and accessories.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
            About Shree Shyam Mobiles
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Your trusted destination for the latest smartphones and accessories at the best prices.
          </p>
        </div>

        {/* Story */}
        <div className="space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Our Story</h2>
            <p>
              Shree Shyam Mobiles was founded with a simple mission: to bring the best mobile phones 
              and accessories to our customers at competitive prices with exceptional service. We believe 
              everyone deserves access to the latest technology without breaking the bank.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">What We Offer</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Latest smartphones from all major brands (Samsung, Apple, Vivo, OnePlus, Xiaomi, and more)</li>
              <li>Genuine accessories and mobile covers</li>
              <li>Competitive pricing with exclusive deals</li>
              <li>EMI options for easy payments</li>
              <li>Cash on Delivery available</li>
              <li>Expert guidance to help you choose the right phone</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Our Promise</h2>
            <p>
              Every product we sell is 100% genuine with manufacturer warranty. We stand behind the 
              quality of our products and our after-sales support team is always ready to help.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Visit Our Store</h2>
            <p className="mb-3">
              Come visit us at our physical store for a hands-on experience with the latest devices:
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
              <p className="font-semibold text-gray-900">Shree Shyam Mobiles</p>
              <p className="text-gray-600 mt-1">Yash Complex, Gokul Nagari Rees, Mohopada, Raigad</p>
              <p className="text-gray-600 mt-1">Phone: +91 7756935635</p>
            </div>
          </section>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="px-8 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
            >
              Browse Products
            </Link>
            <Link
              href="/location"
              className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Get Directions
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
