import 'reflect-metadata';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { beforeEach, describe, expect, it, type Mocked, vi } from 'vitest';
import { AdminController } from '@/api/controllers/admin-controller';
import type { SettingsRepository } from '@/application/contracts/repositories/settings-repository';

describe('AdminController', () => {
  let adminController: AdminController;
  let settingsRepository: Mocked<SettingsRepository>;

  beforeEach(() => {
    vi.clearAllMocks();
    settingsRepository = {
      getSetting: vi.fn(),
      setSetting: vi.fn(),
      getAllSettings: vi.fn(),
    } as any;
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
      } as any as FastifyRequest;

      const reply = {
        send: vi.fn(),
      } as any as FastifyReply;

      let capturedHandler: any;
      await (adminController as any).registerRoutes({
        addHook: vi.fn(),
        get: async (path: string, _opts: any, handler: any) => {
          if (path === '/groups/:groupId/settings') capturedHandler = handler;
        },
        patch: vi.fn(),
      } as any);

      await capturedHandler(request, reply);

      expect(request.requesterContext.checkPermission).toHaveBeenCalledWith(
        'read',
        'settings',
        { groupId: 'group-1' },
      );
      expect(reply.send).toHaveBeenCalledWith(mockSettings);
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
      } as any as FastifyRequest;

      const reply = {
        status: vi.fn().mockReturnThis(),
        send: vi.fn(),
      } as any as FastifyReply;

      let capturedHandler: any;
      await (adminController as any).registerRoutes({
        addHook: vi.fn(),
        get: vi.fn(),
        patch: async (path: string, _opts: any, handler: any) => {
          if (path === '/groups/:groupId/settings') capturedHandler = handler;
        },
      } as any);

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
