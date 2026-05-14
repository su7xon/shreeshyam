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
  signInWithRedirect,
  getRedirectResult
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phone?: string;
  address?: string;
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
  
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
  // Update profile with display name
  if (userCredential.user) {
    await updateProfile(userCredential.user, { displayName });
    
    // Save user profile to Firestore
    const userProfile: UserProfile = {
      uid: userCredential.user.uid,
      email: userCredential.user.email || '',
      displayName,
      phone,
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
  return await signInWithEmailAndPassword(auth, email, password);
};

// Sign In with Google using Redirect
export const signInWithGoogleRedirect = async (): Promise<void> => {
  if (!auth) throw new Error('Firebase auth not initialized');
  
  const googleProvider = new GoogleAuthProvider();
  await signInWithRedirect(auth, googleProvider);
};

// Check Google Redirect Result
export const checkGoogleRedirectResult = async (): Promise<UserCredential | null> => {
  if (!auth) return null;
  
  const userCredential = await getRedirectResult(auth);
  
  // Create user profile in Firestore if it doesn't exist
  if (userCredential?.user && db) {
    const userRef = doc(db, 'users', userCredential.user.uid);
    const docSnap = await getDoc(userRef);
    
    if (!docSnap.exists()) {
      const userProfile: UserProfile = {
        uid: userCredential.user.uid,
        email: userCredential.user.email || '',
        displayName: userCredential.user.displayName || 'User',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      await setDoc(userRef, userProfile);
    }
  }
  
  return userCredential;
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
  
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, {
    ...updates,
    updatedAt: new Date().toISOString(),
  }, { merge: true });
};
