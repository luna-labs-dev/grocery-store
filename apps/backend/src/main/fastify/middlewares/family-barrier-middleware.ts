import type { FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import type { UserService } from '@/application';
import {
  UnauthorizedException,
  UserNotAFamilyMemberBarrierException,
} from '@/domain/exceptions';
import { injection } from '@/main/di/injection-tokens';

const { usecases } = injection;

export const familyBarrierMiddleware = async (request: FastifyRequest) => {
  const userService = container.resolve<UserService>(usecases.userService);

  const { userId } = request.auth;
  if (!userId) {
    console.error('external user id is not provided');
    throw new UnauthorizedException();
  }

  const dbUser = await userService.getUser({
    externalId: userId,
  });

  if (!dbUser.familyId) {
    // if user is not member of any family, return unauthorized with required action to add user to family
    throw new UserNotAFamilyMemberBarrierException();
  }

  request.familyId = dbUser.familyId;
};
