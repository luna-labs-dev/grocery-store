import { inject, injectable } from 'tsyringe';
import { z } from 'zod';
import { authWebhooksTypeList } from './types';
import { FastifyController } from '@/api/contracts/fastify-controller';
import { type AddUser, getPossibleExceptionsSchemas } from '@/domain';
import { UserAlreadyExistsException } from '@/domain/exceptions';
import { injection } from '@/main/di/injection-tokens';
import type { FastifyTypedInstance } from '@/main/fastify';

const { usecases } = injection;

const webhookExternalAuthAddUserRequestSchema = z
  .object({
    type: z.enum(authWebhooksTypeList),
    data: z
      .object({
        id: z.string(),
      })
      .loose(),
  })
  .loose();

@injectable()
export class WebhookAuthController extends FastifyController {
  constructor(@inject(usecases.addUser) private readonly addUser: AddUser) {
    super();
  }
  registerRoutes(app: FastifyTypedInstance): void {
    app.post(
      '/add-user',
      {
        schema: {
          tags: [this.prefix],
          summary: 'Clerk - Adiciona um usuario',
          description: 'Adiciona um usuario externo',
          body: webhookExternalAuthAddUserRequestSchema,
          response: {
            201: z.void(),
            ...getPossibleExceptionsSchemas([new UserAlreadyExistsException()]),
          },
        },
      },
      async (request, reply) => {
        const { data } = request.body;

        await this.addUser.execute({ externalId: data.id });

        reply.status(201).send();
      },
    );
  }
}
