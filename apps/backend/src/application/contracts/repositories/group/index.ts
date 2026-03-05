import type { AddGroupMemberRepository } from './add-group-member-repository';
import type { AddGroupRepository } from './add-group-repository';
import type { GetGroupByIdRepository } from './get-group-by-id-repository';
import type { GetGroupByInviteCodeRepository } from './get-group-by-invite-code-repository';
import type { GetGroupMembersRepository } from './get-group-members-repository';
import type { GetGroupsByUserIdRepository } from './get-groups-by-user-id-repository';
import type { RemoveGroupMemberRepository } from './remove-group-member-repository';
import type { UpdateGroupInviteCodeRepository } from './update-group-invite-code-repository';
import type { UpdateGroupMemberRoleRepository } from './update-group-member-role-repository';

export type GroupRepositories = AddGroupRepository &
  GetGroupByIdRepository &
  GetGroupByInviteCodeRepository &
  AddGroupMemberRepository &
  RemoveGroupMemberRepository &
  UpdateGroupMemberRoleRepository &
  GetGroupMembersRepository &
  GetGroupsByUserIdRepository &
  UpdateGroupInviteCodeRepository;

export * from './add-group-member-repository';
export * from './add-group-repository';
export * from './get-group-by-id-repository';
export * from './get-group-by-invite-code-repository';
export * from './get-group-members-repository';
export * from './get-groups-by-user-id-repository';
export * from './remove-group-member-repository';
export * from './update-group-invite-code-repository';
export * from './update-group-member-role-repository';
