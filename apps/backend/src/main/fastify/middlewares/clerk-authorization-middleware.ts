import { getAuth } from '@clerk/fastify';
import type { FastifyRequest } from 'fastify';
import { UnauthorizedException } from '@/domain/exceptions';

export const clerkAuthorizationMiddleware = async (request: FastifyRequest) => {
  const auth = getAuth(request);

  if (!auth.isAuthenticated) {
    throw new UnauthorizedException();
  }

  request.auth = auth;
};
