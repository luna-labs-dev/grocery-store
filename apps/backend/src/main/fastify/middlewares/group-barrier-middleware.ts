import type { FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import type { UserService } from '@/application';
import type { GroupRepositories } from '@/application/contracts';
import { RequesterContext } from '@/domain/core/requester-context';
import {
  GroupNotFoundException,
  UnauthorizedException,
  UserNotMemberOfAnyGroupBarrierException,
} from '@/domain/exceptions';
import { injection } from '@/main/di/injection-tokens';

const { usecases, infra } = injection;

export const groupBarrierMiddleware = async (request: FastifyRequest) => {
  const userService = container.resolve<UserService>(usecases.userService);
  const groupRepository = container.resolve<GroupRepositories>(
    infra.groupRepositories,
  );

  const { user } = request.auth;
  if (!user?.id) {
    console.error('user id is not provided');
    throw new UnauthorizedException();
  }

  const dbUser = await userService.getUser({
    id: user.id,
  });

  const groups = dbUser.groups || [];

  if (groups.length === 0) {
    throw new UserNotMemberOfAnyGroupBarrierException();
  }

  // Determine the active group.
  const headerGroupId = request.headers['x-group-id'] as string | undefined;
  let activeGroupId = groups[0].groupId;

  if (headerGroupId && groups.some((g) => g.groupId === headerGroupId)) {
    activeGroupId = headerGroupId;
  }

  const group = await groupRepository.getById(activeGroupId);
  if (!group) {
    throw new GroupNotFoundException();
  }

  request.groupId = activeGroupId;
  request.requesterContext = new RequesterContext(dbUser, group);
};
