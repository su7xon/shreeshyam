'use client';

import { useState } from 'react';
import useAdminStore from '@/lib/admin-store';
import { Plus, Trash2, Edit2, Save, X, Eye, EyeOff } from 'lucide-react';

export default function AdminOffersPage() {
  const admin = useAdminStore();
  const offers = admin.offers;
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    id: '',
    title: '',
    description: '',
    icon: '',
    active: true,
  });

  const resetForm = () => {
    setForm({ id: '', title: '', description: '', icon: '', active: true });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (offer: typeof offers[0]) => {
    setForm({
      id: offer.id,
      title: offer.title,
      description: offer.description,
      icon: offer.icon || '',
      active: offer.active,
    });
    setEditingId(offer.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.description.trim()) return;

    if (editingId) {
      admin.updateOffer(editingId, {
        title: form.title,
        description: form.description,
        icon: form.icon,
        active: form.active,
      });
    } else {
      admin.addOffer({
        id: `offer-${Date.now()}`,
        title: form.title,
        description: form.description,
        icon: form.icon,
        active: form.active,
      });
    }

    resetForm();
  };

  const handleDelete = (id: string) => {
    admin.deleteOffer(id);
  };

  const toggleActive = (id: string) => {
    const offer = offers.find((o) => o.id === id);
    if (offer) {
      admin.updateOffer(id, { active: !offer.active });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1a1a2e]">Offers & Deals</h2>
          <p className="text-sm text-gray-500 mt-1">Manage bank offers, EMI deals, and exchange offers</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
        >
          <Plus className="h-5 w-5" />
          Add Offer
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-[#1a1a2e]">
              {editingId ? 'Edit Offer' : 'New Offer'}
            </h3>
            <button onClick={resetForm} className="p-2 rounded-lg hover:bg-gray-100">
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g., HDFC Bank Offer"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Icon (emoji)</label>
              <input
                type="text"
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                placeholder="e.g., 🏦"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 bg-gray-50 text-center text-xl"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe the offer details..."
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 bg-gray-50 resize-none"
              />
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  className="h-5 w-5 rounded text-amber-600 focus:ring-amber-500"
                />
                <span className="text-sm text-gray-600">Active</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6">
            <button onClick={resetForm} className="px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
            >
              <Save className="h-5 w-5" />
              {editingId ? 'Update' : 'Add'} Offer
            </button>
          </div>
        </div>
      )}

      {/* Offers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className={`bg-white rounded-2xl border shadow-sm p-5 transition-all ${
              offer.active ? 'border-gray-200' : 'border-gray-200 opacity-60'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-amber-50 flex items-center justify-center text-2xl flex-shrink-0">
                {offer.icon || '🎁'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-[#1a1a2e]">{offer.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{offer.description}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => toggleActive(offer.id)}
                      className={`p-2 rounded-lg transition-colors ${offer.active ? 'text-emerald-600 hover:bg-emerald-50' : 'text-gray-400 hover:bg-gray-100'}`}
                      title={offer.active ? 'Deactivate' : 'Activate'}
                    >
                      {offer.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => handleEdit(offer)}
                      className="p-2 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(offer.id)}
                      className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {offers.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
          <p className="text-gray-500 font-medium">No offers yet</p>
          <p className="text-sm text-gray-400 mt-1">Add bank offers, EMI deals, and exchange offers</p>
        </div>
      )}
    </div>
  );
}
