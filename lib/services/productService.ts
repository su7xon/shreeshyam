// lib/services/productService.ts
import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDoc, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { AdminProduct } from '@/lib/admin-store';

const PRODUCTS_COLLECTION = 'products';

// Get all products
export const getProducts = async (): Promise<AdminProduct[]> => {
  if (!db) {
    console.warn('Firestore database is not initialized. Returning empty products.');
    return [];
  }
  try {
    const productsQuery = query(collection(db, PRODUCTS_COLLECTION), orderBy('name'));
    const querySnapshot = await getDocs(productsQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as AdminProduct[];
  } catch (error) {
    console.error('Error getting products:', error);
    return [];
  }
};

// Get product by ID
export const getProductById = async (id: string): Promise<AdminProduct | null> => {
  if (!db) return null;
  try {
    const productDoc = await getDoc(doc(db, PRODUCTS_COLLECTION, id));
    if (productDoc.exists()) {
      return { id: productDoc.id, ...productDoc.data() } as AdminProduct;
    }
    return null;
  } catch (error) {
    console.error('Error getting product:', error);
    return null;
  }
};

// Create a new product
export const createProduct = async (productData: Omit<AdminProduct, 'id'>): Promise<string> => {
  if (!db) throw new Error('Firestore is not initialized');
  try {
    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
      ...productData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// Update an existing product
export const updateProduct = async (id: string, productData: Partial<AdminProduct>): Promise<void> => {
  try {
    const productDocRef = doc(db, PRODUCTS_COLLECTION, id);
    await updateDoc(productDocRef, {
      ...productData,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// Delete a product
export const deleteProduct = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, PRODUCTS_COLLECTION, id));
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Get featured products
export const getFeaturedProducts = async (): Promise<AdminProduct[]> => {
  if (!db) return [];
  try {
    const productsQuery = query(
      collection(db, PRODUCTS_COLLECTION),
      where('featured', '==', true),
      orderBy('name')
    );
    const querySnapshot = await getDocs(productsQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as AdminProduct[];
  } catch (error) {
    console.error('Error getting featured products:', error);
    return [];
  }
};
