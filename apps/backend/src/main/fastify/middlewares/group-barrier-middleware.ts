import type { FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import type { UserService } from '@/application';
import {
    UnauthorizedException,
    UserNotMemberOfAnyGroupBarrierException,
} from '@/domain/exceptions';
import { injection } from '@/main/di/injection-tokens';

const { usecases } = injection;

export const groupBarrierMiddleware = async (request: FastifyRequest) => {
  const userService = container.resolve<UserService>(usecases.userService);

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
  // Priority:
  // 1. x-group-id header (for explicit selection)
  // 2. The first group in their list
  const headerGroupId = request.headers['x-group-id'] as string | undefined;

  if (headerGroupId && groups.some((g) => g.groupId === headerGroupId)) {
    request.groupId = headerGroupId;
    return;
  }

  const activeGroupId = groups[0].groupId;
  request.groupId = activeGroupId;
};
