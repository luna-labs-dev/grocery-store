import type { Family } from '@/domain';

export interface GetFamilyByInviteCodeRepositoryParams {
  inviteCode: string;
}

export interface GetFamilyByInviteCodeRepository {
  getByInviteCode(
    params: GetFamilyByInviteCodeRepositoryParams,
  ): Promise<Family | undefined>;
}
