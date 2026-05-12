'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  isLoading = false,
  fullWidth = false,
  className,
  disabled,
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-[#111111] text-white hover:bg-[#2a2a2a] hover:-translate-y-0.5 focus-visible:ring-[#111111] shadow-[0_2px_8px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.2)]',
    secondary: 'bg-[#3b82f6] text-white hover:bg-[#2563eb] hover:-translate-y-0.5 focus-visible:ring-[#3b82f6] shadow-[0_2px_8px_rgba(59,130,246,0.25)] hover:shadow-[0_6px_16px_rgba(59,130,246,0.35)]',
    outline: 'bg-transparent border-2 border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white focus-visible:ring-[#111111]',
    ghost: 'bg-transparent text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#111111] focus-visible:ring-[#3b82f6]',
    danger: 'bg-[#ef4444] text-white hover:bg-[#dc2626] hover:-translate-y-0.5 focus-visible:ring-[#ef4444] shadow-[0_2px_8px_rgba(239,68,68,0.25)]',
  };

  const sizes = {
    sm: 'h-8 px-3 text-xs rounded-lg gap-1.5',
    md: 'h-10 px-4 text-sm rounded-xl gap-2',
    lg: 'h-12 px-6 text-base rounded-xl gap-2.5',
  };

  return (
    <button
      ref={ref}
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4" />}
        </>
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;