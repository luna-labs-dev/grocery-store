# Tasks: Receipt Reconciliation & Fiscal Audit

## Phase 1: Setup & Data Layer

- [ ] T001 Update Drizzle schema with `FiscalRecord`, `FiscalItem`, and `PriceAudit` tables.
- [ ] T002 Generate and run migrations.
- [ ] T003 [P] Implement `NfcEProxyService` interface and mock implementation.

## Phase 2: Decoding Logic (TDD)

- [ ] T004 Implement `NfcEDecoder` unit tests (Parsing EAN, Price, Date).
- [ ] T005 Implement `NfcEDecoder` logic to satisfy T004.
- [ ] T006 [P] Implement `NfcEProxyService` real implementation for SEFAZ proxy.

## Phase 3: Reconciliation Engine (TDD)

- [ ] T007 Implement `ReconciliationEngine` unit tests (EAN match vs Fuzzy match).
- [ ] T008 Implement `ReconciliationEngine` logic to satisfy T007.
- [ ] T009 [P] Implement `AuditService` to coordinate the reconciliation flow.

## Phase 4: Integration & Polish

- [ ] T010 Integrate `AuditService` with current `ShoppingSession` persistence.
- [ ] T011 Handle "Fiscal Truth" flags in the `GoldenProduct` engine to lock prices.
- [ ] T012 Final verification using `quickstart.md`.
