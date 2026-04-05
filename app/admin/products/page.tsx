'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import useAdminStore from '@/lib/admin-store';
import { Plus, Search, Edit, Trash2, Star, Eye, Filter, Smartphone } from 'lucide-react';

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
          <h2 className="text-2xl sm:text-3xl tracking-tight font-bold text-[#201b16]">Manage Products</h2>
          <p className="text-xs sm:text-sm text-gray-500 font-medium tracking-wide uppercase mt-1">Control your storefront catalog</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 sm:py-2.5 bg-[#1f3a4f] text-white text-sm font-semibold rounded-xl sm:rounded-full hover:bg-[#173143] hover:shadow-lg transition-all"
        >
          <Plus className="h-5 w-5" />
          Add New Phone
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl sm:rounded-full border border-gray-100 shadow-sm p-3 sm:p-2 sm:pr-4 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#1f3a4f] transition-colors" />
            <input
              type="text"
              placeholder="Search phones by name or brand..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 sm:py-2.5 bg-gray-50/50 sm:bg-transparent border border-gray-100 sm:border-transparent sm:border-r sm:border-gray-200 rounded-xl sm:rounded-none text-sm font-medium focus:outline-none focus:ring-0 placeholder:text-gray-400 transition-colors"
            />
          </div>
          <div className="flex items-center gap-2 px-1 relative">
            <Filter className="absolute left-4 h-4 w-4 text-[#b78b57] pointer-events-none" />
            <select
              value={filterBrand}
              onChange={(e) => setFilterBrand(e.target.value)}
              className="w-full sm:w-auto pl-10 pr-8 py-3 sm:py-2.5 bg-[#b78b57]/5 hover:bg-[#b78b57]/10 border border-transparent rounded-xl sm:rounded-full text-sm font-bold text-[#201b16] appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#b78b57]/30 transition-colors min-w-[140px]"
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
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Brand</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">RAM / Storage</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Featured</th>
                <th className="text-right px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                        {/* @ts-ignore */}
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-contain p-1"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-[#1a1a2e] text-sm truncate max-w-[200px]">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.processor}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">{product.brand}</td>
                  <td className="px-4 py-4">
                    <p className="text-sm font-semibold text-[#1a1a2e]">₹{product.price.toLocaleString('en-IN')}</p>
                    {product.originalPrice && (
                      <p className="text-xs text-gray-400 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</p>
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">{product.ram} / {product.storage}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                      <span className="text-sm font-medium">{product.rating}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${product.featured ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                      {product.featured ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/products/${product.id}`}
                        target="_blank"
                        className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="p-2 rounded-lg text-gray-400 hover:text-[#b78b57] hover:bg-[#b78b57]/10 transition-colors"
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
        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#f8f4ee]">
          {filtered.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-4 items-center relative overflow-hidden group hover:shadow-md transition-shadow">
              {product.featured && (
                <div className="absolute top-0 right-0">
                  <div className="bg-emerald-500 text-white text-[9px] font-bold px-3 py-1 rounded-bl-xl shadow-sm tracking-widest uppercase">
                    Featured
                  </div>
                </div>
              )}
              <div className="h-24 w-24 rounded-xl bg-[#f8f4ee]/80 border border-gray-50 overflow-hidden flex-shrink-0 flex items-center justify-center p-2 relative">
                {/* @ts-ignore */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-contain drop-shadow-sm group-hover:scale-110 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex-1 min-w-0 py-1">
                <p className="text-[10px] font-bold tracking-widest text-[#b78b57] uppercase mb-1">{product.brand}</p>
                <p className="font-bold text-[#201b16] text-sm leading-snug truncate mb-1 pr-2">{product.name}</p>
                <p className="text-xs font-medium text-gray-500 mb-2 truncate">
                  {product.ram} • {product.storage}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <p className="text-[15px] font-extrabold text-[#1a1a2e] tracking-tight">₹{product.price.toLocaleString('en-IN')}</p>
                </div>
              </div>
              
              {/* Actions */}
              <div className="absolute bottom-3 right-3 flex gap-2">
                <Link href={`/admin/products/${product.id}`} className="bg-[#b78b57]/10 text-[#b78b57] p-2 rounded-lg">
                  <Edit className="h-4 w-4" />
                </Link>
                <button onClick={() => handleDelete(product.id)} className="bg-red-50 text-red-500 p-2 rounded-lg">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="p-12 text-center">
            <Smartphone className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No products found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      <p className="text-sm text-gray-500">Showing {filtered.length} of {products.length} products</p>
    </div>
  );
}
