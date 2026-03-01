import type { FastifyReply, FastifyRequest } from 'fastify';
import {
  hasZodFastifySchemaValidationErrors,
  isResponseSerializationError,
} from 'fastify-type-provider-zod';
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

  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.code(400).send({
      error: 'Response Validation Error',
      message: "Request doesn't match the schema",
      statusCode: 400,
      details: {
        issues: error.validation,
        method: request.method,
        url: request.url,
      },
    });
  }

  if (isResponseSerializationError(error)) {
    return reply.code(500).send({
      error: 'Internal Server Error',
      message: "Response doesn't match the schema",
      statusCode: 500,
      details: {
        issues: error.cause.issues,
        method: request.method,
        url: request.url,
      },
    });
  }

  const typedError = error as Error;

  reply.log.error({
    message: 'error not mapped',
    error: typedError.message,
    stack: typedError.stack,
  });
  reply.status(500).send();
};
