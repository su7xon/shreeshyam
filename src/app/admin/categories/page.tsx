'use client';

import { useState } from 'react';
import useAdminStore, { Category } from '@/lib/admin-store';
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
  Grid,
  Info
} from 'lucide-react';
import { uploadToCloudinary } from '@/lib/cloudinary';

export default function AdminCategoriesPage() {
  const admin = useAdminStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [form, setForm] = useState({
    id: '', name: '', image: '', active: true,
  });

  const categories = [...admin.categories].sort((a, b) => a.order - b.order);

  const resetForm = () => {
    setForm({ id: '', name: '', image: '', active: true });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (category: Category) => {
    setForm({ id: category.id, name: category.name, image: category.image, active: category.active });
    setEditingId(category.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { alert('Please add a category name'); return; }
    if (!form.image.trim()) { alert('Please add an image URL'); return; }
    
    try {
      if (editingId) {
        await admin.updateCategory(editingId, { name: form.name.trim(), image: form.image, active: form.active });
      } else {
        const maxOrder = categories.length > 0 ? Math.max(...categories.map((c) => c.order)) : -1;
        await admin.addCategory({ name: form.name.trim(), image: form.image, order: maxOrder + 1, active: form.active });
      }
      resetForm();
    } catch (error) {
      alert('Failed to save category');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this category? This will not delete the products in it, but they might not show up in this category section.')) {
      try {
        await admin.deleteCategory(id);
      } catch (error) {
        alert('Failed to delete category');
      }
    }
  };

  const moveCategory = (id: string, direction: 'up' | 'down') => {
    const index = categories.findIndex((c) => c.id === id);
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === categories.length - 1)) return;
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    const newIds = categories.map((c) => c.id);
    [newIds[index], newIds[swapIndex]] = [newIds[swapIndex], newIds[index]];
    admin.reorderCategories(newIds);
  };

  const toggleActive = (id: string) => {
    const category = categories.find((c) => c.id === id);
    if (category) admin.updateCategory(id, { active: !category.active });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Grid className="h-6 w-6 text-[#3b82f6]" />
            Category Management
          </h2>
          <p className="text-sm text-gray-800 mt-1">Manage product categories and their featured icons</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowForm(true); }} 
          className="admin-btn-primary shadow-lg shadow-blue-500/10"
        >
          <Plus className="h-4 w-4" /> Add New Category
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sidebar Info */}
        <div className="lg:col-span-3 space-y-4">
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
             <h3 className="text-xs font-bold text-gray-800 uppercase tracking-widest">Stats</h3>
             <div className="flex justify-between items-center">
               <span className="text-sm text-gray-900">Total Categories</span>
               <span className="text-sm font-bold text-gray-900">{categories.length}</span>
             </div>
             <div className="flex justify-between items-center">
               <span className="text-sm text-gray-900">Visible</span>
               <span className="text-sm font-bold text-green-400">{categories.filter(c => c.active).length}</span>
             </div>
          </div>

          <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 space-y-2">
            <div className="flex items-center gap-2 text-blue-400">
              <Info className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase">Requirements</span>
            </div>
            <p className="text-[11px] text-gray-900 leading-relaxed">
              For best results, use PNG images with transparent backgrounds.<br/>
              Recommended size: <span className="text-gray-900 font-medium">400x400px</span>
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9 space-y-4">
          {/* Category Form */}
          {showForm && (
            <div className="admin-card border-[#3b82f6]/30 bg-gray-50/50 backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-300 mb-6 border-2 ring-4 ring-[#3b82f6]/5">
              <div className="admin-card-header border-b border-gray-200">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  {editingId ? <Edit2 className="h-4 w-4 text-blue-400" /> : <Plus className="h-4 w-4 text-blue-400" />}
                  {editingId ? 'Modify Category' : 'Create New Category'}
                </h3>
                <button onClick={resetForm} className="admin-icon-btn p-1.5 hover:bg-gray-200"><X className="h-4 w-4" /></button>
              </div>
              <div className="p-5 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="admin-label text-gray-900">Category Name</label>
                    <input 
                      type="text" 
                      value={form.name} 
                      onChange={(e) => setForm({ ...form, name: e.target.value })} 
                      placeholder="e.g., Smartwatches" 
                      className="admin-input bg-white border-gray-300" 
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
                        <div className="w-10 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3b82f6]"></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 group-hover:text-gray-900 transition-colors">Visible in Home Strip</span>
                    </label>
                  </div>

                  <div className="md:col-span-2">
                    <label className="admin-label text-gray-900">Category Icon (Required)</label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input 
                        type="text" 
                        value={form.image} 
                        onChange={(e) => setForm({ ...form, image: e.target.value })} 
                        placeholder="Direct URL or upload using button →" 
                        className="admin-input flex-1 bg-white border-gray-300" 
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
                        <button type="button" disabled={isUploading} className="admin-btn-secondary h-full min-w-[120px] bg-gray-100 border-gray-300 hover:bg-gray-200 text-gray-900">
                          {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Upload className="h-4 w-4" /> Upload Icon</>}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preview */}
                {form.image && (
                   <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-200">
                      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center p-2">
                        <img src={form.image} alt="Preview" className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-800 mb-1">Preview</p>
                        <p className="text-sm font-bold text-gray-900">{form.name || 'Category Name'}</p>
                      </div>
                   </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button onClick={resetForm} className="px-5 py-2.5 text-sm font-medium text-gray-900 hover:text-gray-900 transition-colors">Discard</button>
                  <button 
                    onClick={handleSave} 
                    disabled={isUploading} 
                    className="admin-btn-primary h-11 px-8 rounded-xl"
                  >
                    {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save Category
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Category List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map((category, index) => (
              <div 
                key={category.id} 
                className={`group admin-card overflow-hidden transition-all duration-300 border-l-4 ${
                  !category.active 
                  ? 'border-l-gray-700 opacity-60 grayscale' 
                  : 'border-l-blue-500 hover:shadow-xl hover:shadow-blue-500/5'
                }`}
              >
                <div className="p-4 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center p-2 relative shrink-0 group-hover:bg-gray-200 transition-colors">
                    <img src={category.image} alt={category.name} className="w-full h-full object-contain" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-gray-900 truncate">{category.name}</h4>
                    <p className="text-[10px] text-gray-800 mt-0.5">Order: {category.order + 1}</p>
                  </div>

                  <div className="flex items-center gap-1">
                    <div className="flex flex-col gap-1 mr-2">
                      <button 
                        onClick={() => moveCategory(category.id, 'up')} 
                        disabled={index === 0}
                        className="p-1 rounded text-gray-900 hover:text-gray-900 hover:bg-gray-200 disabled:opacity-20"
                      >
                        <ArrowUp className="h-3 w-3" />
                      </button>
                      <button 
                        onClick={() => moveCategory(category.id, 'down')} 
                        disabled={index === categories.length - 1}
                        className="p-1 rounded text-gray-900 hover:text-gray-900 hover:bg-gray-200 disabled:opacity-20"
                      >
                        <ArrowDown className="h-3 w-3" />
                      </button>
                    </div>

                    <button 
                      onClick={() => toggleActive(category.id)} 
                      className={`p-2 rounded-lg transition-all ${category.active ? 'text-[#4ade80] bg-[#4ade80]/10' : 'text-gray-800 bg-gray-100 hover:text-gray-900'}`}
                    >
                      {category.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                    <button 
                      onClick={() => handleEdit(category)} 
                      className="p-2 rounded-lg text-gray-900 bg-gray-100 hover:bg-gray-200 transition-all"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(category.id)} 
                      className="p-2 rounded-lg text-[#ef4444] bg-[#ef4444]/5 hover:bg-[#ef4444]/20 transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {categories.length === 0 && (
            <div className="admin-card border-dashed border-2 border-gray-200 bg-transparent py-16">
              <div className="admin-empty-state text-center">
                <div className="admin-empty-icon opacity-20 mb-4 flex justify-center"><ImageIcon className="h-10 w-10" /></div>
                <p className="admin-empty-title text-gray-900">No categories defined yet</p>
                <button 
                  onClick={() => setShowForm(true)}
                  className="text-xs text-blue-400 mt-2 underline"
                >
                  Create your first category
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
