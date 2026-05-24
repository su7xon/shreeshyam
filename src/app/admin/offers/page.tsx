'use client';

import { useState } from 'react';
import useAdminStore from '@/lib/admin-store';
import { Plus, Trash2, Edit2, Save, X, Eye, EyeOff, Gift } from 'lucide-react';

export default function AdminOffersPage() {
  const admin = useAdminStore();
  const offers = admin.offers;
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ id: '', title: '', description: '', icon: '', active: true });

  const resetForm = () => { setForm({ id: '', title: '', description: '', icon: '', active: true }); setShowForm(false); setEditingId(null); };

  const handleEdit = (offer: typeof offers[0]) => {
    setForm({ id: offer.id, title: offer.title, description: offer.description, icon: offer.icon || '', active: offer.active });
    setEditingId(offer.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.description.trim()) return;
    if (editingId) {
      admin.updateOffer(editingId, { title: form.title, description: form.description, icon: form.icon, active: form.active });
    } else {
      admin.addOffer({ title: form.title, description: form.description, icon: form.icon, active: form.active });
    }
    resetForm();
  };

  const toggleActive = (id: string) => {
    const offer = offers.find((o) => o.id === id);
    if (offer) admin.updateOffer(id, { active: !offer.active });
  };

  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-white">Offers & Deals</h2>
          <p className="text-xs text-[#6b7280] mt-0.5">Manage bank offers, EMI deals, and exchange offers</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="admin-btn-primary text-xs sm:text-sm">
          <Plus className="h-4 w-4" /> Add Offer
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="admin-form-panel">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">{editingId ? 'Edit Offer' : 'New Offer'}</h3>
            <button onClick={resetForm} className="admin-icon-btn p-1.5"><X className="h-4 w-4" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="admin-label">Title *</label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g., HDFC Bank Offer" className="admin-input" />
            </div>
            <div>
              <label className="admin-label">Icon (emoji)</label>
              <input type="text" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="🏦" className="admin-input text-center text-xl" />
            </div>
            <div className="sm:col-span-2">
              <label className="admin-label">Description *</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the offer…" rows={3} className="admin-input resize-none" />
            </div>
            <div>
              <label className="flex items-center gap-2.5 cursor-pointer text-sm text-[#9ca3af]">
                <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="h-4 w-4 rounded bg-transparent border-white/20 text-[#3b82f6] focus:ring-[#3b82f6]" />
                Active
              </label>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 mt-5">
            <button onClick={resetForm} className="admin-btn-secondary">Cancel</button>
            <button onClick={handleSave} className="admin-btn-primary">
              <Save className="h-4 w-4" /> {editingId ? 'Update' : 'Add'} Offer
            </button>
          </div>
        </div>
      )}

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {offers.map((offer) => (
          <div key={offer.id} className={`admin-card p-4 transition-all ${!offer.active ? 'opacity-50' : ''}`}>
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#f59e0b]/10 flex items-center justify-center text-xl flex-shrink-0">
                {offer.icon || '🎁'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-[#e5e7eb] truncate">{offer.title}</h4>
                    <p className="text-xs text-[#6b7280] mt-1 line-clamp-2">{offer.description}</p>
                  </div>
                  <div className="flex items-center gap-0.5 flex-shrink-0">
                    <button onClick={() => toggleActive(offer.id)} className={`admin-icon-btn p-1.5 ${offer.active ? '!text-[#4ade80]' : ''}`} title={offer.active ? 'Deactivate' : 'Activate'}>
                      {offer.active ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                    </button>
                    <button onClick={() => handleEdit(offer)} className="admin-icon-btn p-1.5" title="Edit">
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => admin.deleteOffer(offer.id)} className="admin-icon-btn p-1.5 hover:!text-[#ef4444] hover:!bg-[#ef4444]/10" title="Delete">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {offers.length === 0 && (
        <div className="admin-card">
          <div className="admin-empty-state">
            <div className="admin-empty-icon"><Gift className="h-6 w-6" /></div>
            <p className="admin-empty-title">No offers yet</p>
            <p className="admin-empty-desc">Add bank offers, EMI deals, and exchange offers</p>
          </div>
        </div>
      )}
    </div>
  );
}
