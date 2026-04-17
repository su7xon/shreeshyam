'use client';

import { useState } from 'react';
import useAdminStore, { BANNER_PLACEMENTS, Banner, BannerPlacement } from '@/lib/admin-store';
import { Plus, Trash2, Edit2, Eye, EyeOff, ArrowUp, ArrowDown, Save, X, Loader2, Upload } from 'lucide-react';
import { uploadToCloudinary } from '@/lib/cloudinary';

const placementLabel: Record<BannerPlacement, string> = {
  hero: 'Hero Slider',
  'small-cards': '3 Small Banners (after hero)',
  trending: 'Trending Section Banner',
  'before-about': 'Banner Before About Us',
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
    id: '',
    title: '',
    subtitle: '',
    image: '',
    link: '',
    placement: 'hero' as BannerPlacement,
    active: true,
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
    setForm({
      id: banner.id,
      title: banner.title,
      subtitle: banner.subtitle || '',
      image: banner.image,
      link: banner.link || '',
      placement: banner.placement,
      active: banner.active,
    });
    setEditingId(banner.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.image.trim()) {
      alert('Please add an image URL');
      return;
    }

    if (editingId) {
      admin.updateBanner(editingId, {
        title: form.title.trim() || 'Banner',
        subtitle: form.subtitle,
        image: form.image,
        link: form.link,
        placement: form.placement,
        active: form.active,
      });
    } else {
      const samePlacement = banners.filter((b) => b.placement === form.placement);
      const maxOrder = samePlacement.length > 0 ? Math.max(...samePlacement.map((b) => b.order)) : -1;
      const newBanner: Banner = {
        id: `banner-${Date.now()}`,
        title: form.title.trim() || 'Banner',
        subtitle: form.subtitle,
        image: form.image,
        link: form.link,
        placement: form.placement,
        order: maxOrder + 1,
        active: form.active,
      };
      admin.addBanner(newBanner);
    }

    resetForm();
  };

  const handleDelete = (id: string) => {
    admin.deleteBanner(id);
  };

  const moveBanner = (id: string, placement: BannerPlacement, direction: 'up' | 'down') => {
    const sorted = banners.filter((b) => b.placement === placement).sort((a, b) => a.order - b.order);
    const index = sorted.findIndex((b) => b.id === id);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === sorted.length - 1)
    )
      return;

    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    const newIds = sorted.map((b) => b.id);
    [newIds[index], newIds[swapIndex]] = [newIds[swapIndex], newIds[index]];
    admin.reorderBanners(placement, newIds);
  };

  const toggleActive = (id: string) => {
    const banner = banners.find((b) => b.id === id);
    if (banner) {
      admin.updateBanner(id, { active: !banner.active });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1a1a2e]">Homepage Banners</h2>
          <p className="text-sm text-gray-500 mt-1">Manage every homepage banner placement from one panel</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
        >
          <Plus className="h-5 w-5" />
          Add Banner
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-[#1a1a2e]">
              {editingId ? 'Edit Banner' : 'New Banner'}
            </h3>
            <button onClick={resetForm} className="p-2 rounded-lg hover:bg-gray-100">
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Placement *</label>
              <select
                value={form.placement}
                onChange={(e) => setForm({ ...form, placement: e.target.value as BannerPlacement })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 bg-gray-50"
              >
                {BANNER_PLACEMENTS.map((placement) => (
                  <option key={placement} value={placement}>
                    {placementLabel[placement]}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Title (optional)</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Leave empty for image-only banner"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 bg-gray-50"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
              <input
                type="text"
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                placeholder="e.g., The ultimate Galaxy AI experience"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 bg-gray-50"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Image URL *</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="Paste image URL..."
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 bg-gray-50"
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
                          setForm({ ...form, image: url });
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Link (optional)</label>
              <input
                type="text"
                value={form.link}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
                placeholder="e.g., /products/2"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 bg-gray-50"
              />
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  className="h-5 w-5 rounded text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-600">Active</span>
              </label>
            </div>
          </div>

          {/* Preview */}
          {form.image && (
            <div className="mt-5">
              <p className="text-sm font-medium text-gray-700 mb-2">Preview</p>
              <div className="h-40 sm:h-52 rounded-xl overflow-hidden bg-gradient-to-br from-[#211c17] via-[#2a241f] to-[#17130f] p-6 flex items-center relative">
                <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_16%_20%,#d4b78a_0%,transparent_25%),radial-gradient(circle_at_88%_50%,#a37949_0%,transparent_32%)] pointer-events-none" />
                <div className="flex-1 relative z-10">
                  <h4 className="text-white font-bold text-lg">{form.title}</h4>
                  {form.subtitle && <p className="text-gray-300 text-sm mt-1">{form.subtitle}</p>}
                </div>
                <div className="flex-1 relative z-10 h-full flex items-center justify-end">
                  {/* @ts-ignore */}
                  <img src={form.image} alt="Preview" className="max-h-full max-w-full object-contain rounded-lg" />
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
              className="px-8 py-3 bg-[var(--color-primary)] text-white font-bold rounded-xl hover:bg-[var(--color-primary-hover)] hover:shadow-lg disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
              {editingId ? 'Update Banner' : 'Create Banner'}
            </button>
          </div>
        </div>
      )}

       {/* Banners List */}
       <div className="space-y-8">
         {bannersByPlacement.map((group) => (
           <div key={group.placement} className="space-y-4">
             <div className="flex items-center justify-between">
               <div>
                 <h3 className="text-lg font-bold text-[#1a1a2e]">{group.label}</h3>
                 <p className="text-xs text-gray-500 mt-1">Add, remove, activate and reorder banners for this section.</p>
               </div>
               <button
                 onClick={() => {
                   setForm({ id: '', title: '', subtitle: '', image: '', link: '', placement: group.placement, active: true });
                   setShowForm(true);
                   setEditingId(null);
                 }}
                 className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 font-medium rounded hover:bg-purple-100 transition-colors"
               >
                 <Plus className="h-4 w-4" />
                 Add Banner
               </button>
             </div>

            {group.items.map((banner, index) => (
              <div
                key={banner.id}
                className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${
                  banner.active ? 'border-gray-200' : 'border-gray-200 opacity-60'
                }`}
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Preview */}
                  <div className="sm:w-72 h-44 sm:h-auto relative bg-gradient-to-br from-[#211c17] via-[#2a241f] to-[#17130f] flex items-center p-5">
                    <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_16%_20%,#d4b78a_0%,transparent_25%),radial-gradient(circle_at_88%_50%,#a37949_0%,transparent_32%)] pointer-events-none" />
                    <div className="relative z-10 flex-1">
                      <h4 className="text-white font-bold text-base">{banner.title}</h4>
                      {banner.subtitle && <p className="text-gray-300 text-xs mt-1">{banner.subtitle}</p>}
                    </div>
                    <div className="relative z-10 h-full flex items-center justify-end pl-4">
                      {banner.image && (
                        <img src={banner.image} alt={banner.title} className="max-h-28 object-contain" referrerPolicy="no-referrer" />
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {/* Reorder */}
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => moveBanner(banner.id, group.placement, 'up')}
                          disabled={index === 0}
                          className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ArrowUp className="h-4 w-4 text-gray-500" />
                        </button>
                        <button
                          onClick={() => moveBanner(banner.id, group.placement, 'down')}
                          disabled={index === group.items.length - 1}
                          className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ArrowDown className="h-4 w-4 text-gray-500" />
                        </button>
                      </div>
                      <div>
                        <p className="font-semibold text-[#1a1a2e]">{banner.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Order: {index + 1} {banner.link && `• Links to ${banner.link}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleActive(banner.id)}
                        className={`p-2 rounded-lg transition-colors ${banner.active ? 'text-emerald-600 hover:bg-emerald-50' : 'text-gray-400 hover:bg-gray-100'}`}
                        title={banner.active ? 'Deactivate' : 'Activate'}
                      >
                        {banner.active ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                      </button>
                      <button
                        onClick={() => handleEdit(banner)}
                        className="p-2 rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(banner.id)}
                        className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {group.items.length === 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
                <p className="text-gray-500 font-medium">No banners in this placement</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
