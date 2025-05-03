import { z } from 'zod';

const envVariables = z.object({
  VITE_backend_url: z.string(),
  VITE_CLERK_PUBLISHABLE_KEY: z.string(),
});

const parsedVariables = envVariables.safeParse(import.meta.env);

if (!parsedVariables.success) {
  throw new Error(parsedVariables.error.message);
}

const { VITE_backend_url, VITE_CLERK_PUBLISHABLE_KEY } = parsedVariables.data;

export const env = {
  baseConfig: {},
  backend: {
    baseUrl: VITE_backend_url,
  },
  clerk: {
    publishableKey: VITE_CLERK_PUBLISHABLE_KEY,
  },
};
