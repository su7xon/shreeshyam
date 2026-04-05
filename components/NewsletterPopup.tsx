'use client';

import { useState, useEffect } from 'react';
import { X, Mail, Gift } from 'lucide-react';

export default function NewsletterPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const seen = localStorage.getItem('mobimart-newsletter-seen');
    if (!seen) {
      const timer = setTimeout(() => setIsVisible(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      localStorage.setItem('mobimart-newsletter-seen', 'true');
      localStorage.setItem('mobimart-newsletter-email', email);
      setSubmitted(true);
      setTimeout(() => setIsVisible(false), 2000);
    }
  };

  const handleClose = () => {
    localStorage.setItem('mobimart-newsletter-seen', 'true');
    setIsVisible(false);
  };

  if (!mounted || !isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 transform animate-[scaleIn_0.3s_ease-out]">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">You&apos;re Subscribed!</h3>
            <p className="text-gray-600">Check your inbox for your discount code.</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Get 10% Off!</h3>
              <p className="text-gray-600">Subscribe to our newsletter and get an exclusive discount on your first purchase.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white font-bold py-3 px-6 rounded-xl hover:opacity-90 transition-opacity"
              >
                Subscribe & Get 10% Off
              </button>
            </form>

            <p className="text-xs text-gray-500 text-center mt-4">
              No spam, unsubscribe anytime.
            </p>
          </>
        )}
      </div>
    </div>
  );
}