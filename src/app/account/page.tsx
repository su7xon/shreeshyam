'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { updateUserProfile } from '@/lib/firebase-auth';
import { User, Mail, MapPin, Phone, Calendar, Loader2, Save, LogOut, ChevronRight, ShoppingBag, Search, Settings, Edit3, X, Check } from 'lucide-react';
import Link from 'next/link';

export default function AccountPage() {
  const { user, profile, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Form fields
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);

  // Load profile data into form
  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || '');
      setPhone(profile.phone || '');
      setAddress(profile.address || '');
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateUserProfile(user.uid, {
        displayName,
        phone,
        address
      });
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f7f8]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#111]" />
          <p className="text-sm text-gray-800">Loading your account...</p>
        </div>
      </div>
    );
  }

  const joinDate = profile?.createdAt 
    ? new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Recently';

  const initials = (profile?.displayName || user.email || 'U')
    .split(' ')
    .map((n: string) => n.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-[#f7f7f8] pb-24 md:pb-8">
      
      {/* Profile Hero Card */}
      <div className="bg-white border-b border-[#e5e7eb]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            {/* Avatar */}
            <div className="relative">
              {user?.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={profile?.displayName || "User"} 
                  className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl object-cover shadow-lg ring-4 ring-white" 
                  referrerPolicy="no-referrer" 
                />
              ) : (
                <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-gradient-to-br from-[#111] to-[#333] flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-lg ring-4 ring-white">
                  {initials}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-green-500 rounded-lg border-2 border-white flex items-center justify-center">
                <Check className="h-3 w-3 text-white" strokeWidth={3} />
              </div>
            </div>

            {/* Info */}
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-[#111] tracking-tight">
                {profile?.displayName || 'Welcome!'}
              </h1>
              <p className="text-sm text-gray-800 mt-0.5">{user.email}</p>
              <div className="flex items-center justify-center sm:justify-start gap-3 mt-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#f3f4f6] rounded-lg text-[11px] font-semibold text-gray-900">
                  <Calendar className="h-3 w-3" />
                  Member since {joinDate}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 sm:flex-col">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#111] bg-[#f3f4f6] rounded-xl hover:bg-[#e5e7eb] transition-colors"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-800 bg-[#f3f4f6] rounded-xl hover:bg-[#e5e7eb] transition-colors"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {saveSuccess && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-semibold animate-[slideDown_0.3s_ease-out]">
          <Check className="h-4 w-4" />
          Profile updated successfully!
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-4">
        
        {/* Profile Details Card */}
        <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[#f3f4f6] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-[#3b82f6]" />
              <h3 className="text-sm font-bold text-[#111] uppercase tracking-wider">Profile Details</h3>
            </div>
            {isEditing && (
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-[#111] text-white rounded-xl text-xs font-bold hover:bg-[#333] transition-colors disabled:opacity-50"
              >
                {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            )}
          </div>

          <div className="divide-y divide-[#f3f4f6]">
            {/* Name */}
            <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0">
              <div className="sm:w-1/3 flex items-center gap-2 text-sm text-gray-800">
                <User className="h-4 w-4 text-[#3b82f6]" />
                <span className="font-medium">Full Name</span>
              </div>
              <div className="sm:w-2/3">
                {isEditing ? (
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full border border-[#e5e7eb] rounded-xl px-4 py-2.5 text-sm text-[#111] focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6] outline-none transition-all bg-[#f9fafb]"
                    placeholder="Enter your full name"
                  />
                ) : (
                  <span className="text-sm font-semibold text-[#111]">{profile?.displayName || <span className="text-gray-700 italic font-normal">Not set</span>}</span>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0">
              <div className="sm:w-1/3 flex items-center gap-2 text-sm text-gray-800">
                <Mail className="h-4 w-4 text-[#3b82f6]" />
                <span className="font-medium">Email</span>
              </div>
              <div className="sm:w-2/3 flex items-center gap-2">
                <span className="text-sm font-medium text-[#111]">{user.email}</span>
                <span className="text-[10px] text-gray-700 bg-[#f3f4f6] px-2 py-0.5 rounded-md font-medium">Verified</span>
              </div>
            </div>

            {/* Phone */}
            <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0">
              <div className="sm:w-1/3 flex items-center gap-2 text-sm text-gray-800">
                <Phone className="h-4 w-4 text-[#3b82f6]" />
                <span className="font-medium">Phone</span>
              </div>
              <div className="sm:w-2/3">
                {isEditing ? (
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full border border-[#e5e7eb] rounded-xl px-4 py-2.5 text-sm text-[#111] focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6] outline-none transition-all bg-[#f9fafb]"
                  />
                ) : (
                  <span className="text-sm font-medium text-[#111]">{profile?.phone || <span className="text-gray-700 italic font-normal">Not set</span>}</span>
                )}
              </div>
            </div>

            {/* Address */}
            <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-0">
              <div className="sm:w-1/3 flex items-center gap-2 text-sm text-gray-800 pt-2">
                <MapPin className="h-4 w-4 text-[#3b82f6]" />
                <span className="font-medium">Address</span>
              </div>
              <div className="sm:w-2/3">
                {isEditing ? (
                  <textarea
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your full shipping address"
                    className="w-full border border-[#e5e7eb] rounded-xl px-4 py-2.5 text-sm text-[#111] focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6] outline-none resize-none transition-all bg-[#f9fafb]"
                  />
                ) : (
                  <span className="text-sm font-medium text-[#111] leading-relaxed">{profile?.address || <span className="text-gray-700 italic font-normal">Not set</span>}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link href="/cart" className="group bg-white rounded-2xl border border-[#e5e7eb] p-5 flex items-center gap-4 hover:border-[#3b82f6]/30 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-[#111]">My Cart</h3>
              <p className="text-xs text-gray-800 mt-0.5">View items in your cart</p>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-700 group-hover:text-[#3b82f6] transition-colors" />
          </Link>
          
          <Link href="/products" className="group bg-white rounded-2xl border border-[#e5e7eb] p-5 flex items-center gap-4 hover:border-[#3b82f6]/30 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
              <Search className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-[#111]">Continue Shopping</h3>
              <p className="text-xs text-gray-800 mt-0.5">Browse latest products</p>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-700 group-hover:text-green-600 transition-colors" />
          </Link>

          <Link href="/location" className="group bg-white rounded-2xl border border-[#e5e7eb] p-5 flex items-center gap-4 hover:border-[#3b82f6]/30 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-[#111]">Visit Store</h3>
              <p className="text-xs text-gray-800 mt-0.5">Get directions to our shop</p>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-700 group-hover:text-red-600 transition-colors" />
          </Link>

          <a href="https://wa.me/919309415594" target="_blank" rel="noopener noreferrer" className="group bg-white rounded-2xl border border-[#e5e7eb] p-5 flex items-center gap-4 hover:border-[#25d366]/30 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-[#111]">WhatsApp Support</h3>
              <p className="text-xs text-gray-800 mt-0.5">Chat with us directly</p>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-700 group-hover:text-emerald-600 transition-colors" />
          </a>
        </div>

      </div>
    </div>
  );
}
