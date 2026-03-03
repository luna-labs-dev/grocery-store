import { inject, injectable } from 'tsyringe';
import { z } from 'zod';
import { authWebhooksTypeList } from './types';
import { FastifyController } from '@/api/contracts/fastify-controller';
import type { UserService } from '@/application';
import { getPossibleExceptionsSchemas } from '@/domain';
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
  constructor(
    @inject(usecases.userService)
    private readonly userService: UserService,
  ) {
    super();
  }

  registerRoutes(app: FastifyTypedInstance): void {
    app.post(
      '/add-user',
      {
        schema: {
          tags: [this.prefix],
          summary: 'Clerk - Adiciona um usuario',
          operationId: 'addUser',
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

        await this.userService.addUser({ externalId: data.id });

        reply.status(201).send();
      },
    );
  }
}
