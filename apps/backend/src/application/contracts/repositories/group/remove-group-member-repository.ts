export interface RemoveGroupMemberRepository {
  removeMember(params: { groupId: string; userId: string }): Promise<void>;
}
