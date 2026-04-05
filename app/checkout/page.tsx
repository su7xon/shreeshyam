'use client';

import { useCartStore } from '@/lib/store';
import { useState, useEffect } from 'react';
import { CheckCircle, ArrowLeft, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setOrderNumber(`ORD-${Math.floor(Math.random() * 1000000)}`);
      setIsSuccess(true);
      clearCart();
    }, 2000);
  };

  if (!mounted) return null;

  if (isSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
        <div className="premium-surface p-6 sm:p-12 rounded-2xl shadow-xl">
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-8">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[var(--color-text)] mb-4">Order Placed Successfully!</h2>
          <p className="text-lg text-[var(--color-text-muted)] mb-8">
            Thank you for shopping with श्री श्याम Mobiles. Your order has been confirmed and will be shipped shortly.
          </p>
          <div className="bg-[var(--color-surface-soft)] p-6 rounded-xl mb-8 inline-block text-left border border-[var(--color-border)]">
            <p className="text-sm text-[var(--color-text-muted)] mb-1">Order Number</p>
            <p className="font-mono font-bold text-[var(--color-text)] text-lg">{orderNumber}</p>
          </div>
          <div>
            <Link 
              href="/" 
              className="inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-xl premium-btn-primary shadow-lg shadow-black/10"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Please add some items to your cart before proceeding to checkout.</p>
        <Link 
          href="/products" 
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="mb-8">
        <Link href="/cart" className="inline-flex items-center text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Cart
        </Link>
        <h1 className="text-2xl sm:text-4xl font-semibold text-[var(--color-text)] mt-2 sm:mt-4">Checkout</h1>
      </div>

      <div className="premium-surface rounded-2xl p-4 sm:p-6 mb-8">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded-xl bg-[var(--color-surface-soft)] border border-[var(--color-border)] py-3 px-2">
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-text-muted)]">Step 1</p>
            <p className="font-semibold text-[var(--color-text)]">Cart Review</p>
          </div>
          <div className="rounded-xl bg-[var(--color-primary)] text-white border border-[var(--color-primary)] py-3 px-2">
            <p className="text-xs uppercase tracking-[0.16em] text-[#d9e5ed]">Step 2</p>
            <p className="font-semibold">Secure Checkout</p>
          </div>
          <div className="rounded-xl bg-[var(--color-surface-soft)] border border-[var(--color-border)] py-3 px-2">
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-text-muted)]">Step 3</p>
            <p className="font-semibold text-[var(--color-text)]">Confirmation</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        <div className="premium-surface rounded-xl p-4 flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-[var(--color-primary)]" />
          <p className="text-sm text-[var(--color-text)] font-medium">100% Secure Payment</p>
        </div>
        <div className="premium-surface rounded-xl p-4 flex items-center gap-3">
          <Truck className="h-5 w-5 text-[var(--color-primary)]" />
          <p className="text-sm text-[var(--color-text)] font-medium">Priority Shipping Available</p>
        </div>
        <div className="premium-surface rounded-xl p-4 flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-[var(--color-accent)]" />
          <p className="text-sm text-[var(--color-text)] font-medium">Authenticity Guaranteed</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 sm:gap-12">
        {/* Checkout Form */}
        <div className="lg:w-2/3">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Contact Information */}
            <div className="premium-surface p-6 sm:p-8 rounded-xl">
              <h2 className="text-2xl font-semibold text-[var(--color-text)] mb-6">Contact Information</h2>
              <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                <div className="sm:col-span-2">
                  <label htmlFor="email" className="block text-sm font-medium text-[var(--color-text)]">Email address</label>
                  <div className="mt-1">
                    <input type="email" id="email" name="email" required className="block w-full rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] sm:text-sm px-4 py-3" placeholder="you@example.com" />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="phone" className="block text-sm font-medium text-[var(--color-text)]">Phone number</label>
                  <div className="mt-1">
                    <input type="tel" id="phone" name="phone" required className="block w-full rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] sm:text-sm px-4 py-3" placeholder="+91 98765 43210" />
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="premium-surface p-6 sm:p-8 rounded-xl">
              <h2 className="text-2xl font-semibold text-[var(--color-text)] mb-6">Shipping Address</h2>
              <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                <div>
                  <label htmlFor="first-name" className="block text-sm font-medium text-[var(--color-text)]">First name</label>
                  <div className="mt-1">
                    <input type="text" id="first-name" name="first-name" required className="block w-full rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] sm:text-sm px-4 py-3" />
                  </div>
                </div>
                <div>
                  <label htmlFor="last-name" className="block text-sm font-medium text-[var(--color-text)]">Last name</label>
                  <div className="mt-1">
                    <input type="text" id="last-name" name="last-name" required className="block w-full rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] sm:text-sm px-4 py-3" />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-[var(--color-text)]">Address</label>
                  <div className="mt-1">
                    <input type="text" id="address" name="address" required className="block w-full rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] sm:text-sm px-4 py-3" placeholder="Street address, P.O. box, etc." />
                  </div>
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-[var(--color-text)]">City</label>
                  <div className="mt-1">
                    <input type="text" id="city" name="city" required className="block w-full rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] sm:text-sm px-4 py-3" />
                  </div>
                </div>
                <div>
                  <label htmlFor="postal-code" className="block text-sm font-medium text-[var(--color-text)]">Postal code</label>
                  <div className="mt-1">
                    <input type="text" id="postal-code" name="postal-code" required className="block w-full rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] sm:text-sm px-4 py-3" />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="premium-surface p-6 sm:p-8 rounded-xl">
              <h2 className="text-2xl font-semibold text-[var(--color-text)] mb-6">Payment Method</h2>
              <div className="space-y-4">
                <div className="flex items-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3">
                  <input id="payment-card" name="payment-method" type="radio" defaultChecked className="focus:ring-[var(--color-primary)] h-4 w-4 text-[var(--color-primary)] border-[var(--color-border)]" />
                  <label htmlFor="payment-card" className="ml-3 block text-sm font-medium text-[var(--color-text)]">
                    Credit / Debit Card
                  </label>
                </div>
                <div className="flex items-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3">
                  <input id="payment-upi" name="payment-method" type="radio" className="focus:ring-[var(--color-primary)] h-4 w-4 text-[var(--color-primary)] border-[var(--color-border)]" />
                  <label htmlFor="payment-upi" className="ml-3 block text-sm font-medium text-[var(--color-text)]">
                    UPI
                  </label>
                </div>
                <div className="flex items-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3">
                  <input id="payment-cod" name="payment-method" type="radio" className="focus:ring-[var(--color-primary)] h-4 w-4 text-[var(--color-primary)] border-[var(--color-border)]" />
                  <label htmlFor="payment-cod" className="ml-3 block text-sm font-medium text-[var(--color-text)]">
                    Cash on Delivery
                  </label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center py-4 px-4 rounded-xl text-lg font-bold text-white transition-colors ${
                isSubmitting ? 'bg-[#556e81] cursor-not-allowed' : 'premium-btn-primary'
              }`}
            >
              {isSubmitting ? 'Processing...' : `Pay ${formatPrice(totalPrice())}`}
            </button>
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:w-1/3">
          <div className="premium-surface rounded-xl p-6 sm:p-8 lg:sticky lg:top-24">
            <h2 className="text-2xl font-semibold text-[var(--color-text)] mb-6">Order Summary</h2>
            
            <ul className="divide-y divide-[var(--color-border)] mb-6">
              {items.map((item) => (
                <li key={item.id} className="py-4 flex items-center space-x-4">
                  <div className="relative h-16 w-16 bg-[var(--color-surface)] rounded-md border border-[var(--color-border)] flex-shrink-0">
                    {/* @ts-ignore React 19 type mismatch */}
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-1"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--color-text)] truncate">{item.name}</p>
                    <p className="text-sm text-[var(--color-text-muted)]">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-sm font-medium text-[var(--color-text)]">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </li>
              ))}
            </ul>

            <div className="space-y-4 border-t border-[var(--color-border)] pt-6 mb-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-[var(--color-text-muted)]">Subtotal</p>
                <p className="text-sm font-medium text-[var(--color-text)]">{formatPrice(totalPrice())}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-[var(--color-text-muted)]">Shipping</p>
                <p className="text-sm font-medium text-[var(--color-success)]">Free</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-[var(--color-text-muted)]">Taxes</p>
                <p className="text-sm font-medium text-[var(--color-text)]">Included</p>
              </div>
            </div>

            <div className="border-t border-[var(--color-border)] pt-6">
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold text-[var(--color-text)]">Total</p>
                <p className="text-2xl font-extrabold text-[var(--color-text)]">{formatPrice(totalPrice())}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
