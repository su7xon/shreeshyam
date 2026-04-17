'use client';

import useAdminStore from '@/lib/admin-store';
import { TrendingUp, DollarSign, Package, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const admin = useAdminStore();
  const orders = admin.orders;
  const products = admin.products;

  // Calculate analytics
  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const totalOrders = orders.length;
  const completedOrders = orders.filter((o) => o.status === 'delivered').length;
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;

  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const completionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Top products by quantity
  const productSales: Record<string, { name: string; quantity: number; revenue: number }> = {};
  orders.forEach((order) => {
    if (order.status !== 'cancelled') {
      order.items.forEach((item) => {
        if (!productSales[item.id]) {
          productSales[item.id] = { name: item.name, quantity: 0, revenue: 0 };
        }
        productSales[item.id].quantity += item.quantity;
        productSales[item.id].revenue += item.price * item.quantity;
      });
    }
  });

  const topProducts = Object.entries(productSales)
    .sort(([, a], [, b]) => b.revenue - a.revenue)
    .slice(0, 5);

  // Recent orders for activity feed
  const recentOrders = [...orders].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text)] tracking-tight">Analytics</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">Overview of your store performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-[var(--color-accent)]/10 p-2.5 rounded-lg">
              <DollarSign className="h-5 w-5 text-[var(--color-accent)]" />
            </div>
            <div className="flex items-center gap-1 text-green-500 text-xs font-medium">
              <ArrowUpRight className="h-3.5 w-3.5" />
              +12.5%
            </div>
          </div>
          <p className="text-2xl font-bold text-[var(--color-text)]">{formatPrice(totalRevenue)}</p>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">Total Revenue</p>
        </div>

        <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-blue-500/10 p-2.5 rounded-lg">
              <Package className="h-5 w-5 text-blue-500" />
            </div>
            <div className="flex items-center gap-1 text-green-500 text-xs font-medium">
              <ArrowUpRight className="h-3.5 w-3.5" />
              +8.2%
            </div>
          </div>
          <p className="text-2xl font-bold text-[var(--color-text)]">{totalOrders}</p>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">Total Orders</p>
        </div>

        <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-purple-500/10 p-2.5 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-500" />
            </div>
            <div className="flex items-center gap-1 text-green-500 text-xs font-medium">
              <ArrowUpRight className="h-3.5 w-3.5" />
              +5.3%
            </div>
          </div>
          <p className="text-2xl font-bold text-[var(--color-text)]">{formatPrice(averageOrderValue)}</p>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">Avg. Order Value</p>
        </div>

        <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-green-500/10 p-2.5 rounded-lg">
              <Users className="h-5 w-5 text-green-500" />
            </div>
            <div className="flex items-center gap-1 text-red-500 text-xs font-medium">
              <ArrowDownRight className="h-3.5 w-3.5" />
              -2.1%
            </div>
          </div>
          <p className="text-2xl font-bold text-[var(--color-text)]">{completionRate.toFixed(1)}%</p>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">Completion Rate</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6">
          <h2 className="text-lg font-bold text-[var(--color-text)] mb-4">Top Products</h2>
          <div className="space-y-4">
            {topProducts.length === 0 ? (
              <p className="text-sm text-[var(--color-text-muted)] py-8 text-center">No sales data yet</p>
            ) : (
              topProducts.map(([id, data], index) => (
                <div key={id} className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-[var(--color-text-muted)] w-6">#{index + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--color-text)] truncate">{data.name}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{data.quantity} sold</p>
                  </div>
                  <p className="text-sm font-semibold text-[var(--color-accent)]">{formatPrice(data.revenue)}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6">
          <h2 className="text-lg font-bold text-[var(--color-text)] mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentOrders.length === 0 ? (
              <p className="text-sm text-[var(--color-text-muted)] py-8 text-center">No orders yet</p>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="flex items-center gap-4">
                  <div className="bg-[var(--color-accent)]/10 p-2 rounded-lg">
                    <Package className="h-4 w-4 text-[var(--color-accent)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--color-text)] truncate">{order.orderNumber}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{order.customer.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[var(--color-text)]">{formatPrice(order.total)}</p>
                    <p className="text-xs text-[var(--color-text-muted)] capitalize">{order.status}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Products Overview */}
      <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6">
        <h2 className="text-lg font-bold text-[var(--color-text)] mb-4">Product Overview</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-[var(--color-surface-soft)] rounded-lg">
            <p className="text-3xl font-bold text-[var(--color-accent)]">{products.length}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Total Products</p>
          </div>
          <div className="text-center p-4 bg-[var(--color-surface-soft)] rounded-lg">
            <p className="text-3xl font-bold text-green-500">{products.filter((p) => p.featured).length}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Featured</p>
          </div>
          <div className="text-center p-4 bg-[var(--color-surface-soft)] rounded-lg">
            <p className="text-3xl font-bold text-blue-500">{[...new Set(products.map((p) => p.brand))].length}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Brands</p>
          </div>
          <div className="text-center p-4 bg-[var(--color-surface-soft)] rounded-lg">
            <p className="text-3xl font-bold text-purple-500">{pendingOrders}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Pending Orders</p>
          </div>
        </div>
      </div>
    </div>
  );
}
