import { Metadata } from 'next';
import { products as defaultProducts } from '@/lib/data';
import ProductDetailClient from '@/components/ProductDetailClient';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

export const dynamicParams = true;

// ==================== Static Params ====================
export async function generateStaticParams() {
  const params = defaultProducts.map((product) => ({
    id: product.id,
  }));

  if (db) {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      querySnapshot.forEach((docSnap) => {
        if (!params.find(p => p.id === docSnap.id)) {
          params.push({ id: docSnap.id });
        }
      });
    } catch (e) {
      console.warn("Could not fetch products for static generation", e);
    }
  }

  return params;
}

// ==================== Dynamic SEO Metadata ====================
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://shreeshyammobiles.com';

  // Try to find the product from local data first (fast)
  let product = defaultProducts.find(p => p.id === id);

  // If not found locally, try Firestore
  if (!product && db) {
    try {
      const docSnap = await getDoc(doc(db, 'products', id));
      if (docSnap.exists()) {
        product = { id: docSnap.id, ...docSnap.data() } as any;
      }
    } catch (e) {
      // Fallback silently
    }
  }

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.',
    };
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

  const title = `${product.name} — ${formatPrice(product.price)} | Shyam Mobiles`;
  const description = product.description
    ? product.description.slice(0, 160)
    : `Buy ${product.name} by ${product.brand} at ${formatPrice(product.price)}.${product.ram ? ` ${product.ram} RAM,` : ''}${product.storage ? ` ${product.storage} storage.` : ''} Free delivery at Shyam Mobiles.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/products/${id}`,
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/products/${id}`,
      siteName: 'Shyam Mobiles',
      images: product.image
        ? [
            {
              url: product.image,
              width: 800,
              height: 800,
              alt: product.name,
            },
          ]
        : [],
      type: 'website',
      locale: 'en_IN',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: product.image ? [product.image] : [],
    },
  };
}

// ==================== JSON-LD Structured Data ====================
function ProductJsonLd({ product }: { product: any }) {
  if (!product) return null;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://shreeshyammobiles.com';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || `${product.name} by ${product.brand}`,
    image: product.image || '',
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}/products/${product.id}`,
      priceCurrency: 'INR',
      price: product.price,
      availability: product.active !== false
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Shyam Mobiles',
      },
    },
    ...(product.ram && {
      additionalProperty: [
        { '@type': 'PropertyValue', name: 'RAM', value: product.ram },
        { '@type': 'PropertyValue', name: 'Storage', value: product.storage },
      ],
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

function BreadcrumbJsonLd({ product }: { product: any }) {
  if (!product) return null;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://shreeshyammobiles.com';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: 'Products', item: `${baseUrl}/products` },
      { '@type': 'ListItem', position: 3, name: product.brand, item: `${baseUrl}/products?brand=${product.brand}` },
      { '@type': 'ListItem', position: 4, name: product.name },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// ==================== Page Component ====================
export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Server-side product fetch for JSON-LD (structured data needs to be in initial HTML)
  let product = defaultProducts.find(p => p.id === id);

  if (!product && db) {
    try {
      const docSnap = await getDoc(doc(db, 'products', id));
      if (docSnap.exists()) {
        product = { id: docSnap.id, ...docSnap.data() } as any;
      }
    } catch (e) {
      // Fallback — client will handle
    }
  }

  return (
    <>
      {/* Structured data injected server-side for SEO crawlers */}
      <ProductJsonLd product={product} />
      <BreadcrumbJsonLd product={product} />
      <ProductDetailClient id={id} />
    </>
  );
}
