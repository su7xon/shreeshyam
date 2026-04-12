'use client';

import Link from 'next/link';
import useAdminStore from '@/lib/admin-store';
import { Smartphone, Image, Tag, TrendingUp, Plus, Eye } from 'lucide-react';

export default function AdminDashboardPage() {
  const admin = useAdminStore();
  const products = admin.products;
  const banners = admin.banners;
  const offers = admin.offers;

  const totalProducts = products.length;
  const featuredProducts = products.filter((p) => p.featured).length;
  const activeBanners = banners.filter((b) => b.active).length;
  const activeOffers = offers.filter((o) => o.active).length;

  const brands = [...new Set(products.map((p) => p.brand))];

  return (
    <div className="space-y-4 sm:space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <StatCard
          icon={Smartphone}
          label="Total Products"
          value={totalProducts}
          color="from-blue-500 to-blue-600"
        />
        <StatCard
          icon={TrendingUp}
          label="Featured Products"
          value={featuredProducts}
          color="from-emerald-500 to-emerald-600"
        />
        <StatCard
          icon={Image}
          label="Active Banners"
          value={activeBanners}
          color="from-purple-500 to-purple-600"
        />
        <StatCard
          icon={Tag}
          label="Active Offers"
          value={activeOffers}
          color="from-amber-500 to-amber-600"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
        <h2 className="text-xl font-bold text-[#201b16] mb-6 tracking-tight">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Link
            href="/admin/products/new"
            className="flex items-center gap-5 p-5 rounded-2xl border-2 border-dashed border-gray-200 hover:border-[#1f3a4f] hover:bg-[#1f3a4f]/5 transition-all group"
          >
            <div className="h-14 w-14 rounded-2xl bg-[#1f3a4f]/10 flex items-center justify-center group-hover:bg-[#1f3a4f]/20 transition-colors">
              <Plus className="h-7 w-7 text-[#1f3a4f]" />
            </div>
            <div>
              <p className="font-bold text-base text-[#201b16] tracking-tight">Add New Phone</p>
              <p className="text-xs text-gray-500 font-medium mt-1">Create product listing</p>
            </div>
          </Link>
          <Link
            href="/admin/banners"
            className="flex items-center gap-5 p-5 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-purple-50 hover:border-purple-200 transition-all group"
          >
            <div className="h-14 w-14 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:bg-purple-100 transition-colors">
              <Image className="h-7 w-7 text-purple-600" />
            </div>
            <div>
              <p className="font-bold text-base text-[#201b16] tracking-tight">Manage Banners</p>
              <p className="text-xs text-gray-500 font-medium mt-1">Update hero sliders</p>
            </div>
          </Link>
          <Link
            href="/admin/offers"
            className="flex items-center gap-5 p-5 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-amber-50 hover:border-amber-200 transition-all group"
          >
            <div className="h-14 w-14 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:bg-amber-100 transition-colors">
              <Tag className="h-7 w-7 text-amber-600" />
            </div>
            <div>
              <p className="font-bold text-base text-[#201b16] tracking-tight">Manage Offers</p>
              <p className="text-xs text-gray-500 font-medium mt-1">Edit deals & banners</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Brand Overview */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-[#1a1a2e] mb-4">Products by Brand</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {brands.map((brand) => {
            const count = products.filter((p) => p.brand === brand).length;
            return (
              <Link
                key={brand}
                href={`/admin/products?brand=${brand}`}
                className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-center"
              >
                <p className="font-semibold text-[#1a1a2e] text-sm">{brand}</p>
                <p className="text-2xl font-bold text-[#b78b57] mt-1">{count}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Products */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[#1a1a2e]">Recent Products</h2>
          <Link href="/admin/products" className="text-sm text-[#b78b57] hover:underline font-medium flex items-center gap-1">
            View All <Eye className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.slice(-6).reverse().map((product) => (
            <Link
              key={product.id}
              href={`/admin/products/${product.id}`}
              className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-[#b78b57]/50 hover:shadow-sm transition-all"
            >
              <div className="h-16 w-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                {/* @ts-ignore */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-contain p-1"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-[#1a1a2e] text-sm truncate">{product.name}</p>
                <p className="text-xs text-gray-500">{product.brand} • {product.ram}/{product.storage}</p>
                <p className="text-sm font-bold text-[#b78b57] mt-1">₹{product.price.toLocaleString('en-IN')}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: any;
  label: string;
  value: number;
  color: string;
}) {
  const shadowColor = color.match(/from-([a-z]+)-/)?.[1] || 'gray';

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm p-3 sm:p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
      <div className={`absolute -right-4 -top-4 sm:-right-6 sm:-top-6 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br ${color} opacity-[0.08] rounded-full group-hover:scale-150 transition-transform duration-500`} />

      <div className="flex items-center justify-between mb-2 sm:mb-4 relative z-10">
        <div className={`h-9 w-9 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${color} shadow-md shadow-${shadowColor}-500/20 flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
          <Icon className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
        </div>
      </div>
      <div className="relative z-10">
        <p className="text-2xl sm:text-3xl font-bold text-[#201b16] tracking-tight">{value}</p>
        <p className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold text-gray-500 mt-0.5 sm:mt-1 leading-tight">{label}</p>
      </div>
    </div>
  );
}
