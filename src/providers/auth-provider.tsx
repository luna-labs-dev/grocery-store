import { env } from '@/config/env';
import { ClerkProvider } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';
import { ReactNode } from 'react';

interface AuthProviderProps {
  children: ReactNode;
}

const { clerk, backend } = env;

export const AuthProvider = ({ children }: AuthProviderProps) => {
  return (
    <ClerkProvider
      publishableKey={clerk.publishableKey}
      domain={backend.domain}
      isSatellite={true}
      appearance={{
        baseTheme: dark,
      }}
    >
      {children}
    </ClerkProvider>
  );
};
