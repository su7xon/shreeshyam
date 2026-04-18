// lib/services/orderService.ts
import { db } from '@/lib/firebase';
import { collection, addDoc, setDoc, deleteDoc, doc, getDoc, getDocs, query, orderBy, Timestamp, where } from 'firebase/firestore';
import { Order, OrderStatus } from '@/lib/admin-store';

const ORDERS_COLLECTION = 'orders';

// Get all orders
export const getOrders = async (): Promise<Order[]> => {
  if (!db) return [];
  try {
    const ordersQuery = query(collection(db, ORDERS_COLLECTION), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(ordersQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Order[];
  } catch (error) {
    console.error('Error getting orders:', error);
    return [];
  }
};

// Create a new order
export const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  if (!db) throw new Error('Firestore is not initialized');
  try {
    const now = Timestamp.now();
    const orderWithMetadata = {
      ...orderData,
      createdAt: now,
      updatedAt: now,
      orderNumber: `SSM-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`
    };
    
    const docRef = await addDoc(collection(db, ORDERS_COLLECTION), orderWithMetadata);
    return docRef.id;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Update order status
export const updateOrderStatus = async (id: string, status: OrderStatus): Promise<void> => {
  try {
    const orderDocRef = doc(db, ORDERS_COLLECTION, id);
    await setDoc(orderDocRef, {
      status,
      updatedAt: Timestamp.now()
    }, { merge: true });
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

// Get order by ID
export const getOrderById = async (id: string): Promise<Order | null> => {
  try {
    const orderDoc = await getDoc(doc(db, ORDERS_COLLECTION, id));
    if (orderDoc.exists()) {
      return { id: orderDoc.id, ...orderDoc.data() } as Order;
    }
    return null;
  } catch (error) {
    console.error('Error getting order:', error);
    return null;
  }
};

// Get orders by phone number (for customer lookup)
export const getOrdersByPhone = async (phone: string): Promise<Order[]> => {
  if (!db) return [];
  try {
    const ordersQuery = query(
      collection(db, ORDERS_COLLECTION),
      where('customer.phone', '==', phone),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(ordersQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Order[];
  } catch (error) {
    console.error('Error getting orders by phone:', error);
    return [];
  }
};

// Delete an order
export const deleteOrder = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, ORDERS_COLLECTION, id));
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
};
