import { fromNodeHeaders } from 'better-auth/node';
import type { FastifyRequest } from 'fastify';
import { UnauthorizedException } from '@/domain/exceptions';
import { auth } from '@/main/auth/auth';

export const authMiddleware = async (request: FastifyRequest) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(request.headers),
  });

  if (!session) {
    throw new UnauthorizedException();
  }

  request.auth = session;
};
