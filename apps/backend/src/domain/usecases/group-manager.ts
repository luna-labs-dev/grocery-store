import type { GroupRole } from '../core/logic/permissions';
import type { RequesterContext } from '../core/requester-context';
import type { CollaborationGroup, GroupMember } from '../entities';

export interface GetInviteInfoResult {
  inviteCode: string;
  joinUrl: string;
}

export interface JoinGroupParams {
  userId: string;
  inviteCode: string;
}

export interface CreateGroupParams {
  userId: string;
  name: string;
  description?: string;
}

export interface UpdateGroupParams {
  name: string;
  description?: string;
}

export interface UpdateMemberRoleParams {
  targetUserId: string;
  role: GroupRole;
}

export interface RemoveMemberParams {
  targetUserId: string;
}

export interface IGroupManager {
  createGroup(params: CreateGroupParams): Promise<CollaborationGroup>;
  getGroups(userId: string): Promise<CollaborationGroup[]>;
  getGroupMembers(groupId: string): Promise<GroupMember[]>;
  getInviteInfo(ctx: RequesterContext): Promise<GetInviteInfoResult>;
  regenerateInviteCode(ctx: RequesterContext): Promise<GetInviteInfoResult>;
  joinGroup(params: JoinGroupParams): Promise<void>;
  leaveGroup(ctx: RequesterContext): Promise<void>;
  removeMember(
    ctx: RequesterContext,
    params: RemoveMemberParams,
  ): Promise<void>;
  updateMemberRole(
    ctx: RequesterContext,
    params: UpdateMemberRoleParams,
  ): Promise<void>;
  updateGroup(
    ctx: RequesterContext,
    params: UpdateGroupParams,
  ): Promise<CollaborationGroup>;
  deleteGroup(ctx: RequesterContext): Promise<void>;
}
