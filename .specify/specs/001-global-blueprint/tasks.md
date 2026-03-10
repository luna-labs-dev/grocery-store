# Tasks: Global Product Blueprint

**Input**: Design documents from `/.specify/.specify/.specify/specs/001-global-blueprint/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts.md

## Phase 1: Setup (Infrastructure Upgrade)

**Purpose**: Establish the missing testing baseline across the monorepo.

- [ ] T001 [P] Configure `apps/backend/vitest.config.ts` with 100% coverage gates for new work.
- [ ] T002 [P] Initialize `apps/frontend` testing: `npm install -D vitest @testing-library/react @testing-library/jest-dom`.
- [ ] T003 Create `apps/frontend/vitest.config.ts` for component/hook verification.
- [ ] T004 [P] Initialize Playwright globally: `npm init playwright@latest` in monorepo root (or `apps/frontend`).

---

## Phase 2: Foundational (Audit & Contract Verification)

**Purpose**: Verify the core 4-tier Product Engine and ABAC security.

- [ ] T005 Audit Schema: Verify `Physical EAN` -> `Product Identity` -> `Canonical Product` mapping in Drizzle files.
- [ ] T006 [P] Verify ABAC: Audit all `AdminController` routes for `SecurityPermissionService` calls.
- [ ] T007 [P] Contract Check: Run Orval sync and verify types match `contracts.md`.

---

## Phase 3: User Story 1 - System Audit & Integrity (Priority: P1)

**Goal**: Close existing Backend TDD gaps.

- [ ] T008 [US1] Implement Red tests for `pricing-consensus.spec.ts`.
- [ ] T009 [US1] Implement pricing consensus logic (if missing) to pass T008.
- [ ] T010 [US1] Implement Red tests for `search-products.spec.ts` (Local + OFF fallback).
- [ ] T011 [US1] Refactor/Complete product search logic to satisfy T010.
- [ ] T012 [US1] Finalize token validation tests in `invite-member.spec.ts`.

---

## Phase 4: User Story 2 - Full-Stack Testing Mandate (Priority: P1)

**Goal**: Verify the UI surface and CUJs.

- [ ] T013 [US2] Create behavioral test for `ScanProductDrawer` component (Mock OFF response).
- [ ] T014 [US2] Create behavioral test for `GroupInviteQR` display and interaction.
- [ ] T015 [US2] Write Playwright E2E for "Register -> Create Group -> Invite -> Join" journey.
- [ ] T016 [US2] Write Playwright E2E for "Start Shop -> Scan -> Real-time Update" journey.

---

## Phase 5: User Story 4 - Receipt Reconciliation & Fiscal Audit (Priority: P2)

**Goal**: Implement the NFC-e parsing and audit logic.

- [ ] T017 [US4] Create `NfcEDecoder` service with Brazilian SEFAZ proxy support.
- [ ] T018 [US4] Implement the `ReconciliationEngine` to map ticket items to shopping events.
- [ ] T019 [US4] Create a test suite for "Price Delta" identification using mock fiscal data.

---

## Phase 6: Polish & Report

- [ ] T017 Generate "Application Health Report" (Summary of all passing tests/coverage).
- [ ] T018 [P] Documentation updates in `docs/refactor/` with audit results.
- [ ] T019 Run `quickstart.md` validation across both projects.
