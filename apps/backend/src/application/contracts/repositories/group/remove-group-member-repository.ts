export interface RemoveGroupMemberParams {
  groupId: string;
  userId: string;
}

export interface RemoveGroupMemberRepository {
  removeMember(params: RemoveGroupMemberParams): Promise<void>;
}
