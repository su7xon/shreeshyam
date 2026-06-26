'use client';

import { useEffect } from 'react';
import useAdminStore from '@/lib/admin-store';
import { ShieldCheck, XCircle, CheckCircle, Clock } from 'lucide-react';

export default function AdminReviewsPage() {
  const { reviews, updateReviewStatus, deleteReview } = useAdminStore();

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await updateReviewStatus(id, status);
    } catch (error) {
      console.error(error);
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await deleteReview(id);
      } catch (error) {
        console.error(error);
        alert('Failed to delete review');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
          <p className="text-sm text-gray-700 mt-1">Manage and moderate testimonials.</p>
        </div>
      </div>

      <div className="bg-[#1f2937] border border-[#374151] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-[#111827]/50 text-xs uppercase font-semibold text-gray-700 border-b border-[#374151]">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Review</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#374151]">
              {reviews.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-700 italic">
                    No reviews found.
                  </td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <tr key={review.id} className="hover:bg-[#374151]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#b78b57] flex items-center justify-center text-gray-900 font-bold text-xs">
                          {review.initials}
                        </div>
                        <span className="font-medium text-gray-900">{review.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="max-w-md truncate" title={review.text}>{review.text}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                        review.status === 'approved' 
                          ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800' 
                          : review.status === 'rejected'
                          ? 'bg-red-900/30 text-red-400 border-red-800'
                          : 'bg-yellow-900/30 text-yellow-400 border-yellow-800'
                      }`}>
                        {review.status === 'approved' && <CheckCircle className="w-3 h-3" />}
                        {review.status === 'rejected' && <XCircle className="w-3 h-3" />}
                        {review.status === 'pending' && <Clock className="w-3 h-3" />}
                        {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700 whitespace-nowrap">
                      {review.createdAt ? new Date(review.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {review.status !== 'approved' && (
                          <button
                            onClick={() => handleUpdateStatus(review.id!, 'approved')}
                            className="p-1.5 text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-colors"
                            title="Approve"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {review.status !== 'rejected' && (
                          <button
                            onClick={() => handleUpdateStatus(review.id!, 'rejected')}
                            className="p-1.5 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                            title="Reject"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(review.id!)}
                          className="p-1.5 text-gray-700 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors ml-2"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
