'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for cookie on mount
    const hasAuth = document.cookie.includes('__admin_auth=1');
    if (hasAuth) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (password: string): Promise<boolean> => {
    if (password === 'shreeshyam') {
      const isSecure = window.location.protocol === 'https:' ? '; secure' : '';
      document.cookie = `__admin_auth=1; path=/; max-age=86400; samesite=lax${isSecure}`;
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = async () => {
    const isSecure = window.location.protocol === 'https:' ? '; secure' : '';
    document.cookie = `__admin_auth=; path=/; max-age=0; samesite=lax${isSecure}`;
    setIsAuthenticated(false);
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
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout }}>
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
