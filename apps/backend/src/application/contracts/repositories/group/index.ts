import type { AddGroupRepository } from './add-group-repository';
import type { GetGroupByIdRepository } from './get-group-by-id-repository';
import type { GetGroupByInviteCodeRepository } from './get-group-by-invite-code-repository';
import type { GetGroupMembersRepository } from './get-group-members-repository';
import type { GetGroupsByUserIdRepository } from './get-groups-by-user-id-repository';
import type { UpdateGroupInviteCodeRepository } from './update-group-invite-code-repository';
import type { UpdateGroupRepository } from './update-group-repository';

export type GroupRepositories = AddGroupRepository &
  GetGroupByIdRepository &
  GetGroupByInviteCodeRepository &
  GetGroupMembersRepository &
  GetGroupsByUserIdRepository &
  UpdateGroupInviteCodeRepository &
  UpdateGroupRepository;

export * from './add-group-member-repository';
export * from './add-group-repository';
export * from './get-group-by-id-repository';
export * from './get-group-by-invite-code-repository';
export * from './get-group-members-repository';
export * from './get-groups-by-user-id-repository';
export * from './update-group-invite-code-repository';
export * from './update-group-repository';
