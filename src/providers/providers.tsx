import { Toaster } from '@/components';
import { AuthProvider } from './auth-provider';
import { QueryProvider } from './query-provider';
import { RouterProvider } from './router-provider';
import { ThemeProvider } from './theme-provider';

export const Providers = () => {
  return (
    <AuthProvider>
      <QueryProvider>
        <ThemeProvider>
          <RouterProvider />
          <Toaster />
        </ThemeProvider>
      </QueryProvider>
    </AuthProvider>
  );
};
