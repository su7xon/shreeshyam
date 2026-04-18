'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/lib/admin-auth';
import { Lock, User, Loader2, Store, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
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
    await new Promise((r) => setTimeout(r, 400));

    const success = login(password);
    if (success) {
      // Use window.location for static export compatibility
      if (typeof window !== 'undefined') {
        window.location.href = '/admin/dashboard';
      } else {
        router.push('/admin/dashboard');
      }
    } else {
      setError('Invalid credentials. Use admin / admin123');
      setLoading(false);
    }
  };

  return (
    <div className="admin-shell min-h-screen flex items-center justify-center px-4 py-8">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-[#3b82f6]/8 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-sm relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3b82f6] to-[#6366f1] shadow-lg shadow-[#3b82f6]/25 mb-4">
            <Store className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">Admin Console</h1>
          <p className="text-sm text-[#6b7280] mt-1">श्री श्याम मोबाइल्स</p>
        </div>

        {/* Card */}
        <div className="admin-form-panel">
          {error && (
            <div className="admin-alert bg-[#ef4444]/8 border border-[#ef4444]/15 text-[#f87171] mb-5">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="admin-label">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4b5563]" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="admin-input pl-10"
                  autoFocus
                  required
                />
              </div>
            </div>
            <div>
              <label className="admin-label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4b5563]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="admin-input pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4b5563] hover:text-[#9ca3af] transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="admin-btn-primary w-full py-3 text-sm disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Signing in…
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="text-[11px] text-[#4b5563] text-center mt-5">
            Default: <code className="text-[#6b7280] bg-white/[0.04] px-1.5 py-0.5 rounded">admin / admin123</code>
          </p>
        </div>
      </div>
    </div>
  );
}
