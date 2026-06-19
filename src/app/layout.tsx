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
import ReactQueryProvider from '@/components/ReactQueryProvider';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://shreeshyammobiles.com'),
  title: {
    default: 'Shyam Mobiles | Professional E-commerce',
    template: '%s | Shyam Mobiles'
  },
  description: 'A modern and professional e-commerce website for selling mobile phones.',
  keywords: ['mobile phones', 'smartphones', 'buy phones online', 'apple', 'samsung', 'shyam mobiles'],
  authors: [{ name: 'Shyam Mobiles' }],
  manifest: '/manifest.json',
  alternates: {
    canonical: '/',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Shyam Mobiles',
  },
  icons: {
    icon: [
      { url: '/pwa-icon.jpeg', sizes: '1024x1024', type: 'image/jpeg' },
    ],
    apple: [
      { url: '/pwa-icon.jpeg', sizes: '1024x1024', type: 'image/jpeg' },
    ],
  },
  openGraph: {
    title: 'Shyam Mobiles | Professional E-commerce',
    description: 'A modern and professional e-commerce website for selling mobile phones.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://shreeshyammobiles.com',
    siteName: 'Shyam Mobiles',
    images: [
      {
        url: '/store_icon.png',
        width: 800,
        height: 600,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shyam Mobiles | Professional E-commerce',
    description: 'A modern and professional e-commerce website for selling mobile phones.',
    images: ['/store_icon.png'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true, // WCAG 2.1 AA requires user zoom capability
  themeColor: '#000000',
};

// Organization + WebSite JSON-LD for rich search results
function OrganizationJsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://shreeshyammobiles.com';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${baseUrl}/#organization`,
        name: 'Shyam Mobiles',
        url: baseUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/store_icon.png`,
        },
        sameAs: ['https://wa.me/917756935635'],
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+91-7756935635',
          contactType: 'sales',
          areaServed: 'IN',
          availableLanguage: ['English', 'Hindi'],
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        url: baseUrl,
        name: 'Shyam Mobiles',
        publisher: { '@id': `${baseUrl}/#organization` },
        potentialAction: {
          '@type': 'SearchAction',
          target: `${baseUrl}/products?search={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <OrganizationJsonLd />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://cdn.simpleicons.org" />
        <link rel="dns-prefetch" href="https://cdn.simpleicons.org" />
        <script type="text/javascript" dangerouslySetInnerHTML={{ __html: `
          function googleTranslateElementInit() {
            new google.translate.TranslateElement({
              pageLanguage: 'en',
              layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: true
            }, 'google_translate_element');
          }
          
          // Force translation check on route changes or load
          (function() {
            var gtInterval = setInterval(function() {
              if (window.google && window.google.translate && window.google.translate.TranslateElement) {
                clearInterval(gtInterval);
                // The script will automatically pick up the googtrans cookie
              }
            }, 500);
            setTimeout(function() { clearInterval(gtInterval); }, 10000);
          })();
        `}} />
        <script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" async defer></script>
      </head>
      <body
        suppressHydrationWarning
        className={`${poppins.variable} min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-text)]`}
      >
        <div id="google_translate_element" style={{ position: 'fixed', bottom: '0', right: '0', zIndex: -1, opacity: 0, pointerEvents: 'none' }}></div>
        <ErrorBoundary>
          <AuthProvider>
            <CartProvider>
              <ReactQueryProvider>
                <FirebaseInitializer />
                <ConditionalLayout>
                  {children}
                </ConditionalLayout>
                <ModalManager />
                <PWAInstallPrompt />
              </ReactQueryProvider>
            </CartProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
