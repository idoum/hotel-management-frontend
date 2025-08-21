'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from '@/providers/AuthProvider';

interface Props {
  children: React.ReactNode;
}

export default function Providers({ children }: Props) {
  const [queryClient] = React.useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: (failureCount, error: any) => {
          if (error?.status && [401, 403, 404].includes(error.status)) {
            return false;
          }
          return failureCount < 3;
        },
      },
      mutations: {
        retry: false,
      },
    },
  }));

  // ✅ Importer Bootstrap JS seulement côté client
  React.useEffect(() => {
    // Importation dynamique de Bootstrap JS
    import('bootstrap/dist/js/bootstrap.bundle.min.js')
      .then(() => {
        console.log('✅ Bootstrap JS loaded');
      })
      .catch((error) => {
        console.error('❌ Bootstrap JS loading error:', error);
      });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </AuthProvider>
    </QueryClientProvider>
  );
}
