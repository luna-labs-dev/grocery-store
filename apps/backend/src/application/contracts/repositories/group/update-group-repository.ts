import type { CollaborationGroup } from '@/domain/entities/collaboration-group';

export interface UpdateGroupRepository {
  update(group: CollaborationGroup): Promise<void>;
}
