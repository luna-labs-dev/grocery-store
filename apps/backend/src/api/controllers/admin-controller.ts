import { inject, injectable } from 'tsyringe';
import { z } from 'zod';
import { FastifyController } from '../contracts/fastify-controller';
import type { SettingsRepository } from '@/application/contracts/repositories/settings-repository';
import type { RequesterContext } from '@/domain/core/requester-context';
import { injection } from '@/main/di/injection-tokens';
import {
  authMiddleware,
  groupBarrierMiddleware,
} from '@/main/fastify/middlewares';
import type { FastifyTypedInstance } from '@/main/fastify/types';

const { infra } = injection;

@injectable()
export class AdminController extends FastifyController {
  constructor(
    @inject(infra.settingsRepository)
    private readonly settingsRepository: SettingsRepository,
  ) {
    super();
  }

  registerRoutes(app: FastifyTypedInstance): void {
    app.addHook('preHandler', authMiddleware);
    app.addHook('preHandler', groupBarrierMiddleware);

    app.get(
      '/groups/:groupId/settings',
      {
        schema: {
          tags: ['admin'],
          params: z.object({
            groupId: z.string().uuid(),
          }),
        },
      },
      async (request, reply) => {
        const { groupId } = request.params;
        const ctx = request.requesterContext as RequesterContext;

        await ctx.checkPermission('read', 'settings', { groupId });

        const settings = await this.settingsRepository.getAllSettings(groupId);

        return reply.send(settings);
      },
    );

    app.patch(
      '/groups/:groupId/settings',
      {
        schema: {
          tags: ['admin'],
          params: z.object({
            groupId: z.string().uuid(),
          }),
          body: z.record(z.string(), z.any()),
        },
      },
      async (request, reply) => {
        const { groupId } = request.params;
        const ctx = request.requesterContext as RequesterContext;

        await ctx.checkPermission('update', 'settings', { groupId });

        const settings = request.body as Record<string, any>;
        for (const [key, value] of Object.entries(settings)) {
          await this.settingsRepository.setSetting(groupId, key, value);
        }

        return reply.status(204).send();
      },
    );
  }
}
