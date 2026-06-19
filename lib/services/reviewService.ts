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

// Sanitize text to prevent XSS
const sanitizeText = (text: string, maxLen: number): string =>
  text.replace(/[<>"'&]/g, (c) => ({
    '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '&': '&amp;'
  }[c] || c)).slice(0, maxLen).trim();

export const getApprovedReviews = async (): Promise<Review[]> => {
  if (!db) return [];
  try {
    const q = query(collection(db, 'reviews'), where('status', '==', 'approved'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
  } catch (error) {
    console.error("Error fetching approved reviews:", error);
    return [];
  }
};

export const getAllReviews = async (): Promise<Review[]> => {
  if (!db) return [];
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
  if (!db) throw new Error('Firestore is not initialized');

  // Validate and sanitize input
  const name = sanitizeText(review.name || '', 100);
  const text = sanitizeText(review.text || '', 2000);
  if (!name || name.length < 2) throw new Error('Name must be at least 2 characters.');
  if (!text || text.length < 5) throw new Error('Review must be at least 5 characters.');

  const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'C';

  const docRef = await addDoc(collection(db, 'reviews'), {
    name,
    text,
    initials: sanitizeText(initials, 3),
    status: 'pending',
    createdAt: serverTimestamp()
  });
  return docRef.id;
};

export const updateReviewStatus = async (id: string, status: 'approved' | 'rejected'): Promise<void> => {
  if (!db) throw new Error('Firestore is not initialized');
  if (!id || !['approved', 'rejected'].includes(status)) throw new Error('Invalid review ID or status');
  await updateDoc(doc(db, 'reviews', id), { status });
};

export const deleteReview = async (id: string): Promise<void> => {
  if (!db) throw new Error('Firestore is not initialized');
  if (!id) throw new Error('Review ID is required');
  await deleteDoc(doc(db, 'reviews', id));
};
