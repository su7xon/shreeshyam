// lib/services/categoryService.ts
import { db } from '@/lib/firebase';
import { collection, addDoc, setDoc, deleteDoc, doc, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';

const CATEGORIES_COLLECTION = 'categories';

export interface Category {
  id: string;
  name: string;
  image: string;
  active: boolean;
  order: number;
}

export const getCategories = async (): Promise<Category[]> => {
  if (!db) return [];
  try {
    const categoriesQuery = query(collection(db, CATEGORIES_COLLECTION), orderBy('order', 'asc'));
    const querySnapshot = await getDocs(categoriesQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Category[];
  } catch (error) {
    console.error('Error getting categories:', error);
    return [];
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
