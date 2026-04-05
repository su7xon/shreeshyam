'use client';

import { useState } from 'react';
import { X, Crown, Check, Star, Zap, Shield, Gift } from 'lucide-react';

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 0,
    features: ['Standard warranty', 'Basic support', 'Regular deals'],
    highlight: false,
  },
  {
    id: 'silver',
    name: 'Silver',
    price: 99,
    period: '/month',
    features: ['Extended warranty (2 years)', 'Priority support', '10% extra discount', 'Early access to sales', 'Free delivery'],
    highlight: false,
  },
  {
    id: 'gold',
    name: 'Gold',
    price: 199,
    period: '/month',
    features: ['Premium warranty (3 years)', '24/7 dedicated support', '15% extra discount', 'First access to launches', 'Free expedited delivery', 'Exclusive member deals', 'Free screen protector'],
    highlight: true,
  },
];

export default function PremiumMembershipModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-[#F59E0B] to-[#FFD700] rounded-xl flex items-center justify-center">
              <Crown className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Premium Membership</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Unlock Exclusive Benefits</h3>
            <p className="text-gray-600">Join our premium program and enjoy unbeatable perks on every purchase.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                  plan.highlight
                    ? 'border-[#F59E0B] bg-gradient-to-b from-[#F59E0B]/10 to-transparent'
                    : selectedPlan === plan.id
                    ? 'border-[#3B82F6] bg-[#3B82F6]/10'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#F59E0B] to-[#FFD700] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="h-3 w-3" /> POPULAR
                  </div>
                )}
                
                <div className="text-center mb-4">
                  <h4 className="font-bold text-lg text-gray-900">{plan.name}</h4>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-gray-900">₹{plan.price}</span>
                    {plan.period && <span className="text-sm text-gray-500">{plan.period}</span>}
                  </div>
                </div>

                <ul className="space-y-2 mb-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-2 rounded-lg font-medium transition-colors ${
                    plan.highlight
                      ? 'bg-gradient-to-r from-[#F59E0B] to-[#FFD700] text-white'
                      : plan.id === 'basic'
                      ? 'bg-gray-100 text-gray-700'
                      : 'bg-[#3B82F6] text-white'
                  }`}
                >
                  {plan.id === 'basic' ? 'Current Plan' : 'Select Plan'}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-gray-50 rounded-xl">
              <Zap className="h-6 w-6 text-[#F59E0B] mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Fast Delivery</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <Shield className="h-6 w-6 text-[#F59E0B] mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Extended Warranty</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <Gift className="h-6 w-6 text-[#F59E0B] mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Exclusive Deals</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}