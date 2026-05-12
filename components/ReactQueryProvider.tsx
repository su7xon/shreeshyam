'use client';

import { ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface ReactQueryProviderProps {
  children: ReactNode;
}

export default function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  // useState ensures the QueryClient is created ONCE per component lifecycle
  // This is the React 18+ recommended pattern for TanStack Query
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes — data considered fresh
            gcTime: 15 * 60 * 1000, // 15 minutes — cache retained after unmount
            retry: 1,
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
            refetchOnMount: false, // Don't re-fetch if cache is fresh
          },
          mutations: {
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
