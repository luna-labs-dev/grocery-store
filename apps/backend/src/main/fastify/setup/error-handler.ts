import type { FastifyReply, FastifyRequest } from 'fastify';
import { BaseException } from '@/domain';

export const setupErrorHandler = (
  error: unknown,
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  if (error instanceof BaseException) {
    reply.status(error.statusCode).send(error.toJSON());
    return;
  }

  const typedError = error as Error;

  reply.log.error({
    message: 'error not mapped',
    error: typedError.message,
    stack: typedError.stack,
  });
  reply.status(500).send();
};
