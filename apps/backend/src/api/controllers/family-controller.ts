import { inject, injectable } from 'tsyringe';
import { z } from 'zod';
import { FastifyController } from '../contracts/fastify-controller';
import { familyMapper, familyResponseSchema } from './helpers';
import {
  type AddFamily,
  type GetFamily,
  getPossibleExceptionsSchemas,
  type JoinFamily,
  type LeaveFamily,
  type RemoveFamilyMember,
} from '@/domain';
import { HttpStatusCode } from '@/domain/core/enums';
import {
  FamilyNotFoundException,
  FamilyOwnerCannotBeRemovedException,
  FamilyWithoutMembersException,
  InvalidFamilyInvitationCodeException,
  TargetUserNotAFamilyMemberException,
  UserAlreadyAFamilyMemberException,
  UserNotAFamilyMemberException,
  UserNotAFamilyOwnerException,
  UserNotFoundException,
} from '@/domain/exceptions';
import { injection } from '@/main/di/injection-tokens';
import { clerkAuthorizationMiddleware } from '@/main/fastify/middlewares';
import type { FastifyTypedInstance } from '@/main/fastify/types';

const { usecases } = injection;

export const addFamilyRequestSchema = z.object({
  name: z.string().max(100).min(3),
  description: z.string().optional(),
});

export const joinFamilyRequestSchema = z.object({
  inviteCode: z.string(),
});

export const removeFamilyMemberRequestSchema = z.object({
  memberId: z.uuid(),
});

@injectable()
export class FamilyController extends FastifyController {
  constructor(
    @inject(usecases.addFamily) private readonly addFamily: AddFamily,
    @inject(usecases.getFamily) private readonly getFamily: GetFamily,
    @inject(usecases.joinFamily) private readonly joinFamily: JoinFamily,
    @inject(usecases.leaveFamily) private readonly leaveFamily: LeaveFamily,
    @inject(usecases.removeFamilyMember)
    private readonly removeFamilyMember: RemoveFamilyMember,
  ) {
    super();
  }

  registerRoutes(app: FastifyTypedInstance): void {
    app.addHook('preHandler', clerkAuthorizationMiddleware);

    app.get(
      '',
      {
        schema: {
          tags: [this.prefix],
          description: 'List all families',
          summary: 'Listar famílias',
          response: {
            ...getPossibleExceptionsSchemas([
              new FamilyNotFoundException(),
              new UserNotFoundException(),
              new UserNotAFamilyMemberException(),
              new FamilyWithoutMembersException(),
            ]),
            [HttpStatusCode.Ok]: familyResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { userId } = request.context.auth;

        const family = await this.getFamily.execute({
          userId,
        });

        const response = familyMapper.toResponse(family);
        reply.status(HttpStatusCode.Ok).send(response);
      },
    );

    app.post(
      '',
      {
        schema: {
          tags: [this.prefix],
          description: 'Create a new family',
          summary: 'Criar família',
          body: addFamilyRequestSchema,
          response: {
            ...getPossibleExceptionsSchemas([
              new UserNotFoundException(),
              new UserAlreadyAFamilyMemberException(),
            ]),
            [HttpStatusCode.Created]: familyResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { name, description } = request.body;
        const { userId } = request.context.auth;

        const family = await this.addFamily.execute({
          userId,
          name,
          description,
        });

        const response = familyMapper.toResponse(family);
        reply.status(HttpStatusCode.Created).send(response);
      },
    );

    app.put(
      '/members/join',
      {
        schema: {
          tags: [this.prefix],
          description: 'Join a family',
          summary: 'Entrar em uma família',
          body: joinFamilyRequestSchema,
          response: {
            ...getPossibleExceptionsSchemas([
              new UserNotFoundException(),
              new InvalidFamilyInvitationCodeException(),
              new UserAlreadyAFamilyMemberException(),
            ]),
            [HttpStatusCode.NoContent]: z
              .never()
              .describe('Joined the family successfully'),
          },
        },
      },
      async (request, reply) => {
        const { inviteCode } = request.body;
        const { userId } = request.context.auth;

        await this.joinFamily.execute({
          userId,
          inviteCode,
        });

        reply.status(HttpStatusCode.NoContent).send();
      },
    );

    app.put(
      '/members/leave',
      {
        schema: {
          tags: [this.prefix],
          description: 'Leave a family',
          summary: 'Sair da família',
          response: {
            ...getPossibleExceptionsSchemas([
              new UserNotFoundException(),
              new UserNotAFamilyMemberException(),
            ]),
            [HttpStatusCode.NoContent]: z
              .never()
              .describe('Left the family successfully'),
          },
        },
      },
      async (request, reply) => {
        const { userId } = request.context.auth;

        await this.leaveFamily.execute({
          userId,
        });

        reply.status(HttpStatusCode.NoContent).send();
      },
    );

    app.delete(
      '/members/remove/:memberId',
      {
        schema: {
          tags: [this.prefix],
          description: 'Remove a family member',
          summary: 'Remover membro',
          params: removeFamilyMemberRequestSchema,
          response: {
            ...getPossibleExceptionsSchemas([
              new UserNotFoundException(),
              new FamilyNotFoundException(),
              new UserNotAFamilyMemberException(),
              new UserNotAFamilyOwnerException(),
              new FamilyOwnerCannotBeRemovedException(),
              new TargetUserNotAFamilyMemberException(),
            ]),
            [HttpStatusCode.NoContent]: z
              .never()
              .describe('Removed the family member successfully'),
          },
        },
      },
      async (request, reply) => {
        const { memberId } = request.params;
        const { userId: authUserId } = request.context.auth;

        await this.removeFamilyMember.execute({
          userId: authUserId,
          targetUserId: memberId,
        });

        reply.status(HttpStatusCode.NoContent).send();
      },
    );
  }
}
