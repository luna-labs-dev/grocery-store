import { z } from 'zod';

export const addFamilyRequestSchema = z.object({
  name: z.string().max(100).min(3),
  description: z.string().optional(),
});

export const joinFamilyRequestSchema = z.object({
  inviteCode: z.string(),
});

export const removeFamilyMemberRequestSchema = z.object({
  memberId: z.uuid(),
});
