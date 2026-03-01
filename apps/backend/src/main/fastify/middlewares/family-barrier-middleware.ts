import type { FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import type { GetUser } from '@/domain';
import {
  UnauthorizedException,
  UserNotAFamilyMemberBarrierException,
} from '@/domain/exceptions';
import { injection } from '@/main/di/injection-tokens';

const { usecases } = injection;

export const familyBarrierMiddleware = async (request: FastifyRequest) => {
  const getUser = container.resolve<GetUser>(usecases.getUser);

  const { userId } = request.context.auth;
  if (!userId) {
    console.error('external user id is not provided');
    throw new UnauthorizedException();
  }

  const dbUser = await getUser.execute({
    externalId: userId,
  });

  if (!dbUser.familyId) {
    // if user is not member of any family, return unauthorized with required action to add user to family
    throw new UserNotAFamilyMemberBarrierException();
  }

  request.context.familyId = dbUser.familyId;
};
