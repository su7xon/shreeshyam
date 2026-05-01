'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { products as defaultProducts, brands, ramOptions, storageOptions } from '@/lib/data';
import { Filter, X, Search } from 'lucide-react';
import useAdminStore from '@/lib/admin-store';
import { ProductSkeleton, FilterSkeleton } from '@/components/SkeletonLoader';
import { deduplicateProducts } from '@/lib/utils';

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialBrand = searchParams.get('brand');
  const initialCategory = searchParams.get('category');
  const searchQuery = searchParams.get('search');
  const admin = useAdminStore();
  const rawProducts = admin.products.length > 0 ? admin.products : defaultProducts;
  const products = useMemo(() => deduplicateProducts(rawProducts), [rawProducts]);
  const isLoading = admin.isLoading;
  
  // Filters state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(initialBrand ? [initialBrand] : []);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategory ? [initialCategory] : []);
  const [selectedRam, setSelectedRam] = useState<string[]>([]);
  const [selectedStorage, setSelectedStorage] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number>(200000);
  const [stockStatus, setStockStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [brandSearch, setBrandSearch] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 32;
  
  const popularBrands = ['SAMSUNG', 'APPLE', 'VIVO', 'OPPO', 'REALME', 'ONEPLUS', 'XIAOMI', 'MOTOROLA', 'IQOO', 'POCO', 'NOTHING', 'GOOGLE'];

  // Derive brands dynamically from products
  const dynamicBrands = useMemo(() => {
    // Normalize all brand names to uppercase for deduplication
    const allNames = [
      ...brands.map(b => b.toUpperCase()),
      ...products.map(p => p.brand?.toUpperCase()).filter(Boolean)
    ];
    
    const uniqueBrands = Array.from(new Set(allNames));
    const hasUnbranded = products.some(p => !p.brand);
    
    // Sort logic: Popular brands first in their defined order, then others alphabetically
    const sorted = uniqueBrands.sort((a, b) => {
      const indexA = popularBrands.indexOf(a);
      const indexB = popularBrands.indexOf(b);
      
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      
      return a.localeCompare(b);
    });

    if (hasUnbranded) sorted.push("OTHER");
    return sorted;
  }, [products, brands]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

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
      result = result.filter(p => {
        const brandUpper = p.brand?.toUpperCase();
        if (selectedBrands.includes(brandUpper)) return true;
        if (selectedBrands.includes("OTHER") && !brandUpper) return true;
        return false;
      });
    }

    // Category filter
    if (selectedCategories.length > 0) {
      result = result.filter(p => p.category && selectedCategories.includes(p.category));
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

    // Stock Status filter
    if (stockStatus === 'in-stock') {
      // Logic: if variants exist, check variants. otherwise assume active=in stock
      result = result.filter(p => p.active !== false);
    } else if (stockStatus === 'out-of-stock') {
      result = result.filter(p => p.active === false);
    }

    // Sorting
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      result.sort((a, b) => {
        const dateA = a.createdAt ? (typeof a.createdAt === 'string' ? new Date(a.createdAt).getTime() : a.createdAt.seconds * 1000) : 0;
        const dateB = b.createdAt ? (typeof b.createdAt === 'string' ? new Date(b.createdAt).getTime() : b.createdAt.seconds * 1000) : 0;
        return dateB - dateA;
      });
    }

    return result;
  }, [products, selectedBrands, selectedCategories, selectedRam, selectedStorage, priceRange, searchQuery, stockStatus, sortBy]);

  // Reset to page 1 whenever filters change
  useEffect(() => { setCurrentPage(1); }, [selectedBrands, selectedCategories, selectedRam, selectedStorage, priceRange, searchQuery, stockStatus, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

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

  const getPaginationItems = () => {
    const pages = [];
    if (totalPages <= 6) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  const activeFilterCount = selectedBrands.length + selectedCategories.length + selectedRam.length + selectedStorage.length + (priceRange < 200000 ? 1 : 0);

  return (
    <div className="min-h-screen bg-[#f7f7f8]">
      {/* Breadcrumbs */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex text-xs sm:text-sm text-gray-500 gap-2 items-center">
            <Link href="/" className="hover:text-black">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-black">mobiles</Link>
            <span>/</span>
            <span className="text-gray-400">all</span>
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

          {/* Sidebar Filters */}
          <aside className={`
            md:w-64 lg:w-[280px] flex-shrink-0
            ${isFilterOpen 
              ? 'fixed inset-y-0 left-0 w-[85%] max-w-[320px] bg-white z-50 shadow-2xl overflow-y-auto md:relative md:inset-auto md:w-64 lg:w-[280px] md:shadow-none md:z-auto' 
              : 'hidden md:block'}
          `}>
            {/* Mobile Header */}
            <div className="p-4 md:hidden border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <h2 className="font-bold text-lg">Filters</h2>
              <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 md:p-0 space-y-4">
              {/* Brand Filter */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-100">
                  <h3 className="text-sm font-bold text-gray-800">Brand</h3>
                  <button className="w-5 h-5 bg-black text-white flex items-center justify-center rounded-sm text-xs">-</button>
                </div>
                <div className="p-4">
                  <div className="relative mb-4">
                    <input 
                      type="text" 
                      placeholder="Search brand" 
                      value={brandSearch}
                      onChange={(e) => setBrandSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:border-black"
                    />
                    <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {dynamicBrands.filter(b => b.toLowerCase().includes(brandSearch.toLowerCase())).map(brand => (
                      <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="radio" 
                          name="brand-filter"
                          checked={selectedBrands.includes(brand)} 
                          onClick={() => toggleBrand(brand)}
                          onChange={() => {}} // Controlled component
                          className="w-4 h-4 accent-black rounded-full border-gray-300"
                        />
                        <span className="text-sm text-gray-600 group-hover:text-black transition-colors">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-100">
                  <h3 className="text-sm font-bold text-gray-800">Price Range</h3>
                  <button className="w-5 h-5 bg-black text-white flex items-center justify-center rounded-sm text-xs">-</button>
                </div>
                <div className="p-4 space-y-3">
                  {[
                    { label: 'Below ₹10,000.00', value: 10000 },
                    { label: '₹10,000.00 - ₹20,000.00', value: 20000 },
                    { label: '₹20,000.00 - ₹30,000.00', value: 30000 },
                    { label: '₹30,000.00 - ₹40,000.00', value: 40000 },
                    { label: '₹40,000.00 - ₹50,000.00', value: 50000 },
                  ].map((range) => (
                    <label key={range.label} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="radio" 
                        name="price-range"
                        checked={priceRange === range.value} 
                        onChange={() => setPriceRange(range.value)} 
                        className="w-4 h-4 accent-[black]"
                      />
                      <span className="text-sm text-gray-600 group-hover:text-black transition-colors">{range.label}</span>
                    </label>
                  ))}
                  <div className="pt-2">
                    <input 
                      type="range" 
                      min="5000" 
                      max="200000" 
                      step="5000"
                      value={priceRange}
                      onChange={(e) => setPriceRange(Number(e.target.value))}
                      className="w-full accent-black h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-[10px] text-gray-400 mt-1 flex justify-between">
                      <span>₹5,000</span>
                      <span>₹2,00,000</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* RAM Filter */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-100">
                  <h3 className="text-sm font-bold text-gray-800">RAM Size</h3>
                  <button className="w-5 h-5 bg-black text-white flex items-center justify-center rounded-sm text-xs">-</button>
                </div>
                <div className="p-4 space-y-2">
                   {ramOptions.map(ram => (
                      <label key={ram} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          checked={selectedRam.includes(ram)} 
                          onChange={() => toggleRam(ram)} 
                          className="w-4 h-4 accent-black rounded border-gray-300"
                        />
                        <span className="text-sm text-gray-600 group-hover:text-black transition-colors">{ram}</span>
                      </label>
                    ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Top Bar Filters */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button 
                    onClick={() => setIsFilterOpen(true)}
                    className="md:hidden p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Filter className="h-4 w-4 text-gray-600" />
                  </button>
                  <div className="bg-black text-white text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded uppercase tracking-wider">
                    Category: {selectedCategories.length > 0 ? selectedCategories.join(', ') : 'all'}
                  </div>
                </div>
                
                <div className="flex items-center justify-between w-full sm:w-auto gap-4 sm:gap-8">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-gray-400 font-medium">Stock Status:</span>
                    <select 
                      value={stockStatus}
                      onChange={(e) => setStockStatus(e.target.value)}
                      className="text-xs font-bold text-gray-700 bg-transparent focus:outline-none cursor-pointer outline-none border-none"
                    >
                      <option value="all">All Items</option>
                      <option value="in-stock">In Stock</option>
                      <option value="out-of-stock">Out of Stock</option>
                    </select>
                  </div>
                  <div className="w-[1px] h-8 bg-gray-100 hidden sm:block" />
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-gray-400 font-medium">Sort By:</span>
                    <select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="text-xs font-bold text-gray-700 bg-transparent focus:outline-none cursor-pointer outline-none border-none"
                    >
                      <option value="newest">Newest First</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {paginatedProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                {paginatedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-1.5 mt-8 flex-wrap">
                  <button
                    onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); scrollToTop(); }}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-lg text-sm font-medium bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    ← Prev
                  </button>
                  {getPaginationItems().map((item, index) => (
                    item === '...' ? (
                      <span key={`ellipsis-${index}`} className="px-1 text-gray-400">...</span>
                    ) : (
                      <button
                        key={item}
                        onClick={() => { setCurrentPage(item as number); scrollToTop(); }}
                        className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all ${
                          item === currentPage
                            ? 'bg-black text-white shadow-sm'
                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {item}
                      </button>
                    )
                  ))}
                  <button
                    onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); scrollToTop(); }}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded-lg text-sm font-medium bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
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
  );
}
