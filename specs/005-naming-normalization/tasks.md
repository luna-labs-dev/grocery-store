# Tasks: Naming Normalization and Semantic Refactor

**Input**: [spec.md](file:///home/tiago/01-dev-env/personal-repos/grocery-store/specs/005-naming-normalization/spec.md), [plan.md](file:///home/tiago/01-dev-env/personal-repos/grocery-store/specs/005-naming-normalization/plan.md)

## Phase 1: Setup & Domain Reinforcement

- [x] T001 Update `.specify/memory/constitution.md` and `guidelines.md` with strict Nature-Role naming rules
- [x] T002 Verify branch `005-naming-normalization` is active
- [x] T003 **VALIDATE**: `pnpm lint && pnpm --filter backend typecheck && pnpm test` (Root-level verification)

## Phase 2: Interface Normalization & Consolidation (Domain Layer)

- [x] T004 Rename `src/domain/usecases/cart-service.ts` -> `cart.ts` and `ICartService` -> `ICartManager`
- [x] T005 Consolidate: Migrate types from `scan-product.interface.ts` and `manual-search.interface.ts` to `cart.ts`
- [x] T006 [DELETE] `src/domain/usecases/scan-product.interface.ts` and `manual-search.interface.ts`
- [x] T007 Rename `src/domain/usecases/user-service.ts` -> `user.ts` and `IUserService` -> `IUserManager`
- [x] T008 Rename `src/domain/usecases/shopping-event-service.ts` -> `shopping-event.ts` and `IShoppingEventService` -> `IShoppingEventManager`
- [x] T009 Rename `src/domain/usecases/group-service.ts` -> `group.ts` and `IGroupService` -> `IGroupManager`
- [x] T010 Rename `src/domain/usecases/market-service.ts` -> `market.ts` and `IMarketService` -> `IMarketManager`
- [x] T011 Rename `src/domain/usecases/hydrate-product.interface.ts` -> `product-hydrator.ts` and `IHydrateProductUseCase` -> `IProductHydrator`

## Phase 3: Implementation Normalization & Consolidation (Application Layer)

- [x] T012 Rename `src/application/usecases/cart-service.ts` -> `db-cart-manager.ts` and `CartService` -> `DbCartManager`
- [x] T013 Consolidate: Migrate logic from `scan-product-use-case.ts` and `manual-search-use-case.ts` into `DbCartManager`
- [x] T014 [DELETE] `src/application/usecases/products/scan-product-use-case.ts` and `manual-search-use-case.ts`
- [x] T015 Rename `src/application/usecases/user-service.ts` -> `db-user-manager.ts` and `UserService` -> `DbUserManager`
- [x] T016 Rename `src/application/usecases/shopping-event-service.ts` -> `db-shopping-event-manager.ts` and `ShoppingEventService` -> `DbShoppingEventManager`
- [x] T017 Rename `src/application/usecases/group-service.ts` -> `db-group-manager.ts` and `GroupService` -> `DbGroupManager`
- [x] T018 Rename `src/application/usecases/market-service.ts` -> `db-market-manager.ts` and `MarketService` -> `DbMarketManager`
- [x] T019 Rename `src/application/usecases/products/hydrate-product-use-case.ts` -> `remote-product-hydrator.ts` and `HydrateProductUseCase` -> `RemoteProductHydrator`
- [x] T020 Rename `src/application/usecases/products/hydrate-product-job.ts` -> `job-product-hydrator.ts` and `HydrateProductJob` -> `JobProductHydrator`
- [x] T021 Rename `src/application/usecases/products/pricing-consensus-service.ts` -> `db-price-consensus-engine.ts` and `PricingConsensusService` -> `DbPriceConsensusEngine`

## Phase 4: Infrastructure Layer Refinement

- [x] T022 Rename `src/infrastructure/services/open-food-facts-client.ts` -> `open-food-facts-service.ts` and `OpenFoodFactsClient` -> `OpenFoodFactsService`
- [x] T023 Rename `src/infrastructure/services/upcitemdb-client.ts` -> `upcitemdb-service.ts` and `UpcItemDbClient` -> `UpcItemDbService`
- [x] T024 Rename `src/infrastructure/services/composite-external-product-client.ts` -> `composite-external-product-service.ts` and `CompositeExternalProductClient` -> `CompositeExternalProductService`
- [x] T025 Fix Buidler typo: `src/infrastructure/services/resilience/buidler.ts` -> `resilience/resilience-service.ts` and `Buidler` -> `ResilienceService`

## Phase 5: Integration & Global Cleanup

- [x] T026 Update `src/main/di/injection-tokens.ts` with normalized keys
- [x] T027 Update `src/main/di/injections.ts` with new class names and tokens
- [x] T028 Update all controllers in `src/api/controllers/` to use new injections
- [x] T029 Global import fix: search and replace all renamed references project-wide
- [x] T030 **VALIDATE**: `pnpm lint && pnpm --filter backend typecheck && pnpm test` (Root-level verification)

## Phase 6: Documentation

- [x] T031 Update `walkthrough.md` with naming normalization summary
