'use client';

import { ReactNode } from 'react';
import { Download } from 'lucide-react';
import Breadcrumb from './Breadcrumb';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: ReactNode;
  children?: ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  actionLabel,
  onAction,
  actionIcon = <Download className="h-4 w-4" />,
  children,
}: PageHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Breadcrumbs */}
      {breadcrumbs && <Breadcrumb items={breadcrumbs} />}

      {/* Title Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text)] tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm text-[var(--color-text-muted)] mt-1">{subtitle}</p>}
        </div>
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-accent)] text-white rounded-lg hover:bg-[var(--color-accent)]/90 transition-colors font-medium text-sm shadow-sm self-start"
          >
            {actionIcon}
            {actionLabel}
          </button>
        )}
      </div>

      {/* Additional content (filters, etc.) */}
      {children}
    </div>
  );
}
