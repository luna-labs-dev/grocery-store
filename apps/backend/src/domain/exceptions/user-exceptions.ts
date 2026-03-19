import { z } from 'zod';
import { HttpStatusCode } from '../core/enums/http-status-code';
import { BaseException } from '../core/exceptions/base-exception';

/**
 * [PR-EXCEPTION-USER-NOT-FOUND]
 */
export const userNotFoundSchema = z.object({
  userId: z.string().uuid().optional(),
  externalId: z.string().optional(),
});

export type UserNotFoundContext = z.infer<typeof userNotFoundSchema>;

export class UserNotFoundException extends BaseException<UserNotFoundContext> {
  static statusCode = HttpStatusCode.NotFound;
  static contextSchema = userNotFoundSchema;

  constructor(context?: UserNotFoundContext) {
    super('O usuário não foi encontrado', {
      statusCode: UserNotFoundException.statusCode,
      context,
      schema: UserNotFoundException.contextSchema,
    });
  }
}

/**
 * [PR-EXCEPTION-USER-ALREADY-EXISTS]
 */
export const userAlreadyExistsSchema = z.object({
  email: z.string().email().optional(),
});

export type UserAlreadyExistsContext = z.infer<typeof userAlreadyExistsSchema>;

export class UserAlreadyExistsException extends BaseException<UserAlreadyExistsContext> {
  static statusCode = HttpStatusCode.UnprocessableEntity;
  static contextSchema = userAlreadyExistsSchema;

  constructor(context?: UserAlreadyExistsContext) {
    super('O usuário já existe', {
      statusCode: UserAlreadyExistsException.statusCode,
      context,
      schema: UserAlreadyExistsException.contextSchema,
    });
  }
}
