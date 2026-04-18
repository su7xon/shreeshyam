'use client';

import useAdminStore, { Order, OrderStatus, ORDER_STATUSES } from '@/lib/admin-store';
import { useState } from 'react';
import {
  Package, Search, Eye, Trash2, Clock, CheckCircle, Truck, XCircle,
  ChevronDown, ChevronUp, Mail, Phone, MapPin, CreditCard, Download,
  DollarSign,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Breadcrumb } from '@/components/admin';
import DataTable, { Column } from '@/components/admin/DataTable';
import { downloadCSV } from '@/lib/export-utils';

const statusColors: Record<OrderStatus, string> = {
  pending: 'admin-badge-amber',
  confirmed: 'admin-badge-blue',
  shipped: 'admin-badge-purple',
  delivered: 'admin-badge-green',
  cancelled: 'admin-badge-red',
};

const statusIcons: Record<OrderStatus, React.ReactNode> = {
  pending: <Clock className="h-3 w-3" />,
  confirmed: <CheckCircle className="h-3 w-3" />,
  shipped: <Truck className="h-3 w-3" />,
  delivered: <CheckCircle className="h-3 w-3" />,
  cancelled: <XCircle className="h-3 w-3" />,
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
        className={`admin-badge ${statusColors[status]} ${onChange ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}`}
      >
        {statusIcons[status]}
        <span className="capitalize">{status}</span>
        {onChange && (isOpen ? <ChevronUp className="h-2.5 w-2.5" /> : <ChevronDown className="h-2.5 w-2.5" />)}
      </button>
      {isOpen && onChange && (
        <div className="absolute right-0 mt-1 w-36 bg-[#1e2028] rounded-lg shadow-xl border border-white/[0.08] z-50 overflow-hidden">
          {ORDER_STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => { onChange(s); setIsOpen(false); }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium hover:bg-white/[0.04] text-[#d1d5db] ${s === status ? 'bg-white/[0.04]' : ''}`}
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
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const formatPrice = (price: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#181a22] border border-white/[0.08] rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto admin-scrollbar" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-[#181a22] border-b border-white/[0.06] px-5 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div>
            <h2 className="text-sm font-semibold text-white">Order Details</h2>
            <p className="text-xs text-[#6b7280] font-mono mt-0.5">{order.orderNumber}</p>
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={() => { if (confirm('Delete this order?')) { onDelete(order.id); onClose(); } }} className="admin-icon-btn p-2 hover:!text-[#ef4444]">
              <Trash2 className="h-4 w-4" />
            </button>
            <button onClick={onClose} className="admin-icon-btn p-2">
              <XCircle className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#6b7280]">Status</span>
            <OrderStatusBadge status={order.status} onChange={(s) => onUpdateStatus(order.id, s)} />
          </div>

          {/* Items */}
          <div>
            <h3 className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mb-2.5">Items ({order.items.length})</h3>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-white/[0.02] rounded-xl border border-white/[0.04]">
                  <div className="relative h-12 w-12 bg-white/[0.04] rounded-lg flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-contain p-1" unoptimized />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#e5e7eb] truncate">{item.name}</p>
                    <p className="text-[11px] text-[#6b7280]">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-[#e5e7eb]">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Customer & Shipping */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 bg-white/[0.02] rounded-xl border border-white/[0.04]">
              <h3 className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Mail className="h-3 w-3" /> Customer
              </h3>
              <div className="space-y-1.5">
                <p className="text-sm text-[#e5e7eb] font-medium">{order.customer.name}</p>
                <p className="text-xs text-[#6b7280] flex items-center gap-1.5"><Mail className="h-3 w-3" /> {order.customer.email}</p>
                <p className="text-xs text-[#6b7280] flex items-center gap-1.5"><Phone className="h-3 w-3" /> {order.customer.phone}</p>
              </div>
            </div>
            <div className="p-3.5 bg-white/[0.02] rounded-xl border border-white/[0.04]">
              <h3 className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <MapPin className="h-3 w-3" /> Shipping
              </h3>
              <div className="space-y-1">
                <p className="text-sm text-[#e5e7eb]">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                <p className="text-xs text-[#6b7280]">{order.shippingAddress.address}</p>
                <p className="text-xs text-[#6b7280]">{order.shippingAddress.city} - {order.shippingAddress.postalCode}</p>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="p-3.5 bg-white/[0.02] rounded-xl border border-white/[0.04]">
            <h3 className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <CreditCard className="h-3 w-3" /> Payment & Summary
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm"><span className="text-[#6b7280]">Method</span><span className="text-[#e5e7eb] font-medium">{paymentLabels[order.paymentMethod]}</span></div>
              <div className="flex justify-between text-sm"><span className="text-[#6b7280]">Subtotal</span><span className="text-[#e5e7eb]">{formatPrice(order.subtotal)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-[#6b7280]">Shipping</span><span className="text-[#4ade80]">{order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}</span></div>
              <div className="border-t border-white/[0.06] pt-2 flex justify-between">
                <span className="text-sm font-semibold text-[#9ca3af]">Total</span>
                <span className="text-lg font-bold text-white">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-[#4b5563] space-y-0.5">
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
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) || order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) || order.customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatPrice = (price: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  const totalRevenue = orders.filter((o) => o.status !== 'cancelled').reduce((sum, o) => sum + o.total, 0);
  const pendingCount = orders.filter((o) => o.status === 'pending').length;

  const handleExportCSV = () => {
    const exportData = filteredOrders.map((order) => ({ orderNumber: order.orderNumber, customer: order.customer.name, email: order.customer.email, items: order.items.length, total: order.total, status: order.status, date: order.createdAt }));
    const columns = [{ key: 'orderNumber', header: 'Order Number' }, { key: 'customer', header: 'Customer' }, { key: 'email', header: 'Email' }, { key: 'items', header: 'Items' }, { key: 'total', header: 'Total' }, { key: 'status', header: 'Status' }, { key: 'date', header: 'Date' }];
    downloadCSV(exportData, `orders-${new Date().toISOString().split('T')[0]}`, columns);
  };

  const handleBulkDelete = () => {
    if (confirm(`Delete ${selectedIds.length} order(s)?`)) {
      selectedIds.forEach((id) => admin.deleteOrder(id));
      setSelectedIds([]);
    }
  };

  return (
    <div className="space-y-5 pb-8">
      <Breadcrumb items={[{ label: 'Dashboard', href: '/admin/dashboard' }, { label: 'Orders' }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-lg sm:text-xl font-semibold text-white">Orders</h1>
        <button onClick={handleExportCSV} className="admin-btn-primary text-xs sm:text-sm">
          <Download className="h-4 w-4" /> Download CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="admin-stat-card">
          <div className="admin-stat-icon bg-[#3b82f6]/10"><Package className="h-5 w-5 text-[#60a5fa]" /></div>
          <div className="admin-stat-value">{orders.length}</div>
          <div className="admin-stat-label">Total Orders</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon bg-[#f59e0b]/10"><Clock className="h-5 w-5 text-[#fbbf24]" /></div>
          <div className="admin-stat-value">{pendingCount}</div>
          <div className="admin-stat-label">Pending</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon bg-[#22c55e]/10"><DollarSign className="h-5 w-5 text-[#4ade80]" /></div>
          <div className="admin-stat-value text-lg sm:text-xl">{formatPrice(totalRevenue)}</div>
          <div className="admin-stat-label">Revenue</div>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-card p-3 sm:p-4">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4b5563]" />
            <input type="text" placeholder="Search orders…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="admin-input pl-9" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')} className="admin-select w-full lg:w-auto min-w-[150px]">
            <option value="all">All Statuses</option>
            {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="admin-alert admin-alert-warn flex items-center justify-between">
          <span className="text-sm font-medium">{selectedIds.length} order(s) selected</span>
          <button onClick={handleBulkDelete} className="admin-btn-danger text-xs">
            <Trash2 className="h-3.5 w-3.5" /> Delete Selected
          </button>
        </div>
      )}

      {/* Table */}
      <DataTable
        columns={[
          {
            key: 'orderNumber', header: 'Invoice', sortable: true,
            render: (order: Order) => <span className="text-sm font-semibold text-[#e5e7eb] font-mono">{order.orderNumber}</span>,
          },
          {
            key: 'createdAt', header: 'Date', sortable: true,
            render: (order: Order) => <span className="text-sm text-[#9ca3af]">{formatDate(order.createdAt)}</span>,
          },
          {
            key: 'status', header: 'Status', sortable: true,
            render: (order: Order) => <OrderStatusBadge status={order.status} onChange={(s) => admin.updateOrderStatus(order.id, s)} />,
          },
          {
            key: 'customer', header: 'Customer', sortable: true,
            render: (order: Order) => (
              <div>
                <p className="text-sm font-medium text-[#e5e7eb]">{order.customer.name}</p>
                <p className="text-[11px] text-[#6b7280]">{order.customer.email}</p>
              </div>
            ),
          },
          {
            key: 'total', header: 'Total', sortable: true,
            render: (order: Order) => <span className="text-sm font-semibold text-[#e5e7eb]">{formatPrice(order.total)}</span>,
          },
          {
            key: 'actions', header: '',
            render: (order: Order) => (
              <div className="flex justify-end">
                <button onClick={() => setSelectedOrder(order)} className="admin-icon-btn p-2" title="View">
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            ),
          },
        ]}
        data={filteredOrders}
        onSelectionChange={setSelectedIds}
        getId={(order) => order.id}
        emptyMessage={orders.length === 0 ? 'Orders will appear here once customers start purchasing.' : 'Try adjusting your search or filter.'}
      />

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
