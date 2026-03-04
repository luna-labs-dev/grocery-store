import { z } from 'zod';
import type { Family, User } from '@/domain';

export const userResponse = z.object({
  id: z.string(),
  externalId: z.string(),
  name: z.string().optional(),
  picture: z.string().optional(),
  email: z.string(),
});

export type UserResponse = z.infer<typeof userResponse>;

export const userMapper = {
  toResponse: (user: User): UserResponse => ({
    id: user.id,
    externalId: user.externalId,
    name: user.name,
    picture: user.picture,
    email: user.email,
  }),
};

export const familyResponseSchema = z
  .object({
    name: z.string().max(100).min(3),
    description: z.string().optional(),
    owner: userResponse,
    inviteCode: z.string().optional(),
    members: z.array(userResponse).optional(),
    createdAt: z.date(),
    createdBy: z.string(),
  })
  .describe('Family created successfully');

export type AddFamilyResponse = z.infer<typeof familyResponseSchema>;

export const familyMapper = {
  toResponse: (family: Family): AddFamilyResponse => {
    return {
      name: family.name,
      description: family.description,
      owner: userMapper.toResponse(family.owner),
      inviteCode: family.inviteCode,
      members: family.members
        ? family.members.map((member) => userMapper.toResponse(member))
        : undefined,
      createdAt: family.createdAt,
      createdBy: family.createdBy,
    };
  },
};
