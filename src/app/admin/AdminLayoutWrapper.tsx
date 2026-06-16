'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAdminAuth } from '@/lib/admin-auth';
import { Toaster } from 'react-hot-toast';
import useAdminStore from '@/lib/admin-store';
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
  BarChart3,
  Bell,
  ExternalLink,
  Mail,
  PlusCircle,
  Layers,
  MessageSquare,
} from 'lucide-react';
import { clsx } from 'clsx';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, group: 'Overview' },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3, group: 'Overview' },
  { href: '/admin/products', label: 'Products', icon: Smartphone, group: 'Catalog' },
  { href: '/admin/categories', label: 'Categories', icon: Layers, group: 'Catalog' },
  { href: '/admin/brands', label: 'Brands', icon: Building2, group: 'Catalog' },
  { href: '/admin/daily-deals', label: 'Daily Deals', icon: Tag, group: 'Catalog' },
  { href: '/admin/orders', label: 'Orders', icon: Package, group: 'Commerce' },
  { href: '/admin/inquiries', label: 'Inquiries', icon: Mail, group: 'Commerce' },
  { href: '/admin/reviews', label: 'Reviews', icon: MessageSquare, group: 'Commerce' },
  { href: '/admin/banners', label: 'Banners', icon: Image, group: 'Content' },
  { href: '/admin/offers', label: 'Offers', icon: PlusCircle, group: 'Content' },
  { href: '/admin/settings', label: 'Settings', icon: Settings, group: 'System' },
];

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, logout } = useAdminAuth();
  const admin = useAdminStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const initialize = useAdminStore((state) => state.initialize);

  useEffect(() => {
    setMounted(true);
    const unsubscribe = initialize();
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [initialize]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (!mounted) {
    return (
      <div className="admin-shell min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="admin-spinner" />
          <p className="text-sm text-[#6b7280] font-medium">Loading admin...</p>
        </div>
      </div>
    );
  }

  const isLoginPage = pathname === '/admin/login';

  if (!isAuthenticated && !isLoginPage) {
    if (typeof window !== 'undefined') window.location.href = '/admin/login';
    else router.push('/admin/login');
    return null;
  }

  if (isLoginPage) return <>{children}</>;

  const currentPage = navItems.find(
    (item) => pathname === item.href || pathname?.startsWith(item.href + '/')
  );

  return (
    <div className="admin-shell min-h-screen flex">
      <Toaster position="top-right" />
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-[3px] z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ─── Sidebar ─── */}
      <aside
        className={clsx(
          'admin-sidebar fixed lg:sticky inset-y-0 left-0 z-50 w-[272px] flex flex-col',
          'transform transition-transform duration-300 ease-out lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="admin-sidebar-header flex items-center justify-between px-5 py-4">
          <Link href="/admin/dashboard" className="flex items-center gap-3 min-w-0">
            <div className="admin-logo-icon flex-shrink-0">
              <Store className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0">
              <h2 className="text-[0.9rem] font-bold text-white leading-tight truncate">श्री श्याम Mobiles</h2>
              <p className="text-[10px] text-[#4b5563] font-medium tracking-[0.06em] uppercase mt-0.5">Admin Console</p>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg text-[#6b7280] hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 overflow-y-auto admin-scrollbar">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            const Icon = item.icon;
            const showGroupHeader =
              item.group && (index === 0 || navItems[index - 1].group !== item.group);

            return (
              <div key={item.href}>
                {showGroupHeader && (
                  <div className="px-3 pb-1.5 text-[10px] font-bold text-[#374151] uppercase tracking-[0.1em] mt-2 first:mt-0">
                    {item.group}
                  </div>
                )}
                <Link
                  href={item.href}
                  className={clsx(
                    'admin-nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200',
                    isActive
                      ? 'admin-nav-active'
                      : 'text-[#8b8fa3] hover:text-white hover:bg-white/[0.04]'
                  )}
                >
                  <Icon className="h-[18px] w-[18px] flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                  {isActive && <ChevronRight className="h-3.5 w-3.5 ml-auto opacity-50" />}
                </Link>
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="admin-sidebar-footer px-3 py-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-[#6b7280] hover:text-white hover:bg-white/[0.04] transition-colors mb-1"
          >
            <ExternalLink className="h-[18px] w-[18px] flex-shrink-0" />
            <span>View Store</span>
          </Link>
          <button
            onClick={() => {
              logout();
              if (typeof window !== 'undefined') window.location.href = '/admin/login';
              else router.push('/admin/login');
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-[#6b7280] hover:text-[#f87171] hover:bg-[#f87171]/[0.06] transition-colors"
          >
            <LogOut className="h-[18px] w-[18px] flex-shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="admin-topbar sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 h-16">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden admin-icon-btn p-2 -ml-2"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Page Title */}
            <div>
              <h1 className="text-sm sm:text-base font-semibold text-white leading-tight">
                {currentPage?.label || 'Dashboard'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="admin-icon-btn p-2 relative hidden sm:flex">
              <Bell className="h-[18px] w-[18px]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#3b82f6] rounded-full" />
            </button>
            <div className="admin-user-badge flex items-center gap-2 px-2.5 py-1.5 rounded-xl">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#6366f1] flex items-center justify-center">
                <User className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="hidden sm:inline text-xs font-medium text-[#d1d5db]">Admin</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}