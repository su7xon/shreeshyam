// components/FirebaseInitializer.tsx
'use client';

import { useEffect } from 'react';
import useAdminStore from '@/lib/admin-store';

export default function FirebaseInitializer() {
  const initialize = useAdminStore((state) => state.initialize);

  useEffect(() => {
    // Only initialize on the client side
    if (typeof window !== 'undefined') {
      initialize();
    }
  }, [initialize]);

  return null;
}
