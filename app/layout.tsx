import type {Metadata} from 'next';
import './globals.css'; // Global styles
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';
import ModalManager from '@/components/ModalManager';
import { CartProvider } from '@/lib/store';
import FirebaseInitializer from '@/components/FirebaseInitializer';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'श्री श्याम Mobiles | Professional E-commerce',
  description: 'A modern and professional e-commerce website for selling mobile phones.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${poppins.variable} min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-text)]`}
      >
        <CartProvider>
          <FirebaseInitializer />
          <Navbar />
          <main className="flex-grow pb-[68px] md:pb-0">
            {children}
          </main>
          <Footer />
          <MobileBottomNav />
          <ModalManager />
        </CartProvider>
      </body>
    </html>
  );
}
