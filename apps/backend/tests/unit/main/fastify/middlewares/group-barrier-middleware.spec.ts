import 'reflect-metadata';
import type { FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { beforeEach, describe, expect, it, type Mocked, vi } from 'vitest';
import type { GroupRepositories } from '@/application/contracts/repositories/group';
import { DbUserManager } from '@/application/usecases/db-user-manager';
import { type CollaborationGroup, GroupMember, User } from '@/domain/entities';
import {
  UnauthorizedException,
  UserNotMemberOfAnyGroupBarrierException,
} from '@/domain/exceptions';
import { injection } from '@/main/di/injection-tokens';
import { groupBarrierMiddleware } from '@/main/fastify/middlewares/group-barrier-middleware';

vi.mock('@/application/usecases/db-user-manager');

const { usecases, infra } = injection;

describe('groupBarrierMiddleware', () => {
  let userManager: Mocked<DbUserManager>;
  let groupRepository: Mocked<GroupRepositories>;

  beforeEach(() => {
    vi.clearAllMocks();
    userManager = vi.mocked(new DbUserManager(null as unknown as never));
    groupRepository = {
      getById: vi.fn(),
    } as unknown as Mocked<GroupRepositories>;

    vi.spyOn(container, 'resolve').mockImplementation((token: unknown) => {
      if (token === usecases.userManager) return userManager;
      if (token === infra.groupRepositories) return groupRepository;
      return null;
    });
  });

  const mockUser = { id: 'user-1' };
  const mockDbUser = User.create(
    {
      email: 'test@test.com',
      emailVerified: true,
      name: 'Test User',
      groups: [
        GroupMember.create({
          groupId: 'group-1',
          userId: 'user-1',
          joinedAt: new Date(),
        }),
        GroupMember.create({
          groupId: 'group-2',
          userId: 'user-1',
          joinedAt: new Date(),
        }),
      ],
      roles: [] as unknown as never,
      reputationScore: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    'user-1',
  );

  it('should throw UnauthorizedException if user is not in request', async () => {
    const request = { auth: {} } as unknown as FastifyRequest;
    await expect(groupBarrierMiddleware(request)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UserNotMemberOfAnyGroupBarrierException if user has no groups', async () => {
    const userWithNoGroups = User.create(
      {
        email: 'test@test.com',
        emailVerified: true,
        name: 'Test User',
        groups: [],
        roles: [] as unknown as never,
        reputationScore: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      'user-1',
    );

    userManager.getUser.mockResolvedValue(userWithNoGroups);

    const request = { auth: { user: mockUser } } as unknown as FastifyRequest;
    await expect(groupBarrierMiddleware(request)).rejects.toThrow(
      UserNotMemberOfAnyGroupBarrierException,
    );
  });

  it('should set the first group as active by default', async () => {
    userManager.getUser.mockResolvedValue(mockDbUser);
    groupRepository.getById.mockResolvedValue({
      id: 'group-1',
    } as unknown as CollaborationGroup);

    const request = {
      auth: { user: mockUser },
      headers: {},
    } as unknown as FastifyRequest;

    await groupBarrierMiddleware(request);

    expect(request.groupId).toBe('group-1');
  });

  it('should set the group from x-group-id header if valid', async () => {
    userManager.getUser.mockResolvedValue(mockDbUser);
    groupRepository.getById.mockResolvedValue({
      id: 'group-2',
    } as unknown as CollaborationGroup);

    const request = {
      auth: { user: mockUser },
      headers: { 'x-group-id': 'group-2' },
    } as unknown as FastifyRequest;

    await groupBarrierMiddleware(request);

    expect(request.groupId).toBe('group-2');
  });

  it('should fallback to first group if x-group-id is invalid for the user', async () => {
    userManager.getUser.mockResolvedValue(mockDbUser);
    groupRepository.getById.mockResolvedValue({
      id: 'group-1',
    } as unknown as CollaborationGroup);

    const request = {
      auth: { user: mockUser },
      headers: { 'x-group-id': 'not-my-group' },
    } as unknown as FastifyRequest;

    await groupBarrierMiddleware(request);

    expect(request.groupId).toBe('group-1');
  });
});
