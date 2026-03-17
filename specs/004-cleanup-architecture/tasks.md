# Tasks: Codebase Reorganization and Architectural Alignment

**Input**: Design documents from `/specs/004-cleanup-architecture/`
**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story, strictly following **Clean Architecture > Clean Code > SOLID**.
**Atomic Strategy**: Every task is followed by a mandatory validation step (Lint + Typecheck + Test).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify architectural priority is correctly set up in the environment.

- [ ] T001 Verify baseline passes: `pnpm biome check && pnpm tsc && pnpm vitest run`
- [ ] T002 Verify `.specify/memory/constitution.md` contains Supreme Architectural Priority
- [ ] T003 Verify all speckit skills in `.agent/skills/` include architectural rules
- [ ] T004 [P] Ensure `apps/backend/src/main/di/injection-tokens.ts` is ready for refactor

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Consolidate core logic and interfaces to avoid duplication and layer violation.

### VariableWeightParser Unification
- [ ] T005 Move `VariableWeightParser` to `apps/backend/src/domain/core/logic/variable-weight-parser.ts`
- [ ] T006 Update imports in `CartService` and `ScanProductUseCase` to use the new domain location
- [ ] T007 Delete redundant `apps/backend/src/application/utils/variable-weight-parser.ts`
- [ ] T008 **VALIDATE**: `pnpm biome check && pnpm tsc && pnpm vitest run` for Scan/Cart logic

### Identity Repository Interface Consolidation
- [ ] T009 Consolidate `ProductIdentity` and `PhysicalEAN` repository interfaces in `src/application/contracts/repositories/product-identity-repository.ts`
- [ ] T010 **VALIDATE**: `pnpm biome check && pnpm tsc`

**Checkpoint**: Core interfaces and utilities consolidated - architectural alignment can proceed.

---

## Phase 3: User Story 1 - Maintainable Use Case Governance (Priority: P1) 🎯 MVP

**Goal**: Clear boundaries between Domain definitions and Application implementations.

**Independent Test**: Ensure `src/domain/usecases` has NO class implementations.

### Implementation for User Story 1

- [ ] T011 [P] [US1] Create missing Use Case interfaces in `apps/backend/src/domain/usecases/`
- [ ] T012 **VALIDATE**: `pnpm tsc`
- [ ] T013 [P] [US1] Refactor `CartService` in `apps/backend/src/application/usecases/cart-service.ts` to delegate `scanProduct` to `ScanProductUseCase`
- [ ] T014 **VALIDATE**: `pnpm vitest run tests/unit/application/usecases/cart-service.spec.ts`
- [ ] T015 [P] [US1] Refactor `CartService` to delegate `manualSearch` to `ManualSearchUseCase`
- [ ] T016 **VALIDATE**: `pnpm vitest run tests/unit/application/usecases/cart-service.spec.ts`
- [ ] T017 [P] [US1] Refactor `CartService` to delegate `hydrateProduct` logic to `HydrateProductUseCase`
- [ ] T018 **VALIDATE**: `pnpm vitest run tests/unit/application/usecases/cart-service.spec.ts`
- [ ] T019 [US1] Ensure all use case implementations in `apps/backend/src/application/usecases/` strictly implement their domain interface
- [ ] T020 **VALIDATE**: `pnpm biome check && pnpm tsc`

**Checkpoint**: CartService and core use cases refactored to delegate logic correctly.

---

## Phase 4: User Story 2 - SOLID Repository Implementation (Priority: P2)

**Goal**: Stable repository contracts decoupled from business logic.

**Independent Test**: All Drizzle repositories in `src/infrastructure/repositories/drizzle/` implement explicit interfaces.

### Implementation for User Story 2

- [ ] T021 [US2] Update `ProductIdentity` domain entity in `apps/backend/src/domain/entities/product-identity.ts` to include `source` (merging PhysicalEAN)
- [ ] T022 **VALIDATE**: `pnpm tsc`
- [ ] T023 [US2] Update `DrizzleProductIdentityRepository` in `apps/backend/src/infrastructure/repositories/drizzle/drizzle-product-identity-repository.ts` to use Domain entity and consolidated interface
- [ ] T024 **VALIDATE**: `pnpm tsc && pnpm vitest run` relevant repository tests
- [ ] T025 [US2] Refactor fragmented repository interfaces in `apps/backend/src/application/contracts/repositories/product-hierarchy/` into proper service-oriented contracts
- [ ] T026 **VALIDATE**: `pnpm tsc`
- [ ] T027 [US2] Remove `PhysicalEAN` entity and redundant repository files across all layers
- [ ] T028 **VALIDATE**: `pnpm tsc && pnpm vitest run`

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and documentation alignment.

- [ ] T029 [P] Update `src/main/di/injections.ts` to ensure all registration tokens match refined interfaces
- [ ] T030 **VALIDATE**: Full project `pnpm biome check && pnpm tsc && pnpm vitest run`
- [ ] T031 Update `walkthrough.md` with architectural cleanup status
- [ ] T032 Final check of SOLID adherence in all refactored files

---

## Dependencies & Execution Order

- **Phase 1 & 2**: MUST be completed first to establish the architectural baseline.
- **Phase 3 (P1)**: High priority cleanup of the "God Object" `CartService`.
- **Phase 4 (P2)**: Cleanup of infrastructure layer and contracts.
- **Phase 5**: Final verification and linting.

## Parallel Opportunities

- T011, T013, T015, T017 can run in parallel (different target files/methods).
- T021, T023 can run in parallel where independent.
