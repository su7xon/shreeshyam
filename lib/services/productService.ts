// lib/services/productService.ts
import { db } from '@/lib/firebase';
import { collection, addDoc, setDoc, deleteDoc, doc, getDoc, getDocs, query, where, orderBy, Timestamp, writeBatch, limit, startAfter, QueryDocumentSnapshot } from 'firebase/firestore';
import { AdminProduct } from '@/lib/admin-store';

const PRODUCTS_COLLECTION = 'products';

import { productsData } from '@/products-data';

const overrideProductImage = (product: AdminProduct): AdminProduct => {
  if (!product) return product;
  if (!product.image || product.image.includes('media-amazon.com') || product.image.includes('placeholder') || product.image.includes('placehold.co')) {
    const localMatch = productsData.find(p => p.name.toLowerCase().trim() === (product.name || '').toLowerCase().trim());
    if (localMatch && localMatch.image && !localMatch.image.includes('media-amazon.com')) {
      product.image = localMatch.image;
      if (product.images && product.images.length > 0) {
        product.images[0] = localMatch.image;
      }
    }
  }
  return product;
};


// ==================== Types ====================

export interface ProductFilters {
  brand?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  featured?: boolean;
  searchQuery?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  hasMore: boolean;
  lastVisible: QueryDocumentSnapshot<T> | null;
  totalCount: number;
}

// ==================== Helper Functions ====================

const buildProductQuery = (
  filters: ProductFilters = {},
  lastDoc?: QueryDocumentSnapshot | null,
  pageSize: number = 24
) => {
  const constraints: any[] = [];
  const collectionRef = collection(db, PRODUCTS_COLLECTION);

  // Apply filters
  if (filters.brand) {
    constraints.push(where('brand', '==', filters.brand));
  }
  if (filters.category) {
    constraints.push(where('category', '==', filters.category));
  }
  if (filters.featured !== undefined) {
    constraints.push(where('featured', '==', filters.featured));
  }
  if (filters.inStock !== undefined) {
    constraints.push(where('active', '==', filters.inStock));
  }

  // Create base query with limit
  let q = query(collectionRef, ...constraints, limit(pageSize));

  // Add cursor for pagination
  if (lastDoc) {
    q = query(collectionRef, ...constraints, startAfter(lastDoc), limit(pageSize));
  }

  return q;
};

// ==================== Public API (Storefront) ====================

/**
 * Get paginated products for storefront
 * Optimized for reading only active/public products
 */
export const getPaginatedProducts = async (
  filters: ProductFilters = {},
  lastDoc: QueryDocumentSnapshot | null = null,
  pageSize: number = 24
): Promise<PaginatedResult<AdminProduct>> => {
  if (!db) {
    console.warn('Firestore database is not initialized.');
    return { data: [], hasMore: false, lastVisible: null, totalCount: 0 };
  }

  try {
    const q = buildProductQuery(filters, lastDoc, pageSize);
    const snapshot = await getDocs(q);

    const data = snapshot.docs.map(doc => overrideProductImage({
      id: doc.id,
      ...doc.data()
    } as AdminProduct));

    const lastVisible = (snapshot.docs[snapshot.docs.length - 1] as unknown as QueryDocumentSnapshot<AdminProduct>) || null;
    const hasMore = snapshot.docs.length === pageSize;

    // Get total count (separate query for performance)
    let totalCount = 0;
    try {
      const countQuery = query(collection(db, PRODUCTS_COLLECTION));
      const countSnap = await getDocs(countQuery);
      totalCount = countSnap.size;
    } catch (err) {
      console.warn('Could not fetch total count:', err);
    }

    return { data, hasMore, lastVisible, totalCount };
  } catch (error) {
    console.error('Error fetching paginated products:', error);
    return { data: [], hasMore: false, lastVisible: null, totalCount: 0 };
  }
};

/**
 * Get single product by ID (used for product detail page)
 * Uses getDoc (single document read) - very efficient
 */
export const getProductById = async (id: string): Promise<AdminProduct | null> => {
  if (!db) return null;
  try {
    const productDoc = await getDoc(doc(db, PRODUCTS_COLLECTION, id));
    if (productDoc.exists()) {
      return overrideProductImage({ id: productDoc.id, ...productDoc.data() } as AdminProduct);
    }
    return null;
  } catch (error) {
    console.error('Error getting product:', error);
    return null;
  }
};

