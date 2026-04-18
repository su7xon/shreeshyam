'use client';

import { useState } from 'react';
import useAdminStore, { BANNER_PLACEMENTS, Banner, BannerPlacement } from '@/lib/admin-store';
import { Plus, Trash2, Edit2, Eye, EyeOff, ArrowUp, ArrowDown, Save, X, Loader2, Upload, ImageIcon } from 'lucide-react';
import { uploadToCloudinary } from '@/lib/cloudinary';

const placementLabel: Record<BannerPlacement, string> = {
  hero: 'Hero Slider',
  'small-cards': 'Small Banners',
  trending: 'Trending Section',
  'before-about': 'Before About Us',
};

export default function AdminBannersPage() {
  const admin = useAdminStore();
  const banners = [...admin.banners].sort((a, b) => {
    if (a.placement === b.placement) return a.order - b.order;
    return a.placement.localeCompare(b.placement);
  });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [form, setForm] = useState({
    id: '', title: '', subtitle: '', image: '', link: '',
    placement: 'hero' as BannerPlacement, active: true,
  });

  const bannersByPlacement = BANNER_PLACEMENTS.map((placement) => ({
    placement,
    label: placementLabel[placement],
    items: banners.filter((banner) => banner.placement === placement),
  }));

  const resetForm = () => {
    setForm({ id: '', title: '', subtitle: '', image: '', link: '', placement: 'hero', active: true });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (banner: Banner) => {
    setForm({ id: banner.id, title: banner.title, subtitle: banner.subtitle || '', image: banner.image, link: banner.link || '', placement: banner.placement, active: banner.active });
    setEditingId(banner.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.image.trim()) { alert('Please add an image URL'); return; }
    if (editingId) {
      admin.updateBanner(editingId, { title: form.title.trim() || '', subtitle: form.subtitle, image: form.image, link: form.link, placement: form.placement, active: form.active });
    } else {
      const samePlacement = banners.filter((b) => b.placement === form.placement);
      const maxOrder = samePlacement.length > 0 ? Math.max(...samePlacement.map((b) => b.order)) : -1;
      admin.addBanner({ id: `banner-${Date.now()}`, title: form.title.trim() || '', subtitle: form.subtitle, image: form.image, link: form.link, placement: form.placement, order: maxOrder + 1, active: form.active });
    }
    resetForm();
  };

  const handleDelete = (id: string) => admin.deleteBanner(id);

  const moveBanner = (id: string, placement: BannerPlacement, direction: 'up' | 'down') => {
    const sorted = banners.filter((b) => b.placement === placement).sort((a, b) => a.order - b.order);
    const index = sorted.findIndex((b) => b.id === id);
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === sorted.length - 1)) return;
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    const newIds = sorted.map((b) => b.id);
    [newIds[index], newIds[swapIndex]] = [newIds[swapIndex], newIds[index]];
    admin.reorderBanners(placement, newIds);
  };

  const toggleActive = (id: string) => {
    const banner = banners.find((b) => b.id === id);
    if (banner) admin.updateBanner(id, { active: !banner.active });
  };

  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-white">Homepage Banners</h2>
          <p className="text-xs text-[#6b7280] mt-0.5">Manage every banner placement from one panel</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="admin-btn-primary text-xs sm:text-sm">
          <Plus className="h-4 w-4" /> Add Banner
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="admin-form-panel">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">{editingId ? 'Edit Banner' : 'New Banner'}</h3>
            <button onClick={resetForm} className="admin-icon-btn p-1.5"><X className="h-4 w-4" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="admin-label">Placement *</label>
              <select value={form.placement} onChange={(e) => setForm({ ...form, placement: e.target.value as BannerPlacement })} className="admin-select w-full">
                {BANNER_PLACEMENTS.map((p) => <option key={p} value={p}>{placementLabel[p]}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="admin-label">Title (optional)</label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Leave empty for image-only" className="admin-input" />
            </div>
            <div className="sm:col-span-2">
              <label className="admin-label">Subtitle</label>
              <input type="text" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} placeholder="e.g., The ultimate experience" className="admin-input" />
            </div>
            <div className="sm:col-span-2">
              <label className="admin-label">Image URL *</label>
              <div className="flex gap-2">
                <input type="text" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="Paste image URL…" className="admin-input flex-1" />
                <div className="relative overflow-hidden shrink-0">
                  <input type="file" accept="image/*" disabled={isUploading} onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try { setIsUploading(true); const url = await uploadToCloudinary(file); setForm({ ...form, image: url }); }
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
              <label className="admin-label">Link (optional)</label>
              <input type="text" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="e.g., /products/2" className="admin-input" />
            </div>
            <div>
              <label className="flex items-center gap-2.5 cursor-pointer text-sm text-[#9ca3af]">
                <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="h-4 w-4 rounded bg-transparent border-white/20 text-[#3b82f6] focus:ring-[#3b82f6]" />
                Active
              </label>
            </div>
          </div>

          {/* Preview */}
          {form.image && (
            <div className="mt-4 rounded-xl overflow-hidden bg-gradient-to-br from-[#1a1c23] to-[#0f1117] p-5 flex items-center h-36 sm:h-44 border border-white/[0.04]">
              <div className="flex-1">
                <h4 className="text-white font-semibold text-sm">{form.title}</h4>
                {form.subtitle && <p className="text-[#6b7280] text-xs mt-1">{form.subtitle}</p>}
              </div>
              <div className="flex-1 h-full flex items-center justify-end">
                <img src={form.image} alt="Preview" className="max-h-full max-w-full object-contain rounded-lg" />
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 mt-5">
            <button onClick={resetForm} className="admin-btn-secondary">Cancel</button>
            <button onClick={handleSave} disabled={isUploading} className="admin-btn-primary disabled:opacity-50">
              {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {editingId ? 'Update' : 'Create'} Banner
            </button>
          </div>
        </div>
      )}

      {/* Banners by Placement */}
      <div className="space-y-6">
        {bannersByPlacement.map((group) => (
          <div key={group.placement} className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">{group.label}</h3>
                <p className="text-[11px] text-[#6b7280] mt-0.5">Manage banners for this section</p>
              </div>
              <button onClick={() => { setForm({ id: '', title: '', subtitle: '', image: '', link: '', placement: group.placement, active: true }); setShowForm(true); setEditingId(null); }} className="admin-btn-secondary text-xs">
                <Plus className="h-3.5 w-3.5" /> Add
              </button>
            </div>

            {group.items.map((banner, index) => (
              <div key={banner.id} className={`admin-card overflow-hidden transition-all ${!banner.active ? 'opacity-50' : ''}`}>
                <div className="flex flex-col sm:flex-row">
                  {/* Thumbnail */}
                  <div className="sm:w-56 h-32 sm:h-auto bg-gradient-to-br from-[#1a1c23] to-[#0f1117] flex items-center p-4 relative overflow-hidden">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-semibold text-xs truncate">{banner.title}</h4>
                      {banner.subtitle && <p className="text-[#6b7280] text-[10px] mt-0.5 truncate">{banner.subtitle}</p>}
                    </div>
                    <div className="flex-shrink-0 h-full flex items-center justify-end pl-3">
                      {banner.image && <img src={banner.image} alt={banner.title} className="max-h-20 object-contain" referrerPolicy="no-referrer" />}
                    </div>
                  </div>
                  {/* Details */}
                  <div className="flex-1 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col gap-0.5">
                        <button onClick={() => moveBanner(banner.id, group.placement, 'up')} disabled={index === 0} className="admin-icon-btn p-1 disabled:opacity-20">
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => moveBanner(banner.id, group.placement, 'down')} disabled={index === group.items.length - 1} className="admin-icon-btn p-1 disabled:opacity-20">
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#e5e7eb]">{banner.title}</p>
                        <p className="text-[11px] text-[#6b7280] mt-0.5">Order: {index + 1}{banner.link && ` · ${banner.link}`}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => toggleActive(banner.id)} className={`admin-icon-btn p-2 ${banner.active ? '!text-[#4ade80]' : ''}`} title={banner.active ? 'Deactivate' : 'Activate'}>
                        {banner.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </button>
                      <button onClick={() => handleEdit(banner)} className="admin-icon-btn p-2" title="Edit">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(banner.id)} className="admin-icon-btn p-2 hover:!text-[#ef4444] hover:!bg-[#ef4444]/10" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {group.items.length === 0 && (
              <div className="admin-card">
                <div className="admin-empty-state py-8">
                  <div className="admin-empty-icon"><ImageIcon className="h-5 w-5" /></div>
                  <p className="admin-empty-title text-xs">No banners in this placement</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
