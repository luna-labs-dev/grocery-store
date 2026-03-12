import 'reflect-metadata';
import { beforeEach, describe, expect, it, type Mocked, vi } from 'vitest';
import type { IConfigService } from '@/application/contracts/services/config-service';
import { type CollaborationGroup, GroupMember, User } from '@/domain/entities';
import { SecurityPermissionService } from '@/infrastructure/services/security-permission-service';

describe('SecurityPermissionService', () => {
  let service: SecurityPermissionService;
  let configService: Mocked<IConfigService>;

  beforeEach(() => {
    configService = {
      get: vi.fn(),
    } as unknown as Mocked<IConfigService>;
    service = new SecurityPermissionService(configService);
  });

  const mockUser = User.create(
    {
      name: 'Test',
      email: 'test@test.com',
      emailVerified: true,
      roles: ['user'] as unknown as never,
      reputationScore: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
      groups: [
        GroupMember.create({
          groupId: 'group-1',
          userId: 'user-1',
          role: 'member' as unknown as never,
          joinedAt: new Date(),
        }),
      ],
    },
    'user-1',
  );

  it('should allow permission if RBAC check passes', async () => {
    // Member can update shoppingList
    const result = await service.isAllowed(mockUser, 'update', 'shoppingList', {
      id: 'group-1',
    } as unknown as CollaborationGroup);

    expect(result).toBe(true);
  });

  it('should deny permission if RBAC check fails', async () => {
    // User is not in group-2
    const result = await service.isAllowed(mockUser, 'update', 'shoppingList', {
      id: 'group-2',
    } as unknown as CollaborationGroup);

    expect(result).toBe(false);
  });

  it('should deny permission if user is in group but has insufficient role', async () => {
    // Member cannot delete group
    const result = await service.isAllowed(mockUser, 'delete', 'group', {
      id: 'group-1',
    } as unknown as CollaborationGroup);

    expect(result).toBe(false);
  });
});
