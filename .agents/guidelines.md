# Grocery Store Project Guidelines

This document outlines the architectural patterns, team roles, and development conventions for the Grocery Store ecosystem (Backend, Frontend, and Mobile). All developers and AI agents must follow these rules strictly to maintain systemic integrity and organizational cohesion.

## 👥 The Specialized Team

The project is governed by a swarm of specialized agents, each with absolute authority over their domain. Refer to `.agents/specialists/` for detailed profiles.

### Strategic & Product Layer
- **Product Manager (PM)**: Strategic vision and roadmap sovereignty.
- **Product Owner (PO)**: Backlog grooming and requirement clarity.
- **UX/UI Specialist**: Mobile-first experience and "Premium Feel" guardian.

### Architectural Layer
- **System Architect**: Cross-project boundary governance and contract design.
- **Backend Architect Elite**: Clean Architecture and DI supremacy (Backend).
- **Frontend Specialist**: Feature-slicing and state management integrity (Frontend).
- **React Framework Specialist**: Build optimization and rendering strategies.
- **Shadcn Design Architect**: Atomic design system and Tailwind purity.

### Execution & Verification Layer
- **Flow Coordinator**: Supreme orchestrator of the development lifecycle.
- **QA & TDD Enforcer**: Relentless mastermind of TDD and verification.
- **Security Officer**: Zero Trust model and ABAC enforcement.
- **DBA Guardian**: Protector of database integrity and migration safety.
- **Clean Code Purist**: Advocate for SOLID elegance and simplicity.
- **Ops Commander**: Observability and power-user experience.
- **DevOps Commander**: CI/CD pipelines and infrastructure resilience.

## 🏛️ Architectural Layers (Backend)

The backend follows a Clean Architecture approach with a strict separation of concerns:
... [rest of the file remains similar or slightly refined]

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
- **Files**: MUST use **kebab-case** (e.g., `group-service.ts`) across all projects, excluding framework-reserved route files.
- **Interfaces/Classes**: PascalCase (e.g., `CollaborationGroup`, `GroupRepository`).
- **Constants/Tokens**: camelCase for tokens (`userRepositories`), UPPER_SNAKE_CASE for env.
- **Database**: snake_case tables, camelCase columns, kebab-case enums.

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

### 7. Clean Code & Minimalism
- **Rule of Simplicity**: Before implementing a complex solution, narrow down the logic to its most elegant core. Avoid "crap from the ass" (convoluted, over-engineered, or messy code).
- **SOLID First**: All new code must be audited against SOLID principles.
- **Maintainability over Speed**: If a quick fix introduces technical debt, it must be rejected in favor of a clean, maintainable solution.
- **Meaningful Abstractions**: Use design patterns only when they simplify the system's mental model, not for the sake of using them.

### 8. Database & Persistence (DBA Rules)
- **Transactions**: All write operations involving multiple tables MUST be executed within a transaction. Orchestrate at the Service layer using a `TransactionManager`.
- **Naming**:
  - Enums/Statuses/Roles: Always **lowercase** and **kebab-case** (e.g., `partially-filled`, `super-admin`).
  - Tables: snake_case (e.g., `shopping_event`).
  - Columns: camelCase (e.g., `inviteCode`).
- **Integrity**: Every relation MUST be backed by a physical Foreign Key constraint (`.references()`). Use UUIDs for Primary Keys.
- **Audit**: Every table must have `createdAt` and `updatedAt`/`lastUpdatedAt` timestamps.

### 9. Aggregate Root Pattern
- **Encapsulation**: Domain entities like `CollaborationGroup` and `ShoppingEvent` act as Aggregate Roots. All internal state changes (e.g., adding members, upserting products) MUST happen through methods on the Root entity.
- **Persistence**: Repositories must persist the entire Aggregate Root atomically. Avoid scattered repository calls for internal items.

### 10. Authorization Context (`RequesterContext`)
- **DRY Auth**: Use `RequesterContext` to encapsulate the authenticated `User` and the scoped `CollaborationGroup`.
- **Ensuring Permissions**: Services must use `ctx.checkPermission(action, resource)` instead of manual repository checks.
- **Middleware**: Use `groupBarrierMiddleware` to ensure the context is always available for group-scoped routes.

### 11. Environment & Testing (E2E)
- **Valkey/Redis**: The development and E2E environment uses Valkey on port **6380** (Redis-compatible).
- **Docker**: Services (`postgres`, `valkey`, `jaeger`) should be running via `docker compose -f docker-compose.dev.yml up -d` before running E2E tests.
- **Isolation**: Use `cleanupDatabase()` in E2E setup to ensure a clean state between tests.

---

## 🛠️ Implementation Checklist
1. Create/Update Zod Schemas in `api/helpers`.
2. Infer Types and implement Mapper in `api/helpers`.
3. Define Domain Types in `domain/usecases`.
4. Interface for Repository in `application/contracts`.
5. Implementation in `application/usecases`.
6. Integration in `api/controllers`.
7. Register in `main/di`.

---

## 🛡️ CRITICAL: Workflow Safety

> [!IMPORTANT]
> **Commit Governance**: ONLY perform `git commit` when explicitly instructed by the USER. You may stage files (`git add`) as part of your verification process, but you MUST NOT create a commit unless the USER says "commit this".

- **Semantic Commits**: When instructed to commit, follow conventions: `feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `style:`, `perf:`, `chore:`.
- **Progress Tracking**: Agents MUST actively maintain `task.md` and `docs/refactor/ROADMAP.md`. Check off `[x]` tasks before notifying completion.
- **Agent Guidelines**: Consult relevant specialist profiles in `.agents/specialists/` before high-impact changes.
