import { inject, injectable } from 'tsyringe';
import { z } from 'zod';
import { FastifyController } from '../contracts/fastify-controller';
import { familyMapper } from './family/helpers';
import type { AddFamily } from '@/domain';
import { injection } from '@/main/di/injection-tokens';
import { clerkAuthorizationMiddleware } from '@/main/fastify/middlewares';
import type { FastifyTypedInstance } from '@/main/fastify/types';

const { usecases } = injection;

export const addFamilyRequestSchema = z.object({
  name: z.string().max(100).min(3),
  description: z.string().optional(),
});

export const userResponse = z.object({
  id: z.string(),
  externalId: z.string(),
  name: z.string().optional(),
  picture: z.string().optional(),
  email: z.string(),
});
export const addFamilyResponseSchema = z
  .object({
    name: z.string().max(100).min(3),
    description: z.string().optional(),
    owner: userResponse,
    inviteCode: z.string().optional(),
    members: z.array(userResponse).optional(),
    createdAt: z.date(),
    createdBy: z.string(),
  })
  .describe('Family created successfully');

@injectable()
export class FamilyController extends FastifyController {
  constructor(
    @inject(usecases.addFamily) private readonly addFamily: AddFamily,
  ) {
    super();
  }

  registerRoutes(app: FastifyTypedInstance): void {
    app.post(
      '/families',
      {
        preHandler: clerkAuthorizationMiddleware,
        schema: {
          tags: ['families'],
          description: 'Create a new family',
          body: addFamilyRequestSchema,
          response: {
            200: addFamilyResponseSchema,
            400: z.never().describe('Family already exists'),
            401: z.never().describe('Unauthorized'),
          },
        },
      },
      async (request, reply) => {
        const { auth, body } = request;

        const { name, description } = body;
        const { userId } = auth;

        const family = await this.addFamily.execute({
          userId,
          name,
          description,
        });

        const response = familyMapper.toResponse(family);
        reply.status(200).send(response);
      },
    );
  }
}
