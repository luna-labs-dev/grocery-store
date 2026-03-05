export interface UpdateGroupInviteCodeRepository {
  updateInviteCode(groupId: string, inviteCode: string): Promise<void>;
}
