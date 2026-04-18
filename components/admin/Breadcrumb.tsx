'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center text-xs text-[#6b7280]">
      <Link href="/" className="flex items-center gap-1 hover:text-[#60a5fa] transition-colors">
        <Home className="h-3.5 w-3.5" />
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-1">
          <ChevronRight className="h-3.5 w-3.5 opacity-40" />
          {item.href ? (
            <Link href={item.href} className="hover:text-[#60a5fa] transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-[#60a5fa] font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
