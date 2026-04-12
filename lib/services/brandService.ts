// lib/services/brandService.ts
import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDoc, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { Brand } from '@/lib/admin-store';

const BRANDS_COLLECTION = 'brands';

// Get all brands
export const getBrands = async (): Promise<Brand[]> => {
  try {
    const brandsQuery = query(collection(db, BRANDS_COLLECTION), orderBy('name'));
    const querySnapshot = await getDocs(brandsQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Brand[];
  } catch (error) {
    console.error('Error getting brands:', error);
    throw error;
  }
};

// Get brand by ID
export const getBrandById = async (id: string): Promise<Brand | null> => {
  try {
    const brandDoc = await getDoc(doc(db, BRANDS_COLLECTION, id));
    if (brandDoc.exists()) {
      return { id: brandDoc.id, ...brandDoc.data() } as Brand;
    }
    return null;
  } catch (error) {
    console.error('Error getting brand:', error);
    throw error;
  }
};

// Create a new brand
export const createBrand = async (brandData: Omit<Brand, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
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

// Update an existing brand
export const updateBrand = async (id: string, brandData: Partial<Brand>): Promise<void> => {
  try {
    const brandDocRef = doc(db, BRANDS_COLLECTION, id);
    const updateData = {
      ...brandData,
      updatedAt: Timestamp.now()
    };
    
    await updateDoc(brandDocRef, updateData);
  } catch (error) {
    console.error('Error updating brand:', error);
    throw error;
  }
};

// Delete a brand
export const deleteBrand = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, BRANDS_COLLECTION, id));
  } catch (error) {
    console.error('Error deleting brand:', error);
    throw error;
  }
};

// Get active brands only
export const getActiveBrands = async (): Promise<Brand[]> => {
  try {
    const brandsQuery = query(
      collection(db, BRANDS_COLLECTION), 
      where('active', '==', true),
      orderBy('name')
    );
    const querySnapshot = await getDocs(brandsQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Brand[];
  } catch (error) {
    console.error('Error getting active brands:', error);
    throw error;
  }
};