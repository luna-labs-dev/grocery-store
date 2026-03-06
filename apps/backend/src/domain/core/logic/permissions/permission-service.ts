import type { GroupPermissions } from './group/types';
import type { User } from '@/domain/entities';

export interface PermissionService {
  isAllowed<Resource extends keyof GroupPermissions>(
    user: User,
    action: GroupPermissions[Resource]['action'],
    resource: Resource,
    data: GroupPermissions[Resource]['dataType'],
  ): Promise<boolean>;
}
