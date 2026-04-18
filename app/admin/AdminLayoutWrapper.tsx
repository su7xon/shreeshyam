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
  BarChart3,
  Bell,
  Search,
  ExternalLink,
} from 'lucide-react';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, group: 'OVERVIEW' },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3, group: 'OVERVIEW' },
  { href: '/admin/products', label: 'Products', icon: Smartphone, group: 'CATALOG' },
  { href: '/admin/brands', label: 'Brands', icon: Building2, group: 'CATALOG' },
  { href: '/admin/orders', label: 'Orders', icon: Package, group: 'COMMERCE' },
  { href: '/admin/banners', label: 'Banners', icon: Image, group: 'CONTENT' },
  { href: '/admin/offers', label: 'Offers', icon: Tag, group: 'CONTENT' },
  { href: '/admin/settings', label: 'Settings', icon: Settings, group: 'SYSTEM' },
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

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (!mounted) {
    return (
      <div className="admin-shell min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="admin-spinner" />
          <p className="text-sm text-[#8b8fa3] font-medium tracking-wide">Loading admin…</p>
        </div>
      </div>
    );
  }

  const isLoginPage = pathname === '/admin/login';

  if (!isAuthenticated && !isLoginPage) {
    // Use window.location for static export compatibility
    if (typeof window !== 'undefined') {
      window.location.href = '/admin/login';
    } else {
      router.push('/admin/login');
    }
    return null;
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  const currentPage = navItems.find((item) => pathname === item.href || pathname?.startsWith(item.href + '/'));

  return (
    <div className="admin-shell min-h-screen flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ─── Sidebar ─── */}
      <aside
        className={`admin-sidebar fixed lg:sticky inset-y-0 left-0 z-50 w-[264px] flex flex-col transform transition-transform duration-300 ease-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar header */}
        <div className="admin-sidebar-header flex items-center justify-between px-5 py-5">
          <div className="flex items-center gap-3 min-w-0">
            <div className="admin-logo-icon flex-shrink-0">
              <Store className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0">
              <h2 className="text-[0.9rem] font-semibold text-white leading-tight truncate">श्री श्याम</h2>
              <p className="text-[10px] text-[#6b7280] font-medium tracking-[0.08em] uppercase mt-0.5">Admin Console</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-[#6b7280] hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto admin-scrollbar">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            const Icon = item.icon;
            const showGroupHeader = item.group && (index === 0 || navItems[index - 1].group !== item.group);

            return (
              <div key={item.href}>
                {showGroupHeader && (
                  <div className={`px-3 pb-1.5 text-[10px] font-semibold text-[#4b5563] uppercase tracking-[0.1em] ${index === 0 ? 'pt-1' : 'pt-5'}`}>
                    {item.group}
                  </div>
                )}
                <Link
                  href={item.href}
                  className={`admin-nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200 ${
                    isActive
                      ? 'admin-nav-active'
                      : 'text-[#9ca3af] hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon className="h-[18px] w-[18px] flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                  {isActive && <ChevronRight className="h-3.5 w-3.5 ml-auto opacity-50" />}
                </Link>
              </div>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="admin-sidebar-footer px-3 py-3 space-y-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-[#6b7280] hover:text-white hover:bg-white/[0.04] transition-colors"
          >
            <ExternalLink className="h-[18px] w-[18px] flex-shrink-0" />
            <span>View Store</span>
          </Link>
          <button
            onClick={() => {
              logout();
              // Use window.location for static export compatibility
              if (typeof window !== 'undefined') {
                window.location.href = '/admin/login';
              } else {
                router.push('/admin/login');
              }
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-[#6b7280] hover:text-[#ef4444] hover:bg-[#ef4444]/[0.06] transition-colors"
          >
            <LogOut className="h-[18px] w-[18px] flex-shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="admin-topbar sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 lg:px-8 h-[60px] sm:h-16">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden admin-icon-btn p-2"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-semibold text-white leading-tight">
                {currentPage?.label || 'Overview'}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button className="admin-icon-btn p-2 relative hidden sm:flex">
              <Bell className="h-[18px] w-[18px]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#3b82f6] rounded-full" />
            </button>
            <div className="admin-user-badge flex items-center gap-2 px-2.5 py-1.5 rounded-lg">
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-[#3b82f6] to-[#6366f1] flex items-center justify-center text-white">
                <User className="h-3.5 w-3.5" />
              </div>
              <span className="hidden sm:inline text-xs font-medium text-[#d1d5db]">Admin</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
