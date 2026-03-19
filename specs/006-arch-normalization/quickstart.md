# Quickstart: Architectural Normalization

## 1. Cleanup Dead Code
Delete the following unused file:
- `apps/backend/src/application/usecases/products/search-products-service.ts`

## 1. Define Repository Contracts (ISP)
Following the Interface Segregation Principle, define the following in `apps/backend/src/application/contracts/repositories/product-hierarchy/`:
- **`price-report-repository.ts`**: Update `IPriceReportRepository` to support outlier tagging.
- **`market-product-price-repository.ts`**: New `IMarketProductPriceRepository` (Get/Save).
- **`price-history-repository.ts`**: New `IPriceHistoryRepository` (Add).

## 2. Schema and Infrastructure Setup
- **Modify `schema.ts`**: Define `priceReportTable`, `marketProductPriceTable`, and `priceHistoryTable` using the custom `money` type.
- **Implement Repositories**: Create `DrizzlePriceReportRepository`, `DrizzleMarketProductPriceRepository`, and `DrizzlePriceHistoryRepository` in `infrastructure/repositories/drizzle/`.

## 3. Implement Domain Interfaces
Create `apps/backend/src/domain/usecases/price-consensus-engine.ts` with the `IPriceConsensusEngine` interface.

## 4. Relocate and Refine Use Cases
Move files from `products/` to root `application/usecases/`:
- `JobProductHydrator.ts`
- `RemoteProductHydrator.ts`
- `DbPriceConsensusEngine.ts` (Implement `IPriceConsensusEngine` and **Transactional Dual-storage** logic).

## 5. Update Dependency Injection
- Update `apps/backend/src/main/di/injection-tokens.ts`.
- Update `apps/backend/src/main/di/injections.ts` with new paths and register ALL new repository interfaces and the `IPriceConsensusEngine`.

## 6. Reorganize and Expand Testing (STRICT TDD)
Relocate, rename, and **rewrite** tests to achieve 100% symmetry and strict compliance:

- **Header**: ALL test files MUST start with the `CONTEXT_INTELLIGENCE_HEADER`.
- **Delete**: `apps/backend/tests/unit/application/usecases/products/search-products.spec.ts`.
- **Merge & Move**: `manual-search.spec.ts` and `scan-product.spec.ts` into a new `apps/backend/tests/unit/application/usecases/db-cart-manager.spec.ts`.
- **Rename & Move**: `pricing-consensus.spec.ts` -> `apps/backend/tests/unit/application/usecases/db-price-consensus-engine.spec.ts`.
- **Write New**: `job-product-hydrator.spec.ts` and `remote-product-hydrator.spec.ts`.
- **Verification Logic**: Ensure `db-price-consensus-engine.spec.ts` validates the **Mean-based margin**, **Transactional Dual-storage**, and **Always Append** (pulse) logic.

## 7. Verification
Run:
```bash
pnpm lint
pnpm test
pnpm --filter backend typecheck
```
Verify:
1.  Symmetry: `src/application/usecases/` files match `tests/unit/application/usecases/` files.
2.  Clean Arch: Use cases depend on `IMarketProductPriceRepository`, not Drizzle implementations.
3.  Consensus: Unit tests confirm price is updated and history is appended in a single transaction.
