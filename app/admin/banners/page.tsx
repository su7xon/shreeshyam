'use client';

import { useState } from 'react';
import useAdminStore, { BANNER_PLACEMENTS, Banner, BannerPlacement } from '@/lib/admin-store';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Eye, 
  EyeOff, 
  ArrowUp, 
  ArrowDown, 
  Save, 
  X, 
  Loader2, 
  Upload, 
  ImageIcon,
  Layout,
  Monitor,
  Smartphone,
  Info
} from 'lucide-react';
import { uploadToCloudinary } from '@/lib/cloudinary';

const placementLabel: Record<BannerPlacement, string> = {
  hero: 'Main Hero Slider',
  'small-cards': 'Feature Cards',
  trending: 'Trending Highlights',
  'before-about': 'Wide Promotion',
};

const placementSpecs: Record<BannerPlacement, string> = {
  hero: '1920x800px (Aspect 2.4:1)',
  'small-cards': '600x400px (Aspect 3:2)',
  trending: '1200x500px (Aspect 2.4:1)',
  'before-about': '1400x350px (Aspect 4:1)',
};

export default function AdminBannersPage() {
  const admin = useAdminStore();
  const [activeTab, setActiveTab] = useState<BannerPlacement>('hero');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [form, setForm] = useState({
    id: '', title: '', subtitle: '', image: '', link: '',
    placement: 'hero' as BannerPlacement, active: true,
  });

  const banners = [...admin.banners].sort((a, b) => a.order - b.order);
  const filteredBanners = banners.filter(b => b.placement === activeTab);

  const resetForm = () => {
    setForm({ id: '', title: '', subtitle: '', image: '', link: '', placement: activeTab, active: true });
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

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this banner?')) {
      admin.deleteBanner(id);
    }
  };

  const moveBanner = (id: string, direction: 'up' | 'down') => {
    const index = filteredBanners.findIndex((b) => b.id === id);
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === filteredBanners.length - 1)) return;
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    const newIds = filteredBanners.map((b) => b.id);
    [newIds[index], newIds[swapIndex]] = [newIds[swapIndex], newIds[index]];
    admin.reorderBanners(activeTab, newIds);
  };

  const toggleActive = (id: string) => {
    const banner = banners.find((b) => b.id === id);
    if (banner) admin.updateBanner(id, { active: !banner.active });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Layout className="h-6 w-6 text-[#3b82f6]" />
            Banner Management
          </h2>
          <p className="text-sm text-[#6b7280] mt-1">Control visual promotions across the storefront</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowForm(true); }} 
          className="admin-btn-primary shadow-lg shadow-blue-500/10"
        >
          <Plus className="h-4 w-4" /> Add New Banner
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sidebar Navigation - Tabs */}
        <div className="lg:col-span-3 space-y-2">
          <p className="text-[10px] font-bold text-[#4b5563] uppercase tracking-widest px-3 mb-2">Placements</p>
          {BANNER_PLACEMENTS.map((p) => (
            <button
              key={p}
              onClick={() => setActiveTab(p)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === p 
                ? 'bg-[#1e293b] text-[#3b82f6] shadow-sm border border-[#3b82f6]/20' 
                : 'text-[#9ca3af] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-3">
                {p === 'hero' && <Monitor className="h-4 w-4" />}
                {p === 'small-cards' && <Smartphone className="h-4 w-4" />}
                {p === 'trending' && <ImageIcon className="h-4 w-4" />}
                {p === 'before-about' && <Layout className="h-4 w-4" />}
                <span>{placementLabel[p]}</span>
              </div>
              <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full">
                {banners.filter(b => b.placement === p).length}
              </span>
            </button>
          ))}

          {/* Info Card */}
          <div className="mt-6 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 space-y-2">
            <div className="flex items-center gap-2 text-blue-400">
              <Info className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase">Pro Tip</span>
            </div>
            <p className="text-[11px] text-[#94a3b8] leading-relaxed">
              Recommended for {placementLabel[activeTab]}:<br/>
              <span className="text-white font-medium">{placementSpecs[activeTab]}</span>
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9 space-y-4">
          {/* Active Tab Content Header */}
          <div className="flex items-center justify-between mb-4 px-1">
            <div>
              <h3 className="text-base font-semibold text-white">{placementLabel[activeTab]}</h3>
              <p className="text-[11px] text-[#6b7280]">Currently displaying {filteredBanners.length} banners</p>
            </div>
          </div>

          {/* Banner Form (Modal-like Inline) */}
          {showForm && (
            <div className="admin-card border-[#3b82f6]/30 bg-[#1e293b]/50 backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-300 mb-6 border-2 ring-4 ring-[#3b82f6]/5">
              <div className="admin-card-header border-b border-white/5">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  {editingId ? <Edit2 className="h-4 w-4 text-blue-400" /> : <Plus className="h-4 w-4 text-blue-400" />}
                  {editingId ? 'Modify Existing Banner' : 'Compose New Banner'}
                </h3>
                <button onClick={resetForm} className="admin-icon-btn p-1.5 hover:bg-white/10"><X className="h-4 w-4" /></button>
              </div>
              <div className="p-5 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="admin-label text-[#94a3b8]">Placement</label>
                    <select 
                      value={form.placement} 
                      onChange={(e) => setForm({ ...form, placement: e.target.value as BannerPlacement })} 
                      className="admin-select w-full bg-[#0f1117] border-white/10"
                    >
                      {BANNER_PLACEMENTS.map((p) => <option key={p} value={p}>{placementLabel[p]}</option>)}
                    </select>
                  </div>
                  
                  <div>
                    <label className="admin-label text-[#94a3b8]">Headline</label>
                    <input 
                      type="text" 
                      value={form.title} 
                      onChange={(e) => setForm({ ...form, title: e.target.value })} 
                      placeholder="e.g., iPhone 15 Pro Max" 
                      className="admin-input bg-[#0f1117] border-white/10" 
                    />
                  </div>
                  
                  <div>
                    <label className="admin-label text-[#94a3b8]">Sub-headline</label>
                    <input 
                      type="text" 
                      value={form.subtitle} 
                      onChange={(e) => setForm({ ...form, subtitle: e.target.value })} 
                      placeholder="e.g., Titanium Design. Action Button." 
                      className="admin-input bg-[#0f1117] border-white/10" 
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="admin-label text-[#94a3b8]">Image Resource (Required)</label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input 
                        type="text" 
                        value={form.image} 
                        onChange={(e) => setForm({ ...form, image: e.target.value })} 
                        placeholder="Direct URL or upload using button →" 
                        className="admin-input flex-1 bg-[#0f1117] border-white/10" 
                      />
                      <div className="relative shrink-0">
                        <input type="file" accept="image/*" disabled={isUploading} onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try { setIsUploading(true); const url = await uploadToCloudinary(file); setForm({ ...form, image: url }); }
                            catch (error) { alert('Upload failed: ' + (error instanceof Error ? error.message : 'Unknown error')); }
                            finally { setIsUploading(false); if (e.target) e.target.value = ''; }
                          }
                        }} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10" />
                        <button type="button" disabled={isUploading} className="admin-btn-secondary h-full min-w-[120px] bg-white/5 border-white/10 hover:bg-white/10 text-white">
                          {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Upload className="h-4 w-4" /> Upload File</>}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="admin-label text-[#94a3b8]">Destination Link</label>
                    <input 
                      type="text" 
                      value={form.link} 
                      onChange={(e) => setForm({ ...form, link: e.target.value })} 
                      placeholder="e.g., /products/iphone-15" 
                      className="admin-input bg-[#0f1117] border-white/10" 
                    />
                  </div>

                  <div className="flex items-end pb-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          checked={form.active} 
                          onChange={(e) => setForm({ ...form, active: e.target.checked })} 
                          className="sr-only peer"
                        />
                        <div className="w-10 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3b82f6]"></div>
                      </div>
                      <span className="text-sm font-medium text-[#9ca3af] group-hover:text-white transition-colors">Visible to customers</span>
                    </label>
                  </div>
                </div>

                {/* Live Preview Card */}
                {form.image && (
                  <div className="relative group overflow-hidden rounded-2xl bg-[#0f1117] border border-white/5 h-48 sm:h-56 flex items-center justify-center p-8">
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                       <img src={form.image} alt="bg" className="w-full h-full object-cover blur-2xl" />
                    </div>
                    <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 w-full max-w-2xl">
                      <div className="flex-1 text-center sm:text-left min-w-0">
                        <span className="text-[10px] text-[#3b82f6] font-bold tracking-widest uppercase mb-1 block">Live Preview</span>
                        <h4 className="text-lg sm:text-xl font-bold text-white leading-tight truncate">{form.title || 'Untitled Banner'}</h4>
                        {form.subtitle && <p className="text-[#64748b] text-sm mt-1 line-clamp-1">{form.subtitle}</p>}
                      </div>
                      <div className="h-32 sm:h-40 aspect-[4/3] relative flex-shrink-0">
                        <img src={form.image} alt="Preview" className="w-full h-full object-contain drop-shadow-2xl" />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button onClick={resetForm} className="px-5 py-2.5 text-sm font-medium text-[#9ca3af] hover:text-white transition-colors">Discard</button>
                  <button 
                    onClick={handleSave} 
                    disabled={isUploading} 
                    className="admin-btn-primary h-11 px-8 rounded-xl"
                  >
                    {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Commit Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Banner List */}
          <div className="space-y-4">
            {filteredBanners.map((banner, index) => (
              <div 
                key={banner.id} 
                className={`group admin-card overflow-hidden transition-all duration-300 border-l-4 ${
                  !banner.active 
                  ? 'border-l-gray-700 opacity-60 grayscale' 
                  : 'border-l-blue-500 hover:shadow-xl hover:shadow-blue-500/5'
                }`}
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Visual Preview Section */}
                  <div className="sm:w-64 h-40 sm:h-auto bg-[#0a0c10] flex items-center justify-center p-6 relative group-hover:bg-[#0c0f14] transition-colors overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20"></div>
                    {banner.image ? (
                      <img 
                        src={banner.image} 
                        alt={banner.title} 
                        className="max-h-full max-w-full object-contain relative z-10 drop-shadow-lg transform group-hover:scale-110 transition-transform duration-500" 
                        referrerPolicy="no-referrer" 
                      />
                    ) : (
                      <ImageIcon className="h-8 w-8 text-[#1f2937]" />
                    )}
                    <div className="absolute bottom-2 left-2 flex items-center gap-1.5 z-10">
                      <span className="text-[9px] font-bold bg-black/60 backdrop-blur-md text-white px-2 py-0.5 rounded border border-white/5">
                        {index + 1}
                      </span>
                    </div>
                  </div>

                  {/* Content & Action Section */}
                  <div className="flex-1 p-5 flex flex-col justify-center min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {!banner.active && (
                            <span className="text-[9px] font-bold bg-white/5 text-[#9ca3af] px-1.5 py-0.5 rounded uppercase tracking-wider">Draft</span>
                          )}
                          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{placementLabel[banner.placement]}</span>
                        </div>
                        <h4 className="text-base font-bold text-white truncate">{banner.title || 'Untitled Banner'}</h4>
                        <p className="text-xs text-[#64748b] line-clamp-1">{banner.subtitle || 'No description provided'}</p>
                        {banner.link && (
                          <div className="flex items-center gap-1.5 text-[10px] text-[#4b5563] mt-2">
                             <span className="w-1.5 h-1.5 rounded-full bg-blue-500/40"></span>
                             Destination: <span className="text-[#9ca3af] italic">{banner.link}</span>
                          </div>
                        )}
                      </div>

                      {/* Controls Area */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3">
                        {/* Order Controls */}
                        <div className="flex items-center gap-1 p-1 bg-white/5 rounded-lg border border-white/5">
                          <button 
                            onClick={() => moveBanner(banner.id, 'up')} 
                            disabled={index === 0} 
                            className="p-1.5 rounded-md text-[#9ca3af] hover:text-white hover:bg-white/10 disabled:opacity-20 transition-all"
                            title="Move Up"
                          >
                            <ArrowUp className="h-3.5 w-3.5" />
                          </button>
                          <div className="w-[1px] h-4 bg-white/5"></div>
                          <button 
                            onClick={() => moveBanner(banner.id, 'down')} 
                            disabled={index === filteredBanners.length - 1} 
                            className="p-1.5 rounded-md text-[#9ca3af] hover:text-white hover:bg-white/10 disabled:opacity-20 transition-all"
                            title="Move Down"
                          >
                            <ArrowDown className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* Status & Edit Controls */}
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={() => toggleActive(banner.id)} 
                            className={`p-2 rounded-lg transition-all ${banner.active ? 'text-[#4ade80] bg-[#4ade80]/10' : 'text-[#64748b] bg-white/5 hover:text-white'}`}
                            title={banner.active ? 'Hide from store' : 'Show on store'}
                          >
                            {banner.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                          </button>
                          <button 
                            onClick={() => handleEdit(banner)} 
                            className="p-2 rounded-lg text-white bg-white/5 hover:bg-white/10 transition-all"
                            title="Edit content"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(banner.id)} 
                            className="p-2 rounded-lg text-[#ef4444] bg-[#ef4444]/5 hover:bg-[#ef4444]/20 transition-all"
                            title="Remove permanently"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredBanners.length === 0 && (
              <div className="admin-card border-dashed border-2 border-white/5 bg-transparent py-16">
                <div className="admin-empty-state">
                  <div className="admin-empty-icon opacity-20"><ImageIcon className="h-10 w-10" /></div>
                  <p className="admin-empty-title text-[#9ca3af]">No active banners for this placement</p>
                  <p className="text-xs text-[#4b5563] mt-2 max-w-[240px]">Use the "Add New Banner" button to start populating the {placementLabel[activeTab]} section.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
