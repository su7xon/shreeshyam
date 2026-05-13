'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import useAdminStore from '@/lib/admin-store';
import { products as defaultProducts } from '@/lib/data';
import { Plus, Search, Edit, Trash2, Eye, Smartphone } from 'lucide-react';

// Helper function to get the view link for a product
function getViewLink(product: any) {
  if (product.category === 'accessories') {
    return `/accessories/${product.id}`;
  }
  return `/products/${product.id}`;
}

function ProductsList() {
  const searchParams = useSearchParams();
  const initialBrand = searchParams.get('brand') || '';
  
  const [mounted, setMounted] = useState(false);
  const admin = useAdminStore();
  
  const [search, setSearch] = useState('');
  const [filterBrand, setFilterBrand] = useState(initialBrand);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeletingBulk, setIsDeletingBulk] = useState(false);

  useEffect(() => {
    setMounted(true);
    admin.initialize();
  }, []);

  // Update filterBrand if search params change
  useEffect(() => {
    const brand = searchParams.get('brand');
    if (brand !== null) {
      setFilterBrand(brand);
    }
  }, [searchParams]);

  // Avoid hydration mismatch by not rendering the list until mounted
  if (!mounted) return null;

  const products = admin.products;
  const brands = [...new Set(products.map((p) => p.brand))].sort();

  const filtered = products.filter((p) => {
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase());
    const matchBrand = !filterBrand || p.brand === filterBrand;
    return matchSearch && matchBrand;
  });

  const handleDelete = (id: string) => {
    admin.deleteProduct(id);
    setDeleteConfirm(null);
  };

  const handleBulkDelete = async () => {
    if (!selectedIds.length) return;
    if (confirm(`Are you sure you want to delete ${selectedIds.length} products?`)) {
      setIsDeletingBulk(true);
      try {
        await Promise.all(selectedIds.map(id => admin.deleteProduct(id)));
        setSelectedIds([]);
      } finally {
        setIsDeletingBulk(false);
      }
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map(p => p.id));
    }
  };

  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-white">Manage Products</h2>
          <p className="text-xs text-[#6b7280] mt-0.5">Control your storefront catalog</p>
        </div>
        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <button 
              onClick={handleBulkDelete}
              disabled={isDeletingBulk}
              className="px-4 py-2 bg-red-500/10 text-red-500 rounded-lg text-xs font-semibold hover:bg-red-500/20 transition-all border border-red-500/20 disabled:opacity-50"
            >
              {isDeletingBulk ? 'Deleting...' : `Delete ${selectedIds.length}`}
            </button>
          )}
          <Link href="/admin/products/new" className="admin-btn-primary text-xs sm:text-sm">
            <Plus className="h-4 w-4" /> Add Phone
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-card flex flex-col sm:flex-row gap-3 p-3 sm:p-4">
        <div className="flex-1 relative flex items-center">
          <Search className="absolute left-3.5 h-4 w-4 text-[#9ca3af] z-10" />
          <input
            type="text"
            placeholder="Search by name or brand…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-input pl-10"
          />
        </div>
        <select
          value={filterBrand}
          onChange={(e) => setFilterBrand(e.target.value)}
          className="admin-select w-full sm:w-auto min-w-[140px]"
        >
          <option value="">All Brands</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>
      </div>

      {/* Desktop Table */}
      <div className="admin-table-wrap hidden lg:block">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="w-10">
                  <input 
                    type="checkbox" 
                    checked={filtered.length > 0 && selectedIds.length === filtered.length}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 bg-white/5"
                  />
                </th>
                <th>Product</th>
                <th>Brand</th>
                <th>Price</th>
                <th>Specs</th>
                <th>Featured</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id}>
                  <td>
                    <input 
                      type="checkbox" 
                      checked={selectedIds.includes(product.id)}
                      onChange={() => toggleSelect(product.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 bg-white/5"
                    />
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-white/[0.04] overflow-hidden flex-shrink-0">
                        {product.image && (
                          <img src={product.image} alt={product.name} className="h-full w-full object-contain p-1" referrerPolicy="no-referrer" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[#e5e7eb] truncate max-w-[200px]">{product.name}</p>
                        <p className="text-[11px] text-[#6b7280]">{product.processor}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-[#9ca3af]">{product.brand}</td>
                  <td>
                    <p className="font-semibold text-[#e5e7eb]">₹{product.price.toLocaleString('en-IN')}</p>
                    {product.originalPrice && (
                      <p className="text-[11px] text-[#4b5563] line-through">₹{product.originalPrice.toLocaleString('en-IN')}</p>
                    )}
                  </td>
                  <td className="text-[#9ca3af]">
                    {product.ram || product.storage ? `${product.ram || 'N/A'} / ${product.storage || 'N/A'}` : 'N/A'}
                  </td>
                  <td>
                    <span className={`admin-badge ${product.featured ? 'admin-badge-green' : 'admin-badge-gray'}`}>
                      {product.featured ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={getViewLink(product)} target="_blank" className="admin-icon-btn p-2" title="View">
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link href={`/admin/products/${product.id}`} className="admin-icon-btn p-2" title="Edit">
                        <Edit className="h-4 w-4" />
                      </Link>
                      {deleteConfirm === product.id ? (
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleDelete(product.id)} className="px-2.5 py-1 text-[11px] font-semibold bg-[#ef4444] text-white rounded-md">Confirm</button>
                          <button onClick={() => setDeleteConfirm(null)} className="px-2.5 py-1 text-[11px] font-semibold bg-white/[0.06] text-[#9ca3af] rounded-md">Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => setDeleteConfirm(product.id)} className="admin-icon-btn p-2 hover:!text-[#ef4444] hover:!bg-[#ef4444]/10" title="Delete">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map((product) => (
          <div key={product.id} className="admin-card p-3 flex gap-3 items-center relative overflow-hidden group">
            <div className="absolute top-2 left-2 z-10">
              <input 
                type="checkbox" 
                checked={selectedIds.includes(product.id)}
                onChange={() => toggleSelect(product.id)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 bg-black/40"
              />
            </div>
            {product.featured && (
              <div className="absolute top-0 right-0">
                <div className="admin-badge admin-badge-green rounded-none rounded-bl-lg text-[9px] px-2 py-0.5">Featured</div>
              </div>
            )}
            <div className="h-20 w-20 rounded-lg bg-white/[0.04] overflow-hidden flex-shrink-0 flex items-center justify-center p-1.5">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-1 min-w-0 py-0.5">
              <p className="text-[10px] font-semibold tracking-wider text-[#60a5fa] uppercase">{product.brand}</p>
              <p className="text-sm font-medium text-[#e5e7eb] truncate mt-0.5">{product.name}</p>
              {product.ram || product.storage ? (
                <p className="text-[11px] text-[#6b7280] mt-0.5">{product.ram || 'N/A'} · {product.storage || 'N/A'}</p>
              ) : null}
              <div className="flex items-center justify-between mt-2">
                <p className="text-sm font-bold text-white">₹{product.price.toLocaleString('en-IN')}</p>
                <div className="flex gap-1">
                  <Link href={getViewLink(product)} target="_blank" className="admin-icon-btn p-1.5" title="View">
                    <Eye className="h-3.5 w-3.5" />
                  </Link>
                  <Link href={`/admin/products/${product.id}`} className="admin-icon-btn p-1.5">
                    <Edit className="h-3.5 w-3.5" />
                  </Link>
                  <button onClick={() => handleDelete(product.id)} className="admin-icon-btn p-1.5 hover:!text-[#ef4444]">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {!admin.isLoading && filtered.length === 0 && (
        <div className="admin-card">
          <div className="admin-empty-state">
            <div className="admin-empty-icon"><Smartphone className="h-6 w-6" /></div>
            <p className="admin-empty-title">No products found</p>
            <p className="admin-empty-desc">
              {admin.products.length === 0 ? "Your inventory is empty. Add your first product to get started." : "Try adjusting your search or filters."}
            </p>
          </div>
        </div>
      )}

      {/* Count */}
      <p className="text-xs text-[#6b7280]">Showing {filtered.length} of {products.length} products</p>
    </div>
  );
}

export default function AdminProductsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#b78b57]"></div>
      </div>
    }>
      <ProductsList />
    </Suspense>
  );
}
