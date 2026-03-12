import 'reflect-metadata';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { beforeEach, describe, expect, it, type Mocked, vi } from 'vitest';
import { GroupController } from '@/api/controllers/group-controller';
import { GroupService } from '@/application/usecases/group-service';
import { CollaborationGroup } from '@/domain/entities';
import { LastOwnerCannotLeaveException } from '@/domain/exceptions';

// Mock everything from helpers to ensure groupMapper is controlled
vi.mock('@/api/helpers', async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();
  return {
    ...actual,
    groupMapper: {
      toResponse: vi.fn().mockImplementation((g) => ({
        id: g.id,
        name: g.name || g.props?.name, // Support both real and mock props
        createdAt: g.createdAt,
        createdBy: g.createdBy,
      })),
      toMemberResponse: vi.fn(),
    },
  };
});

vi.mock('@/application/usecases/group-service');

describe('GroupController Integration', () => {
  let groupController: GroupController;
  let groupService: Mocked<GroupService>;

  beforeEach(() => {
    vi.clearAllMocks();
    groupService = new GroupService(
      null as unknown as never,
      null as unknown as never,
    ) as Mocked<GroupService>;
    container.registerInstance('GroupService', groupService);
    groupController = new GroupController(groupService);
  });

  const mockUser = { id: 'user-1' };
  const mockGroup = CollaborationGroup.create(
    {
      name: 'Test Group',
      createdBy: 'user-1',
      createdAt: new Date(),
    },
    'group-1',
  );

  describe('getGroups', () => {
    it('should return all groups for the user', async () => {
      groupService.getGroups.mockResolvedValue([mockGroup]);

      const request = {
        auth: { user: mockUser },
      } as unknown as FastifyRequest;

      const reply = {
        status: vi.fn().mockReturnThis(),
        send: vi.fn(),
      } as unknown as FastifyReply;

      let capturedHandler: (
        req: FastifyRequest,
        res: FastifyReply,
      ) => Promise<void> = async () => {};

      await groupController.registerRoutes({
        addHook: vi.fn(),
        get: async (path: string, _opts: unknown, handler: unknown) => {
          if (path === '') {
            capturedHandler = handler as typeof capturedHandler;
          }
        },
        post: vi.fn(),
        delete: vi.fn(),
        patch: vi.fn(),
      } as unknown as FastifyInstance);

      await capturedHandler(request, reply);

      expect(reply.status).toHaveBeenCalledWith(200);
      expect(reply.send).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ id: 'group-1', name: 'Test Group' }),
        ]),
      );
    });
  });

  describe('createGroup', () => {
    it('should create a group and return it', async () => {
      groupService.createGroup.mockResolvedValue(mockGroup);

      const request = {
        auth: { user: mockUser },
        body: { name: 'New Group' },
      } as unknown as FastifyRequest;

      const reply = {
        status: vi.fn().mockReturnThis(),
        send: vi.fn(),
      } as unknown as FastifyReply;

      let capturedHandler: (
        req: FastifyRequest,
        res: FastifyReply,
      ) => Promise<void> = async () => {};

      await groupController.registerRoutes({
        addHook: vi.fn(),
        get: vi.fn(),
        post: async (path: string, _opts: unknown, handler: unknown) => {
          if (path === '') {
            capturedHandler = handler as typeof capturedHandler;
          }
        },
        delete: vi.fn(),
        patch: vi.fn(),
      } as unknown as FastifyInstance);

      await capturedHandler(request, reply);

      expect(groupService.createGroup).toHaveBeenCalledWith({
        userId: 'user-1',
        name: 'New Group',
        description: undefined,
      });
      expect(reply.status).toHaveBeenCalledWith(201);
    });
  });

  describe('leaveGroup', () => {
    it('should throw error if service fails', async () => {
      groupService.leaveGroup.mockRejectedValue(
        new LastOwnerCannotLeaveException(),
      );

      const request = {
        auth: { user: mockUser },
        params: { groupId: 'group-1' },
        requesterContext: { user: mockUser, group: mockGroup },
      } as unknown as FastifyRequest;

      const reply = {
        status: vi.fn().mockReturnThis(),
        send: vi.fn(),
      } as unknown as FastifyReply;

      const runHandler = async () => {
        let capturedHandler: (
          req: FastifyRequest,
          res: FastifyReply,
        ) => Promise<void> = async () => {};

        await groupController.registerRoutes({
          addHook: vi.fn(),
          get: vi.fn(),
          post: async (path: string, _opts: unknown, handler: unknown) => {
            if (path === '/:groupId/leave') {
              capturedHandler = handler as typeof capturedHandler;
            }
          },
          delete: vi.fn(),
          patch: vi.fn(),
        } as unknown as FastifyInstance);
        await capturedHandler(request, reply);
      };

      await expect(runHandler()).rejects.toThrow(LastOwnerCannotLeaveException);
    });
  });

  describe('Role Management (RBAC)', () => {
    it('should call updateMemberRole with correct parameters', async () => {
      const request = {
        auth: { user: mockUser },
        params: { groupId: 'group-1', memberId: 'user-2' },
        body: { role: 'ADMIN' },
        requesterContext: { user: mockUser, group: mockGroup },
      } as unknown as FastifyRequest;

      const reply = {
        status: vi.fn().mockReturnThis(),
        send: vi.fn(),
      } as unknown as FastifyReply;

      let capturedHandler: (
        req: FastifyRequest,
        res: FastifyReply,
      ) => Promise<void> = async () => {};

      await groupController.registerRoutes({
        addHook: vi.fn(),
        get: vi.fn(),
        post: vi.fn(),
        delete: vi.fn(),
        patch: async (path: string, _opts: unknown, handler: unknown) => {
          if (path === '/:groupId/members/:memberId/role') {
            capturedHandler = handler as typeof capturedHandler;
          }
        },
      } as unknown as FastifyInstance);

      await capturedHandler(request, reply);

      expect(groupService.updateMemberRole).toHaveBeenCalledWith(
        request.requesterContext,
        {
          targetUserId: 'user-2',
          role: 'ADMIN',
        },
      );
      expect(reply.status).toHaveBeenCalledWith(204);
    });
  });
});
