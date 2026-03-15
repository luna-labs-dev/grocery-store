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
- **Security Officer**: Zero Zero Trust model and ABAC enforcement.
- **DBA Guardian**: Protector of database integrity and migration safety.
- **Clean Code Purist**: Advocate for SOLID elegance and simplicity.
- **Ops Commander**: Observability and power-user experience.
- **DevOps Commander**: CI/CD pipelines and infrastructure resilience.

## 🏛️ Architectural Layers (Backend)

The backend follows a Clean Architecture approach with a strict separation of concerns:

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
  - `controllers/`: Request handling logic following the **Controller Workflow**.
  - `helpers/`: Zod schemas and mappers.
- **Main (`src/main`)**: Entry point, DI container, and server configuration following the **DI Flow**.

---

## 🏗️ Patterns & Conventions

### 1. Schemas & DTOs
- **Location**: `src/api/helpers/{resource}-schemas.ts`.
- **Naming**: `createSomeResourceRequestSchema`, `someResourceParamsSchema`, `someResourceResponseSchema`.
- **Auto-Generation**: Always use **Zod** schemas. 
- **OperationId**: Every route definition MUST include a unique `operationId` in the schema for Orval client generation.
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

### 4. Naming Conventions (Strict)
- **Files**: MUST use **kebab-case** (e.g., `group-service.ts`) across all projects.
- **Classes/Interfaces**: PascalCase (e.g., `CollaborationGroup`, `GroupRepository`).
- **Variables/Tokens**: camelCase (e.g., `userRepositories`).
- **Environment**: UPPER_SNAKE_CASE.
- **Database**: 
  - Tables: snake_case (e.g., `shopping_event`).
  - Columns: camelCase (e.g., `inviteCode`).
  - Enums/Roles: lowercase and kebab-case (e.g., `partially-filled`).
- **API Routes**: MUST use **singular** nouns (e.g., `/product` instead of `/products`). Plural is reserved for variable names representing collections in code, never in URI paths.

### 5. Repository Pattern
- **Aggregate Roots**: Dominant entities (e.g., `CollaborationGroup`) act as roots. Persist entirely and atomically.
- **Inheritance**: Entities MUST extend `Entity<Props>`.
- **Persistence**: Managed via Drizzle in `src/infrastructure/repositories/drizzle`.

### 6. Dependency Injection
- **Pattern**: Use `tsyringe` for all registrations.
- **Tokens**: Define in `src/main/di/injection-tokens.ts`.
- **Registration**: Perform in `src/main/di/injections.ts`.

### 7. Testing (TDD) & Quality Gates
- **Mandatory**: 100% test coverage with `vitest`.
- **Coverage**: Must test both Success and Failure (exceptions) for every boundary.
- **Post-Implementation Verification**: Every task or feature completion MUST be verified by running:
  - `pnpm vitest run` (Functional correctness)
  - `pnpm tsc` (Type safety)
  - `pnpm biome check` (Linting and formatting) No suppression of Biome rules is allowed unless explicitly justified and approved. All Biome setup must be respected strictly.

### 8. Database Integrity
- **Transactions**: Write operations involving multiple tables MUST use a `TransactionManager` at the Service/Application layer.
- **Constraints**: Physical Foreign Keys mandatory. UUIDs for all Primary Keys.
- **Audit**: `createdAt` and `updatedAt` mandatory on all tables.

### 9. Authorization Context
- **RequesterContext**: Mandatory for authenticated/scoped requests.
- **Middleware**: Use `authMiddleware` and `groupBarrierMiddleware` as standard pre-handlers.

### 10. Controller Workflow (Strict)
- **Base Class**: All controllers MUST extend `FastifyController` and use `@injectable()`. The route prefix is automatically derived from the class name (singular).
- **Typed Instance**: `registerRoutes(app: FastifyTypedInstance)` is mandatory.
- **Route Validation**:
  - `schema`: MUST contain `tags`, `summary`, `operationId`.
  - `params`, `querystring`, `body`, `response`: MUST use Zod schemas from `api/helpers`.
- **Logic**:
  - Extract context: `const ctx = request.requesterContext as RequesterContext`.
  - Use mapper for response: `return reply.status(HttpStatusCode.Ok).send(someMapper.toDTO(domainEntity))`.

### 11. Mandatory DI Flow
- **Tokens**: MUST be defined in `src/main/di/injection-tokens.ts` grouped by layer (e.g., `infra`, `domain`).
- **Registration**:
  - Use `container.register()` or `container.registerSingleton()`.
  - For singletons: `container.register(injection.infra.someRepo, { useClass: DrizzleSomeRepo })`.
- **Resolution**:
  - ONLY resolve via constructor injection using `@inject()`.
  - Manual resolution (`container.resolve()`) is restricted to the server entry point (`main.ts`).

### 12. Monorepo & Package Management
- **Package Manager**: Use `pnpm` exclusively. Never use `npm` or `yarn`.
- **Workspaces**: The repository uses `pnpm workspaces`. All internal dependencies MUST be linked via workspace protocols (e.g., `workspace:*`).
- **Scripts**: Always run commands from the root or within workspace folders using `pnpm`.

### 13. Frontend API Integration (Strict)
- **Orval Mandate**: All API calls, TanStack Queries, and Mutations MUST be generated via **Orval**. 
- **Prohibited**: Manually building `axios` calls, `useQuery`, or `useMutation` for API interactions is strictly **FORBIDDEN**.
- **Workflow**: 
  1. Define/Update backend schemas and routes.
  2. Run Orval generation command (usually from the frontend or root).
  3. Import and use the generated hooks in components.

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
- **Commit Governance**: ONLY commit when explicitly instructed by the USER.
- **Semantic Commits**: Use `feat:`, `fix:`, `refactor:`, etc.
- **Progress Tracking**: Maintain `task.md` and `ROADMAP.md` actively.
