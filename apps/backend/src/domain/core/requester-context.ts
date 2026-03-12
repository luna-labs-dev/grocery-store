import type { GroupPermissions } from '@/domain/core/logic/permissions';
import type { PermissionService } from '@/domain/core/logic/permissions/permission-service';
import type { CollaborationGroup, User } from '@/domain/entities';
import {
  UnauthorizedGroupOperationException,
  UserNotInGroupException,
} from '@/domain/exceptions';

export class RequesterContext {
  constructor(
    public readonly user: User,
    public readonly group: CollaborationGroup,
    private readonly permissionService: PermissionService,
  ) {}

  public async checkPermission<Resource extends keyof GroupPermissions>(
    action: GroupPermissions[Resource]['action'],
    resource: Resource,
    data: GroupPermissions[Resource]['dataType'] = this
      .group as unknown as GroupPermissions[Resource]['dataType'],
  ): Promise<void> {
    const isMember = this.user.groups?.some((g) => g.groupId === this.group.id);

    if (!isMember) {
      throw new UserNotInGroupException();
    }

    const allowed = await this.permissionService.isAllowed(
      this.user,
      action,
      resource,
      data,
    );
    if (!allowed) {
      throw new UnauthorizedGroupOperationException();
    }
  }
}
