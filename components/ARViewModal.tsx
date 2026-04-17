'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { X, Smartphone, Maximize2, RotateCw, Info } from 'lucide-react';

interface PhoneAR {
  id: string;
  name: string;
  image: string;
  price: number;
  dimensions: { width: number; height: number; depth: number };
}

const phonesAR: PhoneAR[] = [
  { id: '1', name: 'Samsung Galaxy S24 Ultra', image: '', price: 129999, dimensions: { width: 79, height: 162, depth: 8.2 } },
  { id: '2', name: 'iPhone 15 Pro Max', image: '', price: 149999, dimensions: { width: 76, height: 159, depth: 8.3 } },
  { id: '3', name: 'Google Pixel 8 Pro', image: '', price: 89999, dimensions: { width: 73, height: 153, depth: 8.2 } },
];

export default function ARViewModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [selectedPhone, setSelectedPhone] = useState<PhoneAR | null>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && selectedPhone) {
      setRotation(prev => ({
        x: prev.x + e.movementY * 0.5,
        y: prev.y + e.movementX * 0.5,
      }));
    }
  };

  const resetView = () => {
    setRotation({ x: 0, y: 0 });
    setScale(1);
  };

  if (!isOpen) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#EC4899] to-[#8B5CF6] rounded-xl flex items-center justify-center">
              <Smartphone className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">AR View - See in Your Space</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-1/3 space-y-3">
              <p className="text-sm text-gray-600 mb-4">Select a phone to view in AR:</p>
              {phonesAR.map((phone) => (
                <button
                  key={phone.id}
                  onClick={() => { setSelectedPhone(phone); resetView(); }}
                  className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                    selectedPhone?.id === phone.id
                      ? 'border-[#EC4899] bg-[#EC4899]/10'
                      : 'border-gray-200 hover:border-[#EC4899]/50'
                  }`}
                >
                  <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={phone.image} alt={phone.name} fill className="object-contain p-2" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-sm text-gray-900 line-clamp-2">{phone.name}</p>
                    <p className="text-sm text-[#EC4899] font-bold">{formatPrice(phone.price)}</p>
                  </div>
                </button>
              ))}
              
              <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                  <p className="text-xs text-blue-700">
                    This is a 3D preview. For full AR experience on your device, use a WebXR-compatible browser.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:w-2/3">
              <div
                ref={containerRef}
                className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden cursor-move"
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onMouseMove={handleMouseMove}
              >
                {selectedPhone ? (
                  <>
                    <div
                      className="absolute inset-0 flex items-center justify-center transition-transform duration-100"
                      style={{
                        transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${scale})`,
                      }}
                    >
                      <div className="relative w-40 h-80 bg-gradient-to-b from-gray-800 to-gray-900 rounded-[3rem] shadow-2xl border-4 border-gray-700">
                        <div className="absolute inset-2 bg-black rounded-[2.5rem] overflow-hidden">
                          <Image
                            src={selectedPhone.image}
                            alt={selectedPhone.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full" />
                      </div>
                    </div>
                    
                    <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-2">
                      <button
                        onClick={resetView}
                        className="px-4 py-2 bg-white/90 rounded-full text-sm font-medium text-gray-700 hover:bg-white transition-colors flex items-center gap-2"
                      >
                        <RotateCw className="h-4 w-4" /> Reset
                      </button>
                      <button
                        onClick={() => setScale(prev => Math.min(prev + 0.2, 2))}
                        className="px-3 py-2 bg-white/90 rounded-full text-sm font-medium text-gray-700 hover:bg-white transition-colors"
                      >
                        <Maximize2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setScale(prev => Math.max(prev - 0.2, 0.5))}
                        className="px-3 py-2 bg-white/90 rounded-full text-sm font-medium text-gray-700 hover:bg-white transition-colors"
                      >
                        -
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Smartphone className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Select a phone to view in AR</p>
                    </div>
                  </div>
                )}
              </div>
              
              {selectedPhone && (
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-500">Drag to rotate • Scroll to zoom</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}