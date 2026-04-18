'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Store, ShoppingBag, User } from 'lucide-react';
import clsx from 'clsx';

export default function MobileBottomNav() {
  const pathname = usePathname();

  // Hide on admin pages
  if (pathname?.startsWith('/admin')) return null;

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Shop', href: '/products', icon: Store },
    { name: 'Cart', href: '/cart', icon: ShoppingBag },
    { name: 'Account', href: '/account', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-50 md:hidden flex justify-around items-center h-[68px]">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (pathname?.startsWith(item.href) && item.href !== '/');
        const Icon = item.icon;
        
        return (
          <Link
            key={item.name}
            href={item.href}
            className={clsx(
              'flex flex-col items-center justify-center w-full h-full space-y-1',
              isActive ? 'text-[var(--color-text)]' : 'text-gray-400 hover:text-gray-600'
            )}
          >
            <Icon className="w-[22px] h-[22px]" strokeWidth={isActive ? 2.5 : 2} />
            <span className={clsx("text-[10px] font-medium tracking-wide uppercase", isActive ? "font-semibold" : "")}>
              {item.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
