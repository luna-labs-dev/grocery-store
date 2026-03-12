import 'reflect-metadata';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { beforeEach, describe, expect, it, type Mocked, vi } from 'vitest';
import { AdminController } from '@/api/controllers/admin-controller';
import type { SettingsRepository } from '@/application/contracts/repositories/settings-repository';
import { UnauthorizedGroupOperationException } from '@/domain/exceptions';

describe('AdminController', () => {
  let adminController: AdminController;
  let settingsRepository: Mocked<SettingsRepository>;

  beforeEach(() => {
    vi.clearAllMocks();
    settingsRepository = {
      getSetting: vi.fn(),
      setSetting: vi.fn(),
      getAllSettings: vi.fn(),
    } as unknown as Mocked<SettingsRepository>;

    container.registerInstance('SettingsRepository', settingsRepository);
    adminController = new AdminController(settingsRepository);
  });

  describe('GET /groups/:groupId/settings', () => {
    it('should return settings for the group', async () => {
      const mockSettings = { THRESHOLD: '100' };
      settingsRepository.getAllSettings.mockResolvedValue(mockSettings);

      const request = {
        params: { groupId: 'group-1' },
        requesterContext: {
          checkPermission: vi.fn().mockResolvedValue(undefined),
        },
      } as unknown as FastifyRequest;

      const reply = {
        status: vi.fn().mockReturnThis(),
        send: vi.fn(),
      } as unknown as FastifyReply;

      let capturedHandler: (
        req: FastifyRequest,
        res: FastifyReply,
      ) => Promise<void> = async () => {};

      await adminController.registerRoutes({
        addHook: vi.fn(),
        get: async (path: string, _opts: unknown, handler: unknown) => {
          if (path === '/groups/:groupId/settings') {
            capturedHandler = handler as typeof capturedHandler;
          }
        },
        patch: vi.fn(),
        post: vi.fn(),
        delete: vi.fn(),
      } as unknown as FastifyInstance);

      await capturedHandler(request, reply);

      expect(request.requesterContext.checkPermission).toHaveBeenCalledWith(
        'read',
        'settings',
        { groupId: 'group-1' },
      );
      expect(reply.send).toHaveBeenCalledWith(mockSettings);
    });

    it('should throw if permission is denied', async () => {
      const request = {
        params: { groupId: 'group-1' },
        requesterContext: {
          checkPermission: vi
            .fn()
            .mockRejectedValue(new UnauthorizedGroupOperationException()),
        },
      } as unknown as FastifyRequest;

      const reply = {
        status: vi.fn().mockReturnThis(),
        send: vi.fn(),
      } as unknown as FastifyReply;

      let capturedHandler: (
        req: FastifyRequest,
        res: FastifyReply,
      ) => Promise<void> = async () => {};

      await adminController.registerRoutes({
        addHook: vi.fn(),
        get: async (path: string, _opts: unknown, handler: unknown) => {
          if (path === '/groups/:groupId/settings') {
            capturedHandler = handler as typeof capturedHandler;
          }
        },
        patch: vi.fn(),
        post: vi.fn(),
        delete: vi.fn(),
      } as unknown as FastifyInstance);

      await expect(capturedHandler(request, reply)).rejects.toThrow(
        UnauthorizedGroupOperationException,
      );
    });
  });

  describe('PATCH /groups/:groupId/settings', () => {
    it('should update settings and return 204', async () => {
      const request = {
        params: { groupId: 'group-1' },
        body: { THRESHOLD: 200 },
        requesterContext: {
          checkPermission: vi.fn().mockResolvedValue(undefined),
        },
      } as unknown as FastifyRequest;

      const reply = {
        status: vi.fn().mockReturnThis(),
        send: vi.fn(),
      } as unknown as FastifyReply;

      let capturedHandler: (
        req: FastifyRequest,
        res: FastifyReply,
      ) => Promise<void> = async () => {};

      await adminController.registerRoutes({
        addHook: vi.fn(),
        get: vi.fn(),
        patch: async (path: string, _opts: unknown, handler: unknown) => {
          if (path === '/groups/:groupId/settings') {
            capturedHandler = handler as typeof capturedHandler;
          }
        },
        post: vi.fn(),
        delete: vi.fn(),
      } as unknown as FastifyInstance);

      await capturedHandler(request, reply);

      expect(request.requesterContext.checkPermission).toHaveBeenCalledWith(
        'update',
        'settings',
        { groupId: 'group-1' },
      );
      expect(settingsRepository.setSetting).toHaveBeenCalledWith(
        'group-1',
        'THRESHOLD',
        200,
      );
      expect(reply.status).toHaveBeenCalledWith(204);
    });
  });
});
