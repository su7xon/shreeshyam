'use client';

import { useState } from 'react';
import { X, Package, CheckCircle, Truck, Home } from 'lucide-react';

interface OrderStep {
  status: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
  current: boolean;
}

const orderSteps: OrderStep[] = [
  { status: 'placed', label: 'Order Placed', description: 'Your order has been confirmed', icon: <CheckCircle className="h-5 w-5" />, completed: true, current: false },
  { status: 'processing', label: 'Processing', description: 'Preparing for dispatch', icon: <Package className="h-5 w-5" />, completed: true, current: false },
  { status: 'shipped', label: 'Shipped', description: 'On the way to you', icon: <Truck className="h-5 w-5" />, completed: false, current: true },
  { status: 'out', label: 'Out for Delivery', description: 'Arriving soon', icon: <Truck className="h-5 w-5" />, completed: false, current: false },
  { status: 'delivered', label: 'Delivered', description: 'Delivered to your address', icon: <Home className="h-5 w-5" />, completed: false, current: false },
];

export default function OrderTrackingModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [orderId, setOrderId] = useState('');
  const [showTracking, setShowTracking] = useState(false);

  const handleTrack = () => {
    if (orderId.trim()) setShowTracking(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-[#F59E0B] to-[#EF4444] rounded-xl flex items-center justify-center">
              <Truck className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Track Your Order</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {!showTracking ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Enter Order ID or Phone Number</label>
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="e.g., ORD-123456 or 9876543210"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                />
              </div>
              <button
                onClick={handleTrack}
                className="w-full bg-gradient-to-r from-[#F59E0B] to-[#EF4444] text-white font-bold py-3 px-6 rounded-xl hover:opacity-90 transition-opacity"
              >
                Track Order
              </button>
            </div>
          ) : (
            <div>
              <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-200">
                <p className="text-sm text-green-700">
                  <span className="font-bold">Order ID: </span>{orderId}
                </p>
                <p className="text-sm text-green-700 mt-1">
                  <span className="font-bold">Estimated Delivery: </span>3-4 business days
                </p>
              </div>

              <div className="space-y-0">
                {orderSteps.map((step, index) => (
                  <div key={step.status} className="flex items-start gap-4 relative">
                    {index !== orderSteps.length - 1 && (
                      <div className={`absolute left-[22px] top-10 w-0.5 h-12 ${step.completed ? 'bg-green-500' : 'bg-gray-200'}`} />
                    )}
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                      step.completed ? 'bg-green-500 text-white' : step.current ? 'bg-[#F59E0B] text-white animate-pulse' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {step.icon}
                    </div>
                    <div className="flex-1 pb-6">
                      <p className={`font-semibold ${step.current ? 'text-[#F59E0B]' : step.completed ? 'text-green-600' : 'text-gray-500'}`}>
                        {step.label}
                      </p>
                      <p className="text-sm text-gray-500">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={() => { setShowTracking(false); setOrderId(''); }} className="mt-4 text-[#F59E0B] hover:underline text-sm font-medium">
                Track another order
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}