import { toNodeHandler } from 'better-auth/node';
import type { FastifyPluginOptions } from 'fastify';
import { injectable } from 'tsyringe';
import { FastifyController } from '@/api/contracts/fastify-controller';
import { auth } from '@/main/auth/auth';
import type { FastifyTypedInstance } from '@/main/fastify/types';

@injectable()
export class AuthController extends FastifyController {
  async registerRoutes(app: FastifyTypedInstance, _opts: FastifyPluginOptions) {
    app.all('/*', async (request, reply) => {
      return toNodeHandler(auth)(request.raw, reply.raw);
    });
  }
}
