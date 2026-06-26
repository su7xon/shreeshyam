'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { products as defaultProducts, brands, ramOptions, storageOptions } from '@/lib/data';
import { Filter, X, Search, ChevronDown, ChevronUp, SlidersHorizontal, ChevronRight } from 'lucide-react';
import { usePaginatedProducts, useActiveBrands, useCategories } from '@/lib/hooks/useStoreData';
import { ProductSkeleton, FilterSkeleton } from '@/components/SkeletonLoader';
import { deduplicateProducts } from '@/lib/utils';
import FilterAccordion from '@/components/ui/FilterAccordion';
import ShopChatbot from '@/components/ShopChatbot';


function ProductsContent() {
  const searchParams = useSearchParams();
  const initialBrand = searchParams.get('brand');
  const initialCategory = searchParams.get('category');
  const searchQuery = searchParams.get('search');

  // Filters state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(initialBrand ? [initialBrand] : []);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategory ? [initialCategory] : []);
  const [selectedRam, setSelectedRam] = useState<string[]>([]);
  const [selectedStorage, setSelectedStorage] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number>(200000);
  const [stockStatus, setStockStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  
  // Use Infinite Query for cursor-based pagination
  const { 
    data, 
    isLoading, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = usePaginatedProducts({
    brand: selectedBrands.length === 1 ? selectedBrands[0] : undefined,
    category: selectedCategories.length === 1 ? selectedCategories[0] : undefined,
    inStock: stockStatus === 'in-stock' ? true : stockStatus === 'out-of-stock' ? false : undefined,
    searchQuery: searchQuery || undefined
  });

  const products = useMemo(() => {
    const allProducts = data?.pages.flatMap(page => page.data) || [];
    return deduplicateProducts(allProducts);
  }, [data]);

  const { data: fetchedBrands = [] } = useActiveBrands();
  const { data: fetchedCategories = [] } = useCategories();
  
  const popularBrands = ['SAMSUNG', 'APPLE', 'VIVO', 'OPPO', 'REALME', 'ONEPLUS', 'XIAOMI', 'MOTOROLA', 'IQOO', 'POCO', 'NOTHING', 'GOOGLE'];

  // Use the fetched brands for the filter list
  const dynamicBrands = useMemo(() => {
    const allNames = [
      ...brands,
      ...fetchedBrands.map(b => b.name)
    ];
    
    const uniqueBrands = Array.from(new Set(allNames.map(b => b.toUpperCase())));
    
    return uniqueBrands.sort((a, b) => {
      const indexA = popularBrands.indexOf(a);
      const indexB = popularBrands.indexOf(b);
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return a.localeCompare(b);
    });
  }, [fetchedBrands]);

  // Use the fetched categories for the filter list
  const dynamicCategories = useMemo(() => {
    const names = fetchedCategories.map(c => c.name);
    return Array.from(new Set(names)).sort();
  }, [fetchedCategories]);

  const [brandSearch, setBrandSearch] = useState<string>('');

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Client-side filtering for attributes not yet handled by server-side query
    // or which require multi-select "OR" logic that Firestore is limited in.
    
    // RAM filter
    if (selectedRam.length > 0) {
      result = result.filter(p => selectedRam.includes(p.ram));
    }

    // Storage filter
    if (selectedStorage.length > 0) {
      result = result.filter(p => selectedStorage.includes(p.storage));
    }

    // Price range filter
    if (priceRange < 200000) {
      result = result.filter(p => p.price <= priceRange);
    }

    // Sort
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, selectedRam, selectedStorage, priceRange, sortBy]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? [] : [brand]
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

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedCategories([]);
    setSelectedRam([]);
    setSelectedStorage([]);
    setPriceRange(200000);
    setStockStatus('all');
    setSortBy('newest');
    setBrandSearch('');
  };

  const activeFilterCount = selectedBrands.length + selectedCategories.length + selectedRam.length + selectedStorage.length + (priceRange < 200000 ? 1 : 0);

  return (
    <div className="min-h-screen bg-[#f7f7f8]">
      {/* Breadcrumbs */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex text-xs sm:text-sm text-gray-800 gap-2 items-center">
            <Link href="/" className="hover:text-black">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-black">mobiles</Link>
            <span>/</span>
            <span className="text-gray-700">all</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col md:flex-row gap-6">

          {/* Mobile Overlay */}
          {isFilterOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setIsFilterOpen(false)}
            />
          )}

{/* Sidebar Filters - Modern Design */}
          <aside className={`
            md:w-64 lg:w-[280px] flex-shrink-0
            ${isFilterOpen 
              ? 'fixed inset-y-0 left-0 w-[85%] max-w-[320px] bg-white z-50 shadow-2xl overflow-y-auto md:relative md:inset-auto md:w-64 lg:w-[280px] md:shadow-none md:z-auto' 
              : 'hidden md:block'}
          `}>
            {/* Mobile Header */}
            <div className="p-4 md:hidden border-b border-[#f3f4f6] flex items-center justify-between bg-white sticky top-0 z-10">
              <h2 className="font-bold text-lg text-[#111111]">Filters</h2>
              <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-[#f3f4f6] rounded-full transition-colors">
                <X className="h-5 w-5 text-[#6b7280]" />
              </button>
            </div>
            
            <div className="p-4 md:p-0 space-y-3">
              {/* Active Filters Pills */}
              {activeFilterCount > 0 && (
                <div className="bg-white rounded-xl border border-[#e5e7eb] p-3">
                  <div className="flex flex-wrap gap-2">
                    {selectedBrands.map(brand => (
                      <button
                        key={brand}
                        onClick={() => toggleBrand(brand)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#111111] text-white text-xs font-medium rounded-lg hover:bg-[#374151] transition-colors"
                      >
                        {brand}
                        <X className="w-3 h-3" />
                      </button>
                    ))}
                    {selectedRam.map(ram => (
                      <button
                        key={ram}
                        onClick={() => toggleRam(ram)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#3b82f6] text-white text-xs font-medium rounded-lg hover:bg-[#2563eb] transition-colors"
                      >
                        {ram}
                        <X className="w-3 h-3" />
                      </button>
                    ))}
                    {priceRange < 200000 && (
                      <button
                        onClick={() => setPriceRange(200000)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#f59e0b] text-white text-xs font-medium rounded-lg hover:bg-[#d97706] transition-colors"
                      >
                        ₹{priceRange.toLocaleString('en-IN')}
                        <X className="w-3 h-3" />
                      </button>
                    )}
                    <button
                      onClick={clearFilters}
                      className="text-xs text-[#ef4444] font-medium hover:underline"
                    >
                      Clear all
                    </button>
                  </div>
                </div>
              )}

              {/* Brand Filter - Accordion */}
              <FilterAccordion title="Brand" defaultOpen={true}>
                <div className="relative mb-3">
                  <input 
                    type="text" 
                    placeholder="Search brand..." 
                    value={brandSearch}
                    onChange={(e) => setBrandSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-[#f9fafb] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20"
                  />
                  <Search className="w-4 h-4 text-[#9ca3af] absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {dynamicBrands.filter(b => b.toLowerCase().includes(brandSearch.toLowerCase())).map(brand => (
                    <label key={brand} className="flex items-center gap-3 cursor-pointer group py-1.5 px-2 -mx-2 rounded-lg hover:bg-[#f3f4f6] transition-colors">
                      <input 
                        type="radio" 
                        name="brand-filter"
                        checked={selectedBrands.includes(brand)} 
                        onClick={() => toggleBrand(brand)}
                        onChange={() => {}}
                        className="w-4 h-4 accent-[#111111] rounded-full border-[#d1d5db]"
                      />
                      <span className="text-sm text-[#6b7280] group-hover:text-[#111111] transition-colors">{brand}</span>
                    </label>
                  ))}
                </div>
              </FilterAccordion>

              {/* Price Range Filter - Accordion */}
              <FilterAccordion title="Price Range" defaultOpen={true}>
                <div className="space-y-2">
                  {[
                    { label: 'Under ₹10K', value: 10000 },
                    { label: '₹10K - ₹20K', value: 20000 },
                    { label: '₹20K - ₹30K', value: 30000 },
                    { label: '₹30K - ₹40K', value: 40000 },
                    { label: '₹40K - ₹50K', value: 50000 },
                  ].map((range) => (
                    <label key={range.value} className="flex items-center gap-3 cursor-pointer group py-1.5 px-2 -mx-2 rounded-lg hover:bg-[#f3f4f6] transition-colors">
                      <input 
                        type="radio" 
                        name="price-range"
                        checked={priceRange === range.value} 
                        onChange={() => setPriceRange(range.value)} 
                        className="w-4 h-4 accent-[#111111]"
                      />
                      <span className="text-sm text-[#6b7280] group-hover:text-[#111111] transition-colors">{range.label}</span>
                    </label>
                  ))}
                </div>
              </FilterAccordion>

              {/* RAM Filter - Accordion */}
              <FilterAccordion title="RAM Size" defaultOpen={false}>
                <div className="space-y-2">
                   {ramOptions.map(ram => (
                       <label key={ram} className="flex items-center gap-3 cursor-pointer group py-1.5 px-2 -mx-2 rounded-lg hover:bg-[#f3f4f6] transition-colors">
                         <input 
                           type="checkbox" 
                           checked={selectedRam.includes(ram)} 
                           onChange={() => toggleRam(ram)} 
                           className="w-4 h-4 accent-[#111111] rounded border-[#d1d5db]"
                         />
                         <span className="text-sm text-[#6b7280] group-hover:text-[#111111] transition-colors">{ram}</span>
                       </label>
                     ))}
                </div>
              </FilterAccordion>

              {/* Storage Filter - Accordion */}
              <FilterAccordion title="Storage" defaultOpen={false}>
                <div className="space-y-2">
                   {storageOptions.map(storage => (
                       <label key={storage} className="flex items-center gap-3 cursor-pointer group py-1.5 px-2 -mx-2 rounded-lg hover:bg-[#f3f4f6] transition-colors">
                         <input 
                           type="checkbox" 
                           checked={selectedStorage.includes(storage)} 
                           onChange={() => toggleStorage(storage)} 
                           className="w-4 h-4 accent-[#111111] rounded border-[#d1d5db]"
                         />
                         <span className="text-sm text-[#6b7280] group-hover:text-[#111111] transition-colors">{storage}</span>
                       </label>
                     ))}
                </div>
              </FilterAccordion>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Top Bar Filters - Modern Design */}
            <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-4 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button 
                    onClick={() => setIsFilterOpen(true)}
                    className="md:hidden flex items-center gap-2 px-3 py-2 bg-[#f3f4f6] rounded-xl hover:bg-[#e5e7eb] transition-colors"
                  >
                    <SlidersHorizontal className="h-4 w-4 text-[#6b7280]" />
                    <span className="text-sm font-medium text-[#6b7280]">Filters</span>
                    {activeFilterCount > 0 && (
                      <span className="w-5 h-5 bg-[#111111] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>
                </div>
                
                <div className="flex items-center justify-between w-full sm:w-auto gap-4 sm:gap-6">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-[#9ca3af] font-medium uppercase tracking-wide">Stock</span>
                    <select 
                      value={stockStatus}
                      onChange={(e) => setStockStatus(e.target.value)}
                      className="text-sm font-semibold text-[#111111] bg-transparent focus:outline-none cursor-pointer outline-none border-none"
                    >
                      <option value="all">All</option>
                      <option value="in-stock">In Stock</option>
                      <option value="out-of-stock">Out of Stock</option>
                    </select>
                  </div>
                  <div className="w-px h-8 bg-[#e5e7eb] hidden sm:block" />
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-[#9ca3af] font-medium uppercase tracking-wide">Sort</span>
                    <select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="text-sm font-semibold text-[#111111] bg-transparent focus:outline-none cursor-pointer outline-none border-none"
                    >
                      <option value="newest">Newest</option>
                      <option value="price-low">Price ↑</option>
                      <option value="price-high">Price ↓</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>



            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Load More */}
              {hasNextPage && (
                <div className="flex justify-center mt-12">
                  <button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="bg-[#111111] text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-[#2a2a2a] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_14px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.2)] flex items-center gap-2"
                  >
                    {isFetchingNextPage ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        Next Page
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white p-12 rounded-2xl border border-gray-200/80 text-center shadow-sm">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Filter className="h-7 w-7 text-gray-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-800 mb-6">Try adjusting your filters or search query.</p>
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
    <>
      <Suspense fallback={
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
          <div className="flex flex-col md:flex-row gap-3 sm:gap-6">
            <div className="md:w-56 lg:w-64 flex-shrink-0 hidden md:block">
              <FilterSkeleton />
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
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
      <ShopChatbot />
    </>
  );
}

