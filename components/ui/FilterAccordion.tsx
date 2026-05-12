'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { clsx } from 'clsx';

interface FilterAccordionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export default function FilterAccordion({ title, defaultOpen = false, children }: FilterAccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-[#f9fafb] transition-colors"
      >
        <span className="text-sm font-semibold text-[#111111]">{title}</span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-[#6b7280]" />
        ) : (
          <ChevronDown className="w-4 h-4 text-[#6b7280]" />
        )}
      </button>
      <div className={clsx(
        'overflow-hidden transition-all duration-300',
        isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
      )}>
        <div className="p-4 pt-0 border-t border-[#f3f4f6]">
          {children}
        </div>
      </div>
    </div>
  );
}