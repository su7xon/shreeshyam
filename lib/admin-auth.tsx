'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof document !== 'undefined') {
      return document.cookie.includes('__admin_auth=1');
    }
    return false;
  });

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
