'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/lib/admin-auth';
import { Lock, Loader2, Store, Eye, EyeOff, AlertCircle } from 'lucide-react';

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 60;

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<Date | null>(null);
  const { login } = useAdminAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Rate limiting
    if (lockedUntil && new Date() < lockedUntil) {
      const secsLeft = Math.ceil((lockedUntil.getTime() - Date.now()) / 1000);
      setError(`Too many failed attempts. Try again in ${secsLeft}s.`);
      return;
    }

    if (!password) {
      setError('Please enter the password.');
      return;
    }

    setLoading(true);

    const success = await login(password);
    if (success) {
      router.push('/admin/dashboard');
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
        const lockTime = new Date(Date.now() + LOCKOUT_SECONDS * 1000);
        setLockedUntil(lockTime);
        setAttempts(0);
        setError(`Account temporarily locked for ${LOCKOUT_SECONDS} seconds due to too many failed attempts.`);
      } else {
        setError(`Invalid password. ${MAX_LOGIN_ATTEMPTS - newAttempts} attempts remaining.`);
      }
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
            <Store className="h-8 w-8 text-gray-900" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight font-serif">Admin Console</h1>
          <p className="text-xs text-gray-800 font-medium tracking-[0.1em] uppercase mt-1">Shree Shyam Mobiles</p>
        </div>

        {/* Card */}
        <div className="admin-form-panel border border-gray-200 backdrop-blur-xl bg-gray-50">
          {error && (
            <div className="admin-alert bg-red-500/10 border border-red-500/20 text-red-400 mb-5 rounded-xl flex gap-3 p-4">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="admin-label text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 block ml-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="admin-input h-12 bg-white/[0.03] border-gray-300 rounded-xl focus:border-[#b78b57]/50 focus:ring-[#b78b57]/20 w-full px-4"
                  style={{ paddingRight: '3rem' }}
                  required
                  autoFocus
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-800 hover:text-gray-900 transition-colors p-1"
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
              Access Dashboard
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-[10px] text-gray-900 text-center font-medium tracking-wide">
              AUTHORIZED ACCESS ONLY • SECURED SYSTEM
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
