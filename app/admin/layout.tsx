import type { Metadata } from 'next';
import { AdminAuthProvider } from '@/lib/admin-auth';
import AdminDashboardLayout from './AdminLayoutWrapper';

export const metadata: Metadata = {
  title: 'Admin Panel | श्री श्याम Mobiles',
  description: 'Admin dashboard for managing श्री श्याम Mobiles store.',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminDashboardLayout>
        {children}
      </AdminDashboardLayout>
    </AdminAuthProvider>
  );
}
