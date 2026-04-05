'use client';

import { useState } from 'react';
import { X, Smartphone, Ruler } from 'lucide-react';

interface PhoneSize {
  name: string;
  screen: number;
  height: number;
  width: number;
}

const phoneSizes: PhoneSize[] = [
  { name: 'iPhone SE', screen: 4.7, height: 138, width: 67 },
  { name: 'iPhone 14', screen: 6.1, height: 147, width: 72 },
  { name: 'iPhone 14 Pro Max', screen: 6.7, height: 160, width: 77 },
  { name: 'Samsung S24', screen: 6.2, height: 147, width: 70 },
  { name: 'Samsung S24 Ultra', screen: 6.8, height: 162, width: 79 },
  { name: 'Google Pixel 8', screen: 6.2, height: 151, width: 72 },
];

export default function SizeGuideModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [selectedPhone, setSelectedPhone] = useState<string | null>(null);

  if (!isOpen) return null;

  const selected = phoneSizes.find(p => p.name === selectedPhone);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] rounded-xl flex items-center justify-center">
              <Ruler className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Phone Size Guide</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <p className="text-gray-600 mb-6 text-sm">
            Compare phone dimensions to find the perfect size for your hand.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
            {phoneSizes.map((phone) => (
              <button
                key={phone.name}
                onClick={() => setSelectedPhone(phone.name)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedPhone === phone.name
                    ? 'border-[#3B82F6] bg-[#3B82F6]/10'
                    : 'border-gray-200 hover:border-[#3B82F6]/50'
                }`}
              >
                <Smartphone className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                <div className="font-semibold text-sm text-gray-900">{phone.name}</div>
                <div className="text-xs text-gray-500">{phone.screen}&quot; Display</div>
              </button>
            ))}
          </div>

          {selected && (
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-4">{selected.name} Dimensions</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-[#3B82F6]">{selected.screen}&quot;</div>
                  <div className="text-xs text-gray-500">Display</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#3B82F6]">{selected.height}mm</div>
                  <div className="text-xs text-gray-500">Height</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#3B82F6]">{selected.width}mm</div>
                  <div className="text-xs text-gray-500">Width</div>
                </div>
              </div>

              <div className="mt-6 relative">
                <div className="flex justify-center">
                  <div
                    className="border-2 border-gray-300 rounded-lg relative overflow-hidden"
                    style={{
                      width: `${selected.width * 2}px`,
                      height: `${selected.height * 2}px`,
                      maxWidth: '200px',
                      maxHeight: '300px',
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent" />
                    <div className="absolute inset-2 border border-gray-400 rounded-md" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 text-center mt-4">* Scale representation</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}