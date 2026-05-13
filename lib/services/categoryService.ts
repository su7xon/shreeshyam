// lib/services/categoryService.ts
import { db } from '@/lib/firebase';
import { collection, addDoc, setDoc, deleteDoc, doc, getDoc, getDocs, query, where, orderBy, Timestamp, limit } from 'firebase/firestore';

const CATEGORIES_COLLECTION = 'categories';

export interface Category {
  id: string;
  name: string;
  image: string;
  active: boolean;
  order: number;
}

/**
 * Get all active categories (lightweight)
 * Used for navigation and filters
 */
export const getCategories = async (includeInactive: boolean = false): Promise<Category[]> => {
  if (!db) return [];
  try {
    let q = query(collection(db, CATEGORIES_COLLECTION));

    if (!includeInactive) {
      q = query(collection(db, CATEGORIES_COLLECTION), where('active', '==', true));
    }

    const querySnapshot = await getDocs(q);
    const categories = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Category[];

    // Sort client-side to avoid composite index requirement
    return categories.sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (error) {
    console.error('Error getting categories:', error);
    return [];
  }
};

/**
 * Get category by ID
 */
export const getCategoryById = async (id: string): Promise<Category | null> => {
  if (!db) return null;
  try {
    const catDoc = await getDoc(doc(db, CATEGORIES_COLLECTION, id));
    if (catDoc.exists()) {
      return { id: catDoc.id, ...catDoc.data() } as Category;
    }
    return null;
  } catch (error) {
    console.error('Error getting category:', error);
    return null;
  }
};

export const createCategory = async (categoryData: Omit<Category, 'id'>): Promise<string> => {
  if (!db) throw new Error('Firestore is not initialized');
  try {
    const docRef = await addDoc(collection(db, CATEGORIES_COLLECTION), {
      ...categoryData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

export const updateCategory = async (id: string, categoryData: Partial<Category>): Promise<void> => {
  if (!db) throw new Error('Firestore is not initialized');
  try {
    const categoryDocRef = doc(db, CATEGORIES_COLLECTION, id);
    await setDoc(categoryDocRef, {
      ...categoryData,
      updatedAt: Timestamp.now()
    }, { merge: true });
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

export const deleteCategory = async (id: string): Promise<void> => {
  if (!db) throw new Error('Firestore is not initialized');
  try {
    await deleteDoc(doc(db, CATEGORIES_COLLECTION, id));
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};
