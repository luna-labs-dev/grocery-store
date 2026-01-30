import { ClerkProvider } from '@clerk/clerk-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { ThemeProvider } from './theme-provider';
import { SidebarProvider } from '@/components';
import { env } from '@/config';
import { routeTree } from '@/route-tree.gen';

export const router = createRouter({ routeTree });

export const Providers = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ClerkProvider publishableKey={env.clerk.publishableKey}>
          <SidebarProvider>
            <RouterProvider router={router} />
          </SidebarProvider>
        </ClerkProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};
