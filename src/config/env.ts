import { z } from 'zod';

const envVariables = z.object({
  VITE_apiKey: z.string(),
  VITE_authDomain: z.string(),
  VITE_projectId: z.string(),
  VITE_storageBucket: z.string(),
  VITE_messagingSenderId: z.string(),
  VITE_appId: z.string(),
  VITE_measurementId: z.string(),
  VITE_backend_url: z.string(),
  VITE_CLERK_PUBLISHABLE_KEY: z.string(),
});

const parsedVariables = envVariables.safeParse(import.meta.env);

if (!parsedVariables.success) {
  throw new Error(parsedVariables.error.message);
}

const {
  VITE_apiKey,
  VITE_appId,
  VITE_authDomain,
  VITE_measurementId,
  VITE_messagingSenderId,
  VITE_projectId,
  VITE_storageBucket,
  VITE_backend_url,
  VITE_CLERK_PUBLISHABLE_KEY,
} = parsedVariables.data;

export const env = {
  baseConfig: {},
  backend: {
    baseUrl: VITE_backend_url,
  },
  clerk: {
    publishableKey: VITE_CLERK_PUBLISHABLE_KEY,
  },
  googleAuth: {
    apiKey: VITE_apiKey,
    authDomain: VITE_authDomain,
    projectId: VITE_projectId,
    storageBucket: VITE_storageBucket,
    messagingSenderId: VITE_messagingSenderId,
    appId: VITE_appId,
    measurementId: VITE_measurementId,
  },
};
