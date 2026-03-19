# Tasks: Standardize Exception Handling

**Input**: Design documents from `/specs/007-exception-handling-std/`
**Prerequisites**: [plan.md](file:///home/tiago/01-dev-env/personal-repos/grocery-store/specs/007-exception-handling-std/plan.md), [spec.md](file:///home/tiago/01-dev-env/personal-repos/grocery-store/specs/007-exception-handling-std/spec.md), [research.md](file:///home/tiago/01-dev-env/personal-repos/grocery-store/specs/007-exception-handling-std/research.md), [data-model.md](file:///home/tiago/01-dev-env/personal-repos/grocery-store/specs/007-exception-handling-std/data-model.md), [contracts/api-exception.md](file:///home/tiago/01-dev-env/personal-repos/grocery-store/specs/007-exception-handling-std/contracts/api-exception.md)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)

## Path Conventions

- **Backend**: `apps/backend/src/`
- **Tests**: `apps/backend/tests/`

---

## Phase 1: Setup (Renaming & Structure)

**Purpose**: Aligning project naming with the "Exception" convention (System Architect directive).

- [x] T001 Rename `apps/backend/src/domain/core/exceptions/base-error.ts` to `base-exception.ts` and update class name to `BaseException`.
- [x] T002 Update all imports of `BaseError` to `BaseException` across the backend workspace.
- [x] T003 Rename `apps/backend/src/domain/exceptions/` contents to follow kebab-case and the "Exception" suffix if missing.
- [x] T004 [P] Configure linting rule to prefer "Exception" over "Error" for internal classes (if applicable).

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure for the new exception pattern.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T005 [P] Implement `HttpStatusCode` enum or constant if not robustly available in `apps/backend/src/domain/core/enums/http-status-code.ts`.
- [x] T006 Refactor `BaseException` in `apps/backend/src/domain/core/exceptions/base-exception.ts` to support standard properties through the constructor and provide a `static standardSchema`.
- [x] T007 [P] Create `ExceptionMappingHelper` in `apps/backend/src/api/helpers/exception-mapping-helper.ts` with basic single-exception mapping.
- [x] T008 [P] Add unit tests for `BaseException` and `ExceptionMappingHelper` in `apps/backend/tests/unit/core/exceptions/base-exception.test.ts` (Mandatory failure scenarios, detailed descriptions).

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - Defining Predictable Exceptions (Priority: P1) 🎯 MVP

**Goal**: Update all domain exceptions to the new standardized pattern.

**Independent Test**: Verify that a specific domain exception (e.g., `UserNotFoundException`) can be used and returns the correct status code and schema.

### Tests for User Story 1

- [x] T009 [P] [US1] Create unit tests for initial batch of domain exceptions in `apps/backend/tests/unit/domain/exceptions/user-exceptions.test.ts`.

### Implementation for User Story 1

- [x] T010 [P] [US1] Update `apps/backend/src/domain/exceptions/user-exceptions.ts` to the new **Schema-First Inference pattern** (schema -> type -> class).
- [x] T011 [P] [US1] Update `apps/backend/src/domain/exceptions/group-exceptions.ts` to the new pattern.
- [x] T012 [P] [US1] Update all other files in `apps/backend/src/domain/exceptions/` to the new pattern.

**Checkpoint**: All domain exceptions standardized.

---

## Phase 4: User Story 2 - Documentation & Multi-mapping (Priority: P1)

**Goal**: Enable controllers to map multiple exceptions cleanly with union support for Swagger.

**Independent Test**: Use Swagger/Scalar UI to verify that an endpoint with multiple exceptions correctly shows the union of potential responses.

### Implementation for User Story 2

- [x] T013 [US2] Enhance `ExceptionMappingHelper` to automatically merge `BaseException.standardSchema` with subclass `static contextSchema` and inject literal codes.
- [x] T014 [US2] Update `apps/backend/src/api/controllers/group-controller.ts` to use the new `ExceptionMappingHelper`.
- [x] T015 [US2] [SKIP] Update `apps/backend/src/api/controllers/user-controller.ts` (Merged into AuthController).
- [x] T016 [US2] Update all remaining controllers to use the new `ExceptionMappingHelper`.

---

## Phase 5: User Story 3 - Type-safe Frontend Integration (Priority: P2)

**Goal**: Verify that Orval generates correct types for the new exception structures.

**Independent Test**: Run Orval and check the generated TypeScript types for a specific API endpoint.

### Tasks for User Story 3

- [x] T017 [US3] Run `pnpm run generate:api` (or equivalent Orval command) in the frontend/root.
- [x] T018 [US3] Verify generated types for exceptions in the frontend source code.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final integration and cleanup.

- [x] T019 Update global error handler in `apps/backend/src/main/fastify/setup/error-handler.ts` to use the new `BaseException` properties.
- [x] T020 [P] [US1] Implement **PII Sanitization layer** (FR-008) in the global exception handler using a sensitive field blacklist.
- [x] T021 [P] [US1] Integrate **Structured Logging** in the global handler to report all `BaseException` occurrences with full context.
- [x] T022 [P] Implement/Update "Unexpected Exception" handler to ensure safe sanitization of internal errors.
- [x] T023 [P] Documentation update: Finalize `quickstart.md` with real examples from the implementation.
- [x] T024 Final run of `pnpm lint`, `pnpm test`, and `pnpm --filter backend typecheck`.
- [x] T025 **Governance Update**: Register the standardized exception pattern (FR-009) in the project's global developer guidelines.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup (T001-T004). BLOCKS all User Stories.
- **User Stories (Phase 3-4)**: Depend on Foundational. Phase 4 integration depends on Phase 3 exceptions being ready.
- **Frontend (Phase 5)**: Depends on Backend implementation and documentation generation (Phase 4).
- **Polish (Phase 6)**: Final step.

---

## Implementation Strategy

### MVP First (User Story 1 & 2)

1. Complete Setup and Foundational phases.
2. Update User Exceptions (Story 1).
3. Implement `ExceptionMappingHelper` with multi-mapping (Story 2).
4. Update one controller (e.g., `UserController`) and verify Swagger.

---

## Notes
- [P] tasks = different files, no dependencies.
- [USx] label maps task to specific user story.
- Every test file MUST include `CONTEXT_INTELLIGENCE_HEADER`.
- Test descriptions MUST be ≥50 chars and prefixed with `[EXCEPTION-STRICT-TDD]`.
