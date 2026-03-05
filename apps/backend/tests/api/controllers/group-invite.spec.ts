import 'reflect-metadata';
import { describe, expect, it, vi, beforeEach, type Mocked } from 'vitest';
import { container } from 'tsyringe';
import { GroupController } from '@/api/controllers/group-controller';
import { GroupService } from '@/application/usecases/group-service';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { UserNotInGroupException, UnexpectedException } from '@/domain/exceptions';
import { HttpStatusCode } from '@/domain/core/enums';

vi.mock('@/application/usecases/group-service');

describe('GroupController - Invite Link Integration', () => {
  let groupController: GroupController;
  let groupService: Mocked<GroupService>;

  beforeEach(() => {
    vi.clearAllMocks();
    groupService = new GroupService(null as any, null as any) as any;
    container.registerInstance('GroupService', groupService);
    groupController = new GroupController(groupService);
  });

  describe('GET /:groupId/invite', () => {
    it('should return 200 with invite info', async () => {
      groupService.getInviteInfo.mockResolvedValue({
        inviteCode: 'ABC-123',
        joinUrl: 'https://app.grocery.app/join?code=ABC-123'
      });

      const request = {
        auth: { user: { id: 'user-1' } },
        params: { groupId: 'group-1' }
      } as any as FastifyRequest;

      const reply = {
        status: vi.fn().mockReturnThis(),
        send: vi.fn(),
      } as any as FastifyReply;

      let capturedHandler: any;
      await (groupController as any).registerRoutes({ 
        addHook: vi.fn(), 
        get: async (path: string, opts: any, handler: any) => {
          if (path === '/:groupId/invite') capturedHandler = handler;
        },
        post: vi.fn(),
        delete: vi.fn(),
        patch: vi.fn()
      } as any);

      await capturedHandler(request, reply);

      expect(reply.status).toHaveBeenCalledWith(HttpStatusCode.Ok);
      expect(reply.send).toHaveBeenCalledWith(expect.objectContaining({
        inviteCode: 'ABC-123',
        joinUrl: expect.stringContaining('ABC-123')
      }));
    });

    it('should return 403 when user is not in group', async () => {
      groupService.getInviteInfo.mockRejectedValue(new UserNotInGroupException());

      const request = {
        auth: { user: { id: 'user-1' } },
        params: { groupId: 'group-1' }
      } as any as FastifyRequest;

      const reply = {
        status: vi.fn().mockReturnThis(),
        send: vi.fn(),
      } as any as FastifyReply;

      let capturedHandler: any;
      await (groupController as any).registerRoutes({ 
        addHook: vi.fn(), 
        get: async (path: string, opts: any, handler: any) => {
          if (path === '/:groupId/invite') capturedHandler = handler;
        },
        post: vi.fn(),
        delete: vi.fn(),
        patch: vi.fn()
      } as any);

      await expect(capturedHandler(request, reply)).rejects.toThrow(UserNotInGroupException);
    });

    it('should return 500 on unexpected error', async () => {
      groupService.getInviteInfo.mockRejectedValue(new UnexpectedException());

      const request = {
        auth: { user: { id: 'user-1' } },
        params: { groupId: 'group-1' }
      } as any as FastifyRequest;

      const reply = {
        status: vi.fn().mockReturnThis(),
        send: vi.fn(),
      } as any as FastifyReply;

      let capturedHandler: any;
      await (groupController as any).registerRoutes({ 
        addHook: vi.fn(), 
        get: async (path: string, opts: any, handler: any) => {
          if (path === '/:groupId/invite') capturedHandler = handler;
        },
        post: vi.fn(),
        delete: vi.fn(),
        patch: vi.fn()
      } as any);

      await expect(capturedHandler(request, reply)).rejects.toThrow(UnexpectedException);
    });
  });
});
