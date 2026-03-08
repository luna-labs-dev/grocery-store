import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from './router-provider';
import { ThemeProvider } from './theme-provider';
import { Toaster } from '@/components';

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
        <RouterProvider />
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
};
