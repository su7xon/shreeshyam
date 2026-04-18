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
    <div className="space-y-3">
      {breadcrumbs && <Breadcrumb items={breadcrumbs} />}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-semibold text-white">{title}</h1>
          {subtitle && <p className="text-xs text-[#6b7280] mt-0.5">{subtitle}</p>}
        </div>
        {actionLabel && onAction && (
          <button onClick={onAction} className="admin-btn-primary text-xs sm:text-sm self-start">
            {actionIcon}
            {actionLabel}
          </button>
        )}
      </div>
      {children}
    </div>
  );
}
