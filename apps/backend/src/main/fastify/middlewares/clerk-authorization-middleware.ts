import { getAuth } from '@clerk/fastify';
import type { FastifyReply, FastifyRequest } from 'fastify';

export const clerkAuthorizationMiddleware = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const auth = getAuth(request);

    if (!auth.isAuthenticated) {
      reply.status(401).send(null);
      return;
    }

    request.auth = auth;
  } catch (error) {
    reply.status(401).send({ message: 'Invalid session', error });
    return;
  }
};
