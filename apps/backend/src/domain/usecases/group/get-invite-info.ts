export interface GetInviteInfoParams {
  userId: string;
  groupId: string;
}

export interface GetInviteInfoResult {
  inviteCode: string;
  joinUrl: string;
}
