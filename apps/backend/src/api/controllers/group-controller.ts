import { inject, injectable } from 'tsyringe';
import { z } from 'zod';
import { FastifyController } from '../contracts/fastify-controller';
import {
  createGroupRequestSchema,
  groupInviteResponseSchema,
  groupMapper,
  groupParamsSchema,
  groupResponseSchema,
  joinGroupRequestSchema,
  removeMemberParamsSchema,
  updateMemberRoleRequestSchema,
} from '../helpers';
import type { GroupService } from '@/application';
import { getPossibleExceptionsSchemas } from '@/domain';
import { HttpStatusCode } from '@/domain/core/enums';
import {
  InvalidGroupInvitationCodeException,
  LastOwnerCannotLeaveException,
  UnauthorizedGroupOperationException,
  UserNotFoundException,
  UserNotInGroupException,
} from '@/domain/exceptions';
import { injection } from '@/main/di/injection-tokens';
import {
  authMiddleware,
  groupBarrierMiddleware,
} from '@/main/fastify/middlewares';
import type { FastifyTypedInstance } from '@/main/fastify/types';

const { usecases } = injection;

@injectable()
export class GroupController extends FastifyController {
  constructor(
    @inject(usecases.groupService)
    private readonly groupService: GroupService,
  ) {
    super();
  }

  registerRoutes(app: FastifyTypedInstance): void {
    app.addHook('preHandler', authMiddleware);

    app.get(
      '',
      {
        schema: {
          tags: [this.prefix],
          description: 'Get all groups the current user belongs to',
          summary: 'Listar grupos',
          operationId: 'getGroups',
          response: {
            [HttpStatusCode.Ok]: groupResponseSchema.array(),
          },
        },
      },
      async (request, reply) => {
        const { user } = request.auth;
        const groups = await this.groupService.getGroups(user.id);
        const response = groups.map((g) => groupMapper.toResponse(g));
        reply.status(HttpStatusCode.Ok).send(response);
      },
    );

    app.post(
      '',
      {
        schema: {
          tags: [this.prefix],
          description: 'Create a new collaboration group',
          summary: 'Criar grupo',
          operationId: 'createGroup',
          body: createGroupRequestSchema,
          response: {
            ...getPossibleExceptionsSchemas([new UserNotFoundException()]),
            [HttpStatusCode.Created]: groupResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { name, description } = request.body;
        const { user } = request.auth;

        const group = await this.groupService.createGroup({
          userId: user.id,
          name,
          description,
        });

        const response = groupMapper.toResponse(group);
        reply.status(HttpStatusCode.Created).send(response);
      },
    );

    app.post(
      '/join',
      {
        schema: {
          tags: [this.prefix],
          description: 'Join a group using an invite code',
          summary: 'Entrar no grupo',
          operationId: 'joinGroup',
          body: joinGroupRequestSchema,
          response: {
            ...getPossibleExceptionsSchemas([
              new UserNotFoundException(),
              new InvalidGroupInvitationCodeException(),
            ]),
            [HttpStatusCode.NoContent]: z
              .never()
              .describe('Joined the group successfully'),
          },
        },
      },
      async (request, reply) => {
        const { inviteCode } = request.body;
        const { user } = request.auth;

        await this.groupService.joinGroup({ userId: user.id, inviteCode });
        reply.status(HttpStatusCode.NoContent).send();
      },
    );

    app.post(
      '/:groupId/leave',
      {
        preHandler: [groupBarrierMiddleware],
        schema: {
          tags: [this.prefix],
          description: 'Leave a collaboration group',
          summary: 'Sair do grupo',
          operationId: 'leaveGroup',
          params: groupParamsSchema,
          response: {
            ...getPossibleExceptionsSchemas([
              new UserNotInGroupException(),
              new LastOwnerCannotLeaveException(),
            ]),
            [HttpStatusCode.NoContent]: z
              .never()
              .describe('Left the group successfully'),
          },
        },
      },
      async (request, reply) => {
        const { requesterContext } = request;

        await this.groupService.leaveGroup(requesterContext);
        reply.status(HttpStatusCode.NoContent).send();
      },
    );

    app.delete(
      '/:groupId/members/:memberId',
      {
        preHandler: [groupBarrierMiddleware],
        schema: {
          tags: [this.prefix],
          description: 'Remove a member from the group (RBAC required)',
          summary: 'Remover membro',
          operationId: 'removeMember',
          params: removeMemberParamsSchema.merge(groupParamsSchema),
          response: {
            ...getPossibleExceptionsSchemas([
              new UnauthorizedGroupOperationException(),
              new UserNotInGroupException(),
            ]),
            [HttpStatusCode.NoContent]: z
              .never()
              .describe('Removed the member successfully'),
          },
        },
      },
      async (request, reply) => {
        const { memberId } = request.params;
        const { requesterContext } = request;

        await this.groupService.removeMember(requesterContext, {
          targetUserId: memberId,
        });
        reply.status(HttpStatusCode.NoContent).send();
      },
    );

    app.patch(
      '/:groupId/members/:memberId/role',
      {
        preHandler: [groupBarrierMiddleware],
        schema: {
          tags: [this.prefix],
          description: "Update a member's role (RBAC required)",
          summary: 'Alterar cargo',
          operationId: 'updateMemberRole',
          params: removeMemberParamsSchema.merge(groupParamsSchema),
          body: updateMemberRoleRequestSchema,
          response: {
            ...getPossibleExceptionsSchemas([
              new UnauthorizedGroupOperationException(),
              new UserNotInGroupException(),
            ]),
            [HttpStatusCode.NoContent]: z
              .never()
              .describe('Role updated successfully'),
          },
        },
      },
      async (request, reply) => {
        const { memberId } = request.params;
        const { role } = request.body;
        const { requesterContext } = request;

        await this.groupService.updateMemberRole(requesterContext, {
          targetUserId: memberId,
          role: role as any,
        });
        reply.status(HttpStatusCode.NoContent).send();
      },
    );

    app.get(
      '/:groupId/invite',
      {
        preHandler: [groupBarrierMiddleware],
        schema: {
          tags: [this.prefix],
          description: 'Get invitation magic link and QR information',
          summary: 'Obter convite',
          operationId: 'getInviteInfo',
          params: groupParamsSchema,
          response: {
            ...getPossibleExceptionsSchemas([new UserNotInGroupException()]),
            [HttpStatusCode.Ok]: groupInviteResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { requesterContext } = request;

        const inviteInfo =
          await this.groupService.getInviteInfo(requesterContext);

        const response = groupMapper.toInviteResponse(inviteInfo);
        reply.status(HttpStatusCode.Ok).send(response);
      },
    );
  }
}
