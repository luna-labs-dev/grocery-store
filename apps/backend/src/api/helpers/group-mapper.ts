import type { z } from 'zod';
import type {
  groupInviteResponseSchema,
  groupMemberResponseSchema,
  groupResponseSchema,
} from './group-schemas';
import type { CollaborationGroup, GroupMember } from '@/domain/entities';

export type GroupMemberResponse = z.infer<typeof groupMemberResponseSchema>;
export type GroupResponse = z.infer<typeof groupResponseSchema>;
export type GroupInviteResponse = z.infer<typeof groupInviteResponseSchema>;

export const groupMapper = {
  toMemberResponse: (member: GroupMember): GroupMemberResponse => ({
    userId: member.userId,
    name: member.user?.name,
    image: member.user?.image,
    role: member.role,
    joinedAt: member.joinedAt,
  }),

  toResponse: (
    group: CollaborationGroup,
    members?: GroupMember[],
  ): GroupResponse => ({
    id: group.id,
    name: group.name,
    description: group.description,
    inviteCode: group.inviteCode,
    members: members?.map((m) => groupMapper.toMemberResponse(m)),
    createdAt: group.createdAt,
    createdBy: group.createdBy,
  }),

  toInviteResponse: (data: {
    inviteCode: string;
    joinUrl: string;
  }): GroupInviteResponse => ({
    inviteCode: data.inviteCode,
    joinUrl: data.joinUrl,
  }),
};
