import type { CollaborationGroup } from '@/domain/entities/collaboration-group';

export interface GetGroupsByUserIdRepository {
  getGroups(userId: string): Promise<CollaborationGroup[]>;
}
