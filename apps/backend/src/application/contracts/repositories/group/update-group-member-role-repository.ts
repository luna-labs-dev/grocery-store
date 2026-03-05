import type { GroupRole } from '@/domain/core/enums';

export interface UpdateGroupMemberRoleRepository {
  updateMemberRole(params: {
    groupId: string;
    userId: string;
    role: GroupRole;
  }): Promise<void>;
}
