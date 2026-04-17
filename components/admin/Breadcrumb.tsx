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
    <nav className="flex items-center text-sm text-[var(--color-text-muted)]">
      <Link href="/" className="flex items-center gap-1 hover:text-[var(--color-accent)] transition-colors">
        <Home className="h-4 w-4" />
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-1">
          <ChevronRight className="h-4 w-4 text-[var(--color-text-muted)]/50" />
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-[var(--color-accent)] transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-[var(--color-accent)] font-medium">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
