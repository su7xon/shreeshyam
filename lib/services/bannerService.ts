// lib/services/bannerService.ts
import { db } from '@/lib/firebase';
import { collection, addDoc, setDoc, deleteDoc, doc, getDocs, query, where, orderBy, Timestamp, limit } from 'firebase/firestore';
import { Banner, BannerPlacement } from '@/lib/admin-store';

const BANNERS_COLLECTION = 'banners';

// ==================== Types ====================

export interface BannerFilters {
  placement?: BannerPlacement;
  active?: boolean;
}

// ==================== Optimized Queries ====================

/**
 * Get all banners (Admin use only)
 * Consider implementing pagination if many banners exist
 */
export const getBanners = async (): Promise<Banner[]> => {
  if (!db) return [];
  try {
    // Optimized: get all banners, sort client-side to prevent needing a composite index
    const bannersQuery = query(
      collection(db, BANNERS_COLLECTION),
      limit(100) // safety limit
    );
    const querySnapshot = await getDocs(bannersQuery);
    const banners = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Banner[];
    
    // Sort client-side
    return banners.sort((a, b) => {
      if (a.placement === b.placement) return (a.order || 0) - (b.order || 0);
      return (a.placement || '').localeCompare(b.placement || '');
    });
  } catch (error) {
    console.error('Error getting banners:', error);
    return [];
  }
};

/**
 * Get banners by placement (public-facing)
 * Optimized with active filter and limit
 */
export const getBannersByPlacement = async (placement: BannerPlacement, limitCount: number = 5): Promise<Banner[]> => {
  if (!db) return [];
  try {
    const bannersQuery = query(
      collection(db, BANNERS_COLLECTION),
      where('placement', '==', placement),
      where('active', '==', true),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(bannersQuery);
    const banners = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Banner[];
    
    // Sort client-side
    return banners.sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (error) {
    console.error(`Error getting banners for placement ${placement}:`, error);
    return [];
  }
};

// ==================== CRUD Operations ====================

export const createBanner = async (bannerData: Omit<Banner, 'id'>): Promise<string> => {
  if (!db) throw new Error('Firestore is not initialized');
  try {
    const docRef = await addDoc(collection(db, BANNERS_COLLECTION), {
      ...bannerData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating banner:', error);
    throw error;
  }
};

export const updateBanner = async (id: string, bannerData: Partial<Banner>): Promise<void> => {
  if (!db) throw new Error('Firestore is not initialized');
  try {
    const bannerDocRef = doc(db, BANNERS_COLLECTION, id);
    await setDoc(bannerDocRef, {
      ...bannerData,
      updatedAt: Timestamp.now()
    }, { merge: true });
  } catch (error) {
    console.error('Error updating banner:', error);
    throw error;
  }
};

export const deleteBanner = async (id: string): Promise<void> => {
  if (!db) throw new Error('Firestore is not initialized');
  try {
    await deleteDoc(doc(db, BANNERS_COLLECTION, id));
  } catch (error) {
    console.error('Error deleting banner:', error);
    throw error;
  }
};

/**
 * Get all active banners for homepage initialization
 * Only fetches id, placement, order, active (lightweight)
 */
export const getActiveBannersLight = async (): Promise<Pick<Banner, 'id' | 'placement' | 'order' | 'active'>[]> => {
  if (!db) return [];
  try {
    const bannersQuery = query(
      collection(db, BANNERS_COLLECTION),
      where('active', '==', true)
    );
    const querySnapshot = await getDocs(bannersQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      placement: doc.data().placement,
      order: doc.data().order,
      active: doc.data().active
    })) as any[];
  } catch (error) {
    console.error('Error getting active banners:', error);
    return [];
  }
};
