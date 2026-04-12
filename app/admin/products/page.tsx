'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import useAdminStore from '@/lib/admin-store';
import { Plus, Search, Edit, Trash2, Eye, Filter, Smartphone } from 'lucide-react';

export default function AdminProductsPage() {
  const admin = useAdminStore();
  const products = admin.products;
  const [search, setSearch] = useState('');
  const [filterBrand, setFilterBrand] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl tracking-tight font-bold text-[var(--color-text)]">Manage Products</h2>
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] font-medium tracking-wide uppercase mt-1">Control your storefront catalog</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 sm:py-2.5 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-xl sm:rounded-full hover:bg-[var(--color-primary-hover)] hover:shadow-lg transition-all"
        >
          <Plus className="h-5 w-5" />
          Add New Phone
        </Link>
      </div>

      {/* Filters */}
      <div className="premium-surface rounded-2xl sm:rounded-full border border-[var(--color-border)] p-3 sm:p-2 sm:pr-4 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[var(--color-primary)] transition-colors" />
            <input
              type="text"
              placeholder="Search phones by name or brand..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 sm:py-2.5 bg-[var(--color-surface-soft)]/50 sm:bg-transparent border border-[var(--color-border)] sm:border-transparent sm:border-r sm:border-[var(--color-border)] rounded-xl sm:rounded-none text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30 placeholder:text-gray-400 transition-colors"
            />
          </div>
          <div className="flex items-center gap-2 px-1 relative">
            <Filter className="absolute left-4 h-4 w-4 text-[var(--color-accent)] pointer-events-none" />
            <select
              value={filterBrand}
              onChange={(e) => setFilterBrand(e.target.value)}
              className="w-full sm:w-auto pl-10 pr-8 py-3 sm:py-2.5 bg-[var(--color-accent)]/5 hover:bg-[var(--color-accent)]/10 border border-transparent rounded-xl sm:rounded-full text-sm font-bold text-[var(--color-text)] appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30 transition-colors min-w-[140px]"
            >
              <option value="">All Brands</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Product Table */}
      <div className="premium-surface rounded-2xl border border-[var(--color-border)] overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--color-surface-soft)] border-b border-[var(--color-border)]">
              <tr>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Product</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Brand</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Price</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">RAM / Storage</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Featured</th>
                <th className="text-right px-6 py-3.5 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {filtered.map((product) => (
                <tr key={product.id} className="hover:bg-[var(--color-surface-soft)]/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-lg bg-[var(--color-surface-soft)] overflow-hidden flex-shrink-0">
                        {/* @ts-ignore */}
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-contain p-1"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-[var(--color-text)] text-sm truncate max-w-[200px]">{product.name}</p>
                        <p className="text-xs text-[var(--color-text-muted)]">{product.processor}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-[var(--color-text-muted)]">{product.brand}</td>
                  <td className="px-4 py-4">
                    <p className="text-sm font-semibold text-[var(--color-text)]">₹{product.price.toLocaleString('en-IN')}</p>
                    {product.originalPrice && (
                      <p className="text-xs text-gray-400 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</p>
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm text-[var(--color-text-muted)]">{product.ram} / {product.storage}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${product.featured ? 'bg-[var(--color-success)]/15 text-[var(--color-success)]' : 'bg-gray-100 text-gray-500'}`}>
                      {product.featured ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/products/${product.id}`}
                        target="_blank"
                        className="p-2 rounded-lg text-gray-400 hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-colors"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="p-2 rounded-lg text-gray-400 hover:text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      {deleteConfirm === product.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="px-3 py-1.5 text-xs font-medium bg-red-600 text-white rounded-lg hover:bg-red-700"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="px-3 py-1.5 text-xs font-medium bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(product.id)}
                          className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
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

        {/* Mobile Cards Premium */}
        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[var(--color-bg)]">
          {filtered.map((product) => (
            <div key={product.id} className="premium-surface rounded-2xl p-4 shadow-sm border border-[var(--color-border)] flex gap-4 items-center relative overflow-hidden group hover:shadow-md transition-shadow">
              {product.featured && (
                <div className="absolute top-0 right-0">
                  <div className="bg-[var(--color-success)] text-white text-[9px] font-bold px-3 py-1 rounded-bl-xl shadow-sm tracking-widest uppercase">
                    Featured
                  </div>
                </div>
              )}
              <div className="h-24 w-24 rounded-xl bg-[var(--color-surface-soft)] border border-[var(--color-border)] overflow-hidden flex-shrink-0 flex items-center justify-center p-2 relative">
                {/* @ts-ignore */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-contain drop-shadow-sm group-hover:scale-110 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex-1 min-w-0 py-1">
                <p className="text-[10px] font-bold tracking-widest text-[var(--color-accent)] uppercase mb-1">{product.brand}</p>
                <p className="font-bold text-[var(--color-text)] text-sm leading-snug truncate mb-1 pr-2">{product.name}</p>
                <p className="text-xs font-medium text-[var(--color-text-muted)] mb-2 truncate">
                  {product.ram} • {product.storage}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <p className="text-[15px] font-extrabold text-[var(--color-text)] tracking-tight">₹{product.price.toLocaleString('en-IN')}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="absolute bottom-3 right-3 flex gap-2">
                <Link href={`/admin/products/${product.id}`} className="bg-[var(--color-accent)]/10 text-[var(--color-accent)] p-2 rounded-lg hover:bg-[var(--color-accent)]/20 transition-colors">
                  <Edit className="h-4 w-4" />
                </Link>
                <button onClick={() => handleDelete(product.id)} className="bg-red-50 text-red-500 p-2 rounded-lg hover:bg-red-100 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="p-12 text-center">
            <Smartphone className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-[var(--color-text-muted)] font-medium">No products found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      <p className="text-sm text-[var(--color-text-muted)]">Showing {filtered.length} of {products.length} products</p>
    </div>
  );
}
