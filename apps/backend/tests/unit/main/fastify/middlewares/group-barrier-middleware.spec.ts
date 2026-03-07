import 'reflect-metadata';
import type { FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { beforeEach, describe, expect, it, type Mocked, vi } from 'vitest';
import { UserService } from '@/application/usecases/user-service';
import { GroupMember, User } from '@/domain/entities';
import {
  UnauthorizedException,
  UserNotMemberOfAnyGroupBarrierException,
} from '@/domain/exceptions';
import { injection } from '@/main/di/injection-tokens';
import { groupBarrierMiddleware } from '@/main/fastify/middlewares/group-barrier-middleware';

vi.mock('@/application/usecases/user-service');

const { usecases, infra } = injection;

describe('groupBarrierMiddleware', () => {
  let userService: Mocked<UserService>;
  let groupRepository: any;

  beforeEach(() => {
    vi.clearAllMocks();
    userService = vi.mocked(new UserService(null as any));
    groupRepository = {
      getById: vi.fn(),
    };

    vi.spyOn(container, 'resolve').mockImplementation((token: any) => {
      if (token === usecases.userService) return userService;
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
      roles: [],
      reputationScore: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    'user-1',
  );

  it('should throw UnauthorizedException if user is not in request', async () => {
    const request = { auth: {} } as any as FastifyRequest;
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
        roles: [],
        reputationScore: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      'user-1',
    );

    userService.getUser.mockResolvedValue(userWithNoGroups);

    const request = { auth: { user: mockUser } } as any as FastifyRequest;
    await expect(groupBarrierMiddleware(request)).rejects.toThrow(
      UserNotMemberOfAnyGroupBarrierException,
    );
  });

  it('should set the first group as active by default', async () => {
    userService.getUser.mockResolvedValue(mockDbUser);
    groupRepository.getById.mockResolvedValue({ id: 'group-1' });

    const request = {
      auth: { user: mockUser },
      headers: {},
    } as any as FastifyRequest;

    await groupBarrierMiddleware(request);

    expect(request.groupId).toBe('group-1');
  });

  it('should set the group from x-group-id header if valid', async () => {
    userService.getUser.mockResolvedValue(mockDbUser);
    groupRepository.getById.mockResolvedValue({ id: 'group-2' });

    const request = {
      auth: { user: mockUser },
      headers: { 'x-group-id': 'group-2' },
    } as any as FastifyRequest;

    await groupBarrierMiddleware(request);

    expect(request.groupId).toBe('group-2');
  });

  it('should fallback to first group if x-group-id is invalid for the user', async () => {
    userService.getUser.mockResolvedValue(mockDbUser);
    groupRepository.getById.mockResolvedValue({ id: 'group-1' });

    const request = {
      auth: { user: mockUser },
      headers: { 'x-group-id': 'not-my-group' },
    } as any as FastifyRequest;

    await groupBarrierMiddleware(request);

    expect(request.groupId).toBe('group-1');
  });
});
