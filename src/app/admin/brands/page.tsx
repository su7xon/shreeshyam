'use client';

import useAdminStore, { Brand } from '@/lib/admin-store';
import { useState } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, Search, Smartphone, Check, X, Loader2, Upload, Building2 } from 'lucide-react';
import { uploadToCloudinary } from '@/lib/cloudinary';

export default function AdminBrandsPage() {
  const admin = useAdminStore();
  const brands = admin.brands;
  const products = admin.products;
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [form, setForm] = useState({ id: '', name: '', logo: '', description: '', active: true });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filteredBrands = brands.filter((b) => b.name.toLowerCase().includes(search.toLowerCase()));

  const resetForm = () => { setForm({ id: '', name: '', logo: '', description: '', active: true }); setShowForm(false); setEditingId(null); };

  const handleEdit = (brand: Brand) => {
    setForm({ id: brand.id, name: brand.name, logo: brand.logo || '', description: brand.description || '', active: brand.active });
    setEditingId(brand.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) { alert('Brand name is required'); return; }
    const duplicate = brands.find((b) => b.name.toLowerCase() === form.name.trim().toLowerCase() && b.id !== editingId);
    if (duplicate) { alert('A brand with this name already exists'); return; }
    if (editingId) {
      admin.updateBrand(editingId, { name: form.name.trim(), logo: form.logo.trim(), description: form.description.trim(), active: form.active });
    } else {
      admin.addBrand({ name: form.name.trim(), logo: form.logo.trim(), description: form.description.trim(), active: form.active });
    }
    resetForm();
  };

  const handleDelete = (id: string) => { admin.deleteBrand(id); setDeleteConfirm(null); };
  const toggleActive = (id: string) => { const brand = brands.find((b) => b.id === id); if (brand) admin.updateBrand(id, { active: !brand.active }); };
  const getProductCount = (brandName: string) => products.filter((p) => p.brand === brandName).length;

  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-white">Brand Management</h2>
          <p className="text-xs text-[#6b7280] mt-0.5">Manage your store brands</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="admin-btn-primary text-xs sm:text-sm">
          <Plus className="h-4 w-4" /> Add Brand
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="admin-form-panel">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">{editingId ? 'Edit Brand' : 'Add New Brand'}</h3>
            <button onClick={resetForm} className="admin-icon-btn p-1.5"><X className="h-4 w-4" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="admin-label">Brand Name *</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g., Apple, Samsung, OnePlus" className="admin-input" />
            </div>
            <div className="sm:col-span-2">
              <label className="admin-label">Logo</label>
              <div className="flex gap-2">
                <input type="text" value={form.logo} onChange={(e) => setForm({ ...form, logo: e.target.value })} placeholder="Paste logo image URL…" className="admin-input flex-1" />
                <div className="relative overflow-hidden shrink-0">
                  <input type="file" accept="image/*" disabled={isUploading} onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try { setIsUploading(true); const url = await uploadToCloudinary(file); setForm({ ...form, logo: url }); }
                      catch (error) { alert('Upload failed: ' + (error instanceof Error ? error.message : 'Unknown error')); }
                      finally { setIsUploading(false); }
                    }
                  }} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                  <button type="button" disabled={isUploading} className="admin-btn-secondary h-full min-w-[90px]">
                    {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Upload className="h-4 w-4" /> Upload</>}
                  </button>
                </div>
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="admin-label">Description (optional)</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Short description…" rows={3} className="admin-input resize-none" />
            </div>
            <div>
              <label className="flex items-center gap-2.5 cursor-pointer text-sm text-[#9ca3af]">
                <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="h-4 w-4 rounded bg-transparent border-white/20 text-[#3b82f6] focus:ring-[#3b82f6]" />
                Active (show in brand list)
              </label>
            </div>
          </div>

          {/* Preview */}
          {form.name && (
            <div className="mt-4 p-3 bg-white/[0.02] rounded-xl border border-white/[0.04]">
              <p className="text-[10px] text-[#6b7280] font-medium uppercase tracking-wider mb-2">Preview</p>
              <div className="flex items-center gap-3">
                {form.logo ? (
                  <img src={form.logo} alt={form.name} className="h-10 w-10 object-contain rounded-lg bg-white/[0.06] p-1" />
                ) : (
                  <div className="h-10 w-10 rounded-lg bg-[#3b82f6]/10 flex items-center justify-center">
                    <span className="text-lg font-bold text-[#60a5fa]">{form.name[0]}</span>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-[#e5e7eb]">{form.name}</p>
                  {form.description && <p className="text-[11px] text-[#6b7280] mt-0.5">{form.description}</p>}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 mt-5">
            <button onClick={resetForm} className="admin-btn-secondary">Cancel</button>
            <button onClick={handleSave} disabled={isUploading} className="admin-btn-primary disabled:opacity-50">
              {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              {editingId ? 'Update' : 'Add'} Brand
            </button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="admin-card p-3 relative">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4b5563]" />
        <input type="text" placeholder="Search brands…" value={search} onChange={(e) => setSearch(e.target.value)} className="admin-input pl-9" />
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredBrands.map((brand) => {
          const productCount = getProductCount(brand.name);
          return (
            <div key={brand.id} className={`admin-card overflow-hidden transition-all ${!brand.active ? 'opacity-50' : ''}`}>
              <div className="p-4">
                <div className="flex items-start gap-3">
                  {brand.logo ? (
                    <img src={brand.logo} alt={brand.name} className="h-11 w-11 object-contain rounded-lg bg-white/[0.06] p-1 flex-shrink-0" />
                  ) : (
                    <div className="h-11 w-11 rounded-lg bg-[#3b82f6]/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-bold text-[#60a5fa]">{brand.name[0]}</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-[#e5e7eb] truncate">{brand.name}</p>
                      <span className={`admin-badge text-[9px] ${brand.active ? 'admin-badge-green' : 'admin-badge-gray'}`}>
                        {brand.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    {brand.description && <p className="text-[11px] text-[#6b7280] mt-0.5 line-clamp-2">{brand.description}</p>}
                    <p className="text-[11px] text-[#4b5563] mt-1.5 flex items-center gap-1">
                      <Smartphone className="h-3 w-3" /> {productCount} product{productCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>
              {/* Actions */}
              <div className="px-4 py-2.5 bg-white/[0.02] border-t border-white/[0.04] flex items-center justify-between">
                <div className="flex items-center gap-0.5">
                  <button onClick={() => toggleActive(brand.id)} className={`admin-icon-btn p-1.5 ${brand.active ? '!text-[#4ade80]' : ''}`} title={brand.active ? 'Deactivate' : 'Activate'}>
                    {brand.active ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                  </button>
                  <button onClick={() => handleEdit(brand)} className="admin-icon-btn p-1.5" title="Edit">
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                {deleteConfirm === brand.id ? (
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleDelete(brand.id)} className="px-2 py-1 text-[10px] font-semibold bg-[#ef4444] text-white rounded-md">Yes</button>
                    <button onClick={() => setDeleteConfirm(null)} className="px-2 py-1 text-[10px] font-semibold bg-white/[0.06] text-[#9ca3af] rounded-md">No</button>
                  </div>
                ) : (
                  <button onClick={() => setDeleteConfirm(brand.id)} className="admin-icon-btn p-1.5 hover:!text-[#ef4444] hover:!bg-[#ef4444]/10" title="Delete">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredBrands.length === 0 && (
        <div className="admin-card">
          <div className="admin-empty-state">
            <div className="admin-empty-icon"><Building2 className="h-6 w-6" /></div>
            <p className="admin-empty-title">No brands found</p>
            <p className="admin-empty-desc">Try adjusting your search or add a new brand</p>
          </div>
        </div>
      )}
    </div>
  );
}
