# Tasks: Cart Workflow Completion (003)

**Input**: Design documents from `/.specify/specs/003-cart-workflow-completion/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Mandatory per Constitution Principle III. Write Red tests FIRST. 100% coverage required for all new logic.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and base requirements

- [ ] T001 Configure environment variables for OFF (Open Food Facts) and UPCitemdb in `apps/backend/.env`
- [ ] T002 Update `orval.config.ts` if needed to include new product-related endpoints

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [ ] T003 Create database migrations for `physical_ean` and `external_fetch_log` in `apps/backend/drizzle`
- [ ] T004 Implement `PhysicalEAN` and `ExternalFetchLog` entities in `apps/backend/src/infrastructure/repositories/drizzle/setup/schema.ts`
- [ ] T005 [P] Create `ExternalProductClient` interface and base Axios/HttpService configuration with 2000ms timeout in `apps/backend/src/infrastructure/external`
- [ ] T006 [P] Implement Circuit Breaker wrapper for external HTTP calls

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Product Scanning with Internal Match (Priority: P1) 🎯 MVP

**Goal**: Identify products quickly using local database mapping.

**Independent Test**: Scan an EAN-13 barcode that exists in the local `physical_eans` table. Verify it maps correctly to a `ProductIdentity`.

### Tests for User Story 1
- [ ] T007 [P] [US1] Unit test for `ScanProductUseCase` (Local Match) in `apps/backend/tests/unit/application/usecases/scan-product-usecase.spec.ts`
- [ ] T008 [P] [US1] Integration test for `PhysicalEanRepository` in `apps/backend/tests/integration/infrastructure/repositories/drizzle-physical-ean-repository.spec.ts`

### Implementation for User Story 1
- [ ] T009 [P] [US1] Implement `DrizzlePhysicalEanRepository` in `apps/backend/src/infrastructure/repositories/drizzle/drizzle-physical-ean-repository.ts`
- [ ] T010 [US1] Implement `ScanProductUseCase` (Local Match logic) in `apps/backend/src/application/usecases/scan-product-usecase.ts`
- [ ] T011 [US1] Create `/api/products/scan/:barcode` endpoint in `apps/backend/src/infrastructure/api/controllers/product-controller.ts`
- [ ] T012 [US1] Frontend: Basic Scanner UI with barcode capture in `apps/frontend/src/features/scanner/components/scanner-view.tsx`

**Checkpoint**: User Story 1 (Internal Scan) is functional.

---

## Phase 4: User Story 2 - External API Fallback (Priority: P1)

**Goal**: Fetch product details from OFF/UPCitemdb when not found locally.

**Independent Test**: Scan a barcode not in the local DB. Verify `ExternalProductClient` triggers and hydrates the local database.

### Tests for User Story 2
- [ ] T013 [P] [US2] Unit test for `OpenFoodFactsClient` (mocked) in `apps/backend/tests/unit/infrastructure/external/off-client.spec.ts`
- [ ] T014 [P] [US2] Integration test for background hydration (Outbox) in `apps/backend/tests/integration/application/workers/hydration-worker.spec.ts`

### Implementation for User Story 2
- [ ] T015 [P] [US2] Implement `OpenFoodFactsClient` in `apps/backend/src/infrastructure/external/off-client.ts`
- [ ] T016 [US2] Update `ScanProductUseCase` to include external fallback logic (depends on T010, T015)
- [ ] T017 [US2] Implement `ExternalFetchLog` persistence in `ScanProductUseCase`
- [ ] T018 [US2] Setup Outbox event for product hydration in `apps/backend/src/domain/products/events/product-fetched-event.ts`
- [ ] T019 [US2] Implement `BackgroundHydrationWorker` in `apps/backend/src/application/workers/hydration-worker.ts`

**Checkpoint**: User Story 2 (External Fallback) is functional.

---

## Phase 5: User Story 3 - Manual Search & Selection (Priority: P2)

**Goal**: Support broken labels/loose items via fuzzy search.

**Independent Test**: Perform fuzzy search for "Coca" and verify results include "Coca-Cola".

### Tests for User Story 3
- [ ] T020 [P] [US3] Unit test for `ManualSearchUseCase` in `apps/backend/tests/unit/application/usecases/manual-search-usecase.spec.ts`

### Implementation for User Story 3
- [ ] T021 [US3] Implement fuzzy search logic in `apps/backend/src/infrastructure/repositories/drizzle/drizzle-product-identity-repository.ts`
- [ ] T022 [US3] Implement `ManualSearchUseCase` in `apps/backend/src/application/usecases/manual-search-usecase.ts`
- [ ] T023 [US3] Add `/api/products/search` endpoint to `product-controller.ts`
- [ ] T024 [US3] Frontend: Search bar and results list in `apps/frontend/src/features/scanner/components/product-search-drawer.tsx`

**Checkpoint**: User Story 3 (Manual Search) is functional.

---

## Phase 6: User Story 4 - Variable-Weight Barcode Support (Priority: P3)

**Goal**: Recognition of price/weight embedded barcodes starting with '2'.

**Independent Test**: Scan a barcode starting with '2' and verify weight/price is correctly parsed in the cart.

### Tests for User Story 4
- [ ] T025 [P] [US4] Unit test for `VariableWeightParser` in `apps/backend/tests/unit/domain/products/services/variable-weight-parser.spec.ts`

### Implementation for User Story 4
- [ ] T026 [US4] Implement `VariableWeightParser` domain service in `apps/backend/src/domain/products/services/variable-weight-parser.ts`
- [ ] T027 [US4] Integrate `VariableWeightParser` into `ScanProductUseCase` logic
- [ ] T028 [US4] Implement price-to-weight auto-calculation logic (per FR-004 clarification)

**Checkpoint**: User Story 4 (Variable Weight) is functional.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements and final validation

- [ ] T029 [US1] Implement Duplicate Scan detection and quantity increment (FR-007) in `ScanProductUseCase`
- [ ] T030 [P] Frontend: Add Haptic Feedback on successful scan in `apps/frontend/src/hooks/use-haptics.ts` (if missing or update existing)
- [ ] T031 Frontend: Add visual feedback (toast/confetti) on product add
- [ ] T032 Run `quickstart.md` validation to ensure dev environment setup is valid
- [ ] T033 [P] Final architectural audit to ensure UseCases remain pure (Domain Layer check)

---

## Dependencies & Execution Order

### Phase Dependencies
- **Setup & Foundational**: Must complete T001-T006 before user stories.
- **US1 & US2**: US1 is the base; US2 extends it with external calls.
- **US4**: Depends on US1/US2 being able to identify the `ProductIdentity` to get unit price.

### Parallel Opportunities
- T005, T006 are parallel foundational tasks.
- Tests (T007, T008, T013, T014, T020, T025) are all parallelizable.
- Once Foundation is ready, US1, US2, and US3 can be worked on in parallel across different files.

---

## Parallel Example: User Story 1
```bash
# Developer A: Backend Core
Task T009: Implement PhysicalEanRepository
Task T010: Implement ScanProductUseCase

# Developer B: Frontend UI
Task T012: Create ScannerView component
```

## Implementation Strategy
### MVP First (User Story 1 & 2)
1. Complete Setup and Foundational database migrations.
2. Implement US1 for local database matches.
3. Implement US2 for external fallback (OFF).
4. **Validation**: Demonstrate a scan working for both local and external items.