/**
 * Get products by IDs (batch get)
 * Used for cart, wishlist, comparison
 */
export const getProductsByIds = async (ids: string[]): Promise<AdminProduct[]> => {
  if (!db || ids.length === 0) return [];

  try {
    const results: AdminProduct[] = [];
    const batchSize = 10; // Firestore limits, process in chunks

    for (let i = 0; i < ids.length; i += batchSize) {
      const batch = ids.slice(i, i + batchSize);
      const promises = batch.map(id => getDoc(doc(db, PRODUCTS_COLLECTION, id)));
      const snapshots = await Promise.all(promises);

      snapshots.forEach((snap, idx) => {
        if (snap.exists()) {
          results.push(overrideProductImage({ id: snap.id, ...snap.data() } as AdminProduct));
        }
      });
    }

    return results;
  } catch (error) {
    console.error('Error fetching products by IDs:', error);
    return [];
  }
};

/**
 * Get featured products with limit
 * Only fetch what's needed for homepage
 */
export const getFeaturedProducts = async (limitCount: number = 8): Promise<AdminProduct[]> => {
  if (!db) return [];
  try {
    const productsQuery = query(
      collection(db, PRODUCTS_COLLECTION),
      where('featured', '==', true),
      where('active', '==', true)
    );
    const querySnapshot = await getDocs(productsQuery);
    
    // Sort client-side by name and limit
    const products = querySnapshot.docs.map(doc => overrideProductImage({
      id: doc.id,
      ...doc.data()
    } as AdminProduct));
    
    return products
      .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
      .slice(0, limitCount);
  } catch (error) {
    console.error('Error getting featured products:', error);
    return [];
  }
};

/**
 * Get products by brand with pagination
 */
export const getProductsByBrand = async (
  brand: string,
  lastDoc: QueryDocumentSnapshot | null = null,
  pageSize: number = 24
): Promise<PaginatedResult<AdminProduct>> => {
  return getPaginatedProducts({ brand, featured: false }, lastDoc, pageSize);
};

/**
 * Get new arrivals (sorted by createdAt desc) with limit
 */
export const getNewArrivals = async (limitCount: number = 10): Promise<AdminProduct[]> => {
  if (!db) return [];
  try {
    const productsQuery = query(
      collection(db, PRODUCTS_COLLECTION),
      where('active', '==', true)
    );
    const querySnapshot = await getDocs(productsQuery);
    
    // Sort client-side by createdAt descending and limit
    const products = querySnapshot.docs.map(doc => overrideProductImage({
      id: doc.id,
      ...doc.data()
    } as AdminProduct));
    
    return products
      .sort((a, b) => {
        const getTime = (date: any) => {
          if (!date) return 0;
          if (typeof date === 'string' || typeof date === 'number') return new Date(date).getTime();
          if (date.toMillis) return date.toMillis();
          if (date.toDate) return date.toDate().getTime();
          return 0;
        };
        const dateA = getTime(a.createdAt);
        const dateB = getTime(b.createdAt);
        return dateB - dateA;
      })
      .slice(0, limitCount);
  } catch (error) {
    console.error('Error getting new arrivals:', error);
    return [];
  }
};

/**
 * Lazy-load products with infinite scroll
 * Returns next page based on last document
 */
export const loadMoreProducts = async (
  currentProducts: AdminProduct[],
  filters: ProductFilters = {},
  pageSize: number = 24
): Promise<{ newProducts: AdminProduct[]; hasMore: boolean; lastDoc: QueryDocumentSnapshot | null }> => {
  if (currentProducts.length === 0) {
    const initial = await getPaginatedProducts(filters, null, pageSize);
    return {
      newProducts: initial.data,
      hasMore: initial.hasMore,
      lastDoc: initial.lastVisible
    };
  }

  const lastProduct = currentProducts[currentProducts.length - 1];
  const result = await getPaginatedProducts(filters, null, pageSize); // Simplified for demo

  return {
    newProducts: result.data,
    hasMore: result.hasMore,
    lastDoc: result.lastVisible
  };
};

// ==================== Admin API (Management) ====================

/**
 * Get ALL products (Admin ONLY)
 * Use sparingly - high read cost
 * Should be cached with TanStack Query (staleTime: 5 min)
 */
