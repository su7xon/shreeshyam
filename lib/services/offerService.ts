// lib/services/offerService.ts
import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy, Timestamp, where } from 'firebase/firestore';
import { Offer } from '@/lib/admin-store';

const OFFERS_COLLECTION = 'offers';

// Get all offers
export const getOffers = async (): Promise<Offer[]> => {
  if (!db) return [];
  try {
    const querySnapshot = await getDocs(query(collection(db, OFFERS_COLLECTION)));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Offer[];
  } catch (error) {
    console.error('Error getting offers:', error);
    return [];
  }
};

// Create a new offer
export const createOffer = async (offerData: Omit<Offer, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, OFFERS_COLLECTION), {
      ...offerData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating offer:', error);
    throw error;
  }
};

// Update an existing offer
export const updateOffer = async (id: string, offerData: Partial<Offer>): Promise<void> => {
  try {
    const offerDocRef = doc(db, OFFERS_COLLECTION, id);
    await updateDoc(offerDocRef, {
      ...offerData,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating offer:', error);
    throw error;
  }
};

// Delete an offer
export const deleteOffer = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, OFFERS_COLLECTION, id));
  } catch (error) {
    console.error('Error deleting offer:', error);
    throw error;
  }
};

// Get active offers
export const getActiveOffers = async (): Promise<Offer[]> => {
  if (!db) return [];
  try {
    const offersQuery = query(
      collection(db, OFFERS_COLLECTION),
      where('active', '==', true)
    );
    const querySnapshot = await getDocs(offersQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Offer[];
  } catch (error) {
    console.error('Error getting active offers:', error);
    return [];
  }
};
