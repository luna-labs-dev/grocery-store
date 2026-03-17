# Feature Specification: Naming Normalization and Semantic Refactor

**Feature Branch**: `005-naming-normalization`  
**Created**: 2026-03-17  
**Status**: Draft  
**Input**: User description: "Normalize all naming conventions across the codebase. Remove -service suffix from interfaces. Use db-/remote- prefixes for implementations. Reserve 'service' suffix for external services. Fix typos like Buidler."

## Clarifications

### Session 2026-03-17
- Q: Role suffix for `SearchProductsService`? → A: Use `RemoteProductFinder` (alignment with manual search). Class: `RemoteProductFinder`, File: `remote-product-finder.ts`.
- Q: Background worker naming convention? → A: Use `Job` prefix and keep role suffix (e.g., `JobProductHydrator`, Interface: `IProductHydrator`).
- Q: Resilience utility nature prefix? → A: No prefix for pure infra utilities. Use `ResilienceService` (File: `resilience-service.ts`).
- Q: Domain filenames for Scan/Search? → A: Use physical action names (`product-scan.ts`, `product-manual-search.ts`) instead of role-suffix matching.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Semantic Discovery (Priority: P1)

As a Developer, I want to immediately understand the nature of a component's implementation by looking at its name and file, so that I don't have to open the file to know if it deals with local data or external services.

**Why this priority**: High. This directly addresses the "crap all over the code" and "obscure naming" complaints. It's the core value of the refactor.

**Independent Test**: Identify any implementation class in `src/application/usecases` and verify its prefix matches its nature (DB vs Remote).

**Acceptance Scenarios**:

1. **Given** a UseCase interface in `src/domain/usecases`, **When** I check its name, **Then** it must NOT contain the word "Service" AND it MUST have a semantic "Role" suffix (e.g., `ICartManager`, `IProductResolver`).
2. **Given** a UseCase implementation file in `apps/backend/src/application/usecases`, **When** it mainly interacts with the database, **Then** it must be prefixed with `db-` and suffixed with its Role (e.g., `DbCartManager`).
3. **Given** a UseCase implementation file in `apps/backend/src/application/usecases`, **When** it mainly interacts with external APIs, **Then** it must be prefixed with `remote-` and suffixed with its Role (e.g., `RemoteProductResolver`).

---

### User Story 2 - Lexical Precision (Priority: P2)

As a Maintenance Engineer, I want the codebase to be free of typos and obscure jargon (like "Buidler"), so that the system remains accessible to new developers and follows professional standards.

**Why this priority**: Medium. Improves professionalism and reduces cognitive load, but secondary to the structural semantic naming.

**Independent Test**: Search for "Buidler" in the codebase and verify 0 results, while ensuring the resilience functionality remains intact.

**Acceptance Scenarios**:

1. **Given** the resilience component previously named "Buidler", **When** I use the DI container, **Then** I find it renamed to a semantically correct name like `ResilienceBuilder`.

---

### Edge Cases

- **Mixed Nature UseCases**: Handling UseCases that hit both DB and Remote services (Decision: Use the primary/orchestrating nature).
- **Core Entities**: Ensuring entities aren't accidentally caught in suffix-stripping if "Service" was part of their actual domain name (unlikely in this context).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST rename all UseCase interfaces in `src/domain/usecases` to remove the "Service" suffix and add a semantic "Role" suffix.
- **FR-002**: System MUST consolidate `IScanProductUseCase` and `IManualSearchUseCase` into `ICartManager`.
- **FR-003**: System MUST rename all UseCase implementation files to follow the `db-`, `remote-`, or `job-` prefix rule + the semantic "Role" suffix.
- **FR-004**: System MUST consolidate `ScanProductUseCase` and `ManualSearchUseCase` implementations into `DbCartManager`.
- **FR-005**: System MUST rename UseCase implementation classes to match their filename exactly (e.g., `DbCartManager`, `RemoteProductResolver`).
- **FR-006**: System MUST rename the resilience component `Buidler` to `ResilienceService` (File: `resilience-service.ts`).
- **FR-007**: System MUST update all DI tokens and registrations to reflect the new conventions.
- **FR-008**: System MUST update all imports across the entire monorepo to maintain build integrity.

### Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of files in `src/application/usecases` follow the naming convention.
- **SC-002**: 0 instances of the word "Service" in UseCase interface names in `src/domain/usecases`.
- **SC-003**: All search use cases use the `Finder` role (e.g., `RemoteProductFinder` for search).
- **SC-04**: System integrity is preserved with all functional and regression tests passing (`pnpm test` success at root).
- **SC-005**: Code quality standards are satisfied across all refactored components without any justified exceptions (`pnpm lint` and `pnpm --filter backend typecheck` success at root).
