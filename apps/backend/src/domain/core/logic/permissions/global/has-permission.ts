import type { PermissionCheck } from '../base/types';
import { GLOBAL_ROLES } from './definitions';
import type { GlobalPermissions } from './types';
import type { User } from '@/domain/entities';

export function hasPermission<Resource extends keyof GlobalPermissions>(
  user: User,
  action: GlobalPermissions[Resource]['action'],
  resource: Resource,
  data?: GlobalPermissions[Resource]['dataType'],
): boolean {
  return user.roles.some((role) => {
    const rolePermissions = GLOBAL_ROLES[role];
    if (!rolePermissions) return false;

    const resourcePermissions = rolePermissions[resource];
    if (!resourcePermissions) return false;

    const permission = (
      resourcePermissions as Record<string, PermissionCheck<unknown>>
    )[action];

    if (permission == null) return false;
    if (typeof permission === 'boolean') return permission;

    return permission({ user, data });
  });
}
