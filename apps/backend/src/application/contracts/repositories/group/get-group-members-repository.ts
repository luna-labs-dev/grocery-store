import type { GroupMember } from '@/domain/entities/group-member';

export interface GetGroupMembersRepository {
  getMembers(groupId: string): Promise<GroupMember[]>;
}
