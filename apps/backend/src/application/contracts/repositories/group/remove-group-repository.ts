export interface RemoveGroupRepository {
  remove(groupId: string): Promise<void>;
}
