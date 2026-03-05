import type { CollaborationGroup } from '@/domain/entities/collaboration-group';

export interface GetGroupByInviteCodeRepository {
  getByInviteCode(params: {
    inviteCode: string;
  }): Promise<CollaborationGroup | undefined>;
}
