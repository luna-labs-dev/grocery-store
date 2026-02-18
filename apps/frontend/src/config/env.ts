import { z } from 'zod';

const envVariables = z.object({
  VITE_ENV: z
    .enum(['local', 'remote-backend', 'development', 'production'])
    .default('development'),

  VITE_PORT: z.coerce.number().default(3000),
  VITE_BACKEND_URL: z.string(),
  VITE_CLERK_PUBLISHABLE_KEY: z.string(),
});

const parsedVariables = envVariables.safeParse(import.meta.env);

if (!parsedVariables.success) {
  throw new Error(parsedVariables.error.message);
}

const { VITE_ENV, VITE_PORT, VITE_BACKEND_URL, VITE_CLERK_PUBLISHABLE_KEY } =
  parsedVariables.data;

export const env = {
  baseConfig: {
    port: VITE_PORT,
  },
  backend: {
    baseUrl: VITE_ENV === 'remote-backend' ? '/' : VITE_BACKEND_URL,
  },
  clerk: {
    publishableKey: VITE_CLERK_PUBLISHABLE_KEY,
  },
};
