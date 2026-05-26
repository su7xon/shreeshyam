'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { updateUserProfile } from '@/lib/firebase-auth';
import { User, Mail, MapPin, Phone, Calendar, Loader2, Save, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function AccountPage() {
  const { user, profile, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
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
      // Wait a bit for the onAuthChange listener to refresh context or handle it via local state if needed
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-black" />
      </div>
    );
  }

  const joinDate = profile?.createdAt 
    ? new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Recently';

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:py-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">My Account</h1>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors sm:w-auto w-full"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>

        <div className="bg-white shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
          <div className="px-4 py-5 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Profile Information</h3>
              <p className="mt-1 text-sm text-gray-500">Personal details and contact info.</p>
            </div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setIsEditing(false)}
                  disabled={saving}
                  className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-transparent rounded-xl text-sm font-semibold text-white bg-black hover:bg-gray-800 transition-colors"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save
                </button>
              </div>
            )}
          </div>
          
          <div className="px-0 sm:p-0">
            <dl className="divide-y divide-gray-100 sm:divide-y sm:divide-gray-200">
              
              {/* Name */}
              <div className="py-4 px-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <User className="h-4 w-4 text-[var(--color-primary)]" /> Full name
                </dt>
                <dd className="mt-1.5 sm:mt-0 text-sm text-gray-900 sm:col-span-2">
                  {isEditing ? (
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="block w-full max-w-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-black/20 focus:border-black sm:text-sm py-2.5 px-3 outline-none transition-all"
                    />
                  ) : (
                    <span className="font-semibold text-gray-900">{profile?.displayName || 'Not set'}</span>
                  )}
                </dd>
              </div>

              {/* Email */}
              <div className="py-4 px-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-[var(--color-primary)]" /> Email address
                </dt>
                <dd className="mt-1.5 sm:mt-0 text-sm text-gray-900 sm:col-span-2 font-medium">
                  {user.email} <span className="text-[10px] sm:text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md ml-2 font-normal">(Cannot be changed)</span>
                </dd>
              </div>

              {/* Phone */}
              <div className="py-4 px-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-[var(--color-primary)]" /> Phone number
                </dt>
                <dd className="mt-1.5 sm:mt-0 text-sm text-gray-900 sm:col-span-2">
                  {isEditing ? (
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 9876543210"
                      className="block w-full max-w-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-black/20 focus:border-black sm:text-sm py-2.5 px-3 outline-none transition-all"
                    />
                  ) : (
                    <span className="font-medium">{profile?.phone || <span className="text-gray-400 italic">Not set</span>}</span>
                  )}
                </dd>
              </div>

              {/* Address */}
              <div className="py-4 px-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[var(--color-primary)]" /> Default Address
                </dt>
                <dd className="mt-1.5 sm:mt-0 text-sm text-gray-900 sm:col-span-2">
                  {isEditing ? (
                    <textarea
                      rows={3}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter your full shipping address"
                      className="block w-full max-w-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-black/20 focus:border-black sm:text-sm py-2.5 px-3 outline-none resize-none transition-all"
                    />
                  ) : (
                    <span className="font-medium leading-relaxed">{profile?.address || <span className="text-gray-400 italic">Not set</span>}</span>
                  )}
                </dd>
              </div>

              {/* Join Date */}
              <div className="py-4 px-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50/50">
                <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[var(--color-primary)]" /> Member since
                </dt>
                <dd className="mt-1.5 sm:mt-0 text-sm text-gray-900 sm:col-span-2 font-medium">
                  {joinDate}
                </dd>
              </div>

            </dl>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/cart" className="bg-white shadow rounded-lg p-6 flex items-center gap-4 hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">My Orders</h3>
              <p className="text-sm text-gray-500">View and track your past orders.</p>
            </div>
          </Link>
          
          <Link href="/products" className="bg-white shadow rounded-lg p-6 flex items-center gap-4 hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Continue Shopping</h3>
              <p className="text-sm text-gray-500">Browse the latest products and deals.</p>
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
}
