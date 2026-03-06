import type { GroupRole } from '@/domain/core/logic/permissions/group/types';

export interface UpdateGroupMemberRoleParams {
  groupId: string;
  userId: string;
  role: GroupRole;
}

export interface UpdateGroupMemberRoleRepository {
  updateMemberRole(params: UpdateGroupMemberRoleParams): Promise<void>;
}
