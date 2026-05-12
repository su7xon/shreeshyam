'use client';

import { clsx } from 'clsx';
import { HTMLAttributes } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'accent';
  size?: 'sm' | 'md';
}

export default function Badge({
  children,
  variant = 'default',
  size = 'sm',
  className,
  ...props
}: BadgeProps) {
  const variants = {
    default: 'bg-[#f3f4f6] text-[#6b7280]',
    success: 'bg-[#ecfdf5] text-[#059669]',
    warning: 'bg-[#fffbeb] text-[#d97706]',
    error: 'bg-[#fef2f2] text-[#dc2626]',
    info: 'bg-[#eff6ff] text-[#2563eb]',
    accent: 'bg-[#111111] text-white',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center font-semibold rounded-md',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}