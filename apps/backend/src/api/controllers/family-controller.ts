import { inject, injectable } from 'tsyringe';
import { z } from 'zod';
import { FastifyController } from '../contracts/fastify-controller';
import {
  addFamilyRequestSchema,
  familyMapper,
  familyResponseSchema,
  joinFamilyRequestSchema,
  removeFamilyMemberRequestSchema,
} from '../helpers';
import type { FamilyService } from '@/application';
import { getPossibleExceptionsSchemas } from '@/domain';
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

@injectable()
export class FamilyController extends FastifyController {
  constructor(
    @inject(usecases.familyService)
    private readonly familyService: FamilyService,
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
          description: 'Get the family of the current user',
          summary: 'Obter família',
          operationId: 'getFamily',
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
        const { userId } = request.auth;

        const family = await this.familyService.getFamily({ userId });

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
          operationId: 'createFamily',
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
        const { userId } = request.auth;

        const family = await this.familyService.addFamily({
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
          operationId: 'joinFamily',
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
        const { userId } = request.auth;

        await this.familyService.joinFamily({ userId, inviteCode });

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
          operationId: 'leaveFamily',
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
        const { userId } = request.auth;

        await this.familyService.leaveFamily({ userId });

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
          operationId: 'removeFamilyMember',
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
        const { userId: authUserId } = request.auth;

        await this.familyService.removeFamilyMember({
          userId: authUserId,
          targetUserId: memberId,
        });

        reply.status(HttpStatusCode.NoContent).send();
      },
    );
  }
}
