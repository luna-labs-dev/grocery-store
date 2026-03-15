# Tasks: Cart Workflow Completion

**Input**: Design documents from `/.specify/specs/003-cart-workflow-completion/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Mandatory per Constitution Principle III. Write Red tests FIRST. 100% coverage required for all new logic.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

---

## Phase 0: Remediation & Alignment (CRITICAL)

**Purpose**: Fix reported bugs and align with updated guidelines before proceeding with new features.

- [x] T_REM_001 [P] Standardize `ProductController` routes to **singular** (`/api/product/...`) and unique `operationId`s in `apps/backend/src/api/controllers/product-controller.ts`
- [x] T_REM_002 [P] Update `VariableWeightParser` and `ScanProductUseCase` to align with singular route logic and `searchQuery` nomenclature.
- [x] T_REM_003 [P] Update Orval configuration (`orval.config.ts`) and run `pnpm orval` from project root.
- [x] T_REM_004 Migrate `use-scan-product.ts` to use Orval-generated `useScanProduct` hook.
- [x] T_REM_005 Migrate `product-search.tsx` to use Orval-generated `useSearchProductInfinite` hook (ensure `searchQuery` is used).
- [x] T_REM_006 Improve `ScannerOverlay` UX: decouple `isScanning` from `isPaused`, add backdrop to prevent background interaction.
- [x] T_REM_007 Verify all fixes: run backend tests, frontend tests, and manual scanning loop.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 [P] Define `ExternalFetchLog` and `OutboxEvent` schemas in `apps/backend/src/infrastructure/database/schema/`
- [ ] T002 [P] Register `OFF` and `UPCitemdb` environment variables in `apps/backend/src/main/config/env.ts`
- [ ] T003 Configure `Buidler` circuit breaker factory in `apps/backend/src/infrastructure/services/resilience/`
- [ ] T004 [P] Install `react-zxing` and `vaul` in `apps/frontend/` using `pnpm add react-zxing vaul`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [ ] T005 Create database migration for `physical_eans`, `external_fetch_logs`, and `outbox_events` in `apps/backend/drizzle/`
- [ ] T006 [P] Implement `VariableWeightParser` utility in `apps/backend/src/application/utils/`
- [ ] T007 [P] Define `ExternalProductClient` interface in `apps/backend/src/application/contracts/services/`
- [ ] T008 [P] Implement base `OutboxRepository` in `apps/backend/src/infrastructure/database/repositories/`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Product Scanning Interior Match (Priority: P1) 🎯 MVP

**Goal**: Instant recognition of products existing in the local database with mandatory price confirmation.

### Tests for User Story 1
- [ ] T009 [P] [US1] Unit test for `ScanProductUseCase` (Internal Match + FR-008 Confirmation) in `apps/backend/tests/unit/application/usecases/products/`
- [ ] T010 [P] [US1] Contract test for `GET /api/product/scan/:barcode` (ensure `requiresPriceConfirmation` in response) in `apps/backend/tests/contract/`
- [ ] T011 [P] [US1] Unit test for `ScannerOverlay` component in `apps/frontend/src/features/shopping-event/components/`

### Implementation for User Story 1
- [ ] T012 [P] [US1] Implement `DrizzlePhysicalEanRepository` in `apps/backend/src/infrastructure/database/repositories/`
- [ ] T013 [US1] Implement `ScanProductUseCase` with mandatory confirmation logic in `apps/backend/src/application/usecases/products/`
- [ ] T014 [US1] Create `ProductController.scanProduct` endpoint in `apps/backend/src/api/controllers/`
- [ ] T015 [US1] Implement `ScannerOverlay` using `react-zxing` (wrapped in a `Drawer`) in `apps/frontend/src/features/shopping-event/components/`
- [ ] T015.1 [US1] Implement "Access Denied" error state for `ScannerOverlay` (FR-011) with "Enter Manually" recovery path.
- [ ] T016 [US1] Implement `PriceConfirmationDrawer` using `vaul` in `apps/frontend/src/features/shopping-event/components/`

**Checkpoint**: User Story 1 (MVP) functional for local matches with full-stack confirmation flow.

---

## Phase 4: User Story 2 - External API Fallback (Priority: P1)

**Goal**: Search external databases (OFF/UPCitemdb) when local lookup fails.

### Tests for User Story 2
- [ ] T017 [P] [US2] Unit tests for `OpenFoodFactsClient` and `UpcItemDbClient` in `apps/backend/tests/unit/infrastructure/services/`
- [ ] T018 [US2] Unit test for `ScanProductUseCase` (External Fallback + Hydration Logic) in `apps/backend/tests/unit/application/usecases/products/`

### Implementation for User Story 2
- [ ] T019 [P] [US2] Implement `OpenFoodFactsClient` with circuit breaker in `apps/backend/src/infrastructure/services/`
- [ ] T020 [P] [US2] Implement `UpcItemDbClient` with circuit breaker in `apps/backend/src/infrastructure/services/`
- [ ] T021 [US2] Update backend `ScanProductUseCase` to include external fallback and outbox event emission
- [ ] T022 [US2] Create `HydrateProductJob` worker in `apps/backend/src/application/jobs/`
- [ ] T023 [US2] Handle external product loading states in frontend scan flow
- [ ] T023.1 [US2] Implement "Product Not Found" Drawer UI (FR-009) with "Enter Manually" path in `apps/frontend/src/features/shopping-event/components/`

**Checkpoint**: External fallbacks successfully hydrate the catalog.

---

## Phase 5: User Story 3 - Manual Search (Priority: P2)

**Goal**: Search for products by name/brand when barcodes are unavailable.

### Tests for User Story 3
- [ ] T024 [P] [US3] Unit test for `ManualSearchUseCase` (verifying `searchQuery` filter) in `apps/backend/tests/unit/application/usecases/products/`
- [ ] T025 [P] [US3] Unit test for `ProductSearch` component with infinite scroll (mocking `useSearchProductsInfinite`) in `apps/frontend/src/features/market/components/`

### Implementation for User Story 3
- [ ] T026 [P] [US3] Implement fuzzy search (`searchQuery`) + pagination in `DrizzleProductIdentityRepository` in `apps/backend/src/infrastructure/database/repositories/`
- [ ] T027 [US3] Implement `ManualSearchUseCase` in `apps/backend/src/application/usecases/products/`
- [ ] T028 [US3] Implement search UI in `apps/frontend/src/features/market/components/` using the Orval-generated `useSearchProductsInfinite` hook.

---

## Phase 6: User Story 4 - Variable-Weight Support (Priority: P3)

**Goal**: Extract weight/price from EAN-13 barcodes starting with "2".

### Tests for User Story 4
- [ ] T029 [P] [US4] Unit tests for `VariableWeightParser` in `apps/backend/tests/unit/application/utils/`
- [ ] T030 [US4] Integration test for full resolution of variable weight barcodes

### Implementation for User Story 4
- [ ] T031 [US4] Integrate `VariableWeightParser` into `ScanProductUseCase` logic
- [ ] T032 [US4] Update `PriceConfirmationDrawer` in frontend to display weight for price-embedded barcodes

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Cleanup and final verification

- [ ] T033 [P] Implement duplicate scan detection (quantity increment) in `CartService` in `apps/backend/src/application/services/`
- [ ] T034 [P] Add `sonner` toast confirmation for successful items additions in `apps/frontend/`
- [ ] T035 [P] Performance audit (Local speed SC-001, External total SC-002)
- [ ] T036 Complete quality gates: `pnpm vitest run`, `pnpm tsc`, and `pnpm biome check` across all workspaces

---

## Dependencies & Execution Order

### Phase Dependencies
- **Setup (Phase 1)**: Must complete T001-T004 first.
- **Foundational (Phase 2)**: T005-T008 block all user story logic.
- **User Stories**:
  - **US1 (P1)**: Baseline for all scanning UI and confirmation UX.
  - **US2 (P1)**: Extends US1 with backend-driven hydration.
  - **US3 (P2)**: Independent search feature.
  - **US4 (P3)**: Specialized parsing extension for deli/bakery items.

### Parallel Opportunities
- Backend and Frontend Setup tasks (Phase 1).
- US3 (Manual Search) implementation can run in parallel with US1/US2 after Foundational is complete.
- Most unit tests [P] can run in parallel.
