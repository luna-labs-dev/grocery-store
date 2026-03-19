# Exception Data Model

## BaseException Model

The `BaseException` is the root of all standardized exceptions in the system.

### Attributes
- **statusCode**: `number` (RFC 9110 HTTP Status Code)
- **code**: `string` (Unique semantic identifier, e.g., `INTERNAL_SERVER_EXCEPTION`)
- **message**: `string` (Human-readable error description)
- **stack**: `string` (Optional, only provided in non-production environments)
- **context**: `Record<string, unknown>` (Optional, additional typesafe data that is **spread** into the final response)

### Validation Rules
- **Exception Code**: MUST be a **unique literal string** (e.g., `z.literal('USER_NOT_FOUND')`) in UPPER_SNAKE_CASE.
- **Message**: MUST be provided and non-empty.
- **Context**: MUST be serializable to JSON and will be **spread** at the root of the exception response, validated by the exception's static schema.
- **PII Scrubbing**: Context data is SUBJECT TO AUTOMATIC SCRUBBING via a global PII blacklist (e.g., `password`, `token`) in the global handler before being finalized in the model.

## Literal Narrowing (Automated)

The system automatically narrows the `code` field in the API schema to the specific literal defined in the exception class. This eliminates "type drift" between backend and frontend.

```typescript
// Under the hood transformation:
// From: { code: string, message: string }
// To:   { code: 'USER_NOT_FOUND', message: string, userId: string }
```

## Exception Schema Pattern

The most robust way to define exceptions is **Schema-First Inference**. This ensures the Zod definition drives both the static documentation and the runtime type safety.

### 1. Extended Case (With Context)

Define the schema first, infer the type, and pass it to the base class.

```typescript
// 1. Define the context schema
const userNotFoundSchema = z.object({ userId: z.string().uuid() });
type UserNotFoundContext = z.infer<typeof userNotFoundSchema>;

// 2. Define the Exception class using the inferred type
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

### 2. Standard Case (No extra props)

```typescript
export class UnauthorizedException extends BaseException {
  static statusCode = HttpStatusCode.Unauthorized;
  static code = 'UNAUTHORIZED';

  constructor() {
    super('Unauthorized access', {
      statusCode: UnauthorizedException.statusCode,
      code: UnauthorizedException.code
    });
  }
}
```
> [!NOTE]
> The `ExceptionMappingHelper` automatically constructs the final schema by taking the `BaseException.standardSchema`, narrowing `code` to `z.literal(Exception.code)`, and spreading the `contextSchema`.
