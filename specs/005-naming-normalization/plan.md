# Implementation Plan: Naming Normalization (Nature-Role Hybrid)

Standardize and normalize all naming conventions backend-wide using the **Nature-Role** hybrid pattern. This ensures both technical source (db, remote, job) and functional responsibility (Manager, Resolver, Finder, etc.) are clear from the name.

## User Review Required

> [!IMPORTANT]
> **Structural Change**: `ScanProductUseCase` and `ManualSearchUseCase` are being consolidated directly into the `CartManager`. This means `scan-product.interface.ts`, `manual-search.interface.ts`, `scan-product-use-case.ts`, and `manual-search-use-case.ts` will be deleted after their logic is migrated.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Principle I (Supreme Priority)**: Refactor improves Clean Architecture by clarifying layer responsibilities.
- [x] **Principle VI (Nomenclature)**: Directly implements and enforces the new naming mandate.
- [x] **Minimalism**: Removes redundant suffixes ("Service") as requested.
- [x] **DI Flow**: Standardizes tokens and registrations to avoid class-to-class injection.
- [ ] T030 **VALIDATE**: `pnpm lint && pnpm --filter backend typecheck && pnpm test` (Root-level verification)

## Project Structure

### Documentation (this feature)

```text
specs/005-naming-normalization/
├── plan.md              # This file
├── research.md          # Implementation decisions (db- vs remote-)
├── data-model.md        # Naming mapping inventory
├── quickstart.md        # Guide for new conventions
├── checklists/          # Quality checklists
└── tasks.md             # Task list
```

### Source Code (repository root)

```text
apps/backend/src/
├── domain/usecases/       # Stripping -service suffix
├── application/usecases/  # Adding db-/remote- prefixes
├── infrastructure/services/ # Renaming Clients to Services
└── main/di/               # Updating tokens and injections
```

**Structure Decision**: Standard Clean Architecture layout (no changes to directory structure, only file/class naming).

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |

## Proposed Changes

### [Consolidation] Cart Manager (`apps/backend/src/domain/usecases` & `apps/backend/src/application/usecases`)

- **Domain Layer**:
  - #### [MODIFY] [cart.ts](file:///home/tiago/01-dev-env/personal-repos/grocery-store/apps/backend/src/domain/usecases/cart.ts) (formerly `cart-service.ts`)
    - Rename `ICartService` -> `ICartManager`.
    - Incorporate types from `scan-product.interface.ts` and `manual-search.interface.ts`.
  - #### [DELETE] [scan-product.interface.ts](file:///home/tiago/01-dev-env/personal-repos/grocery-store/apps/backend/src/domain/usecases/scan-product.interface.ts)
  - #### [DELETE] [manual-search.interface.ts](file:///home/tiago/01-dev-env/personal-repos/grocery-store/apps/backend/src/domain/usecases/manual-search.interface.ts)

- **Application Layer**:
  - #### [MODIFY] [db-cart-manager.ts](file:///home/tiago/01-dev-env/personal-repos/grocery-store/apps/backend/src/application/usecases/db-cart-manager.ts) (formerly `cart-service.ts`)
    - Rename `CartService` -> `DbCartManager`.
    - Move logic from `ScanProductUseCase` and `ManualSearchUseCase` directly into `scanProduct` and `manualSearch` methods.
    - Inline repositories (ProductIdentity, Outbox) previously injected into separate use cases.
  - #### [DELETE] [scan-product-use-case.ts](file:///home/tiago/01-dev-env/personal-repos/grocery-store/apps/backend/src/application/usecases/products/scan-product-use-case.ts)
  - #### [DELETE] [manual-search-use-case.ts](file:///home/tiago/01-dev-env/personal-repos/grocery-store/apps/backend/src/application/usecases/products/manual-search-use-case.ts)

---

### [Domain Layer] Use Cases (`apps/backend/src/domain/usecases`)

Summary of interface renaming (Roles).

