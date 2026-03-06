import { inject, injectable } from 'tsyringe';
import type { IConfigService } from '@/application/contracts/services/config-service';
import { hasGroupPermission } from '@/domain/core/logic/permissions';
import type { GroupPermissions } from '@/domain/core/logic/permissions/group/types';
import type { PermissionService } from '@/domain/core/logic/permissions/permission-service';
import type { User } from '@/domain/entities';
import { injection } from '@/main/di/injection-tokens';

const { infra } = injection;

@injectable()
export class SecurityPermissionService implements PermissionService {
  constructor(
    @inject(infra.configService)
    private readonly configService: IConfigService,
  ) {}

  async isAllowed<Resource extends keyof GroupPermissions>(
    user: User,
    action: GroupPermissions[Resource]['action'],
    resource: Resource,
    data: GroupPermissions[Resource]['dataType'],
  ): Promise<boolean> {
    // 1. Check basic group permission (RBAC/ABAC)
    const isAllowedByRole = hasGroupPermission(user, action, resource, data);
    if (!isAllowedByRole) return false;

    // 2. Policy Engine: check dynamic thresholds/settings
    // Future expansion: lookup thresholds from configService here

    return true;
  }
}
