// lib/services/brandService.ts
import { db } from '@/lib/firebase';
import { collection, addDoc, setDoc, deleteDoc, doc, getDoc, getDocs, query, where, orderBy, Timestamp, limit } from 'firebase/firestore';
import { Brand } from '@/lib/admin-store';

const BRANDS_COLLECTION = 'brands';

// ==================== Public API ====================

/**
 * Get active brands only (public-facing)
 * Optimized with active filter and optional limit
 */
export const getActiveBrands = async (limitCount?: number): Promise<Brand[]> => {
  if (!db) return [];
  try {
    let q = query(
      collection(db, BRANDS_COLLECTION),
      where('active', '==', true)
    );

    if (limitCount && limitCount > 0) {
      q = query(q, limit(limitCount));
    }

    const querySnapshot = await getDocs(q);
    const brands = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Brand[];
    
    // Sort client-side
    return brands.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  } catch (error) {
    console.error('Error getting active brands:', error);
    return [];
  }
};

// ==================== Admin API ====================

/**
 * Get all brands (Admin panel only)
 * Includes safety limit of 500
 */
export const getBrands = async (): Promise<Brand[]> => {
  if (!db) return [];
  try {
    const brandsQuery = query(collection(db, BRANDS_COLLECTION), orderBy('name'), limit(500));
    const querySnapshot = await getDocs(brandsQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Brand[];
  } catch (error) {
    console.error('Error getting brands:', error);
    return [];
  }
};

/**
 * Get brand by ID
 */
export const getBrandById = async (id: string): Promise<Brand | null> => {
  if (!db) return null;
  try {
    const brandDoc = await getDoc(doc(db, BRANDS_COLLECTION, id));
    if (brandDoc.exists()) {
      return { id: brandDoc.id, ...brandDoc.data() } as Brand;
    }
    return null;
  } catch (error) {
    console.error('Error getting brand:', error);
    return null;
  }
};

/**
 * Create a new brand
 */
export const createBrand = async (brandData: Omit<Brand, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  if (!db) throw new Error('Firestore is not initialized');
  try {
    const now = Timestamp.now();
    const brandWithTimestamps = {
      ...brandData,
      createdAt: now,
      updatedAt: now
    };

    const docRef = await addDoc(collection(db, BRANDS_COLLECTION), brandWithTimestamps);
    return docRef.id;
  } catch (error) {
    console.error('Error creating brand:', error);
    throw error;
  }
};

/**
 * Update an existing brand
 */
export const updateBrand = async (id: string, brandData: Partial<Brand>): Promise<void> => {
  if (!db) throw new Error('Firestore is not initialized');
  try {
    const brandDocRef = doc(db, BRANDS_COLLECTION, id);
    const updateData = {
      ...brandData,
      updatedAt: Timestamp.now()
    };

    await setDoc(brandDocRef, updateData, { merge: true });
  } catch (error) {
    console.error('Error updating brand:', error);
    throw error;
  }
};

/**
 * Delete a brand
 */
export const deleteBrand = async (id: string): Promise<void> => {
  if (!db) throw new Error('Firestore is not initialized');
  try {
    await deleteDoc(doc(db, BRANDS_COLLECTION, id));
  } catch (error) {
    console.error('Error deleting brand:', error);
    throw error;
  }
};
