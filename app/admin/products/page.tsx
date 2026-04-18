'use client';

import { useState } from 'react';
import Link from 'next/link';
import useAdminStore from '@/lib/admin-store';
import { Plus, Search, Edit, Trash2, Eye, Smartphone, UploadCloud, Loader2 } from 'lucide-react';
import { expandedProducts } from '@/lib/expanded-catalog';

export default function AdminProductsPage() {
  const admin = useAdminStore();
  const products = admin.products;
  const [search, setSearch] = useState('');
  const [filterBrand, setFilterBrand] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);

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

  const handleBulkImport = async () => {
    if (!confirm(`Import ${expandedProducts.length} products? This will update the live catalog.`)) return;
    setIsImporting(true);
    try {
      if (admin.importBulkProducts) {
        const sanitizedProducts = expandedProducts.map(({ id, ...rest }) => rest);
        await admin.importBulkProducts(sanitizedProducts as any);
        alert(`Successfully imported ${expandedProducts.length} products!`);
      } else {
        alert('Store method missing');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to import. Check console.');
    } finally {
      setIsImporting(false);
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
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleBulkImport}
            disabled={isImporting}
            className="admin-btn-secondary text-xs sm:text-sm disabled:opacity-50"
          >
            {isImporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
            {isImporting ? 'Importing…' : 'Bulk Import'}
          </button>
          <Link href="/admin/products/new" className="admin-btn-primary text-xs sm:text-sm">
            <Plus className="h-4 w-4" /> Add Phone
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-card flex flex-col sm:flex-row gap-3 p-3 sm:p-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4b5563]" />
          <input
            type="text"
            placeholder="Search by name or brand…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-input pl-9"
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
                  <td className="text-[#9ca3af]">{product.ram} / {product.storage}</td>
                  <td>
                    <span className={`admin-badge ${product.featured ? 'admin-badge-green' : 'admin-badge-gray'}`}>
                      {product.featured ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/products/${product.id}`} target="_blank" className="admin-icon-btn p-2" title="View">
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
              <p className="text-[11px] text-[#6b7280] mt-0.5">{product.ram} · {product.storage}</p>
              <div className="flex items-center justify-between mt-2">
                <p className="text-sm font-bold text-white">₹{product.price.toLocaleString('en-IN')}</p>
                <div className="flex gap-1">
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
      {filtered.length === 0 && (
        <div className="admin-card">
          <div className="admin-empty-state">
            <div className="admin-empty-icon"><Smartphone className="h-6 w-6" /></div>
            <p className="admin-empty-title">No products found</p>
            <p className="admin-empty-desc">Try adjusting your search or filters</p>
          </div>
        </div>
      )}

      {/* Count */}
      <p className="text-xs text-[#6b7280]">Showing {filtered.length} of {products.length} products</p>
    </div>
  );
}
