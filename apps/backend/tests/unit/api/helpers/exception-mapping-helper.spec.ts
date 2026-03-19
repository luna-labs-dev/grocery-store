/**
 * [CONTEXT_INTELLIGENCE_HEADER]
 * This test verifies the ExceptionMappingHelper, ensuring it correctly
 * translates BaseException classes into Zod schemas for Fastify documentation.
 */
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { mapExceptionsToSchema } from '@/api/helpers/exception-mapping-helper';
import { HttpStatusCode } from '@/domain/core/enums/http-status-code';
import { BaseException } from '@/domain/core/exceptions/base-exception';

describe('[EXCEPTION-STRICT-TDD] ExceptionMappingHelper', () => {
  const userNotFoundSchema = z.object({
    userId: z.string().uuid(),
  });

  class UserNotFoundException extends BaseException<{ userId: string }> {
    static statusCode = HttpStatusCode.NotFound;
    static contextSchema = userNotFoundSchema;
    constructor(userId: string) {
      super('User not found', {
        statusCode: UserNotFoundException.statusCode,
        context: { userId },
        schema: UserNotFoundException.contextSchema,
      });
    }
  }

  it('[PR-EXCEPTION-MAPPING-SINGLE] should map a single exception class to a Zod schema', () => {
    const schema = mapExceptionsToSchema(UserNotFoundException);

    // Verify the schema shape
    const objSchema = schema as z.ZodObject<z.ZodRawShape>;
    expect(objSchema.shape).toHaveProperty('code');
    expect(objSchema.shape).toHaveProperty('message');
    expect(objSchema.shape).toHaveProperty('userId');

    // Test validation with valid data
    const result = schema.safeParse({
      code: 'USER_NOT_FOUND_EXCEPTION',
      message: 'Some message',
      userId: '550e8400-e29b-41d4-a716-446655440000',
    });
    expect(result.success).toBe(true);
  });

  it('[PR-EXCEPTION-MAPPING-UNION] should map multiple exception classes to a Zod union', () => {
    class ForbiddenException extends BaseException {
      static statusCode = HttpStatusCode.Forbidden;
      constructor() {
        super('Forbidden', { statusCode: ForbiddenException.statusCode });
      }
    }

    const schema = mapExceptionsToSchema(
      UserNotFoundException,
      ForbiddenException,
    );

    // It should be a union or object (depending on implementation, here it returns object for single status, but we test behavior)
    // Actually our implementation returns z.union if schemas.length > 1

    // Test with one of the exceptions
    const result1 = schema.safeParse({
      code: 'USER_NOT_FOUND_EXCEPTION',
      message: 'Not found',
      userId: '550e8400-e29b-41d4-a716-446655440000',
    });
    expect(result1.success).toBe(true);

    const result2 = schema.safeParse({
      code: 'FORBIDDEN_EXCEPTION',
      message: 'Forbidden',
    });
    expect(result2.success).toBe(true);
  });
});
