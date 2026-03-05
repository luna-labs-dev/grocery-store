import type { GroupMember } from '@/domain/entities/group-member';

export interface AddGroupMemberRepository {
  addMember(member: GroupMember): Promise<void>;
}
