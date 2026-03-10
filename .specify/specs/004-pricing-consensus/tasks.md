# Tasks: Pricing Truth Consensus Engine

## Phase 1: Setup & Data Layer

- [ ] T001 Update Drizzle schema with `PriceReport` and `PriceHistory` tables.
- [ ] T002 Generate and run migrations.
- [ ] T003 [P] Configure Valkey cache keys for ephemeral consensus counters.

## Phase 2: Domain Logic (TDD)

- [ ] T004 Implement `ConsensusEngine` unit tests (Logic: 5-User Rule, 2% margin).
- [ ] T005 Implement `ConsensusEngine` logic to satisfy T004.
- [ ] T006 Implement `OutlierDetector` unit tests (Logic: 30% regional variance).
- [ ] T007 Implement `OutlierDetector` logic to satisfy T006.

## Phase 3: Application Services

- [ ] T008 Implement `ConsensusService` to coordinate reports, outliers, and persistence.
- [ ] T009 Add `isPromotion` handling to ignore temporary sales from history.
- [ ] T010 [P] Integration test: Submit 5 valid reports -> Verify `GoldenPrice`.

## Phase 4: Polish & API

- [ ] T011 Update `/api/products/:ean/prices/:marketId` to reflect consensus status.
- [ ] T012 Emit `price:verified` Socket.io events.
- [ ] T013 Final verification using `quickstart.md`.
