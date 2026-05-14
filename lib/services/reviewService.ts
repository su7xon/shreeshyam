import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, query, where, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export interface Review {
  id?: string;
  name: string;
  text: string;
  initials: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt?: any;
}

export const getApprovedReviews = async (): Promise<Review[]> => {
  try {
    const q = query(collection(db, 'reviews'), where('status', '==', 'approved'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
  } catch (error) {
    console.error("Error fetching approved reviews:", error);
    // If index is missing, return empty array for now
    return [];
  }
};

export const getAllReviews = async (): Promise<Review[]> => {
  try {
    const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
  } catch (error) {
    console.error("Error fetching all reviews:", error);
    return [];
  }
};

export const addReview = async (review: Omit<Review, 'id' | 'createdAt' | 'status'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'reviews'), {
    ...review,
    status: 'pending',
    createdAt: serverTimestamp()
  });
  return docRef.id;
};

export const updateReviewStatus = async (id: string, status: 'approved' | 'rejected'): Promise<void> => {
  await updateDoc(doc(db, 'reviews', id), { status });
};

export const deleteReview = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'reviews', id));
};
