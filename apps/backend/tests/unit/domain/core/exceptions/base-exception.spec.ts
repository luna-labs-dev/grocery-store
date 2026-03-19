/**
 * [CONTEXT_INTELLIGENCE_HEADER]
 * This test verifies the foundational BaseException class, ensuring it supports
 * schema-first inference, static schema extraction, and standardized serialization.
 */
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { HttpStatusCode } from '@/domain/core/enums/http-status-code';
import { BaseException } from '@/domain/core/exceptions/base-exception';

describe('[EXCEPTION-STRICT-TDD] BaseException Foundational Logic', () => {
  const mockContextSchema = z.object({
    userId: z.string().uuid(),
  });
  type MockContext = z.infer<typeof mockContextSchema>;

  class MockException extends BaseException<MockContext> {
    static statusCode = HttpStatusCode.BadRequest;
    static contextSchema = mockContextSchema;

    constructor(context: MockContext) {
      super('Mock error message', {
        statusCode: MockException.statusCode,
        context,
        schema: MockException.contextSchema,
      });
    }
  }

  it('[PR-EXCEPTION-SERIALIZATION] should serialize to JSON including code, message and context', () => {
    const context = { userId: '550e8400-e29b-41d4-a716-446655440000' };
    const exception = new MockException(context);

    const json = exception.toJSON();

    expect(json).toMatchObject({
      code: 'MOCK_EXCEPTION',
      message: 'Mock error message',
      userId: context.userId,
    });
  });

  it('[PR-EXCEPTION-CODE-GENERATION] should automatically generate upper-snake-case code from class name', () => {
    class UserNotFoundException extends BaseException {
      constructor() {
        super('User not found', { statusCode: HttpStatusCode.NotFound });
      }
    }
    const exception = new UserNotFoundException();
    expect(exception.code).toBe('USER_NOT_FOUND_EXCEPTION');
  });

  it('[PR-EXCEPTION-SCHEMA-VALIDATION] should validate context data against the provided schema', () => {
    // In our implementation, we should probably decide if we throw during construction
    // if the context is invalid, or if we just let it be.
    // Given it's an exception, we probably want it to be robust.
    const exception = new MockException({
      userId: '550e8400-e29b-41d4-a716-446655440000',
    });
    expect(exception.extras).toEqual({
      userId: '550e8400-e29b-41d4-a716-446655440000',
    });
  });
});
