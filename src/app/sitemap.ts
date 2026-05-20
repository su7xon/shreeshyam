import { MetadataRoute } from 'next';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { products as defaultProducts } from '@/lib/data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://shreeshyammobiles.com';

  const sitemapEntries: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  const popularBrands = ['apple', 'samsung', 'oneplus', 'vivo', 'oppo', 'xiaomi'];
  popularBrands.forEach(brand => {
    sitemapEntries.push({
      url: `${baseUrl}/brands/${brand}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  });

  // Fetch dynamic products
  const productIds = new Set(defaultProducts.map(p => p.id));
  
  if (db) {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      querySnapshot.forEach((doc) => {
        productIds.add(doc.id);
      });
    } catch (e) {
      console.warn("Could not fetch products for dynamic sitemap", e);
    }
  }

  Array.from(productIds).forEach(id => {
    sitemapEntries.push({
      url: `${baseUrl}/products/${id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    });
  });

  return sitemapEntries;
}
