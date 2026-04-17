// lib/services/bannerService.ts
import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy, Timestamp, where } from 'firebase/firestore';
import { Banner, BannerPlacement } from '@/lib/admin-store';

const BANNERS_COLLECTION = 'banners';

// Get all banners
export const getBanners = async (): Promise<Banner[]> => {
  if (!db) return [];
  try {
    const bannersQuery = query(collection(db, BANNERS_COLLECTION), orderBy('order'));
    const querySnapshot = await getDocs(bannersQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Banner[];
  } catch (error) {
    console.error('Error getting banners:', error);
    return [];
  }
};

// Create a new banner
export const createBanner = async (bannerData: Omit<Banner, 'id'>): Promise<string> => {
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

// Update an existing banner
export const updateBanner = async (id: string, bannerData: Partial<Banner>): Promise<void> => {
  try {
    const bannerDocRef = doc(db, BANNERS_COLLECTION, id);
    await updateDoc(bannerDocRef, {
      ...bannerData,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating banner:', error);
    throw error;
  }
};

// Delete a banner
export const deleteBanner = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, BANNERS_COLLECTION, id));
  } catch (error) {
    console.error('Error deleting banner:', error);
    throw error;
  }
};

// Get banners by placement
export const getBannersByPlacement = async (placement: BannerPlacement): Promise<Banner[]> => {
  if (!db) return [];
  try {
    const bannersQuery = query(
      collection(db, BANNERS_COLLECTION),
      where('placement', '==', placement),
      where('active', '==', true),
      orderBy('order')
    );
    const querySnapshot = await getDocs(bannersQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Banner[];
  } catch (error) {
    console.error(`Error getting banners for placement ${placement}:`, error);
    return [];
  }
};
