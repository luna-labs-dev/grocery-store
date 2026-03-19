import type { FastifyReply, FastifyRequest } from 'fastify';
import {
  hasZodFastifySchemaValidationErrors,
  isResponseSerializationError,
} from 'fastify-type-provider-zod';
import { BaseException } from '@/domain';
import { UnexpectedException } from '@/domain/core/exceptions/generic-exceptions';

/**
 * [PR-EXCEPTION-PII-SANITIZATION]
 * List of fields that should be removed from public API responses to prevent PII leakage.
 */
const SENSITIVE_FIELDS = ['password', 'token', 'secret', 'email'];

/**
 * Sanitizes an object by removing sensitive fields.
 */
function sanitize<T>(data: T): T {
  if (!data || typeof data !== 'object') return data;

  const sanitized = { ...data } as Record<string, unknown>;
  for (const field of SENSITIVE_FIELDS) {
    if (field in sanitized) {
      delete sanitized[field];
    }
  }
  return sanitized as T;
}

export const setupErrorHandler = (
  error: unknown,
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  // 1. Standard Application Exceptions
  if (error instanceof BaseException) {
    const errorData = error.toJSON();
    const sanitizedData = sanitize(errorData);

    // [PR-EXCEPTION-LOGGING] Structured logging with full context (before sanitization for internal debugging)
    request.log.warn(
      {
        code: error.code,
        message: error.message,
        context: error.extras,
        statusCode: error.statusCode,
      },
      `[BACKEND-EXCEPTION] ${error.code}: ${error.message}`,
    );

    return reply.status(error.statusCode).send(sanitizedData);
  }

  // 2. Fastify Validation Errors (Zod)
  if (hasZodFastifySchemaValidationErrors(error)) {
    request.log.info(
      {
        issues: error.validation,
        url: request.url,
      },
      '[VALIDATION-FAILURE] Request validation failed',
    );

    return reply.code(400).send({
      code: 'BAD_REQUEST',
      message: "Request doesn't match the schema",
      issues: error.validation,
    });
  }

  // 3. Fastify Serialization Errors
  if (isResponseSerializationError(error)) {
    request.log.error(
      {
        issues: error.cause.issues,
        url: request.url,
        method: request.method,
      },
      '[SERIALIZATION-FAILURE] Response serialization failed',
    );

    return reply.code(500).send({
      code: 'INTERNAL_SERVER_ERROR',
      message: "Response doesn't match the schema",
    });
  }

  // 4. Default / Unexpected Errors
  const unexpected = new UnexpectedException(
    (error as Error).message || 'An unexpected error occurred',
  );

  request.log.error(
    {
      error: (error as Error).message,
      stack: (error as Error).stack,
      url: request.url,
    },
    '[UNHANDLED-ERROR] An unhandled error occurred',
  );

  return reply.status(500).send(unexpected.toJSON());
};
