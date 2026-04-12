'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { products as defaultProducts, brands, ramOptions, storageOptions } from '@/lib/data';
import { Filter, X } from 'lucide-react';
import useAdminStore from '@/lib/admin-store';
import { ProductSkeleton, FilterSkeleton } from '@/components/SkeletonLoader';

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialBrand = searchParams.get('brand');
  const searchQuery = searchParams.get('search');
  const admin = useAdminStore();
  const products = admin.products.length > 0 ? admin.products : defaultProducts;

  // Get active brands from admin store, fallback to hardcoded if empty
  const availableBrands = admin.brands.filter(b => b.active).length > 0
    ? admin.brands.filter(b => b.active).map(b => b.name)
    : brands;

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading delay for better UX
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);
  
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

  const activeFilterCount = selectedBrands.length + selectedRam.length + selectedStorage.length + (priceRange < 200000 ? 1 : 0);

  return (
    <div className="min-h-screen bg-[#f7f7f8]">
      {/* Premium Page Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-gray-400 font-semibold mb-1.5">Collection</p>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
                {searchQuery ? `Results for "${searchQuery}"` : 'All Smartphones'}
              </h1>
              <p className="text-sm text-gray-500 mt-1.5">{filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} available</p>
            </div>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="md:hidden self-start flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Filter className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="bg-white text-black text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center -mr-1">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Active Filter Pills */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
              {selectedBrands.map(brand => (
                <button key={brand} onClick={() => toggleBrand(brand)} className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full transition-colors">
                  {brand}
                  <X className="h-3 w-3" />
                </button>
              ))}
              {selectedRam.map(ram => (
                <button key={ram} onClick={() => toggleRam(ram)} className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full transition-colors">
                  {ram} RAM
                  <X className="h-3 w-3" />
                </button>
              ))}
              {selectedStorage.map(s => (
                <button key={s} onClick={() => toggleStorage(s)} className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full transition-colors">
                  {s}
                  <X className="h-3 w-3" />
                </button>
              ))}
              {priceRange < 200000 && (
                <button onClick={() => setPriceRange(200000)} className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full transition-colors">
                  Under ₹{priceRange.toLocaleString('en-IN')}
                  <X className="h-3 w-3" />
                </button>
              )}
              <button onClick={clearFilters} className="text-xs font-semibold text-red-500 hover:text-red-600 px-2 py-1.5 transition-colors">
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8">
        <div className="flex flex-col md:flex-row gap-5 sm:gap-8">

          {/* Mobile Filter Drawer Overlay */}
          {isFilterOpen && (
            <div className="fixed inset-0 bg-black/40 z-50 md:hidden" onClick={() => setIsFilterOpen(false)} />
          )}

          {/* Sidebar Filters */}
          <div className={`
            md:w-60 lg:w-[270px] flex-shrink-0
            ${isFilterOpen 
              ? 'fixed inset-y-0 left-0 w-[85%] max-w-[320px] bg-white z-50 shadow-2xl overflow-y-auto md:relative md:inset-auto md:w-60 lg:w-[270px] md:shadow-none md:z-auto' 
              : 'hidden md:block'}
          `}>
            {isLoading ? (
              <FilterSkeleton />
            ) : (
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200/80 md:sticky md:top-20 shadow-sm">
              {/* Filter Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center">
                    <Filter className="h-4 w-4 text-white" />
                  </div>
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="bg-black text-white text-[10px] font-bold rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </h2>
                <div className="flex items-center gap-3">
                  {activeFilterCount > 0 && (
                    <button onClick={clearFilters} className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors">
                      Reset
                    </button>
                  )}
                  <button onClick={() => setIsFilterOpen(false)} className="md:hidden w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <h3 className="text-xs uppercase tracking-[0.15em] text-gray-500 font-semibold mb-3">Price Range</h3>
                <div className="bg-gray-50 rounded-xl p-3.5">
                  <div className="text-center mb-3">
                    <span className="text-lg font-bold text-gray-900">₹{priceRange.toLocaleString('en-IN')}</span>
                    <span className="text-xs text-gray-400 ml-1">max</span>
                  </div>
                  <input 
                    type="range" 
                    min="10000" 
                    max="200000" 
                    step="5000"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full accent-black h-1.5 rounded-full appearance-none bg-gray-200 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-2 font-medium">
                    <span>₹10,000</span>
                    <span>₹2,00,000</span>
                  </div>
                </div>
              </div>

              {/* Brand Filter */}
              <div className="mb-6">
                <h3 className="text-xs uppercase tracking-[0.15em] text-gray-500 font-semibold mb-3">Brand</h3>
                <div className="space-y-1">
                  {brands.map(brand => (
                    <label key={brand} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors group">
                      <div className={`w-[18px] h-[18px] rounded border-2 flex items-center justify-center transition-all duration-200 ${selectedBrands.includes(brand) ? 'bg-black border-black' : 'border-gray-300 group-hover:border-gray-400'}`}>
                        {selectedBrands.includes(brand) && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <input type="checkbox" checked={selectedBrands.includes(brand)} onChange={() => toggleBrand(brand)} className="sr-only" />
                      <span className="text-sm text-gray-700 font-medium">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* RAM Filter */}
              <div className="mb-6">
                <h3 className="text-xs uppercase tracking-[0.15em] text-gray-500 font-semibold mb-3">RAM</h3>
                <div className="flex flex-wrap gap-2">
                  {ramOptions.map(ram => (
                    <button 
                      key={ram} 
                      onClick={() => toggleRam(ram)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 ${selectedRam.includes(ram) ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}
                    >
                      {ram}
                    </button>
                  ))}
                </div>
              </div>

              {/* Storage Filter */}
              <div>
                <h3 className="text-xs uppercase tracking-[0.15em] text-gray-500 font-semibold mb-3">Storage</h3>
                <div className="flex flex-wrap gap-2">
                  {storageOptions.map(storage => (
                    <button 
                      key={storage} 
                      onClick={() => toggleStorage(storage)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 ${selectedStorage.includes(storage) ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}
                    >
                      {storage}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Apply Button */}
              <button 
                onClick={() => setIsFilterOpen(false)} 
                className="md:hidden w-full mt-6 bg-black text-white font-semibold py-3 rounded-xl hover:bg-gray-800 transition-colors"
              >
                Show {filteredProducts.length} results
              </button>
            </div>
            )}
          </div>

        {/* Product Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl border border-gray-200/80 text-center shadow-sm">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Filter className="h-7 w-7 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your filters or search query.</p>
              <button
                onClick={clearFilters}
                className="bg-black text-white px-6 py-2.5 rounded-full hover:bg-gray-800 transition-colors font-medium text-sm"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        <div className="flex flex-col md:flex-row gap-3 sm:gap-6">
          <div className="md:w-56 lg:w-64 flex-shrink-0 hidden md:block">
            <FilterSkeleton />
          </div>
          <div className="flex-1">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
