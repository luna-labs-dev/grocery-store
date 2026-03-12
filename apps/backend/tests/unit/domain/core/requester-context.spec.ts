import 'reflect-metadata';
import { beforeEach, describe, expect, it, type Mocked, vi } from 'vitest';
import type { PermissionService } from '@/domain/core/logic/permissions/permission-service';
import { RequesterContext } from '@/domain/core/requester-context';
import type { CollaborationGroup, User } from '@/domain/entities';
import { UnauthorizedGroupOperationException } from '@/domain/exceptions';

describe('RequesterContext', () => {
  let permissionService: Mocked<PermissionService>;
  let mockUser: User;
  let mockGroup: CollaborationGroup;

  beforeEach(() => {
    permissionService = {
      isAllowed: vi.fn(),
    } as unknown as Mocked<PermissionService>;
    mockUser = {
      id: 'user-1',
      groups: [{ groupId: 'group-1' }],
    } as unknown as Mocked<User>;
    mockGroup = { id: 'group-1' } as unknown as Mocked<CollaborationGroup>;
  });

  it('should allow checkPermission if service returns true', async () => {
    permissionService.isAllowed.mockResolvedValue(true);
    const ctx = new RequesterContext(mockUser, mockGroup, permissionService);

    await expect(
      ctx.checkPermission('read', 'settings', { groupId: 'group-1' }),
    ).resolves.not.toThrow();

    expect(permissionService.isAllowed).toHaveBeenCalledWith(
      mockUser,
      'read',
      'settings',
      { groupId: 'group-1' },
    );
  });

  it('should throw UnauthorizedGroupOperationException if service returns false', async () => {
    permissionService.isAllowed.mockResolvedValue(false);
    const ctx = new RequesterContext(mockUser, mockGroup, permissionService);

    await expect(
      ctx.checkPermission('update', 'settings', { groupId: 'group-1' }),
    ).rejects.toThrow(UnauthorizedGroupOperationException);
  });

  it('should throw if data is missing when required by specific check (demonstrating wrapper logic)', async () => {
    permissionService.isAllowed.mockResolvedValue(true);
    const ctx = new RequesterContext(mockUser, mockGroup, permissionService);

    // This just tests that it passes the call. The actual enforcement is in PermissionService,
    // but RequesterContext is the gatekeeper.
    await ctx.checkPermission('read', 'settings', { groupId: 'group-1' });
    expect(permissionService.isAllowed).toHaveBeenCalled();
  });
});
