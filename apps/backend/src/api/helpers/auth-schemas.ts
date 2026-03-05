import { z } from 'zod';

export const signUpEmailRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  image: z.string().url().optional(),
});

export const signInEmailRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const userResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  emailVerified: z.boolean(),
  image: z.url().nullish(),
  createdAt: z.date().or(z.string()),
  updatedAt: z.date().or(z.string()),
});

export const signInSocialRequestSchema = z.object({
  provider: z.enum(['google']),
  callbackURL: z.url().optional(),
  errorCallbackURL: z.url().optional(),
  newUserCallbackURL: z.url().optional(),
});

export const sessionResponseSchema = z
  .object({
    user: userResponseSchema,
    session: z.object({
      id: z.string(),
      expiresAt: z.date().or(z.string()),
      token: z.string(),
      createdAt: z.date().or(z.string()),
      updatedAt: z.date().or(z.string()),
      ipAddress: z.string().nullish(),
      userAgent: z.string().nullish(),
      userId: z.string(),
    }),
  })
  .nullable()
  .or(
    z.object({
      token: z.string().nullable(),
      user: userResponseSchema,
    }),
  )
  .or(
    z.object({
      redirect: z.boolean(),
      token: z.string(),
      url: z.string().optional(),
      user: userResponseSchema,
    }),
  )
  .or(
    z.object({
      success: z.boolean(),
    }),
  )
  .or(
    z.object({
      url: z.url(),
      redirect: z.boolean(),
    }),
  );

export const callbackGoogleQuerystringSchema = z.object({
  code: z.string().optional(),
  state: z.string().optional(),
  error: z.string().optional(),
});

export const csrfResponseSchema = z.object({
  csrfToken: z.string(),
});
