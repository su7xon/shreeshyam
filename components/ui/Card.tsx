'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outline' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(({
  children,
  variant = 'default',
  padding = 'md',
  hover = false,
  className,
  ...props
}, ref) => {
  const variants = {
    default: 'bg-white border border-[#e5e7eb]',
    elevated: 'bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)] border border-transparent',
    outline: 'bg-transparent border-2 border-[#111111]',
    glass: 'glass-surface border border-white/20',
  };

  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4 sm:p-5',
    lg: 'p-6 sm:p-8',
  };

  return (
    <div
      ref={ref}
      className={clsx(
        'rounded-2xl transition-all duration-300',
        variants[variant],
        paddings[padding],
        hover && 'hover:shadow-lg hover:-translate-y-1 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export default Card;