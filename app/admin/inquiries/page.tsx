'use client';

import { useState, useEffect } from 'react';
import { Breadcrumb, PageHeader } from '@/components/admin';
import { Mail, Phone, Search, Filter, Eye, Trash2, CheckCircle, Clock, XCircle } from 'lucide-react';

interface Inquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  inquiryType: string;
  productName: string;
  message: string;
  status: 'pending' | 'contacted' | 'converted' | 'rejected';
  createdAt: string;
}

const statusColors: Record<Inquiry['status'], string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  contacted: 'bg-blue-100 text-blue-800 border-blue-200',
  converted: 'bg-green-100 text-green-800 border-green-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
};

const typeLabels: Record<string, string> = {
  emi: 'EMI Options',
  exchange: 'Exchange Offer',
  bulk: 'Bulk Purchase',
  corporate: 'Corporate Deal',
  other: 'Other',
};

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  useEffect(() => {
    // Load inquiries from localStorage
    const saved = localStorage.getItem('payment_inquiries');
    if (saved) {
      setInquiries(JSON.parse(saved));
    }
  }, []);

  const updateStatus = (id: string, newStatus: Inquiry['status']) => {
    const updated = inquiries.map(inquiry => 
      inquiry.id === id ? { ...inquiry, status: newStatus } : inquiry
    );
    setInquiries(updated);
    localStorage.setItem('payment_inquiries', JSON.stringify(updated));
  };

  const deleteInquiry = (id: string) => {
    if (confirm('Are you sure you want to delete this inquiry?')) {
      const filtered = inquiries.filter(i => i.id !== id);
      setInquiries(filtered);
      localStorage.setItem('payment_inquiries', JSON.stringify(filtered));
      setSelectedInquiry(null);
    }
  };

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = 
      inquiry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.phone.includes(searchQuery) ||
      inquiry.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.productName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || inquiry.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: inquiries.length,
    pending: inquiries.filter(i => i.status === 'pending').length,
    contacted: inquiries.filter(i => i.status === 'contacted').length,
    converted: inquiries.filter(i => i.status === 'converted').length,
  };

  return (
    <div className="admin-shell">
      <div className="admin-layout">
        <main className="admin-main">
          <Breadcrumb items={[{ label: 'Dashboard', href: '/admin/dashboard' }, { label: 'Inquiries' }]} />
          
          <PageHeader
            title="Payment Inquiries"
          />

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="admin-card p-4">
              <p className="text-sm text-gray-500 mb-1">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="admin-card p-4">
              <p className="text-sm text-yellow-600 mb-1">Pending</p>
              <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
            </div>
            <div className="admin-card p-4">
              <p className="text-sm text-blue-600 mb-1">Contacted</p>
              <p className="text-2xl font-bold text-blue-700">{stats.contacted}</p>
            </div>
            <div className="admin-card p-4">
              <p className="text-sm text-green-600 mb-1">Converted</p>
              <p className="text-2xl font-bold text-green-700">{stats.converted}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="admin-card p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, phone, email, or product..."
                  className="admin-input pl-10 w-full"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="admin-select min-w-[180px]"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="contacted">Contacted</option>
                <option value="converted">Converted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Inquiries List */}
          <div className="space-y-3">
            {filteredInquiries.length === 0 ? (
              <div className="admin-card p-12 text-center">
                <Mail className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No inquiries found</p>
              </div>
            ) : (
              filteredInquiries.map((inquiry) => (
                <div key={inquiry.id} className="admin-card p-5 hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{inquiry.name}</h3>
                          <p className="text-sm text-gray-500">
                            {new Date(inquiry.createdAt).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[inquiry.status]}`}>
                          {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <a href={`tel:${inquiry.phone}`} className="text-gray-700 hover:text-blue-600">
                            {inquiry.phone}
                          </a>
                        </div>
                        {inquiry.email && (
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <a href={`mailto:${inquiry.email}`} className="text-gray-700 hover:text-blue-600">
                              {inquiry.email}
                            </a>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded">
                          {typeLabels[inquiry.inquiryType] || inquiry.inquiryType}
                        </span>
                        {inquiry.productName && (
                          <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded">
                            {inquiry.productName}
                          </span>
                        )}
                      </div>

                      {inquiry.message && (
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                          {inquiry.message}
                        </p>
                      )}
                    </div>

                    <div className="flex md:flex-col gap-2">
                      <button
                        onClick={() => setSelectedInquiry(inquiry)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => updateStatus(inquiry.id, 'contacted')}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Mark as Contacted"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteInquiry(inquiry.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      {/* Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Inquiry Details</h2>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <XCircle className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Name</p>
                  <p className="font-semibold text-gray-900">{selectedInquiry.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Phone</p>
                  <a href={`tel:${selectedInquiry.phone}`} className="font-semibold text-blue-600 hover:underline">
                    {selectedInquiry.phone}
                  </a>
                </div>
              </div>

              {selectedInquiry.email && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <a href={`mailto:${selectedInquiry.email}`} className="font-semibold text-blue-600 hover:underline">
                    {selectedInquiry.email}
                  </a>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Type</p>
                  <p className="font-semibold text-gray-900">{typeLabels[selectedInquiry.inquiryType]}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${statusColors[selectedInquiry.status]}`}>
                    {selectedInquiry.status}
                  </span>
                </div>
              </div>

              {selectedInquiry.productName && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Product</p>
                  <p className="font-semibold text-gray-900">{selectedInquiry.productName}</p>
                </div>
              )}

              {selectedInquiry.message && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Message</p>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedInquiry.message}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-500 mb-1">Submitted</p>
                <p className="text-gray-900">
                  {new Date(selectedInquiry.createdAt).toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => updateStatus(selectedInquiry.id, 'contacted')}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium"
              >
                Mark Contacted
              </button>
              <button
                onClick={() => updateStatus(selectedInquiry.id, 'converted')}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-medium"
              >
                Mark Converted
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
