'use client';

import { ShieldCheck, Award, Truck, RotateCcw } from 'lucide-react';

const badges = [
  {
    icon: ShieldCheck,
    title: '100% Original',
    subtitle: 'Products',
  },
  {
    icon: Award,
    title: '1 Year',
    subtitle: 'Warranty',
  },
  {
    icon: Truck,
    title: 'Free & Fast',
    subtitle: 'Delivery',
  },
  {
    icon: RotateCcw,
    title: 'Easy',
    subtitle: 'Returns',
  },
];

export default function TrustBadges() {
  return (
    <section className="pb-8 sm:pb-12 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-gray-50/50 border border-gray-100 rounded-2xl p-4 sm:p-8">
        <div className="grid grid-cols-4 gap-1 sm:gap-8">
          {badges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <div key={index} className="flex items-center gap-1.5 sm:gap-4 justify-center">
                <div className="flex-shrink-0">
                  <Icon className="h-4 w-4 sm:h-8 sm:w-8 text-blue-600" strokeWidth={2} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] sm:text-base font-bold text-gray-900 leading-tight">
                    {badge.title}
                  </span>
                  <span className="text-[8px] sm:text-sm text-gray-500 font-medium uppercase tracking-tight sm:tracking-wider">
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
