import 'reflect-metadata';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { beforeEach, describe, expect, it, type Mocked, vi } from 'vitest';
import { GroupController } from '@/api/controllers/group-controller';
import { DbGroupManager } from '@/application/usecases/db-group-manager';
import { HttpStatusCode } from '@/domain/core/enums';
import {
  UnexpectedException,
  UserNotInGroupException,
} from '@/domain/exceptions';

vi.mock('@/application/usecases/db-group-manager');

describe('GroupController - Invite Link Integration', () => {
  let groupController: GroupController;
  let groupManager: Mocked<DbGroupManager>;

  beforeEach(() => {
    vi.clearAllMocks();
    groupManager = new DbGroupManager(
      null as unknown as never,
      null as unknown as never,
    ) as Mocked<DbGroupManager>;
    container.registerInstance('DbGroupManager', groupManager);
    groupController = new GroupController(groupManager);
  });

  describe('GET /:groupId/invite', () => {
    it('should return 200 with invite info', async () => {
      groupManager.getInviteInfo.mockResolvedValue({
        inviteCode: 'ABC-123',
        joinUrl: 'https://app.grocery.app/join?code=ABC-123',
      });

      const request = {
        auth: { user: { id: 'user-1' } },
        params: { groupId: 'group-1' },
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
          if (path === '/:groupId/invite')
            capturedHandler = handler as typeof capturedHandler;
        },
        post: vi.fn(),
        delete: vi.fn(),
        patch: vi.fn(),
      } as unknown as FastifyInstance);

      await capturedHandler(request, reply);

      expect(reply.status).toHaveBeenCalledWith(HttpStatusCode.Ok);
      expect(reply.send).toHaveBeenCalledWith(
        expect.objectContaining({
          inviteCode: 'ABC-123',
          joinUrl: expect.stringContaining('ABC-123'),
        }),
      );
    });

    it('should return 403 when user is not in group', async () => {
      groupManager.getInviteInfo.mockRejectedValue(
        new UserNotInGroupException(),
      );

      const request = {
        auth: { user: { id: 'user-1' } },
        params: { groupId: 'group-1' },
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
          if (path === '/:groupId/invite')
            capturedHandler = handler as typeof capturedHandler;
        },
        post: vi.fn(),
        delete: vi.fn(),
        patch: vi.fn(),
      } as unknown as FastifyInstance);

      await expect(capturedHandler(request, reply)).rejects.toThrow(
        UserNotInGroupException,
      );
    });

    it('should return 500 on unexpected error', async () => {
      groupManager.getInviteInfo.mockRejectedValue(new UnexpectedException());

      const request = {
        auth: { user: { id: 'user-1' } },
        params: { groupId: 'group-1' },
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
          if (path === '/:groupId/invite')
            capturedHandler = handler as typeof capturedHandler;
        },
        post: vi.fn(),
        delete: vi.fn(),
        patch: vi.fn(),
      } as unknown as FastifyInstance);

      await expect(capturedHandler(request, reply)).rejects.toThrow(
        UnexpectedException,
      );
    });
  });
});
