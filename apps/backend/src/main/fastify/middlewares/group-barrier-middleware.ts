import type { FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import type { GroupRepositories } from '@/application/contracts';
import type { IUserService } from '@/domain';
import type { PermissionService } from '@/domain/core/logic/permissions/permission-service';
import { RequesterContext } from '@/domain/core/requester-context';
import {
  GroupNotFoundException,
  UnauthorizedException,
  UserNotMemberOfAnyGroupBarrierException,
} from '@/domain/exceptions';
import { injection } from '@/main/di/injection-tokens';

const { usecases, infra } = injection;

export const groupBarrierMiddleware = async (request: FastifyRequest) => {
  const userService = container.resolve<IUserService>(usecases.userService);
  const groupRepository = container.resolve<GroupRepositories>(
    infra.groupRepositories,
  );
  const permissionService = container.resolve<PermissionService>(
    infra.permissionService,
  );

  const { user } = request.auth;
  if (!user?.id) {
    console.error('user id is not provided');
    throw new UnauthorizedException();
  }

  const dbUser = await userService.getUser({
    externalId: user.id,
  });

  const groups = dbUser.groups || [];

  if (groups.length === 0) {
    throw new UserNotMemberOfAnyGroupBarrierException();
  }

  // Determine the active group.
  const headerGroupId = request.headers['x-group-id'] as string | undefined;
  const paramGroupId = (request.params as Record<string, string | undefined>)
    ?.groupId;

  let activeGroupId = groups[0].groupId;

  if (
    paramGroupId &&
    groups.some((g) => (g as { groupId: string }).groupId === paramGroupId)
  ) {
    activeGroupId = paramGroupId;
  } else if (
    headerGroupId &&
    groups.some((g) => (g as { groupId: string }).groupId === headerGroupId)
  ) {
    activeGroupId = headerGroupId;
  }

  const group = await groupRepository.getById(activeGroupId);
  if (!group) {
    throw new GroupNotFoundException();
  }

  request.groupId = activeGroupId;
  request.requesterContext = new RequesterContext(
    dbUser,
    group,
    permissionService,
  );
};
