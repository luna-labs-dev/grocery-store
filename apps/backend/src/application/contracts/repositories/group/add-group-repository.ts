import type { CollaborationGroup } from '@/domain/entities/collaboration-group';

export interface AddGroupRepository {
  add(group: CollaborationGroup): Promise<void>;
}
