import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Mobiles — Browse Smartphones',
  description:
    'Browse our complete collection of smartphones from Apple, Samsung, OnePlus, Xiaomi, Vivo, and more. Compare prices, specs, and find the best deals at Shyam Mobiles.',
  alternates: {
    canonical: '/products',
  },
  openGraph: {
    title: 'All Mobiles — Browse Smartphones | Shyam Mobiles',
    description:
      'Browse our complete collection of smartphones. Compare prices, specs, and find the best deals.',
    type: 'website',
  },
};

// BreadcrumbList JSON-LD for products listing
function ProductsListJsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://shreeshyammobiles.com';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: 'Mobiles', item: `${baseUrl}/products` },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ProductsListJsonLd />
      {children}
    </>
  );
}
