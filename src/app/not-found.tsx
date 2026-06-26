import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl font-extrabold text-gray-700">404</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Page Not Found</h1>
        <p className="text-gray-900 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/products"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}
