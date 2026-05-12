'use client';

import { ShieldCheck, Award, Truck, RotateCcw } from 'lucide-react';

const badges = [
  {
    icon: ShieldCheck,
    title: '100% Original',
    subtitle: 'Products',
    color: '#059669',
    bg: '#d1fae5',
  },
  {
    icon: Award,
    title: '1 Year',
    subtitle: 'Warranty',
    color: '#7c3aed',
    bg: '#ede9fe',
  },
  {
    icon: Truck,
    title: 'Free & Fast',
    subtitle: 'Delivery',
    color: '#d97706',
    bg: '#fef3c7',
  },
  {
    icon: RotateCcw,
    title: 'Easy',
    subtitle: 'Returns',
    color: '#2563eb',
    bg: '#dbeafe',
  },
];

export default function TrustBadges() {
  return (
    <section className="pb-8 sm:pb-12 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl p-2.5 sm:p-6 border border-[#e5e7eb] shadow-sm">
        <div className="flex items-center justify-center gap-0 sm:gap-4">
          {badges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <div 
                key={index} 
                className="flex items-center gap-1.5 sm:gap-3 flex-1 justify-center p-1.5 sm:p-3 rounded-xl group"
              >
                <div 
                  className="w-7 h-7 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: badge.bg }}
                >
                  <Icon 
                    className="h-3.5 w-3.5 sm:h-5 sm:w-5" 
                    style={{ color: badge.color }}
                    strokeWidth={2} 
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[9px] sm:text-sm font-bold text-[#111111] leading-tight">
                    {badge.title}
                  </span>
                  <span 
                    className="text-[8px] sm:text-xs font-semibold uppercase tracking-tight"
                    style={{ color: badge.color }}
                  >
                    {badge.subtitle}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}