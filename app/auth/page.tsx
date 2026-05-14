'use client';

import { useState, Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, signUp, signInWithGoogle } from '@/lib/firebase-auth';
import { useAuth } from '@/lib/auth-context';
import { Mail, Lock, User, Phone, ArrowLeft, Eye, EyeOff } from 'lucide-react';

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/';
  
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    phone: ''
  });

  const { user } = useAuth();

  // If user is already logged in, redirect to returnUrl
  useEffect(() => {
    if (user) {
      router.push(returnUrl);
    }
  }, [user, router, returnUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        await signIn(formData.email, formData.password);
        // Redirect to return URL or home
        router.push(returnUrl);
      } else {
        // Signup
        if (!formData.displayName) {
          setError('Please enter your name');
          setLoading(false);
          return;
        }
        await signUp(formData.email, formData.password, formData.displayName, formData.phone);
        // Redirect to return URL or home
        router.push(returnUrl);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Email already registered. Please login.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address.');
      } else if (err.code === 'auth/user-not-found') {
        setError('No account found with this email.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password.');
      } else if (err.code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else {
        setError(err.message || 'An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
      // Popup returns immediately after success, redirect now
      router.push(returnUrl);
    } catch (err: any) {
      console.error('Google Auth error:', err);
      // User closed the popup - not an error
      if (err.code === 'auth/popup-closed-by-user') {
        setLoading(false);
        return;
      }
      setError(err.message || 'Failed to sign in with Google.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Page Title */}
        <div className="text-center mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Login / Register
          </h1>
        </div>

        {/* Card */}
        <div className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8 sm:p-12">
            {/* Box Header */}
            <h2 className="text-lg font-medium text-gray-800 mb-8 pb-4 border-b border-gray-100">
              {isLogin ? 'Account Login' : 'Create New Account'}
            </h2>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 text-sm">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:border-[#ff8c00] transition-colors"
                    placeholder="Enter your name"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:border-[#ff8c00] transition-colors"
                  placeholder={isLogin ? "Enter Email" : "your@email.com"}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:border-[#ff8c00] transition-colors"
                    placeholder="••••••••"
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {isLogin && (
                <div className="flex justify-end">
                  <Link 
                    href="/forgot-password" 
                    className="text-xs text-gray-500 hover:text-black transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#ff8c00] text-black rounded-sm hover:bg-[#e67e00] transition-all font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {loading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
              </button>
            </form>

            <div className="mt-6 flex items-center justify-between">
              <span className="w-1/5 border-b border-gray-200 lg:w-1/4"></span>
              <span className="text-xs text-center text-gray-500 uppercase">or sign in with</span>
              <span className="w-1/5 border-b border-gray-200 lg:w-1/4"></span>
            </div>

            <button
              type="button"
              disabled={loading}
              onClick={handleGoogleSignIn}
              className="mt-6 w-full flex items-center justify-center gap-3 py-3.5 border border-gray-300 rounded-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="text-gray-700 font-medium">Continue with Google</span>
            </button>

            {/* Toggle Login/Signup */}
            <div className="mt-8 pt-8 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500">
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                  }}
                  className="text-black font-bold hover:underline"
                >
                  {isLogin ? 'Register Now' : 'Login Now'}
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Home Link */}
        <div className="mt-8 text-center">
          <Link 
            href="/" 
            className="text-sm text-gray-500 hover:text-black transition-colors inline-flex items-center gap-1"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff8c00]"></div>
      </div>
    }>
      <AuthContent />
    </Suspense>
  );
}
