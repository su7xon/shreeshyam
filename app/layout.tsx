import type {Metadata, Viewport} from 'next';
import './globals.css'; // Global styles
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';
import ModalManager from '@/components/ModalManager';
import { CartProvider } from '@/lib/store';
import { AuthProvider } from '@/lib/auth-context';
import FirebaseInitializer from '@/components/FirebaseInitializer';
import ConditionalLayout from '@/components/ConditionalLayout';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'श्री श्याम Mobiles | Professional E-commerce',
  description: 'A modern and professional e-commerce website for selling mobile phones.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Shyam Mobiles',
  },
  appleTouchIcon: [
    {
      url: '/icon-192.png',
      sizes: '192x192',
      type: 'image/png',
    },
    {
      url: '/icon-512.png',
      sizes: '512x512',
      type: 'image/png',
    },
  ],
  themeColor: '#000000',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#000000',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${poppins.variable} min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-text)]`}
      >
        <AuthProvider>
          <CartProvider>
            <FirebaseInitializer />
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
            <ModalManager />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
