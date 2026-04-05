'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { products as defaultProducts, brands, ramOptions, storageOptions } from '@/lib/data';
import { Filter, X } from 'lucide-react';
import useAdminStore from '@/lib/admin-store';

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialBrand = searchParams.get('brand');
  const searchQuery = searchParams.get('search');
  const admin = useAdminStore();
  const products = admin.products.length > 0 ? admin.products : defaultProducts;

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Filters state
  const [selectedBrands, setSelectedBrands] = useState<string[]>(initialBrand ? [initialBrand] : []);
  const [selectedRam, setSelectedRam] = useState<string[]>([]);
  const [selectedStorage, setSelectedStorage] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number>(200000);

  const filteredProducts = useMemo(() => {
    let result = products;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.brand.toLowerCase().includes(query)
      );
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      result = result.filter(p => selectedBrands.includes(p.brand));
    }

    // RAM filter
    if (selectedRam.length > 0) {
      result = result.filter(p => selectedRam.includes(p.ram));
    }

    // Storage filter
    if (selectedStorage.length > 0) {
      result = result.filter(p => selectedStorage.includes(p.storage));
    }

    // Price filter
    result = result.filter(p => p.price <= priceRange);

    return result;
  }, [selectedBrands, selectedRam, selectedStorage, priceRange, searchQuery]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const toggleRam = (ram: string) => {
    setSelectedRam(prev => 
      prev.includes(ram) ? prev.filter(r => r !== ram) : [...prev, ram]
    );
  };

  const toggleStorage = (storage: string) => {
    setSelectedStorage(prev => 
      prev.includes(storage) ? prev.filter(s => s !== storage) : [...prev, storage]
    );
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedRam([]);
    setSelectedStorage([]);
    setPriceRange(200000);
  };

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold text-gray-900">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'All Smartphones'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">Showing {filteredProducts.length} products</p>
        </div>
        <button 
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="md:hidden mt-4 flex items-center justify-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-md text-gray-700 font-medium"
        >
          <Filter className="h-5 w-5" />
          Filters
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-3 sm:gap-6">
        {/* Sidebar Filters */}
        <div className={`md:w-56 lg:w-64 flex-shrink-0 ${isFilterOpen ? 'block' : 'hidden md:block'}`}>
          <div className="bg-white p-4 sm:p-5 rounded-lg border border-gray-200 md:sticky md:top-20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Filter className="h-5 w-5" /> Filters
              </h2>
              <div className="flex items-center gap-4">
                <button onClick={clearFilters} className="text-sm text-blue-600 hover:underline">
                  Clear All
                </button>
                <button onClick={() => setIsFilterOpen(false)} className="md:hidden text-gray-500 hover:text-gray-700">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Price Filter */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Max Price: ₹{priceRange.toLocaleString('en-IN')}</h3>
              <input 
                type="range" 
                min="10000" 
                max="200000" 
                step="5000"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>₹10K</span>
                <span>₹200K</span>
              </div>
            </div>

            {/* Brand Filter */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Brand</h3>
              <div className="space-y-2">
                {brands.map(brand => (
                  <label key={brand} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                      className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <span className="text-gray-700">{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* RAM Filter */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">RAM</h3>
              <div className="space-y-2">
                {ramOptions.map(ram => (
                  <label key={ram} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={selectedRam.includes(ram)}
                      onChange={() => toggleRam(ram)}
                      className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <span className="text-gray-700">{ram}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Storage Filter */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Storage</h3>
              <div className="space-y-2">
                {storageOptions.map(storage => (
                  <label key={storage} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={selectedStorage.includes(storage)}
                      onChange={() => toggleStorage(storage)}
                      className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <span className="text-gray-700">{storage}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-xl border border-gray-200 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your filters or search query.</p>
              <button 
                onClick={clearFilters}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading products...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
