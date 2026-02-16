import { ClerkProvider } from '@clerk/clerk-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from './router-provider';
import { ThemeProvider } from './theme-provider';
import { Toaster } from '@/components';
import { env } from '@/config';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export const Providers = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ClerkProvider publishableKey={env.clerk.publishableKey}>
          <RouterProvider />
          <Toaster />
        </ClerkProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};
