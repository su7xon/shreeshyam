import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where,
  getDoc
} from 'firebase/firestore';
import { db } from '../firebase';

const COLLECTION_NAME = 'dailyDeals';

export interface DailyDeal {
  id: string;
  productId: string;
  active: boolean;
  order: number;
}

export const getDailyDeals = async (): Promise<DailyDeal[]> => {
  if (!db) return [];
  const q = query(collection(db, COLLECTION_NAME));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DailyDeal));
};

export const createDailyDeal = async (deal: Omit<DailyDeal, 'id'>): Promise<string> => {
  if (!db) throw new Error('Firebase not initialized');
  const docRef = await addDoc(collection(db, COLLECTION_NAME), deal);
  return docRef.id;
};

export const updateDailyDeal = async (id: string, deal: Partial<DailyDeal>): Promise<void> => {
  if (!db) throw new Error('Firebase not initialized');
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, deal);
};

export const deleteDailyDeal = async (id: string): Promise<void> => {
  if (!db) throw new Error('Firebase not initialized');
  await deleteDoc(doc(db, COLLECTION_NAME, id));
};
