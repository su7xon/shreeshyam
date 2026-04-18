'use client';

import { useState } from 'react';
import useAdminStore from '@/lib/admin-store';
import { Save, Store, Palette, Globe, Database, Check } from 'lucide-react';

export default function AdminSettingsPage() {
  const admin = useAdminStore();
  const [siteName, setSiteName] = useState(admin.siteName);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    admin.setSiteName(siteName);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-5 max-w-3xl pb-8">
      {/* Header */}
      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-white">Settings</h2>
        <p className="text-xs text-[#6b7280] mt-0.5">Configure your store settings</p>
      </div>

      {saved && (
        <div className="admin-alert admin-alert-success">
          <Check className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <p className="font-medium text-sm">Settings saved successfully!</p>
        </div>
      )}

      {/* Store Settings */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="flex items-center gap-3">
            <div className="admin-stat-icon bg-[#3b82f6]/10">
              <Store className="h-5 w-5 text-[#60a5fa]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#e5e7eb]">Store Information</h3>
              <p className="text-[11px] text-[#6b7280]">Basic store details</p>
            </div>
          </div>
        </div>
        <div className="admin-card-body space-y-4">
          <div>
            <label className="admin-label">Store Name</label>
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="admin-input"
            />
          </div>
          <button onClick={handleSave} className="admin-btn-primary">
            <Save className="h-4 w-4" /> Save Changes
          </button>
        </div>
      </div>

      {/* Appearance */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="flex items-center gap-3">
            <div className="admin-stat-icon bg-[#8b5cf6]/10">
              <Palette className="h-5 w-5 text-[#a78bfa]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#e5e7eb]">Appearance</h3>
              <p className="text-[11px] text-[#6b7280]">Theme and styling</p>
            </div>
          </div>
        </div>
        <div className="admin-card-body space-y-4">
          <p className="text-sm text-[#9ca3af]">
            The site uses a warm cream palette with the Poppins font. Theme customization will be available in future updates.
          </p>
          <div className="flex items-center gap-2.5 p-3 bg-white/[0.02] rounded-xl border border-white/[0.04]">
            <div className="h-8 w-8 rounded-full bg-[#f8f4ee] border border-white/10" />
            <div className="h-8 w-8 rounded-full bg-[#1f3a4f]" />
            <div className="h-8 w-8 rounded-full bg-[#b78b57]" />
            <div className="h-8 w-8 rounded-full bg-[#3d6d48]" />
            <span className="text-[11px] text-[#6b7280] ml-2">Current theme</span>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="flex items-center gap-3">
            <div className="admin-stat-icon bg-[#f59e0b]/10">
              <Database className="h-5 w-5 text-[#fbbf24]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#e5e7eb]">Data Management</h3>
              <p className="text-[11px] text-[#6b7280]">Export, import, or reset</p>
            </div>
          </div>
        </div>
        <div className="admin-card-body space-y-4">
          <p className="text-sm text-[#9ca3af]">
            All data is stored locally. Clearing browser data will reset all changes.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                const data = localStorage.getItem('mobimart-admin-store');
                if (data) {
                  const blob = new Blob([data], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url; a.download = 'mobimart-data.json'; a.click();
                  URL.revokeObjectURL(url);
                }
              }}
              className="admin-btn-secondary"
            >
              <Globe className="h-4 w-4" /> Export Data
            </button>
            <button
              onClick={() => {
                if (confirm('Are you sure? This cannot be undone.')) {
                  localStorage.removeItem('mobimart-admin-store');
                  window.location.reload();
                }
              }}
              className="admin-btn-danger"
            >
              Reset to Default
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
