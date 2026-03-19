# Quickstart: Standardized Exception Handling

Follow these steps to define and use exceptions in the Grocery Store project.

## 1. Implement BaseException (Core)

The core `BaseException` provides the foundation for all other exceptions. It uses Schema-First Inference to derive context data types from Zod schemas.

```typescript
export abstract class BaseException<T = unknown> extends Error {
  public readonly statusCode: HttpStatusCode;
  public readonly code: string;
  public readonly extras?: T;

  constructor(message: string, props: IBaseExceptionProps<T>) {
    super(message);
    // ... initialization logic
  }
}
```

## 2. Define a Custom Exception

Define your domain-specific exceptions in `src/domain/exceptions/`.

```typescript
import { z } from 'zod';
import { BaseException } from '../core/exceptions/base-exception';
import { HttpStatusCode } from '../core/enums/http-status-code';

export const userNotFoundContextSchema = z.object({
  userId: z.string().uuid(),
});

export type UserNotFoundContext = z.infer<typeof userNotFoundContextSchema>;

export class UserNotFoundException extends BaseException<UserNotFoundContext> {
  static statusCode = HttpStatusCode.NotFound;
  static contextSchema = userNotFoundContextSchema;

  constructor(context: UserNotFoundContext) {
    super('Usuário não encontrado', {
      statusCode: UserNotFoundException.statusCode,
      schema: UserNotFoundException.contextSchema,
      context,
    });
  }
}
```

## 3. Map Exceptions in Controller

Use `getPossibleExceptionsSchemas` to consolidate multiple exceptions into a Fastify-compatible response schema.

```typescript
import { getPossibleExceptionsSchemas } from '@/domain';
import { UserNotFoundException } from '@/domain/exceptions';

app.get('/:id', {
  schema: {
    response: {
      [HttpStatusCode.Ok]: userSchema,
      ...getPossibleExceptionsSchemas([UserNotFoundException])
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

## 5. Security & Observability

- **PII Sanitization**: The global error handler automatically removes fields like `email`, `password`, and `token` from public responses.
- **Structured Logging**: All standardized exceptions are logged with full context (`code`, `statusCode`, `extras`) for internal observability.
