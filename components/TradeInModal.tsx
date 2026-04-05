'use client';

import { useState } from 'react';
import { X, Calculator, RefreshCw } from 'lucide-react';

const brandOptions = ['Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi', 'Realme', 'Oppo', 'Vivo', 'Motorola', 'Nothing', 'iQOO', 'Poco'];
const conditionOptions = [
  { value: 'excellent', label: 'Excellent', discount: 1.0 },
  { value: 'good', label: 'Good', discount: 0.8 },
  { value: 'fair', label: 'Fair', discount: 0.6 },
  { value: 'poor', label: 'Poor', discount: 0.4 },
];

export default function TradeInModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [condition, setCondition] = useState('');
  const [estimatedValue, setEstimatedValue] = useState<number | null>(null);

  const baseValue = model ? parseInt(model.replace(/,/g, '')) || 0 : 0;

  const calculateValue = () => {
    if (!brand || !model || !condition) return;
    const conditionDiscount = conditionOptions.find(c => c.value === condition)?.discount || 0.6;
    const value = Math.round(baseValue * 0.4 * conditionDiscount);
    setEstimatedValue(value);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl flex items-center justify-center">
              <RefreshCw className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Trade-in Calculator</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
            <select
              value={brand}
              onChange={(e) => { setBrand(e.target.value); setEstimatedValue(null); }}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#10B981]"
            >
              <option value="">Select Brand</option>
              {brandOptions.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Original Price (₹)</label>
            <input
              type="number"
              value={model}
              onChange={(e) => { setModel(e.target.value); setEstimatedValue(null); }}
              placeholder="Enter original purchase price"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#10B981]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Condition</label>
            <div className="grid grid-cols-4 gap-2">
              {conditionOptions.map(c => (
                <button
                  key={c.value}
                  onClick={() => { setCondition(c.value); setEstimatedValue(null); }}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    condition === c.value
                      ? 'bg-[#10B981] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-[#10B981]/20'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={calculateValue}
            disabled={!brand || !model || !condition}
            className="w-full bg-gradient-to-r from-[#10B981] to-[#059669] text-white font-bold py-3 px-6 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Calculator className="h-5 w-5" />
            Calculate Value
          </button>

          {estimatedValue !== null && (
            <div className="mt-6 p-6 bg-gradient-to-r from-[#10B981]/10 to-[#059669]/10 rounded-xl border border-[#10B981]/20">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Estimated Trade-in Value</p>
                <p className="text-4xl font-bold text-[#10B981]">₹{estimatedValue.toLocaleString('en-IN')}</p>
                <p className="text-xs text-gray-500 mt-2">This value can be redeemed as discount on your next purchase</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}