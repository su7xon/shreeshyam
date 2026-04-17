'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, ChevronRight } from 'lucide-react';
import { products as defaultProducts, brands as defaultBrands } from '@/lib/data';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import useAdminStore from '@/lib/admin-store';

interface SearchResult {
  id: string;
  name: string;
  brand: string;
  image: string;
  price: number;
}

export default function SearchAutocomplete({ 
  value, 
  onChange, 
  onSearch, 
  className = '',
  autoFocus = false
}: { 
  value: string; 
  onChange: (value: string) => void; 
  onSearch: () => void;
  className?: string;
  autoFocus?: boolean;
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const admin = useAdminStore();
  const storeProducts = (admin.products || []).length > 0 ? admin.products.filter(p => p.active !== false) : (admin.isLoading ? [] : defaultProducts);
  const storeBrands = (admin.brands || []).length > 0 ? admin.brands.filter(b => b.active !== false).map(b => b.name) : (admin.isLoading ? [] : defaultBrands);

  const results = useMemo<SearchResult[]>(() => {
    if (!value.trim()) {
      return [];
    }

    const q = value.toLowerCase();
    const productResults = storeProducts
      .filter(p => (p.name?.toLowerCase().includes(q) || p.brand?.toLowerCase().includes(q)))
      .slice(0, 4)
      .map(p => ({
        id: p.id,
        name: p.name,
        brand: p.brand,
        image: p.image,
        price: p.price
      }));

    const brandResults = storeBrands
      .filter(b => b.toLowerCase().includes(q))
      .slice(0, 2)
      .map(b => ({
        id: `brand-${b}`,
        name: `Shop ${b}`,
        brand: b,
        image: '',
        price: 0
      }));

    return [...productResults, ...brandResults];
  }, [value, storeProducts, storeBrands]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClear = () => {
    onChange('');
    setShowDropdown(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className={`relative ${className}`} ref={ref}>
      <div className="flex items-stretch rounded-full bg-white shadow-sm overflow-hidden h-10 min-w-0">
        <div className="hidden sm:flex items-center px-4 bg-gray-50 border-r border-gray-200 text-sm font-medium text-gray-600 whitespace-nowrap">
          All Phones <ChevronRight className="h-4 w-4 ml-1 opacity-60" />
        </div>
        <input
          type="text"
          placeholder="Search smartphones, brands..."
          className="flex-1 min-w-0 px-3 sm:px-4 text-sm focus:outline-none placeholder-gray-400"
          value={value}
          autoFocus={autoFocus}
          onChange={(e) => {
            const nextValue = e.target.value;
            onChange(nextValue);
            setShowDropdown(nextValue.trim().length > 0);
          }}
          onFocus={() => {
            if (value.trim().length > 0) {
              setShowDropdown(true);
            }
          }}
          onKeyDown={(e) => e.key === 'Enter' && onSearch()}
        />
        {value && (
          <button onClick={handleClear} className="px-3 flex items-center">
            <X className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors" />
          </button>
        )}
        <button
          onClick={onSearch}
          className="bg-[#d32f2f] hover:bg-[#b71c1c] w-10 sm:w-12 flex items-center justify-center transition-all text-white hover:scale-[1.02]"
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </button>
      </div>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 animate-in fade-in zoom-in duration-200">
          <div className="py-1 max-h-80 overflow-y-auto">
            {results.map((result) => (
              <Link
                key={result.id}
                href={result.price > 0 ? `/products/${result.id}` : `/products?brand=${result.brand}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group"
                onClick={() => setShowDropdown(false)}
              >
                {result.image && (
                  <div className="relative flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden bg-gray-100 group-hover:bg-gray-200 transition-colors">
                    <Image
                      src={result.image}
                      alt={result.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 truncate">{result.name}</p>
                  <p className="text-sm text-gray-500">{result.brand}</p>
                  {result.price > 0 && (
                    <p className="text-sm font-bold text-[#1f3a4f] mt-0.5">
                      {formatPrice(result.price)}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

