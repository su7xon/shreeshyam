'use client';

import { useState } from 'react';
import useAdminStore from '@/lib/admin-store';
import { Save, Store, Palette, Globe } from 'lucide-react';

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
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-[#1a1a2e]">Settings</h2>
        <p className="text-sm text-gray-500 mt-1">Configure your store settings</p>
      </div>

      {saved && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-emerald-700 text-sm font-medium">
          ✓ Settings saved successfully!
        </div>
      )}

      {/* Store Settings */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <Store className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-[#1a1a2e]">Store Information</h3>
            <p className="text-xs text-gray-500">Basic store details</p>
          </div>
        </div>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#b78b57]/50 bg-gray-50"
            />
          </div>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#b78b57] to-[#d4a76a] text-white font-semibold rounded-xl hover:shadow-lg transition-all"
          >
            <Save className="h-5 w-5" />
            Save Changes
          </button>
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center">
            <Palette className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-bold text-[#1a1a2e]">Appearance</h3>
            <p className="text-xs text-gray-500">Theme and styling options</p>
          </div>
        </div>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            The site uses a warm cream and gold color palette with the Poppins font. 
            Theme settings will be available in future updates.
          </p>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
            <div className="h-10 w-10 rounded-full bg-[#f8f4ee] border border-[#d8cdbf]" />
            <div className="h-10 w-10 rounded-full bg-[#1f3a4f]" />
            <div className="h-10 w-10 rounded-full bg-[#b78b57]" />
            <div className="h-10 w-10 rounded-full bg-[#3d6d48]" />
            <span className="text-xs text-gray-500 ml-2">Current theme colors</span>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center">
            <Globe className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h3 className="font-bold text-[#1a1a2e]">Data Management</h3>
            <p className="text-xs text-gray-500">Export, import, or reset data</p>
          </div>
        </div>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            All data is stored locally in your browser. Clearing browser data will reset all changes.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                const data = localStorage.getItem('mobimart-admin-store');
                if (data) {
                  const blob = new Blob([data], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'mobimart-data.json';
                  a.click();
                  URL.revokeObjectURL(url);
                }
              }}
              className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Export Data
            </button>
            <button
              onClick={() => {
                if (confirm('Are you sure you want to reset all data to default? This cannot be undone.')) {
                  localStorage.removeItem('mobimart-admin-store');
                  window.location.reload();
                }
              }}
              className="px-4 py-2 text-sm font-medium border border-red-300 text-red-600 rounded-xl hover:bg-red-50 transition-colors"
            >
              Reset to Default
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
