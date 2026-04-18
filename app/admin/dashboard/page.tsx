'use client';

import Link from 'next/link';
import useAdminStore from '@/lib/admin-store';
import { products as defaultProducts } from '@/lib/data';
import {
  Smartphone, Image, Tag, TrendingUp, Plus, Eye, AlertCircle,
  ArrowUpRight, Package, Building2, BarChart3,
} from 'lucide-react';
import { isConfigValid } from '@/lib/firebase';

export default function AdminDashboardPage() {
  const admin = useAdminStore();
  const { products: storeProducts, banners, offers: storeOffers, isLoading } = admin;

  const products = storeProducts.length > 0 ? storeProducts : defaultProducts;
  const offers = storeOffers.length > 0 ? storeOffers : [];

  const totalProducts = products.length;
  const featuredProducts = products.filter((p) => p.featured).length;
  const activeBanners = banners.filter((b) => b.active).length;
  const activeOffers = offers.filter((o) => o.active).length;

  const brands = [...new Set(products.map((p) => p.brand))];

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="admin-stat-card h-28 bg-[#181a22]" />
          ))}
        </div>
        <div className="admin-card h-48" />
        <div className="admin-card h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Firebase warning */}
      {!isConfigValid && (
        <div className="admin-alert admin-alert-warn">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm">Firebase Not Configured</p>
            <p className="text-xs opacity-80 mt-0.5">Showing local default data. Add Firebase env variables to <code className="bg-white/10 px-1.5 py-0.5 rounded text-xs">.env.local</code> for live data.</p>
          </div>
        </div>
      )}

      {/* ─── Stats Grid ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard icon={Smartphone} label="Products" value={totalProducts} color="blue" />
        <StatCard icon={TrendingUp} label="Featured" value={featuredProducts} color="green" />
        <StatCard icon={Image} label="Banners" value={activeBanners} color="purple" />
        <StatCard icon={Tag} label="Offers" value={activeOffers} color="amber" />
      </div>

      {/* ─── Quick Actions ─── */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3>Quick Actions</h3>
        </div>
        <div className="admin-card-body">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Link href="/admin/products/new" className="admin-action-link group">
              <div className="admin-action-icon bg-[#3b82f6]/10">
                <Plus className="h-5 w-5 text-[#60a5fa]" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#e5e7eb] leading-tight">Add Product</p>
                <p className="text-[11px] text-[#6b7280] mt-0.5">New phone listing</p>
              </div>
            </Link>
            <Link href="/admin/banners" className="admin-action-link group">
              <div className="admin-action-icon bg-[#8b5cf6]/10">
                <Image className="h-5 w-5 text-[#a78bfa]" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#e5e7eb] leading-tight">Banners</p>
                <p className="text-[11px] text-[#6b7280] mt-0.5">Manage hero slides</p>
              </div>
            </Link>
            <Link href="/admin/offers" className="admin-action-link group">
              <div className="admin-action-icon bg-[#f59e0b]/10">
                <Tag className="h-5 w-5 text-[#fbbf24]" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#e5e7eb] leading-tight">Offers</p>
                <p className="text-[11px] text-[#6b7280] mt-0.5">Deals & discounts</p>
              </div>
            </Link>
            <Link href="/admin/analytics" className="admin-action-link group">
              <div className="admin-action-icon bg-[#22c55e]/10">
                <BarChart3 className="h-5 w-5 text-[#4ade80]" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#e5e7eb] leading-tight">Analytics</p>
                <p className="text-[11px] text-[#6b7280] mt-0.5">View insights</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* ─── Brands Overview ─── */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3>Products by Brand</h3>
          <Link href="/admin/brands" className="admin-badge admin-badge-blue text-xs hover:opacity-80 transition-opacity">
            View All <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="admin-card-body">
          {brands.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
              {brands.map((brand) => {
                const count = products.filter((p) => p.brand === brand).length;
                return (
                  <Link
                    key={brand}
                    href={`/admin/products?brand=${brand}`}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-[#3b82f6]/20 hover:bg-white/[0.04] transition-all text-center group"
                  >
                    <div className="h-8 w-8 rounded-lg bg-white/[0.06] flex items-center justify-center group-hover:bg-[#3b82f6]/10 transition-colors">
                      <Building2 className="h-4 w-4 text-[#6b7280] group-hover:text-[#60a5fa] transition-colors" />
                    </div>
                    <p className="text-xs font-medium text-[#9ca3af] truncate w-full">{brand}</p>
                    <p className="text-lg font-bold text-white leading-none">{count}</p>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="admin-empty-state">
              <div className="admin-empty-icon">
                <Building2 className="h-6 w-6" />
              </div>
              <p className="admin-empty-title">No brands yet</p>
              <p className="admin-empty-desc">Add your first product to see brands here</p>
            </div>
          )}
        </div>
      </div>

      {/* ─── Recent Products ─── */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3>Recent Products</h3>
          <Link href="/admin/products" className="admin-badge admin-badge-blue text-xs hover:opacity-80 transition-opacity">
            View All <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="admin-card-body">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {products.slice(-6).reverse().map((product) => (
                <Link
                  key={product.id}
                  href={`/admin/products/${product.id}`}
                  className="flex items-center gap-3.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] hover:bg-white/[0.04] transition-all group"
                >
                  <div className="h-16 w-16 rounded-lg bg-white/[0.04] overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-contain p-1.5 group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <Smartphone className="h-6 w-6 text-[#4b5563]" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[#e5e7eb] truncate leading-tight">{product.name}</p>
                    <p className="text-[11px] text-[#6b7280] mt-1">{product.brand} · {product.ram}/{product.storage}</p>
                    <p className="text-sm font-bold text-[#60a5fa] mt-1.5">₹{product.price.toLocaleString('en-IN')}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="admin-empty-state">
              <div className="admin-empty-icon">
                <Smartphone className="h-6 w-6" />
              </div>
              <p className="admin-empty-title">No Products</p>
              <p className="admin-empty-desc">Start building your inventory by adding a product.</p>
              <Link href="/admin/products/new" className="admin-btn-primary mt-4">
                <Plus className="h-4 w-4" /> Add Product
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


/* ─── Stat Card Component ─── */
const colorMap: Record<string, { bg: string; text: string; glow: string }> = {
  blue:   { bg: 'rgba(59,130,246,0.12)',  text: '#60a5fa', glow: 'rgba(59,130,246,0.06)' },
  green:  { bg: 'rgba(34,197,94,0.12)',   text: '#4ade80', glow: 'rgba(34,197,94,0.06)' },
  purple: { bg: 'rgba(139,92,246,0.12)',   text: '#a78bfa', glow: 'rgba(139,92,246,0.06)' },
  amber:  { bg: 'rgba(245,158,11,0.12)',   text: '#fbbf24', glow: 'rgba(245,158,11,0.06)' },
};

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: number; color: string }) {
  const c = colorMap[color] || colorMap.blue;
  return (
    <div className="admin-stat-card">
      <div
        className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-40"
        style={{ background: `radial-gradient(circle, ${c.glow}, transparent 70%)` }}
      />
      <div className="admin-stat-icon" style={{ background: c.bg }}>
        <Icon className="h-5 w-5" style={{ color: c.text }} />
      </div>
      <div className="admin-stat-value">{value}</div>
      <div className="admin-stat-label">{label}</div>
    </div>
  );
}