export const getAllProductsAdmin = async (): Promise<AdminProduct[]> => {
  if (!db) return [];
  try {
    const productsQuery = query(collection(db, PRODUCTS_COLLECTION));
    const querySnapshot = await getDocs(productsQuery);
    return querySnapshot.docs.map(doc => overrideProductImage({
      id: doc.id,
      ...doc.data()
    } as AdminProduct));
  } catch (error) {
    console.error('Error getting all products (admin):', error);
    return [];
  }
};

/**
 * Get filtered products for admin panel with pagination
 */
export const getAdminProducts = async (
  filters: ProductFilters = {},
  page: number = 1,
  pageSize: number = 50
): Promise<PaginatedResult<AdminProduct>> => {
  return getPaginatedProducts(filters, null, pageSize);
};

/**
 * Search products by name (partial match)
 * Uses Firestore's array-contains for efficient search
 */
export const searchProducts = async (queryString: string, limitCount: number = 10): Promise<AdminProduct[]> => {
  if (!db || !queryString.trim()) return [];

  try {
    // Note: Firestore doesn't support text search natively
    // For production, use Algolia/Meilisearch/ElasticSearch
    // This is a simple prefix match on name field (requires index)
    const productsQuery = query(
      collection(db, PRODUCTS_COLLECTION),
      where('name', '>=', queryString),
      where('name', '<=', queryString + '\uf8ff'),
      limit(limitCount)
    );

    const snapshot = await getDocs(productsQuery);
    return snapshot.docs.map(doc => overrideProductImage({
      id: doc.id,
      ...doc.data()
    } as AdminProduct));
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
};

// ==================== Count Helpers ====================

/**
 * Get total product count (cached separately)
 */
export const getProductCount = async (): Promise<number> => {
  if (!db) return 0;
  try {
    const snapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    return snapshot.size;
  } catch (error) {
    console.error('Error getting product count:', error);
    return 0;
  }
};

/**
 * Get count by filter (e.g., featured count, brand count)
 */
export const getProductCountByFilter = async (field: string, value: any): Promise<number> => {
  if (!db) return 0;
  try {
    const q = query(collection(db, PRODUCTS_COLLECTION), where(field, '==', value));
    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (error) {
    console.error(`Error getting count for ${field}=${value}:`, error);
    return 0;
  }
};

// ==================== Legacy Methods (Deprecated) ====================
// Kept for backward compatibility during migration

export const getProducts = async (): Promise<AdminProduct[]> => {
  console.warn('DEPRECATED: Use getPaginatedProducts() or getFeaturedProducts() instead');
  return getAllProductsAdmin();
};


export const getProductsCount = async (): Promise<number> => {
  return getProductCount();
};

// ==================== Mutations ====================

/**
 * Create a new product
 */
export const createProduct = async (productData: Omit<AdminProduct, 'id'>): Promise<string> => {
  if (!db) throw new Error('Firestore is not initialized');
  try {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
      ...productData,
      active: productData.active ?? true,
      createdAt: now,
      updatedAt: now,
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

/**
 * Update an existing product
 */
export const updateProduct = async (id: string, updates: Partial<AdminProduct>): Promise<void> => {
  if (!db) throw new Error('Firestore is not initialized');
  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, id);
    await setDoc(productRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    }, { merge: true });
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

/**
 * Delete a product
 */
export const deleteProduct = async (id: string): Promise<void> => {
  if (!db) throw new Error('Firestore is not initialized');
  try {
    await deleteDoc(doc(db, PRODUCTS_COLLECTION, id));
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

/**
 * Bulk create products
 */
export const createProductsBulk = async (products: Omit<AdminProduct, 'id'>[]): Promise<void> => {
  if (!db) throw new Error('Firestore is not initialized');
  try {
    const batch = writeBatch(db);
    const now = Timestamp.now();
    
    products.forEach((product) => {
      const docRef = doc(collection(db, PRODUCTS_COLLECTION));
      batch.set(docRef, {
        ...product,
        active: product.active ?? true,
        createdAt: now,
        updatedAt: now,
      });
    });
    
    await batch.commit();
  } catch (error) {
    console.error('Error in bulk product creation:', error);
    throw error;
  }
};

/**
 * Bulk delete products
 */
export const deleteProductsBulk = async (ids: string[]): Promise<void> => {
  if (!db) throw new Error('Firestore is not initialized');
  try {
    const batch = writeBatch(db);
    ids.forEach((id) => {
      batch.delete(doc(db, PRODUCTS_COLLECTION, id));
    });
    await batch.commit();
  } catch (error) {
    console.error('Error in bulk product deletion:', error);
    throw error;
  }
};

