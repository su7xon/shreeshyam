import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  User,
  UserCredential,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export interface SavedAddress {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phone?: string;
  address?: string;
  savedAddresses?: SavedAddress[];
  language?: string;
  createdAt: string;
  updatedAt: string;
}

// Sign Up with Email & Password
export const signUp = async (
  email: string,
  password: string,
  displayName: string,
  phone?: string
): Promise<UserCredential> => {
  if (!auth) throw new Error('Firebase auth not initialized');
  
  // Input validation
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    throw new Error('Please provide a valid email address.');
  }
  if (!password || password.length < 6) {
    throw new Error('Password must be at least 6 characters.');
  }
  const cleanName = displayName.replace(/[<>]/g, '').trim().slice(0, 100);
  if (!cleanName || cleanName.length < 2) {
    throw new Error('Name must be at least 2 characters.');
  }
  const cleanPhone = phone ? phone.replace(/[^\d+\-() ]/g, '').slice(0, 20) : undefined;
  
  const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
  
  // Update profile with display name
  if (userCredential.user) {
    await updateProfile(userCredential.user, { displayName: cleanName });
    
    // Save user profile to Firestore
    const userProfile: UserProfile = {
      uid: userCredential.user.uid,
      email: userCredential.user.email || '',
      displayName: cleanName,
      phone: cleanPhone,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await setDoc(doc(db, 'users', userCredential.user.uid), userProfile);
  }
  
  return userCredential;
};

// Sign In with Email & Password
export const signIn = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  if (!auth) throw new Error('Firebase auth not initialized');
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail) throw new Error('Email is required.');
  return await signInWithEmailAndPassword(auth, cleanEmail, password);
};

// Helper: create/update Google user profile in Firestore
const saveGoogleUserProfile = async (user: User): Promise<void> => {
  if (!db) return;
  const userRef = doc(db, 'users', user.uid);
  const docSnap = await getDoc(userRef);
  
  if (!docSnap.exists()) {
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || 'User',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await setDoc(userRef, userProfile);
  }
};

// Sign In with Google — tries popup first, falls back to redirect (for mobile)
export const signInWithGoogle = async (): Promise<UserCredential | null> => {
  if (!auth) throw new Error('Firebase auth not initialized');
  
  const googleProvider = new GoogleAuthProvider();
  googleProvider.addScope('email');
  googleProvider.addScope('profile');
  
  try {
    // Try popup first (works on desktop)
    const userCredential = await signInWithPopup(auth, googleProvider);
    
    // Save profile to Firestore
    if (userCredential?.user) {
      await saveGoogleUserProfile(userCredential.user);
    }
    
    return userCredential;
  } catch (popupError: any) {
    const errorCode = popupError?.code || '';
    console.warn('Google popup sign-in failed:', errorCode, popupError?.message);
    
    // If popup was blocked or cancelled, fall back to redirect
    if (
      errorCode === 'auth/popup-blocked' ||
      errorCode === 'auth/popup-closed-by-user' ||
      errorCode === 'auth/cancelled-popup-request' ||
      errorCode === 'auth/internal-error'
    ) {
      console.log('Falling back to redirect sign-in...');
      await signInWithRedirect(auth, googleProvider);
      return null; // redirect navigates away
    }
    
    // Re-throw other errors (e.g., auth/unauthorized-domain, network)
    throw popupError;
  }
};

// Handle redirect result on page load (call this once on app mount)
export const handleGoogleRedirectResult = async (): Promise<UserCredential | null> => {
  if (!auth) return null;
  
  try {
    const result = await getRedirectResult(auth);
    if (result?.user) {
      await saveGoogleUserProfile(result.user);
    }
    return result;
  } catch (error: any) {
    console.error('Google redirect result error:', error?.code, error?.message);
    throw error;
  }
};

// Sign Out
export const logOut = async (): Promise<void> => {
  if (!auth) throw new Error('Firebase auth not initialized');
  await signOut(auth);
};

// Password Reset
export const resetPassword = async (email: string): Promise<void> => {
  if (!auth) throw new Error('Firebase auth not initialized');
  await sendPasswordResetEmail(auth, email);
};

// Get Current User
export const getCurrentUser = (): User | null => {
  if (!auth) return null;
  return auth.currentUser;
};

// Listen to Auth State Changes
export const onAuthChange = (callback: (user: User | null) => void) => {
  if (!auth) return () => {};
  return onAuthStateChanged(auth, callback);
};

// Get User Profile from Firestore
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  if (!db) return null;
  
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return docSnap.data() as UserProfile;
  }
  
  return null;
};

// Update User Profile
export const updateUserProfile = async (
  uid: string,
  updates: Partial<UserProfile>
): Promise<void> => {
  if (!db) throw new Error('Firestore not initialized');
  if (!uid) throw new Error('User ID is required');
  
  // Sanitize text fields
  const sanitized: Record<string, any> = {
    updatedAt: new Date().toISOString(),
  };
  if (updates.displayName !== undefined) {
    sanitized.displayName = updates.displayName.replace(/[<>]/g, '').trim().slice(0, 100);
  }
  if (updates.phone !== undefined) {
    sanitized.phone = updates.phone.replace(/[^\d+\-() ]/g, '').slice(0, 20);
  }
  if (updates.address !== undefined) {
    sanitized.address = updates.address.replace(/[<>]/g, '').trim().slice(0, 500);
  }
  if (updates.language !== undefined) {
    sanitized.language = updates.language.replace(/[^a-zA-Z-]/g, '').slice(0, 10);
  }
  
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, sanitized, { merge: true });
};
