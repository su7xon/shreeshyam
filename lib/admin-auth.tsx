'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from './firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut,
  User 
} from 'firebase/auth';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// The primary admin email that has write permissions in firestore.rules
const ADMIN_EMAIL = 'admin@shreeshyammobiles.com';

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    if (!auth) return false;
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user !== null;
    } catch (error: any) {
      // Don't use console.error for standard auth failures in dev mode
      // as it triggers annoying Next.js overlays.
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        console.warn('Login failed: Invalid credentials');
      } else {
        console.error('Admin login error:', error);
      }
      return false;
    }
  };

  const logout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Admin logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#b78b57] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-500 font-medium animate-pulse">Verifying session…</p>
        </div>
      </div>
    );
  }

  return (
    <AdminAuthContext.Provider value={{ 
      isAuthenticated: !!user && (user.email === ADMIN_EMAIL || !!user.email?.endsWith('@shreeshyammobiles.com')), 
      user, 
      login, 
      logout 
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
