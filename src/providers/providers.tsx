import { ClerkProvider } from '@clerk/clerk-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from './router-provider';
import { ThemeProvider } from './theme-provider';
import { env } from '@/config';

export const Providers = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ClerkProvider publishableKey={env.clerk.publishableKey}>
          <RouterProvider />
        </ClerkProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};
