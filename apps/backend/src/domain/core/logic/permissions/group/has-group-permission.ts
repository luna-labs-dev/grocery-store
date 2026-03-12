import type { PermissionCheck } from '../base/types';
import { GROUP_ROLES } from './definitions';
import type { GroupPermissions, GroupRole } from './types';
import type { User } from '@/domain/entities';

export function hasGroupPermission<Resource extends keyof GroupPermissions>(
  user: User,
  action: GroupPermissions[Resource]['action'],
  resource: Resource,
  data: GroupPermissions[Resource]['dataType'],
): boolean {
  const groupId =
    'id' in data
      ? (data as { id: string }).id
      : (data as { groupId: string }).groupId;
  const groupRole = user.groups?.find((g) => g.groupId === groupId)?.role;

  if (!groupRole) return false;

  const rolePermissions = GROUP_ROLES[groupRole as GroupRole];
  if (!rolePermissions) return false;

  const resourcePermissions = rolePermissions[resource];
  if (!resourcePermissions) return false;

  const permission = (
    resourcePermissions as Record<string, PermissionCheck<unknown>>
  )[action];

  if (permission == null) return false;
  if (typeof permission === 'boolean') return permission;

  return permission({ user, data });
}
