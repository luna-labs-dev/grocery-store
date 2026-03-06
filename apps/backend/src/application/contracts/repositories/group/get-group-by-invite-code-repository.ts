import type { CollaborationGroup } from '@/domain/entities/collaboration-group';

export interface GetGroupByInviteCodeParams {
  inviteCode: string;
}

export interface GetGroupByInviteCodeRepository {
  getByInviteCode(
    params: GetGroupByInviteCodeParams,
  ): Promise<CollaborationGroup | undefined>;
}
