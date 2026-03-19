# Feature Specification: Standardize Exception Handling

**Feature Branch**: `007-exception-handling-std`  
**Created**: 2026-03-18  
**Status**: Draft  
**Input**: User description: "Standardize fail-proof exception handling across the application with Zod, type-safety, and cleaner controller mapping"

## Clarifications

### Session 2026-03-19
- Q: How should we log standardized exceptions? → A: Global handler automatically logs all `BaseException` instances with their full structured context to the system logs/Sentry.
- Q: How should we handle PII (Personally Identifiable Information) in context data? → A: Use a global blacklist (e.g., `PII_SENSITIVE_FIELDS`) in the global handler to scrub sensitive fields before logging or responding.
- Q: Which existing exceptions are out-of-scope for refactoring? → A: Only refactor *Application & Domain* exceptions; leave *Infrastructure & Library* exceptions (e.g., Database, Auth provider) as-is unless they impact public API responses.
- Q: Is there a specific latency budget? → A: No strict metric, but the implementation MUST be "negligible" (<2ms overhead) by using efficient Zod schema caching and avoid heavy operations in the hot path.

### User Story 1 - Defining Predictable Exceptions (Priority: P1)

As a backend developer, I want to define domain and application exceptions using a standardized pattern that enforces the inclusion of a status code and a response schema. This ensures that every exception returned by the API is predictable and follows a global standard.

**Why this priority**: Highly critical for system stability and maintenance. It prevents "one-off" exceptions handled inconsistently.

**Independent Test**: Can be verified by creating a new exception class and ensuring it requires a status code and a schema, and that the resulting API response matches the definition.

**Acceptance Scenarios**:

1. **Given** a new domain exception is needed, **When** it is defined using the standard pattern, **Then** it must include a unique error code, a default message, and an HTTP status code.
2. **Given** an exception that requires extra context (e.g., validation details), **When** it is defined, **Then** the extra data must be explicitly mapped in the response schema to ensure type safety and must follow a serializable flat-object structure.
3. **Given** a new implementation, **When** developers write tests, **Then** they must follow the `CONTEXT_INTELLIGENCE_HEADER` and `[COMPONENT-CODE-SUCCESS/FAILURE]` standards with ≥50 char descriptions.

---

### User Story 2 - Automated API Documentation (Priority: P1)

As a developer, I want to map multiple possible exceptions to a single API endpoint in a way that automatically populates the API documentation (Swagger/Scalar).

**Why this priority**: Essential for communication between frontend and backend. Manual documentation of errors is error-prone and often out of sync.

**Independent Test**: Can be verified by checking the generated `openapi.json` file to ensure all mapped exceptions appear under their respective HTTP status codes for the endpoint.

**Acceptance Scenarios**:

1. **Given** an endpoint that can fail for multiple reasons (e.g., UserNotFound, Unauthorized), **When** these exceptions are mapped in the controller, **Then** the Swagger UI must show multiple possible responses for those status codes.

---

### User Story 3 - Type-safe Frontend Integration (Priority: P2)

As a frontend developer, I want the generated API client (Orval) to have full knowledge of the possible exception structures for each endpoint.

**Why this priority**: Improves frontend developer experience and reduces runtime exceptions when handling specific failure cases.

**Independent Test**: Can be verified by running the code generation tool and checking that the generated response types for error status codes include the specific fields defined in the backend exceptions.

**Acceptance Scenarios**:

1. **Given** a specific error response structure for a 404 error, **When** the frontend client is generated, **Then** the TypeScript types for that 404 response must reflect the defined structure instead of a generic error type.

---

### Edge Cases

- **Handling multiple exceptions with the same HTTP status code**: The system should correctly represent these as a union of potential response structures in the API documentation.
- **Unexpected Exceptions**: How does the system handle an exception that is not a defined `BaseException` (e.g., a native JS error)? It should fall back to a safe, generic "Unexpected Exception" response that doesn't leak sensitive system information.

## Out of Scope

- **Infrastructure Errors**: Errors originating from low-level infrastructure (e.g., Drizzle/DB connection, Redis, Axios network failures) that do not directly map to a business-level domain exception are out of scope for this standardization phase.
- **3rd-Party Library Errors**: Specific error classes provided by libraries (e.g., `better-auth`) will be handled by the global "Unexpected Exception" fallback unless explicitly mapped for a critical user flow.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Every exception MUST define a unique literal string-based exception code (e.g., `z.literal('USER_NOT_FOUND')`). The system **MUST automatically narrow the API schema's code field** to this specific literal "under the hood" to enable type-safe discriminative unions on the frontend.
- **FR-002**: Every exception MUST be associated with a specific HTTP status code.
- **FR-003**: The system MUST provide a minimalist exception pattern where the base class handles all standard schema construction under the hood. Developers MUST NOT be required to call manual static helpers to "mend" the schema.
- **FR-004**: The system MUST support "contextual data" in exceptions that is automatically **spread** into the root of the JSON response. Contextual data MUST follow a serializable object structure defined by the exception's public schema.
- **FR-005**: Controllers MUST have a clean and expressive way to declare which exceptions an endpoint can return.
- **FR-006**: Every API boundary and usecase MUST have mandatory failure scenario tests covering all defined exceptions.
- **FR-007**: The exception mapping logic MUST automatically include global exceptions (like "Unexpected Exception" or "Unauthorized") and **ensure the global exception handler logs all `BaseException` instances with their full context**.
- **FR-008**: The global exception handler MUST implement a **PII sanitization layer** that scrubs sensitive fields (e.g., passwords, tokens) from the `context` before logging or returning the response.
- **FR-009 (Governance)**: This exception handling pattern (including PII/Logging/Type-safety) is **mandatory for all current and future feature specifications** in this project to maintain architectural consistency.

### Non-Functional Requirements

- **NFR-001 (Performance)**: The exception mapping and resolution logic MUST have a negligible latency impact (**<2ms p95**) on the response path. Use Zod schema caching where possible.
- **NFR-002 (Security)**: Contextual data MUST NOT leak PII. The sanitization layer (FR-008) MUST be tested against a standard sensitive field blacklist.
- **NFR-003 (Observability)**: 100% of `BaseException` occurrences MUST be logged with their full structured context by the global handler.

### Key Entities *(include if feature involves data)*

- **BaseException**: The core abstraction for all application exceptions.
- **ExceptionMappingHelper**: A utility used in controllers to bridge defined exceptions with the API documentation engine.
- **ExceptionSchema**: A definition (technology-agnostic in principle, but implemented via schemas) that describes the shape of an exception response.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of custom domain exceptions follow the new standardized pattern.
- **SC-002**: Every API endpoint in the application has its possible error responses documented in the Swagger/Scalar UI.
- **SC-003**: Zero "manual" objects are used in controllers to define exception responses; all must come from exception definitions.
- **SC-004**: Developers can map multiple potential exceptions to an endpoint with a single, concise helper call.
- **SC-005**: Frontend developers can access specific exception fields (like `details` or `context`) with full type safety in their IDEs.
