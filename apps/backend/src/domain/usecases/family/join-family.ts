export interface JoinFamilyParams {
  userId: string;
  inviteCode: string;
}

export interface JoinFamily {
  execute(params: JoinFamilyParams): Promise<void>;
}
