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
} from 'lucide-react';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Smartphone },
  { href: '/admin/banners', label: 'Banners & Hero', icon: Image },
  { href: '/admin/offers', label: 'Offers & Deals', icon: Tag },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, logout } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
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
        className={`fixed lg:static inset-y-0 left-0 z-50 w-[260px] bg-[#1a1a2e] text-white flex flex-col transform transition-all duration-300 ease-in-out shadow-2xl lg:shadow-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-white/5 bg-[#141424]">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-[#b78b57] to-[#d4a76a] p-2 rounded-xl shadow-lg">
              <Store className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-[1.1rem] leading-tight tracking-wide">Admin Panel</h2>
              <p className="text-[11px] text-[#b78b57] font-medium tracking-wider uppercase mt-0.5">श्री श्याम Mobiles</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 group ${
                  isActive
                    ? 'bg-gradient-to-r from-[#b78b57]/20 to-transparent text-[#d4a76a] border border-[#b78b57]/20 shadow-sm'
                    : 'text-gray-400 hover:bg-white/5 hover:text-gray-100'
                }`}
              >
                <Icon className={`h-5 w-5 flex-shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span className="tracking-wide">{item.label}</span>
                {isActive && <ChevronRight className="h-4 w-4 ml-auto text-[#d4a76a]/70" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 bg-[#141424]">
          <button
            onClick={() => {
              logout();
              router.push('/admin/login');
            }}
            className="flex items-center gap-3 px-4 py-4 w-full rounded-xl text-sm font-medium text-gray-400 hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/20 transition-all"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            <span className="tracking-wide">Sign Out</span>
          </button>
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-4 w-full rounded-xl text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white border border-transparent hover:border-white/10 transition-all mt-2"
          >
            <Store className="h-5 w-5 flex-shrink-0" />
            <span className="tracking-wide">View Storefront</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#f8f4ee]">
        {/* Top Bar */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/60 px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-[#b78b57] transition-colors shadow-sm"
            >
              <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-[#201b16] tracking-tight">
              {navItems.find((item) => pathname === item.href || pathname?.startsWith(item.href + '/'))?.label || 'Overview'}
            </h1>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 bg-white px-2 sm:px-3 py-1.5 rounded-full border border-gray-200/60 shadow-sm">
            <span className="hidden sm:inline text-sm font-medium text-gray-600 pl-2 tracking-wide">Administrator</span>
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-[#1a1a2e] flex items-center justify-center text-[#d4a76a] font-bold text-sm shadow-inner">
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
