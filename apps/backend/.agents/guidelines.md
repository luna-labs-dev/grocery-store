# Grocery Store Backend Project Guidelines

This document outlines the architectural patterns and conventions for the Grocery Store Backend. All developers (and AI agents) must follow these rules strictly.

## 🏛️ Architectural Layers

The project follows a Clean Architecture approach with a strict separation of concerns:

- **Domain (`src/domain`)**: Core business logic, entities, and usecase definitions.
  - No external dependencies except for core helpers.
  - `entities/`: Domain entities extending `Entity<Props>`.
  - `usecases/`: Input (Params) and Output (Result) types for each usecase.
  - `exceptions/`: Domain-specific exceptions.
  - `core/`: Constants, enums, and base classes.
- **Application (`src/application`)**: Use case implementations and repository contracts.
  - `usecases/`: Implementation of domain usecases.
  - `contracts/`: Interfaces for repositories and external services.
- **Infrastructure (`src/infrastructure`)**: Database and external service implementations.
  - `repositories/drizzle/`: Implementation of repository contracts using Drizzle ORM.
  - `services/`: Implementation of external services (e.g., Google Places).
- **API (`src/api`)**: Fastify-based controllers and helpers.
  - `controllers/`: Request handling logic.
  - `helpers/`: Zod schemas and mappers.
- **Main (`src/main`)**: Entry point, DI container, and server configuration.

---

## 🏗️ Patterns & Conventions

### 1. Schemas & DTOs
- **Location**: `src/api/helpers/{resource}-schemas.ts`.
- **Convention**:
  - Request Schemas: `createSomeResourceRequestSchema`, `someResourceParamsSchema`.
  - Response Schemas: `someResourceResponseSchema`.
- **Strict Rule**: Always use `z.infer<typeof schema>` to define public-facing Types/DTOs.

### 2. Mappers
- **Location**: `src/api/helpers/{resource}-mapper.ts`.
- **Naming**: `someResourceMapper`.
- **Purpose**: Transform Domain Entities to API-safe Response objects.
- **Types**: Export DTO types derived from schemas at the top of the mapper file.

### 3. Use Case Definitions (Domain)
- **Location**: `src/domain/usecases/{module}/{feature}.ts`.
- **Convention**:
  - Define `SomeFeatureParams` interface.
  - (Optional) Define `SomeFeature` interface with an `execute` method.
  - (Optional) Define `SomeFeatureResult` for complex returns.

### 4. Naming Conventions
- **Files**: kebab-case (e.g., `group-service.ts`, `auth-middleware.ts`).
- **Interfaces/Classes**: PascalCase (e.g., `CollaborationGroup`, `GroupRepository`).
- **Constants/Tokens**: camelCase for tokens (`userRepositories`), UPPER_SNAKE_CASE for env.

### 5. Dependency Injection
- **Pattern**: Use `tsyringe` for all registrations.
- **Tokens**: Define in `src/main/di/injection-tokens.ts`.
- **Registration**: Perform in `src/main/di/injections.ts`.
- **Complex Setups**: Use `useFactory` in `injections.ts` for services requiring environment configuration or manual setup.

### 6. Testing (TDD)
- **Framework**: `vitest`.
- **Types of Tests**:
  - Unit Tests: For domain logic and services (`.spec.ts` in respective modules).
  - Integration Tests: For controllers and full-stack flows.
- **Rule**: Always test both Success (`should ...`) and Failure (`should throw ...`) scenarios.

---

## 🛠️ Implementation Checklist
1. Create/Update Zod Schemas in `api/helpers`.
2. Infer Types and implement Mapper in `api/helpers`.
3. Define Domain Types in `domain/usecases`.
4. Interface for Repository in `application/contracts`.
5. Implementation in `application/usecases`.
6. Integration in `api/controllers`.
7. Register in `main/di`.
