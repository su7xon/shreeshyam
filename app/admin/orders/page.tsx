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
  Download,
  FileText,
  TrendingUp,
  DollarSign,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Breadcrumb } from '@/components/admin';
import DataTable, { Column } from '@/components/admin/DataTable';
import { downloadCSV } from '@/lib/export-utils';

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
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

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

  // Export functionality
  const handleExportCSV = () => {
    const exportData = filteredOrders.map((order) => ({
      orderNumber: order.orderNumber,
      customer: order.customer.name,
      email: order.customer.email,
      items: order.items.length,
      total: order.total,
      status: order.status,
      date: order.createdAt,
    }));

    const columns = [
      { key: 'orderNumber', header: 'Order Number' },
      { key: 'customer', header: 'Customer' },
      { key: 'email', header: 'Email' },
      { key: 'items', header: 'Items' },
      { key: 'total', header: 'Total' },
      { key: 'status', header: 'Status' },
      { key: 'date', header: 'Date' },
    ];

    downloadCSV(exportData, `orders-${new Date().toISOString().split('T')[0]}`, columns);
  };

  // Bulk delete functionality
  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedIds.length} order(s)?`)) {
      selectedIds.forEach((id) => admin.deleteOrder(id));
      setSelectedIds([]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Dashboard', href: '/admin/dashboard' }, { label: 'Orders' }]} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text)] tracking-tight">Orders</h1>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-accent)] text-white rounded-lg hover:bg-[var(--color-accent)]/90 transition-colors font-medium text-sm shadow-sm"
        >
          <Download className="h-4 w-4" />
          Download CSV
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-[var(--color-accent)]/10 p-2.5 rounded-lg">
              <Package className="h-5 w-5 text-[var(--color-accent)]" />
            </div>
            <p className="text-sm text-[var(--color-text-muted)]">Total Orders</p>
          </div>
          <p className="text-2xl font-bold text-[var(--color-text)]">{orders.length}</p>
        </div>
        <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-yellow-500/10 p-2.5 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-500" />
            </div>
            <p className="text-sm text-[var(--color-text-muted)]">Pending</p>
          </div>
          <p className="text-2xl font-bold text-[var(--color-text)]">{pendingCount}</p>
        </div>
        <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-green-500/10 p-2.5 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-sm text-[var(--color-text-muted)]">Total Revenue</p>
          </div>
          <p className="text-2xl font-bold text-[var(--color-text)]">{formatPrice(totalRevenue)}</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-text-muted)]" />
            <input
              type="text"
              placeholder="Search for order..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)] text-sm"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
            className="px-4 py-2.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)] text-sm font-medium text-[var(--color-text)]"
          >
            <option value="all">Filter by status</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s} className="capitalize">
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 rounded-xl p-3 flex items-center justify-between">
          <span className="text-sm font-medium text-[var(--color-text)]">
            {selectedIds.length} order(s) selected
          </span>
          <button
            onClick={handleBulkDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
          >
            <Trash2 className="h-4 w-4" />
            Delete Selected
          </button>
        </div>
      )}

      {/* Orders Table */}
      <DataTable
        columns={[
          {
            key: 'orderNumber',
            header: 'Invoice',
            sortable: true,
            render: (order: Order) => (
              <span className="text-sm font-semibold text-[var(--color-text)] font-mono">
                {order.orderNumber}
              </span>
            ),
          },
          {
            key: 'createdAt',
            header: 'Date',
            sortable: true,
            render: (order: Order) => (
              <span className="text-sm text-[var(--color-text-muted)]">
                {formatDate(order.createdAt)}
              </span>
            ),
          },
          {
            key: 'status',
            header: 'Status',
            sortable: true,
            render: (order: Order) => (
              <OrderStatusBadge
                status={order.status}
                onChange={(s) => admin.updateOrderStatus(order.id, s)}
              />
            ),
          },
          {
            key: 'customer',
            header: 'Customer',
            sortable: true,
            render: (order: Order) => (
              <div>
                <p className="text-sm font-medium text-[var(--color-text)]">{order.customer.name}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{order.customer.email}</p>
              </div>
            ),
          },
          {
            key: 'total',
            header: 'Total',
            sortable: true,
            render: (order: Order) => (
              <span className="text-sm font-semibold text-[var(--color-text)]">
                {formatPrice(order.total)}
              </span>
            ),
          },
          {
            key: 'actions',
            header: '',
            render: (order: Order) => (
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="p-2 text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 rounded-lg transition-colors"
                  title="View Details"
                >
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            ),
          },
        ]}
        data={filteredOrders}
        onSelectionChange={setSelectedIds}
        getId={(order) => order.id}
        emptyMessage={
          orders.length === 0
            ? 'Orders will appear here once customers start purchasing.'
            : 'Try adjusting your search or filter.'
        }
      />

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
