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
  familyId: z.uuid().nullish(),
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
  );
