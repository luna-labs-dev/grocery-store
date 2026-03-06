import type { GroupPermissions } from '@/domain/core/logic/permissions';
import { hasGroupPermission } from '@/domain/core/logic/permissions';
import type { CollaborationGroup, User } from '@/domain/entities';
import {
  UnauthorizedGroupOperationException,
  UserNotInGroupException,
} from '@/domain/exceptions';

export class RequesterContext {
  constructor(
    public readonly user: User,
    public readonly group: CollaborationGroup,
  ) {}

  public checkPermission<Resource extends keyof GroupPermissions>(
    action: GroupPermissions[Resource]['action'],
    resource: Resource,
    data: GroupPermissions[Resource]['dataType'] = this.group as any,
  ): void {
    const isMember = this.user.groups?.some((g) => g.groupId === this.group.id);

    if (!isMember) {
      throw new UserNotInGroupException();
    }

    const allowed = hasGroupPermission(this.user, action, resource, data);
    if (!allowed) {
      throw new UnauthorizedGroupOperationException();
    }
  }
}
