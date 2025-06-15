import { env } from '@/config/env';
import { ClerkProvider } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';
import { ReactNode } from 'react';

interface AuthProviderProps {
  children: ReactNode;
}

const { clerk } = env;

export const AuthProvider = ({ children }: AuthProviderProps) => {
  return (
    <ClerkProvider
      publishableKey={clerk.publishableKey}
      appearance={{
        baseTheme: dark,
      }}
    >
      {children}
    </ClerkProvider>
  );
};
