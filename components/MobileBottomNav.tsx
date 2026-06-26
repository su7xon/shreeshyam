'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Store, ShoppingBag, User } from 'lucide-react';
import clsx from 'clsx';
import { useCartStore } from '@/lib/store';
import { useState, useEffect } from 'react';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { totalItems } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (pathname?.startsWith('/admin')) return null;

  const cartCount = mounted ? totalItems() : 0;

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Shop', href: '/products', icon: Store },
    { name: 'Cart', href: '/cart', icon: ShoppingBag, badge: cartCount },
    { name: 'Account', href: '/account', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-white/95 backdrop-blur-xl rounded-t-2xl shadow-[0_-8px_30px_-18px_rgba(0,0,0,0.2)] border-t border-white/50 z-50 flex justify-around items-center h-[70px]">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (pathname?.startsWith(item.href) && item.href !== '/');
        const Icon = item.icon;
        
        return (
          <Link
            key={item.name}
            href={item.href}
            aria-label={item.name}
            className={clsx(
              'flex flex-col items-center justify-center flex-1 h-full gap-1 relative transition-all duration-200',
              isActive 
                ? 'text-[#111111]' 
                : 'text-[#9ca3af] hover:text-[#6b7280]'
            )}
          >
            {/* Active indicator */}
            {isActive && (
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#111111] rounded-full" />
            )}
            
            <div className={clsx(
              'p-1.5 rounded-xl transition-all duration-200 relative',
              isActive && 'bg-[#f3f4f6]'
            )}>
              <Icon 
                className={clsx(
                  'w-5 h-5 transition-transform',
                  isActive && 'scale-110'
                )} 
                strokeWidth={isActive ? 2.5 : 2} 
              />
              {/* Cart badge */}
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  aria-label="Cart item count"
                  className="absolute top-[6px] right-[2px] h-4 min-w-[16px] px-1 rounded-full bg-[#111111] text-white text-[9px] font-bold flex items-center justify-center"
                >
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </div>
            <span className={clsx(
              "text-[10px] font-semibold tracking-wide",
              isActive ? "text-[#111111]" : "text-[#9ca3af]"
            )}>
              {item.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}