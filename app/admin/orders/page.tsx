'use client';

import useAdminStore, { Order, OrderStatus, ORDER_STATUSES } from '@/lib/admin-store';
import { useState } from 'react';
import {
  Package,
  Search,
  Eye,
  Trash2,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  MapPin,
  CreditCard,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const statusColors: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  shipped: 'bg-purple-100 text-purple-800 border-purple-200',
  delivered: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
};

const statusIcons: Record<OrderStatus, React.ReactNode> = {
  pending: <Clock className="h-3.5 w-3.5" />,
  confirmed: <CheckCircle className="h-3.5 w-3.5" />,
  shipped: <Truck className="h-3.5 w-3.5" />,
  delivered: <CheckCircle className="h-3.5 w-3.5" />,
  cancelled: <XCircle className="h-3.5 w-3.5" />,
};

const paymentLabels: Record<string, string> = {
  card: 'Credit/Debit Card',
  upi: 'UPI',
  cod: 'Cash on Delivery',
};

function OrderStatusBadge({ status, onChange }: { status: OrderStatus; onChange?: (status: OrderStatus) => void }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => onChange && setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${statusColors[status]} ${onChange ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}`}
      >
        {statusIcons[status]}
        <span className="capitalize">{status}</span>
        {onChange && (isOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
      </button>
      {isOpen && onChange && (
        <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
          {ORDER_STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => {
                onChange(s);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium hover:bg-gray-50 ${
                s === status ? 'bg-gray-100' : ''
              }`}
            >
              {statusIcons[s]}
              <span className="capitalize">{s}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function OrderDetailModal({ order, onClose, onUpdateStatus, onDelete }: {
  order: Order;
  onClose: () => void;
  onUpdateStatus: (id: string, status: OrderStatus) => void;
  onDelete: (id: string) => void;
}) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Order Details</h2>
            <p className="text-sm text-gray-500 font-mono">{order.orderNumber}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (confirm('Are you sure you want to delete this order?')) {
                  onDelete(order.id);
                  onClose();
                }
              }}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="h-5 w-5" />
            </button>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <XCircle className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Status</span>
            <OrderStatusBadge status={order.status} onChange={(s) => onUpdateStatus(order.id, s)} />
          </div>

          {/* Order Items */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Items ({order.items.length})</h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                  <div className="relative h-14 w-14 bg-white rounded-lg border border-gray-200 flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-contain p-1" unoptimized />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                Customer
              </h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-900 font-medium">{order.customer.name}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" />
                  {order.customer.email}
                </p>
                <p className="text-xs text-gray-500 flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" />
                  {order.customer.phone}
                </p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                Shipping Address
              </h3>
              <div className="space-y-1">
                <p className="text-sm text-gray-900">
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                </p>
                <p className="text-xs text-gray-500">{order.shippingAddress.address}</p>
                <p className="text-xs text-gray-500">
                  {order.shippingAddress.city} - {order.shippingAddress.postalCode}
                </p>
              </div>
            </div>
          </div>

          {/* Payment & Totals */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-gray-400" />
              Payment & Summary
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Payment Method</span>
                <span className="font-medium text-gray-900">{paymentLabels[order.paymentMethod]}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium text-gray-900">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span className="font-medium text-green-600">{order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">Total</span>
                <span className="text-lg font-bold text-gray-900">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="text-xs text-gray-400 space-y-1">
            <p>Created: {formatDate(order.createdAt)}</p>
            <p>Updated: {formatDate(order.updatedAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminOrdersPage() {
  const admin = useAdminStore();
  const orders = admin.orders;
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingCount = orders.filter((o) => o.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="premium-surface rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-[var(--color-primary)]/10 p-2 rounded-lg">
              <Package className="h-5 w-5 text-[var(--color-primary)]" />
            </div>
            <p className="text-sm text-[var(--color-text-muted)]">Total Orders</p>
          </div>
          <p className="text-2xl font-bold text-[var(--color-text)]">{orders.length}</p>
        </div>
        <div className="premium-surface rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-yellow-500/10 p-2 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-500" />
            </div>
            <p className="text-sm text-[var(--color-text-muted)]">Pending</p>
          </div>
          <p className="text-2xl font-bold text-[var(--color-text)]">{pendingCount}</p>
        </div>
        <div className="premium-surface rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-green-500/10 p-2 rounded-lg">
              <Package className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-sm text-[var(--color-text-muted)]">Total Revenue</p>
          </div>
          <p className="text-2xl font-bold text-[var(--color-text)]">{formatPrice(totalRevenue)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="premium-surface rounded-xl p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order number, name, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] text-sm"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
            className="px-4 py-2.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] text-sm font-medium text-[var(--color-text)]"
          >
            <option value="all">All Status</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s} className="capitalize">
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="premium-surface rounded-xl overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="py-16 text-center">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-1">No orders found</h3>
            <p className="text-sm text-gray-500">
              {orders.length === 0
                ? 'Orders will appear here once customers start purchasing.'
                : 'Try adjusting your search or filter.'}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[var(--color-surface-soft)] border-b border-[var(--color-border)]">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Order</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Customer</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Items</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Total</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Date</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-[var(--color-surface-soft)] transition-colors">
                      <td className="px-4 py-4">
                        <p className="text-sm font-semibold text-[var(--color-text)] font-mono">{order.orderNumber}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm font-medium text-[var(--color-text)]">{order.customer.name}</p>
                        <p className="text-xs text-[var(--color-text-muted)]">{order.customer.email}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-[var(--color-text-muted)]">{order.items.length} item(s)</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm font-semibold text-[var(--color-text)]">{formatPrice(order.total)}</p>
                      </td>
                      <td className="px-4 py-4">
                        <OrderStatusBadge status={order.status} onChange={(s) => admin.updateOrderStatus(order.id, s)} />
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-[var(--color-text-muted)]">{formatDate(order.createdAt)}</p>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded-lg transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden divide-y divide-[var(--color-border)]">
              {filteredOrders.map((order) => (
                <div key={order.id} className="p-4 hover:bg-[var(--color-surface-soft)] transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm font-semibold text-[var(--color-text)] font-mono">{order.orderNumber}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{formatDate(order.createdAt)}</p>
                    </div>
                    <OrderStatusBadge status={order.status} onChange={(s) => admin.updateOrderStatus(order.id, s)} />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium text-[var(--color-text)]">{order.customer.name}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{order.items.length} item(s)</p>
                    </div>
                    <p className="text-base font-bold text-[var(--color-text)]">{formatPrice(order.total)}</p>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="w-full mt-2 px-4 py-2 text-sm font-medium text-[var(--color-primary)] bg-[var(--color-primary)]/10 hover:bg-[var(--color-primary)]/20 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={admin.updateOrderStatus}
          onDelete={admin.deleteOrder}
        />
      )}
    </div>
  );
}
