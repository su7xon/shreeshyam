'use client';

import useAdminStore from '@/lib/admin-store';
import { TrendingUp, DollarSign, Package, Users, ArrowUpRight, ArrowDownRight, BarChart3 } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const admin = useAdminStore();
  const orders = admin.orders;
  const products = admin.products;

  const totalRevenue = orders.filter((o) => o.status !== 'cancelled').reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const completedOrders = orders.filter((o) => o.status === 'delivered').length;
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const completionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;

  const formatPrice = (price: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

  const productSales: Record<string, { name: string; quantity: number; revenue: number }> = {};
  orders.forEach((order) => {
    if (order.status !== 'cancelled') {
      order.items.forEach((item) => {
        if (!productSales[item.id]) productSales[item.id] = { name: item.name, quantity: 0, revenue: 0 };
        productSales[item.id].quantity += item.quantity;
        productSales[item.id].revenue += item.price * item.quantity;
      });
    }
  });

  const topProducts = Object.entries(productSales).sort(([, a], [, b]) => b.revenue - a.revenue).slice(0, 5);
  const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-white">Analytics</h2>
        <p className="text-xs text-[#6b7280] mt-0.5">Overview of your store performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="admin-stat-card">
          <div className="flex items-center justify-between">
            <div className="admin-stat-icon bg-[#22c55e]/10"><DollarSign className="h-5 w-5 text-[#4ade80]" /></div>
            <div className="flex items-center gap-0.5 text-[#4ade80] text-[10px] font-semibold">
              <ArrowUpRight className="h-3 w-3" /> +12.5%
            </div>
          </div>
          <div className="admin-stat-value text-lg sm:text-xl">{formatPrice(totalRevenue)}</div>
          <div className="admin-stat-label">Total Revenue</div>
        </div>

        <div className="admin-stat-card">
          <div className="flex items-center justify-between">
            <div className="admin-stat-icon bg-[#3b82f6]/10"><Package className="h-5 w-5 text-[#60a5fa]" /></div>
            <div className="flex items-center gap-0.5 text-[#4ade80] text-[10px] font-semibold">
              <ArrowUpRight className="h-3 w-3" /> +8.2%
            </div>
          </div>
          <div className="admin-stat-value">{totalOrders}</div>
          <div className="admin-stat-label">Total Orders</div>
        </div>

        <div className="admin-stat-card">
          <div className="flex items-center justify-between">
            <div className="admin-stat-icon bg-[#8b5cf6]/10"><TrendingUp className="h-5 w-5 text-[#a78bfa]" /></div>
            <div className="flex items-center gap-0.5 text-[#4ade80] text-[10px] font-semibold">
              <ArrowUpRight className="h-3 w-3" /> +5.3%
            </div>
          </div>
          <div className="admin-stat-value text-lg sm:text-xl">{formatPrice(averageOrderValue)}</div>
          <div className="admin-stat-label">Avg. Order</div>
        </div>

        <div className="admin-stat-card">
          <div className="flex items-center justify-between">
            <div className="admin-stat-icon bg-[#f59e0b]/10"><Users className="h-5 w-5 text-[#fbbf24]" /></div>
            <div className="flex items-center gap-0.5 text-[#f87171] text-[10px] font-semibold">
              <ArrowDownRight className="h-3 w-3" /> -2.1%
            </div>
          </div>
          <div className="admin-stat-value">{completionRate.toFixed(1)}%</div>
          <div className="admin-stat-label">Completion Rate</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Products */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>Top Products</h3>
          </div>
          <div className="admin-card-body">
            <div className="space-y-3">
              {topProducts.length === 0 ? (
                <div className="admin-empty-state py-6">
                  <div className="admin-empty-icon"><BarChart3 className="h-5 w-5" /></div>
                  <p className="admin-empty-title text-xs">No sales data yet</p>
                </div>
              ) : (
                topProducts.map(([id, data], index) => (
                  <div key={id} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-[#4b5563] w-5 text-center">#{index + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#e5e7eb] truncate">{data.name}</p>
                      <p className="text-[11px] text-[#6b7280]">{data.quantity} sold</p>
                    </div>
                    <p className="text-sm font-semibold text-[#60a5fa]">{formatPrice(data.revenue)}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>Recent Activity</h3>
          </div>
          <div className="admin-card-body">
            <div className="space-y-3">
              {recentOrders.length === 0 ? (
                <div className="admin-empty-state py-6">
                  <div className="admin-empty-icon"><Package className="h-5 w-5" /></div>
                  <p className="admin-empty-title text-xs">No orders yet</p>
                </div>
              ) : (
                recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#3b82f6]/10 flex items-center justify-center flex-shrink-0">
                      <Package className="h-4 w-4 text-[#60a5fa]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#e5e7eb] truncate font-mono">{order.orderNumber}</p>
                      <p className="text-[11px] text-[#6b7280]">{order.customer.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-[#e5e7eb]">{formatPrice(order.total)}</p>
                      <p className="text-[10px] text-[#6b7280] capitalize">{order.status}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Products Overview */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3>Product Overview</h3>
        </div>
        <div className="admin-card-body">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="text-center p-4 bg-white/[0.02] rounded-xl border border-white/[0.04]">
              <p className="text-2xl font-bold text-[#60a5fa]">{products.length}</p>
              <p className="text-[11px] text-[#6b7280] mt-1">Total Products</p>
            </div>
            <div className="text-center p-4 bg-white/[0.02] rounded-xl border border-white/[0.04]">
              <p className="text-2xl font-bold text-[#4ade80]">{products.filter((p) => p.featured).length}</p>
              <p className="text-[11px] text-[#6b7280] mt-1">Featured</p>
            </div>
            <div className="text-center p-4 bg-white/[0.02] rounded-xl border border-white/[0.04]">
              <p className="text-2xl font-bold text-[#a78bfa]">{[...new Set(products.map((p) => p.brand))].length}</p>
              <p className="text-[11px] text-[#6b7280] mt-1">Brands</p>
            </div>
            <div className="text-center p-4 bg-white/[0.02] rounded-xl border border-white/[0.04]">
              <p className="text-2xl font-bold text-[#fbbf24]">{pendingOrders}</p>
              <p className="text-[11px] text-[#6b7280] mt-1">Pending Orders</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
