'use client';

import { useState } from 'react';
import useAdminStore from '@/lib/admin-store';
import { Plus, Trash2, Save, X, Eye, EyeOff, Zap, Search } from 'lucide-react';
import Image from 'next/image';

export default function AdminDailyDealsPage() {
  const admin = useAdminStore();
  const dailyDeals = admin.dailyDeals;
  const products = admin.products;
  
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [form, setForm] = useState({ productId: '', active: true });

  const resetForm = () => {
    setForm({ productId: '', active: true });
    setShowForm(false);
    setSearchQuery('');
  };

  const handleAdd = (productId: string) => {
    admin.addDailyDeal({ productId, active: true, order: dailyDeals.length });
    resetForm();
  };

  const toggleActive = (id: string) => {
    const deal = dailyDeals.find((d) => d.id === id);
    if (deal) admin.updateDailyDeal(id, { active: !deal.active });
  };

  const filteredProducts = products.filter(p => 
    (p.name || '').toLowerCase().includes((searchQuery || '').toLowerCase()) &&
    !dailyDeals.some(d => d.productId === p.id)
  ).slice(0, 5);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Daily Deals</h2>
          <p className="text-sm text-[#6b7280] mt-1">Select products to feature in the "Deals of the Day" section</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="admin-btn-primary">
            <Plus className="h-4 w-4" /> Add Deal
          </button>
        )}
      </div>

      {/* Form / Product Selector */}
      {showForm && (
        <div className="admin-form-panel max-w-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-semibold text-white font-serif">Select Product for Deal</h3>
            <button onClick={resetForm} className="admin-icon-btn p-1.5"><X className="h-5 w-5" /></button>
          </div>
          
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input 
                type="text" 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by name..." 
                className="admin-input pl-10"
                autoFocus
              />
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {searchQuery.length > 0 ? (
                filteredProducts.map(product => (
                  <div key={product.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 rounded-lg bg-white overflow-hidden">
                        <Image src={product.image} alt={product.name} fill className="object-contain p-1" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{product.name}</p>
                        <p className="text-xs text-gray-500">₹{product.price.toLocaleString()}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleAdd(product.id)}
                      className="text-xs font-bold text-blue-500 hover:text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Select
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">Type to search for products</p>
              )}
              {searchQuery.length > 0 && filteredProducts.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No products found</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Deals List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dailyDeals.map((deal) => {
          const product = products.find(p => p.id === deal.productId);
          if (!product) return null;

          return (
            <div key={deal.id} className={`admin-card flex flex-col relative overflow-hidden group ${!deal.active ? 'opacity-50' : ''}`}>
              {/* Card Header with Actions */}
              <div className="flex items-start justify-between p-4 pb-0">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${deal.active ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-400'}`}>
                    {deal.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex items-center gap-1 z-10">
                  <button 
                    onClick={() => toggleActive(deal.id)}
                    className={`p-2 rounded-lg transition-colors ${deal.active ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' : 'bg-gray-500/10 text-gray-400 hover:bg-gray-500/20'}`}
                    title={deal.active ? 'Deactivate' : 'Activate'}
                  >
                    {deal.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                  <button 
                    onClick={() => admin.deleteDailyDeal(deal.id)}
                    className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                    title="Remove Deal"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex flex-col items-center text-center gap-4 flex-1">
                <div className="relative h-32 w-32 bg-white rounded-2xl overflow-hidden shadow-inner mt-2">
                  <Image src={product.image} alt={product.name} fill className="object-contain p-4" />
                </div>
                
                <div className="space-y-1 w-full">
                  <h4 className="text-sm font-bold text-white line-clamp-2 min-h-[40px]">{product.name}</h4>
                  <p className="text-xs text-gray-500 truncate">{product.category}</p>
                  <div className="flex items-center justify-center gap-2 mt-3">
                    <span className="text-[15px] font-bold text-blue-500">₹{product.price.toLocaleString()}</span>
                    <span className="text-[11px] text-gray-600 line-through">₹{(product.price * 1.2).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="w-full px-5 py-3 border-t border-white/5 bg-white/[0.02] flex items-center justify-center">
                <div className="flex items-center gap-1.5 text-[11px] text-yellow-500/80 font-bold uppercase tracking-widest">
                  <Zap className="h-3.5 w-3.5 fill-current" />
                  Featured Deal
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {dailyDeals.length === 0 && (
        <div className="admin-card py-16 text-center">
          <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
            <Zap className="h-8 w-8 text-gray-600" />
          </div>
          <h3 className="text-lg font-semibold text-white">No active deals</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto mt-2">Select products to showcase them in the daily deals section on your homepage.</p>
          <button 
            onClick={() => setShowForm(true)}
            className="mt-6 admin-btn-primary mx-auto"
          >
            <Plus className="h-4 w-4" /> Feature First Product
          </button>
        </div>
      )}
    </div>
  );
}
