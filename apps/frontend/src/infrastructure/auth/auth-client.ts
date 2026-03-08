import { createAuthClient } from 'better-auth/react';
import { env } from '@/config';

export const authClient = createAuthClient({
  baseURL: env.auth.url,
  fetchOptions: {
    credentials: 'include',
  },
});

export const { useSession, signIn, signOut, signUp } = authClient;