- #### [MODIFY] [user.ts](file:///home/tiago/01-dev-env/personal-repos/grocery-store/apps/backend/src/domain/usecases/user.ts) (formerly `user-service.ts`): `IUserService` -> `IUserManager`
- #### [MODIFY] [shopping-event.ts](file:///home/tiago/01-dev-env/personal-repos/grocery-store/apps/backend/src/domain/usecases/shopping-event.ts) (formerly `shopping-event-service.ts`): `IShoppingEventService` -> `IShoppingEventManager`
- #### [MODIFY] [group.ts](file:///home/tiago/01-dev-env/personal-repos/grocery-store/apps/backend/src/domain/usecases/group.ts) (formerly `group-service.ts`): `IGroupService` -> `IGroupManager`
- #### [MODIFY] [market.ts](file:///home/tiago/01-dev-env/personal-repos/grocery-store/apps/backend/src/domain/usecases/market.ts) (formerly `market-service.ts`): `IMarketService` -> `IMarketManager`
- #### [MODIFY] [product-hydrator.ts](file:///home/tiago/01-dev-env/personal-repos/grocery-store/apps/backend/src/domain/usecases/product-hydrator.ts) (formerly `hydrate-product.interface.ts`): `IHydrateProductUseCase` -> `IProductHydrator`

---

### [Application Layer] Use Cases (`apps/backend/src/application/usecases`)

Summary of implementation renaming (Nature-Role).

- #### [MODIFY] [db-user-manager.ts](file:///home/tiago/01-dev-env/personal-repos/grocery-store/apps/backend/src/application/usecases/db-user-manager.ts) (formerly `user-service.ts`): `UserService` -> `DbUserManager`
- #### [MODIFY] [db-shopping-event-manager.ts](file:///home/tiago/01-dev-env/personal-repos/grocery-store/apps/backend/src/application/usecases/db-shopping-event-manager.ts) (formerly `shopping-event-service.ts`): `ShoppingEventService` -> `DbShoppingEventManager`
- #### [MODIFY] [db-group-manager.ts](file:///home/tiago/01-dev-env/personal-repos/grocery-store/apps/backend/src/application/usecases/db-group-manager.ts) (formerly `group-service.ts`): `GroupService` -> `DbGroupManager`
- #### [MODIFY] [db-market-manager.ts](file:///home/tiago/01-dev-env/personal-repos/grocery-store/apps/backend/src/application/usecases/db-market-manager.ts) (formerly `market-service.ts`): `MarketService` -> `DbMarketManager`
- #### [MODIFY] [remote-product-hydrator.ts](file:///home/tiago/01-dev-env/personal-repos/grocery-store/apps/backend/src/application/usecases/products/remote-product-hydrator.ts) (formerly `hydrate-product-use-case.ts`): `HydrateProductUseCase` -> `RemoteProductHydrator`
- #### [MODIFY] [job-product-hydrator.ts](file:///home/tiago/01-dev-env/personal-repos/grocery-store/apps/backend/src/application/usecases/products/job-product-hydrator.ts) (formerly `hydrate-product-job.ts`): `HydrateProductJob` -> `JobProductHydrator`
- #### [MODIFY] [db-price-consensus-engine.ts](file:///home/tiago/01-dev-env/personal-repos/grocery-store/apps/backend/src/application/usecases/products/db-price-consensus-engine.ts) (formerly `pricing-consensus-service.ts`): `PricingConsensusService` -> `DbPriceConsensusEngine`

---

### [Infrastructure Layer] Services (`apps/backend/src/infrastructure/services`)

- #### [MODIFY] [open-food-facts-service.ts](file:///home/tiago/01-dev-env/personal-repos/grocery-store/apps/backend/src/infrastructure/services/open-food-facts-service.ts) (formerly `...client.ts`): `OpenFoodFactsClient` -> `OpenFoodFactsService`
- #### [MODIFY] [upcitemdb-service.ts](file:///home/tiago/01-dev-env/personal-repos/grocery-store/apps/backend/src/infrastructure/services/upcitemdb-service.ts) (formerly `...client.ts`): `UpcItemDbClient` -> `UpcItemDbService`
- #### [MODIFY] [composite-external-product-service.ts](file:///home/tiago/01-dev-env/personal-repos/grocery-store/apps/backend/src/infrastructure/services/composite-external-product-service.ts) (formerly `...client.ts`): `CompositeExternalProductClient` -> `CompositeExternalProductService`
- #### [MODIFY] [resilience-service.ts](file:///home/tiago/01-dev-env/personal-repos/grocery-store/apps/backend/src/infrastructure/services/resilience/resilience-service.ts) (formerly `buidler.ts`): `Buidler` -> `ResilienceService`

## Verification Plan

### Automated Tests
- Run `pnpm test` to ensure all existing tests pass with consolidated logic and new names.
- Run `pnpm --filter backend typecheck` (or `tsc --noEmit` in backend dir) for type checking.
- Run `pnpm lint` for code style verification.

### Manual Verification
- Verify DI container resolution in logs.
- Test `scanProduct` and `manualSearch` endpoints via Swagger or Postman to ensure they still work without delegation.
