export interface RemoveFamilyMemberParams {
  targetUserId: string;
  userId: string;
}

export interface RemoveFamilyMember {
  execute(params: RemoveFamilyMemberParams): Promise<void>;
}
