# Tasks: Naming Normalization and Semantic Refactor

**Input**: [spec.md](file:///home/tiago/01-dev-env/personal-repos/grocery-store/specs/005-naming-normalization/spec.md), [plan.md](file:///home/tiago/01-dev-env/personal-repos/grocery-store/specs/005-naming-normalization/plan.md)

## Phase 1: Setup & Domain Reinforcement

- [x] T001 Update `.specify/memory/constitution.md` and `guidelines.md` with strict Nature-Role naming rules
- [x] T002 Verify branch `005-naming-normalization` is active
- [x] T003 **VALIDATE**: `pnpm lint && pnpm --filter backend typecheck && pnpm test` (Root-level verification)

## Phase 2: Interface Normalization & Consolidation (Domain Layer)

- [ ] T004 Rename `src/domain/usecases/cart-service.ts` -> `cart.ts` and `ICartService` -> `ICartManager`
- [ ] T005 Consolidate: Migrate types from `scan-product.interface.ts` and `manual-search.interface.ts` to `cart.ts`
- [ ] T006 [DELETE] `src/domain/usecases/scan-product.interface.ts` and `manual-search.interface.ts`
- [ ] T007 Rename `src/domain/usecases/user-service.ts` -> `user.ts` and `IUserService` -> `IUserManager`
- [ ] T008 Rename `src/domain/usecases/shopping-event-service.ts` -> `shopping-event.ts` and `IShoppingEventService` -> `IShoppingEventManager`
- [ ] T009 Rename `src/domain/usecases/group-service.ts` -> `group.ts` and `IGroupService` -> `IGroupManager`
- [ ] T010 Rename `src/domain/usecases/market-service.ts` -> `market.ts` and `IMarketService` -> `IMarketManager`
- [ ] T011 Rename `src/domain/usecases/hydrate-product.interface.ts` -> `product-hydrator.ts` and `IHydrateProductUseCase` -> `IProductHydrator`

## Phase 3: Implementation Normalization & Consolidation (Application Layer)

- [ ] T012 Rename `src/application/usecases/cart-service.ts` -> `db-cart-manager.ts` and `CartService` -> `DbCartManager`
- [ ] T013 Consolidate: Migrate logic from `scan-product-use-case.ts` and `manual-search-use-case.ts` into `DbCartManager`
- [ ] T014 [DELETE] `src/application/usecases/products/scan-product-use-case.ts` and `manual-search-use-case.ts`
- [ ] T015 Rename `src/application/usecases/user-service.ts` -> `db-user-manager.ts` and `UserService` -> `DbUserManager`
- [ ] T016 Rename `src/application/usecases/shopping-event-service.ts` -> `db-shopping-event-manager.ts` and `ShoppingEventService` -> `DbShoppingEventManager`
- [ ] T017 Rename `src/application/usecases/group-service.ts` -> `db-group-manager.ts` and `GroupService` -> `DbGroupManager`
- [ ] T018 Rename `src/application/usecases/market-service.ts` -> `db-market-manager.ts` and `MarketService` -> `DbMarketManager`
- [ ] T019 Rename `src/application/usecases/products/hydrate-product-use-case.ts` -> `remote-product-hydrator.ts` and `HydrateProductUseCase` -> `RemoteProductHydrator`
- [ ] T020 Rename `src/application/usecases/products/hydrate-product-job.ts` -> `job-product-hydrator.ts` and `HydrateProductJob` -> `JobProductHydrator`
- [ ] T021 Rename `src/application/usecases/products/pricing-consensus-service.ts` -> `db-price-consensus-engine.ts` and `PricingConsensusService` -> `DbPriceConsensusEngine`

## Phase 4: Infrastructure Layer Refinement

- [ ] T022 Rename `src/infrastructure/services/open-food-facts-client.ts` -> `open-food-facts-service.ts` and `OpenFoodFactsClient` -> `OpenFoodFactsService`
- [ ] T023 Rename `src/infrastructure/services/upcitemdb-client.ts` -> `upcitemdb-service.ts` and `UpcItemDbClient` -> `UpcItemDbService`
- [ ] T024 Rename `src/infrastructure/services/composite-external-product-client.ts` -> `composite-external-product-service.ts` and `CompositeExternalProductClient` -> `CompositeExternalProductService`
- [ ] T025 Fix Buidler typo: `src/infrastructure/services/resilience/buidler.ts` -> `resilience/resilience-service.ts` and `Buidler` -> `ResilienceService`

## Phase 5: Integration & Global Cleanup

- [ ] T026 Update `src/main/di/injection-tokens.ts` with normalized keys
- [ ] T027 Update `src/main/di/injections.ts` with new class names and tokens
- [ ] T028 Update all controllers in `src/api/controllers/` to use new injections
- [ ] T029 Global import fix: search and replace all renamed references project-wide
- [ ] T030 **VALIDATE**: `pnpm lint && pnpm --filter backend typecheck && pnpm test` (Root-level verification)

## Phase 6: Documentation

- [ ] T031 Update `walkthrough.md` with naming normalization summary
