# Tasks: Architectural Normalization & Price Consensus Grounding

## Phase 1: Setup
- [ ] T001 [P] Verify project root prerequisites and current build state with `pnpm lint && pnpm test`

## Phase 2: Foundational (Schema, Repos & DI)
- [ ] T002 [P] Define `priceReportTable`, `marketProductPriceTable` (Composite PK), and `priceHistoryTable` (ConsensusID) in `apps/backend/src/infrastructure/repositories/drizzle/setup/schema.ts`
- [ ] T003 [P] Create `IPriceConsensusEngine` interface in `apps/backend/src/domain/usecases/price-consensus-engine.ts`
- [ ] T004 [P] Define or Update `IPriceReportRepository` (ISP) in `apps/backend/src/application/contracts/repositories/product-hierarchy/price-report-repository.ts`
- [ ] T005 [P] Create `IMarketProductPriceRepository` (ISP: Get/Save) in `apps/backend/src/application/contracts/repositories/product-hierarchy/market-product-price-repository.ts`
- [ ] T006 [P] Create `IPriceHistoryRepository` (ISP: Add) in `apps/backend/src/application/contracts/repositories/product-hierarchy/price-history-repository.ts`
- [ ] T007 [P] Implement `DrizzlePriceReportRepository` in `apps/backend/src/infrastructure/repositories/drizzle/drizzle-price-report-repository.ts`
- [ ] T008 [P] Implement `DrizzleMarketProductPriceRepository` in `apps/backend/src/infrastructure/repositories/drizzle/drizzle-market-product-price-repository.ts`
- [ ] T009 [P] Implement `DrizzlePriceHistoryRepository` in `apps/backend/src/infrastructure/repositories/drizzle/drizzle-price-history-repository.ts`
- [ ] T010 [P] Update DI tokens and registrations in `apps/backend/src/main/di/injection-tokens.ts` and `injections.ts`

## Phase 3: User Story 1 & 5 - Consensus Logic (P1)
- [ ] T011 [US1] [US5] Implement Mean-based 2% consensus logic in `apps/backend/src/application/usecases/db-price-consensus-engine.ts`
- [ ] T012 [US1] [US5] Implement Transactional Dual-Storage (Update Current + Always Append History with `consensusId`) in `apps/backend/src/application/usecases/db-price-consensus-engine.ts`
- [ ] T013 [US1] [US5] Create expansive unit tests with `CONTEXT_INTELLIGENCE_HEADER` in `apps/backend/tests/unit/application/usecases/db-price-consensus-engine.spec.ts`
- [ ] T014 [US1] [US5] Delete redundant `SearchProductsService.ts` and update related imports

## Phase 4: User Story 2 - Directory Normalization (P2)
- [ ] T015 [P] [US2] Move `JobProductHydrator.ts` and `RemoteProductHydrator.ts` to `apps/backend/src/application/usecases/`
- [ ] T016 [P] [US2] Create symmetric unit tests for `JobProductHydrator` in `apps/backend/tests/unit/application/usecases/job-product-hydrator.spec.ts`
- [ ] T017 [P] [US2] Create symmetric unit tests for `RemoteProductHydrator` in `apps/backend/tests/unit/application/usecases/remote-product-hydrator.spec.ts`
- [ ] T018 [US2] Merge scan/search tests into `apps/backend/tests/unit/application/usecases/db-cart-manager.spec.ts`

## Phase 5: Final Polish & Wiring
- [ ] T019 [P] Update exports in `apps/backend/src/application/usecases/index.ts`
- [ ] T020 Perform final root-level verification `pnpm lint && pnpm test && pnpm --filter backend typecheck`
