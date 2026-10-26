import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import type { ReactNode } from 'react';
import { queryClient } from '@/lib/query/client';
import { AuthProvider } from '@/app/providers/auth-provider';
import { ErrorBoundary } from '@/components/common/error-boundary';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          {children}
          <Toaster richColors position="bottom-right" closeButton />
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
