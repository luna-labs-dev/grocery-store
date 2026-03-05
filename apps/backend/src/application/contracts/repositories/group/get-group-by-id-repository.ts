import type { CollaborationGroup } from '@/domain/entities/collaboration-group';

export interface GetGroupByIdRepository {
  getById(id: string): Promise<CollaborationGroup | undefined>;
}
