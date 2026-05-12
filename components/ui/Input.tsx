'use client';

import { InputHTMLAttributes, forwardRef, useState } from 'react';
import { clsx } from 'clsx';
import { LucideIcon, Eye, EyeOff } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  variant?: 'default' | 'filled';
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  icon: Icon,
  iconPosition = 'left',
  variant = 'default',
  type,
  className,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  const inputStyles = clsx(
    'w-full h-11 px-4 rounded-xl text-sm transition-all duration-200',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3b82f6] focus-visible:ring-offset-1',
    'placeholder:text-[#9ca3af]',
    variant === 'default' && [
      'bg-white border border-[#e5e7eb]',
      'hover:border-[#d1d5db]',
      error ? 'border-[#ef4444] focus-visible:ring-[#ef4444]' : 'border-[#e5e7eb]',
    ],
    variant === 'filled' && [
      'bg-[#f9fafb] border border-transparent',
      'hover:bg-[#f3f4f6]',
    ],
    Icon && iconPosition === 'left' && 'pl-10',
    (Icon && iconPosition === 'right') || isPassword && 'pr-10',
    className
  );

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-[#374151] mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && iconPosition === 'left' && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
        )}
        <input
          ref={ref}
          type={isPassword ? (showPassword ? 'text' : 'password') : type}
          className={inputStyles}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#6b7280]"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
        {Icon && iconPosition === 'right' && !isPassword && (
          <Icon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-[#ef4444]">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;