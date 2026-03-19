# Quickstart: Standardized Exception Handling

Follow these steps to define and use exceptions in the Grocery Store project.

## 1. Implement BaseException (Core)

The core `BaseException` provides the foundation for all other exceptions. It uses a generic `TContext` to enforce type safety on additional data.

```typescript
export interface BaseExceptionOptions<T = void> {
  statusCode: number;
  code: string;
  context?: T;
}

export abstract class BaseException<TContext = void> extends Error {
  static standardSchema = z.object({
    code: z.string(),
    message: z.string(),
    stack: z.string().optional(),
  });

  constructor(message: string, options: BaseExceptionOptions<TContext>) {
    super(message);
    // ... logic to spread context into root
  }
}
```

## 2. Define a Custom Exception

Define your domain-specific exceptions in `src/domain/exceptions/`.

```typescript
import { BaseException } from '../core/exceptions';
import { HttpStatusCode } from '../core/enums';
import { z } from 'zod';

const userNotFoundSchema = z.object({ userId: z.string().uuid() });
type UserNotFoundContext = z.infer<typeof userNotFoundSchema>;

export class UserNotFoundException extends BaseException<UserNotFoundContext> {
  static statusCode = HttpStatusCode.NotFound;
  static code = 'USER_NOT_FOUND';
  static contextSchema = userNotFoundSchema;

  constructor(context: UserNotFoundContext) {
    super('User not found', {
      statusCode: UserNotFoundException.statusCode,
      code: UserNotFoundException.code,
      context
    });
  }
}
```

## 3. Map Exceptions in Controller

Use the `ExceptionMappingHelper` to automatically document exceptions in Swagger/Scalar.

```typescript
app.get('/:id', {
  schema: {
    response: {
      [HttpStatusCode.Ok]: userSchema,
      ...ExceptionMappingHelper.map([UserNotFoundException, UnauthorizedException])
    }
  }
}, async (request, reply) => {
  // ... logic
});
```

## 4. Run Verification

Always run the following commands to ensure TDD compliance:
```bash
pnpm lint
pnpm test
pnpm --filter backend typecheck
```
