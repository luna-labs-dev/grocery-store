import type { RequesterContext } from '../core/requester-context';

export interface GetInviteInfoResult {
  inviteCode: string;
  joinUrl: string;
}

export interface JoinGroupParams {
  userId: string;
  inviteCode: string;
}

export interface RemoveMemberParams {
  userId: string;
  groupId: string;
  targetUserId: string;
}

export interface IGroupService {
  getInviteInfo(ctx: RequesterContext): Promise<GetInviteInfoResult>;
  joinGroup(params: JoinGroupParams): Promise<void>;
  leaveGroup(ctx: RequesterContext): Promise<void>;
  removeMember(
    ctx: RequesterContext,
    params: RemoveMemberParams,
  ): Promise<void>;
}
