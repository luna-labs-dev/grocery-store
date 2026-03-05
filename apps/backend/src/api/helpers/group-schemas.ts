import { z } from 'zod';

export const groupRoleSchema = z.enum(['OWNER', 'ADMIN', 'MEMBER']);

export const groupMemberResponseSchema = z.object({
  userId: z.string(),
  name: z.string().optional(),
  image: z.string().optional(),
  role: groupRoleSchema,
  joinedAt: z.date(),
});

export const groupResponseSchema = z
  .object({
    id: z.string().uuid(),
    name: z.string().max(100).min(3),
    description: z.string().optional(),
    inviteCode: z.string().optional(),
    members: z.array(groupMemberResponseSchema).optional(),
    createdAt: z.date(),
    createdBy: z.string(),
  })
  .describe('Group details');

export const createGroupRequestSchema = z.object({
  name: z.string().max(100).min(3),
  description: z.string().optional(),
});

export const joinGroupRequestSchema = z.object({
  inviteCode: z.string(),
});

export const updateMemberRoleRequestSchema = z.object({
  role: groupRoleSchema,
});

export const removeMemberParamsSchema = z.object({
  memberId: z.string(),
});

export const groupParamsSchema = z.object({
  groupId: z.string().uuid(),
});

export const groupInviteResponseSchema = z.object({
  inviteCode: z.string(),
  joinUrl: z.string().url(),
});
