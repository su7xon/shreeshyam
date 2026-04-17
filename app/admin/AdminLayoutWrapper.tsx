'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAdminAuth } from '@/lib/admin-auth';
import {
  LayoutDashboard,
  Smartphone,
  Image,
  Tag,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Store,
  User,
  Package,
  Building2,
  Upload,
  BarChart3,
} from 'lucide-react';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, group: 'DASHBOARD' },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3, group: 'DASHBOARD' },
  { href: '/admin/products', label: 'Products', icon: Smartphone, group: 'WORKSPACE' },
  { href: '/admin/brands', label: 'Brands', icon: Building2, group: 'WORKSPACE' },
  { href: '/admin/orders', label: 'Orders', icon: Package, group: 'WORKSPACE' },
  { href: '/admin/banners', label: 'Banners & Hero', icon: Image, group: 'WORKSPACE' },
  { href: '/admin/offers', label: 'Offers & Deals', icon: Tag, group: 'WORKSPACE' },
  { href: '/admin/settings', label: 'Settings', icon: Settings, group: 'WORKSPACE' },
];

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, logout } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const isLoginPage = pathname === '/admin/login';

  if (!isAuthenticated && !isLoginPage) {
    router.push('/admin/login');
    return null;
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex font-sans">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-[260px] bg-[var(--color-surface)] text-[var(--color-text)] flex flex-col transform transition-all duration-300 ease-in-out shadow-2xl lg:shadow-none border-r border-[var(--color-border)] ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-[var(--color-border)] bg-[var(--color-surface-soft)]">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-gray-800 to-black p-2 rounded-xl shadow-lg">
              <Store className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-[1.1rem] leading-tight tracking-wide text-[var(--color-text)]">Admin Panel</h2>
              <p className="text-[11px] text-[var(--color-accent)] font-medium tracking-wider uppercase mt-0.5">श्री श्याम Mobiles</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg bg-[var(--color-surface-soft)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-border)] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            const Icon = item.icon;
            const showGroupHeader = item.group && (index === 0 || navItems[index - 1].group !== item.group);

            return (
              <div key={item.href}>
                {showGroupHeader && (
                  <div className="px-4 pt-6 pb-2 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                    {item.group}
                  </div>
                )}
                <Link
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 group ${
                    isActive
                      ? 'bg-gradient-to-r from-[var(--color-accent)]/15 to-transparent text-[#111827] border border-[var(--color-accent)]/25 shadow-sm'
                      : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text)]'
                  }`}
                >
                  <Icon className={`h-5 w-5 flex-shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className="tracking-wide">{item.label}</span>
                  {isActive && <ChevronRight className="h-4 w-4 ml-auto text-[#111827]/70" />}
                </Link>
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-surface-soft)]">
          <button
            onClick={() => {
              logout();
              router.push('/admin/login');
            }}
            className="flex items-center gap-3 px-4 py-4 w-full rounded-xl text-sm font-medium text-[var(--color-text-muted)] hover:bg-red-500/10 hover:text-red-500 border border-transparent hover:border-red-500/20 transition-all"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            <span className="tracking-wide">Sign Out</span>
          </button>
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-4 w-full rounded-xl text-sm font-medium text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)] border border-transparent hover:border-[var(--color-border)] transition-all mt-2"
          >
            <Store className="h-5 w-5 flex-shrink-0" />
            <span className="tracking-wide">View Storefront</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-[var(--color-bg)]">
        {/* Top Bar */}
        <header className="premium-surface border-b border-[var(--color-border)] px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-accent)] transition-colors shadow-sm"
            >
              <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-text)] tracking-tight">
              {navItems.find((item) => pathname === item.href || pathname?.startsWith(item.href + '/'))?.label || 'Overview'}
            </h1>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 bg-[var(--color-surface)] px-2 sm:px-3 py-1.5 rounded-full border border-[var(--color-border)] shadow-sm">
            <span className="hidden sm:inline text-sm font-medium text-[var(--color-text-muted)] pl-2 tracking-wide">Administrator</span>
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white font-bold text-sm shadow-inner">
              <User className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto min-h-[calc(100vh-80px)]">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
