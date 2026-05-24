'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/lib/admin-auth';
import { Lock, User, Loader2, Store, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAdminAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password !== 'shreeshyam') {
      setError('Invalid password.');
      setLoading(false);
      return;
    }

    // Login with actual admin credentials behind the scenes
    const success = await login('admin@shreeshyammobiles.com', 'admin123');
    if (success) {
      if (typeof window !== 'undefined') {
        window.location.href = '/admin/dashboard';
      } else {
        router.push('/admin/dashboard');
      }
    } else {
      setError('System login failed. Please contact support.');
      setLoading(false);
    }
  };

  return (
    <div className="admin-shell min-h-screen flex items-center justify-center px-4 py-8">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-[#b78b57]/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-sm relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#b78b57] to-[#d4a76a] shadow-lg shadow-[#b78b57]/25 mb-4">
            <Store className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight font-serif">Admin Console</h1>
          <p className="text-xs text-[#6b7280] font-medium tracking-[0.1em] uppercase mt-1">Shree Shyam Mobiles</p>
        </div>

        {/* Card */}
        <div className="admin-form-panel border border-white/5 backdrop-blur-xl bg-white/[0.02]">
          {error && (
            <div className="admin-alert bg-red-500/10 border border-red-500/20 text-red-400 mb-5 rounded-xl flex gap-3 p-4">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="admin-label text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block ml-1">Admin Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="admin-input h-12 bg-white/[0.03] border-white/10 rounded-xl focus:border-[#b78b57]/50 focus:ring-[#b78b57]/20"
                  style={{ paddingRight: '3rem' }}
                  required
                  autoFocus
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="admin-btn-primary w-full h-12 text-sm font-bold bg-[#b78b57] hover:bg-[#d4a76a] shadow-lg shadow-[#b78b57]/20 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> <span>Authenticating…</span>
                </div>
              ) : (
                'Access Dashboard'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5">
            <p className="text-[10px] text-gray-600 text-center font-medium tracking-wide">
              AUTHORIZED ACCESS ONLY • SECURED BY FIREBASE
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
