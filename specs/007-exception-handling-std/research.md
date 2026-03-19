# Phase 0: Research & Design Decisions

## Decision 1: Static Zod Schemas in TypeScript Classes

**Status**: Confirmed  
**Rationale**: To allow controllers to access exception schemas without instantiating the class, we will use static properties. Since abstract classes cannot enforce static properties, we will use a naming convention and a helper to extract them safely.

**Implementation Pattern**:
```typescript
export class UserNotFoundException extends BaseException {
  static statusCode = HttpStatusCode.NotFound;
  static schema = exceptionSchema.extend({ ... });

  constructor() {
    super('User not found', {
      statusCode: UserNotFoundException.statusCode,
      schema: UserNotFoundException.schema
    });
  }
}
```

**Alternatives considered**: 
- Declaring schemas in a separate file (rejected as it fragments the definition).
- Instantiating exceptions in the controller (rejected as requested by the user to avoid complexity).

## Decision 2: Multi-Response Mapping in Fastify/Swagger

**Status**: Confirmed  
**Rationale**: For a single status code (e.g., 400), we must support multiple possible exception structures. `fastify-type-provider-zod` supports `z.union` for responses. The mapping helper will detect collisions and automatically wrap schemas in a `z.union`.

**OpenAPI Impact**: This will correctly generate `oneOf` in the resulting Swagger/Scalar documentation.

## Decision 3: "Error" to "Exception" Renaming Strategy

**Status**: Confirmed  
**Rationale**: Per System Architect directive, all internal definitions will use "Exception".  
- Filenames: `base-error.ts` -> `base-exception.ts`
- Classes: `BaseError` -> `BaseException`
- Folder: `domain/errors` -> `domain/exceptions`

**Dependency Warning**: We will NOT rename `Error` in external libraries (e.g., `better-auth`, `fastify-type-provider-zod`) to avoid breaking the build. Only application-level code is in scope.

## Decision 4: Automated Testing Standards

**Status**: Confirmed  
**Rationale**: Every exception implementation must include a unit test verifying its schema, status code, and serializability.
- **Prefix**: `[EXCEPTION-STRICT-TDD]`
- **Header**: `CONTEXT_INTELLIGENCE_HEADER`
- **Coverage**: 100% logic coverage using Vitest.

## Decision 5: Literal Exception Codes for Discriminative Unions

**Status**: Confirmed  
**Rationale**: To enable the frontend (via Orval) to use discriminative unions for handling specific exceptions, the `code` field in the Zod schema must be a literal (e.g., `z.literal('USER_NOT_FOUND')`) instead of a generic `z.string()`. This allows the generated TypeScript types to have specific literal values, making `if (err.code === 'USER_NOT_FOUND')` typesafe.

**Implementation Pattern**:
```typescript
const userNotFoundSchema = z.object({
  userId: z.string().uuid(),
});
type UserNotFoundContext = z.infer<typeof userNotFoundSchema>;

class UserNotFoundException extends BaseException<UserNotFoundContext> {
  static contextSchema = userNotFoundSchema;
  // ...
}
```

## Decision 6: PII Sanitization via Global Blacklist

**Status**: Confirmed  
**Rationale**: To prevent sensitive data leakage (passwords, tokens, etc.) into logs or public API responses, the global exception handler will implement a sanitization layer using a `PII_SENSITIVE_FIELDS` blacklist.

## Decision 7: Automated Structured Logging

**Status**: Confirmed  
**Rationale**: 100% of standardized exceptions (`BaseException` subclasses) must be automatically logged by the global handler with their full context to ensure observability and easier debugging in production.
