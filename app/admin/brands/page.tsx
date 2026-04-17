'use client';

import useAdminStore, { Brand } from '@/lib/admin-store';
import { useState } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, Search, Smartphone, Check, X, Loader2, Upload } from 'lucide-react';
import { uploadToCloudinary } from '@/lib/cloudinary';

export default function AdminBrandsPage() {
  const admin = useAdminStore();
  const brands = admin.brands;
  const products = admin.products;
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [form, setForm] = useState({
    id: '',
    name: '',
    logo: '',
    description: '',
    active: true,
  });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  const resetForm = () => {
    setForm({ id: '', name: '', logo: '', description: '', active: true });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (brand: Brand) => {
    setForm({
      id: brand.id,
      name: brand.name,
      logo: brand.logo || '',
      description: brand.description || '',
      active: brand.active,
    });
    setEditingId(brand.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      alert('Brand name is required');
      return;
    }

    // Check for duplicate name
    const duplicate = brands.find(
      (b) => b.name.toLowerCase() === form.name.trim().toLowerCase() && b.id !== editingId
    );
    if (duplicate) {
      alert('A brand with this name already exists');
      return;
    }

    if (editingId) {
      admin.updateBrand(editingId, {
        name: form.name.trim(),
        logo: form.logo.trim(),
        description: form.description.trim(),
        active: form.active,
      });
    } else {
      const now = new Date().toISOString();
      admin.addBrand({
        id: `brand-${Date.now()}`,
        name: form.name.trim(),
        logo: form.logo.trim(),
        description: form.description.trim(),
        active: form.active,
        createdAt: now,
        updatedAt: now,
      });
    }

    resetForm();
  };

  const handleDelete = (id: string) => {
    admin.deleteBrand(id);
    setDeleteConfirm(null);
  };

  const toggleActive = (id: string) => {
    const brand = brands.find((b) => b.id === id);
    if (brand) {
      admin.updateBrand(id, { active: !brand.active });
    }
  };

  const getProductCount = (brandName: string) => {
    return products.filter((p) => p.brand === brandName).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl tracking-tight font-bold text-[var(--color-text)]">Brand Management</h2>
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] font-medium tracking-wide uppercase mt-1">Manage your store brands</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-xl hover:bg-[var(--color-primary-hover)] hover:shadow-lg transition-all"
        >
          <Plus className="h-5 w-5" />
          Add Brand
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-[#1a1a2e]">
              {editingId ? 'Edit Brand' : 'Add New Brand'}
            </h3>
            <button onClick={resetForm} className="p-2 rounded-lg hover:bg-gray-100">
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Brand Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g., Apple, Samsung, OnePlus"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/50 bg-gray-50"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={form.logo}
                  onChange={(e) => setForm({ ...form, logo: e.target.value })}
                  placeholder="Paste logo image URL..."
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/50 bg-gray-50"
                />
                <div className="relative overflow-hidden shrink-0">
                  <input 
                    type="file" 
                    accept="image/*" 
                    disabled={isUploading}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          setIsUploading(true);
                          const url = await uploadToCloudinary(file);
                          setForm({ ...form, logo: url });
                        } catch (error) {
                          alert('Upload failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
                        } finally {
                          setIsUploading(false);
                        }
                      }
                    }} 
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" 
                  />
                  <button 
                    type="button" 
                    disabled={isUploading}
                    className="px-4 py-2.5 bg-gray-100 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-200 disabled:opacity-50 transition-colors flex items-center justify-center h-full min-w-[100px]"
                  >
                    {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Upload className="h-4 w-4 mr-2" /> Upload</>}
                  </button>
                </div>
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description (optional)</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Short description about this brand..."
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/50 bg-gray-50 resize-none"
              />
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  className="h-5 w-5 rounded text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                />
                <span className="text-sm text-gray-600">Active (show in brand list)</span>
              </label>
            </div>
          </div>

          {/* Preview */}
          {form.name && (
            <div className="mt-5 p-4 bg-gray-50 rounded-xl">
              <p className="text-sm font-medium text-gray-700 mb-2">Preview</p>
              <div className="flex items-center gap-4">
                {form.logo ? (
                  <img src={form.logo} alt={form.name} className="h-10 w-10 object-contain rounded-lg bg-white p-1 border" />
                ) : (
                  <div className="h-10 w-10 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center">
                    <span className="text-lg font-bold text-[var(--color-primary)]">{form.name[0]}</span>
                  </div>
                )}
                <div>
                  <p className="font-semibold text-[var(--color-text)]">{form.name}</p>
                  {form.description && <p className="text-xs text-gray-500 mt-0.5">{form.description}</p>}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 mt-6">
            <button onClick={resetForm} className="px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isUploading}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-hover)] text-white font-semibold rounded-xl hover:shadow-lg disabled:opacity-50 transition-all"
            >
              {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Check className="h-5 w-5" />}
              {editingId ? 'Update' : 'Add'} Brand
            </button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="premium-surface rounded-xl border border-[var(--color-border)] p-3 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search brands..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 bg-transparent text-sm font-medium focus:outline-none placeholder:text-gray-400"
        />
      </div>

      {/* Brands List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBrands.map((brand) => {
          const productCount = getProductCount(brand.name);
          return (
            <div
              key={brand.id}
              className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all ${
                brand.active ? 'border-gray-200' : 'border-gray-200 opacity-60'
              }`}
            >
              <div className="p-4">
                <div className="flex items-start gap-3">
                  {brand.logo ? (
                    <img src={brand.logo} alt={brand.name} className="h-12 w-12 object-contain rounded-lg bg-gray-50 p-1 border flex-shrink-0" />
                  ) : (
                    <div className="h-12 w-12 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl font-bold text-[var(--color-primary)]">{brand.name[0]}</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-[var(--color-text)] truncate">{brand.name}</p>
                      <span className={`inline-flex items-center px-1.5 py-0.5 text-[9px] font-semibold rounded-full ${brand.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {brand.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    {brand.description && (
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{brand.description}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      <Smartphone className="h-3 w-3" />
                      {productCount} product{productCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleActive(brand.id)}
                    className={`p-2 rounded-lg transition-colors ${brand.active ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}
                    title={brand.active ? 'Deactivate' : 'Activate'}
                  >
                    {brand.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => handleEdit(brand)}
                    className="p-2 rounded-lg text-gray-400 hover:text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                </div>
                {deleteConfirm === brand.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDelete(brand.id)}
                      className="px-2 py-1 text-xs font-medium bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="px-2 py-1 text-xs font-medium bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirm(brand.id)}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredBrands.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
          <Smartphone className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-[var(--color-text-muted)] font-medium">No brands found</p>
          <p className="text-sm text-gray-400 mt-1">Try adjusting your search or add a new brand.</p>
        </div>
      )}
    </div>
  );
}
