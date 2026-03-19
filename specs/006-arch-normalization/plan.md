# Implementation Plan: Architectural Normalization and Use Case Cleanup

**Branch**: `006-arch-normalization` | **Date**: 2026-03-18 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/006-arch-normalization/spec.md`

## Summary

This plan addresses architectural inconsistencies and dead code in the `grocery-store` backend. We will remove unused product-related services, flatten the use case directory structure, and ensure all use cases strictly follow Clean Architecture by implementing domain interfaces and adhering to semantic naming conventions. This directly supports the long-term maintainability and clarity of the product search and hydration flows.

## User Review Required

> [!IMPORTANT]
> This plan now enforces the **Global Test Standards** recently amended in the [Constitution](file:///home/tiago/01-dev-env/personal-repos/grocery-store/.specify/memory/constitution.md) (v1.7.0). 
> - ALL new and modified tests in this task will include the `CONTEXT_INTELLIGENCE_HEADER`.
> - ALL test descriptions will be extremely detailed and prefixed.
> - The goal is to establish a pattern that will be applied to the rest of the codebase in future tasks.

## Technical Context

**Language/Version**: TypeScript 5.7+ (Strict), Node.js 22+  
**Primary Dependencies**: Fastify, tsyringe (DI), Drizzle ORM  
**Storage**: PostgreSQL  
**Testing**: Vitest  
**Target Platform**: Linux (Node.js runtime)
**Project Type**: Web Service (Backend API)  
**Performance Goals**: N/A (Restructuring/Cleanup)  
**Constraints**: Clean Architecture boundaries, Strict Naming (Nature-Role), ABSOLUTE mandatory root-level verification.  
**Scale/Scope**: Use Case layer normalization and Product module cleanup.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Context |
|------|--------|---------|
| Clean Architecture | PASS | Moving implementations to `application/usecases` and interfaces to `domain/usecases`. |
| Semantic Naming | PASS | Enforcing `Nature-Role` pattern and removing "Service" from use case interfaces. |
| SOLID Integrity | PASS | Enforcing Dependency Inversion by using interfaces for all use cases. |
| Test Coverage | PASS | Red-Green-Refactor for any logic changes; structural changes verified by existing suite. |

## Project Structure

### Documentation (this feature)

```text
specs/006-arch-normalization/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output (N/A for this feature)
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A for this feature)
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
apps/backend/src/
├── application/
│   └── usecases/       # All managers and hydrators moved here (flat)
├── domain/
│   └── usecases/       # All use case interfaces (no "Service" suffix)
└── main/
    └── di/             # Injection tokens and container setup
```

**Structure Decision**: Flat Use Case structure in `application/usecases/`. This aligns with the existing `DbCartManager`, `DbGroupManager`, etc., and removes unnecessary nesting in `products/`.

## Proposed Changes

### Domain Layer (Usecases)

#### [NEW] price-consensus-engine.ts(file:///home/tiago/01-dev-env/personal-repos/grocery-store/apps/backend/src/domain/usecases/price-consensus-engine.ts)
- Define `IPriceConsensusEngine` interface and related DTOs.

---

### Application Layer (Contracts)

#### [MODIFY] price-report-repository.ts(file:///home/tiago/01-dev-env/personal-repos/grocery-store/apps/backend/src/application/contracts/repositories/product-hierarchy/price-report-repository.ts)
-   *Note*: Verify/Update existing `IPriceReportRepository` (ISP pattern) to ensure full alignment with `isOutlier` flagging.

#### [NEW] market-product-price-repository.ts(file:///home/tiago/01-dev-env/personal-repos/grocery-store/apps/backend/src/application/contracts/repositories/product-hierarchy/market-product-price-repository.ts)
-   Define `IMarketProductPriceRepository` (ISP style):
    - `GetMarketProductPriceRepository`: `getByMarketAndProduct(marketId, productIdentityId)`.
    - `SaveMarketProductPriceRepository`: `save(data)`.

#### [NEW] price-history-repository.ts(file:///home/tiago/01-dev-env/personal-repos/grocery-store/apps/backend/src/application/contracts/repositories/product-hierarchy/price-history-repository.ts)
-   Define `IPriceHistoryRepository` (ISP style):
    - `AddPriceHistoryRepository`: `add(data)`.

---

### Infrastructure Layer (Persistence)

#### [MODIFY] schema.ts(file:///home/tiago/01-dev-env/personal-repos/grocery-store/apps/backend/src/infrastructure/repositories/drizzle/setup/schema.ts)
-   Define `priceReportTable`: `id` (UUID), `userId`, `marketId`, `productIdentityId`, `price` (**money**), `reportedAt`, `isOutlier`.
-   Define `marketProductPriceTable`: 
    - **Primary Key**: Composite `(marketId, productIdentityId)`.
    - **Fields**: `marketId`, `productIdentityId`, `price` (**money**), `lastVerifiedAt`, `isVerified`.
-   Define `priceHistoryTable`: 
    - **Fields**: `id` (UUID), `marketId`, `productIdentityId`, `price` (**money**), `verifiedAt`, `consensusId` (UUID).

#### [NEW] drizzle-price-report-repository.ts(file:///home/tiago/01-dev-env/personal-repos/grocery-store/apps/backend/src/infrastructure/repositories/drizzle/drizzle-price-report-repository.ts)
-   Implement `IPriceReportRepository`.

#### [NEW] drizzle-market-product-price-repository.ts(file:///home/tiago/01-dev-env/personal-repos/grocery-store/apps/backend/src/infrastructure/repositories/drizzle/drizzle-market-product-price-repository.ts)
-   Implement `IMarketProductPriceRepository`.

#### [NEW] drizzle-price-history-repository.ts(file:///home/tiago/01-dev-env/personal-repos/grocery-store/apps/backend/src/infrastructure/repositories/drizzle/drizzle-price-history-repository.ts)
-   Implement `IPriceHistoryRepository`.

---

### Application Layer (Usecases)

#### [DELETE] search-products-service.ts(file:///home/tiago/01-dev-env/personal-repos/grocery-store/apps/backend/src/application/usecases/products/search-products-service.ts)
#### [DELETE] products/index.ts(file:///home/tiago/01-dev-env/personal-repos/grocery-store/apps/backend/src/application/usecases/products/index.ts)

#### [MOVE] job-product-hydrator.ts(file:///home/tiago/01-dev-env/personal-repos/grocery-store/apps/backend/src/application/usecases/job-product-hydrator.ts)
- Move from `products/` to root `usecases/`.
#### [MOVE] remote-product-hydrator.ts(file:///home/tiago/01-dev-env/personal-repos/grocery-store/apps/backend/src/application/usecases/remote-product-hydrator.ts)
- Move from `products/` to root `usecases/`.
#### [MOVE/REWRITE] db-price-consensus-engine.ts(file:///home/tiago/01-dev-env/personal-repos/grocery-store/apps/backend/src/application/usecases/db-price-consensus-engine.ts)
- Move from `products/` to root `usecases/`.
- Implement `IPriceConsensusEngine`.
- **Refined Logic**:
    - Apply 2% **mean-based** margin check across 5 unique user reports.
    - Enforce 72-hour window and 30% outlier rejection.
    - **Consensus Storage**:
        - **Update** `MarketProductPrice` (isVerified: true, price).
        - **Append** to `PriceHistory`.
    - Include architecture placeholders/TODOs for future `UserReputation` weighting.

#### [MODIFY] index.ts(file:///home/tiago/01-dev-env/personal-repos/grocery-store/apps/backend/src/application/usecases/index.ts)
- Update exports to reflect moved files and removed directory.

---

### Main Layer (DI)

#### [MODIFY] injections.ts(file:///home/tiago/01-dev-env/personal-repos/grocery-store/apps/backend/src/main/di/injections.ts)
- Update import paths for `JobProductHydrator`, `RemoteProductHydrator`, and `DbPriceConsensusEngine`.
- Register `IPriceConsensusEngine`, `PriceReportRepository`, and `MarketProductPriceRepository`.

---

### Test Layer (Unit Tests)

Every test file MUST start with the `CONTEXT_INTELLIGENCE_HEADER` and reside in `apps/backend/tests/unit/application/usecases/`.

#### [DELETE] search-products.spec.ts(file:///home/tiago/01-dev-env/personal-repos/grocery-store/apps/backend/tests/unit/application/usecases/products/search-products.spec.ts)
#### [DELETE] products/ (directory)

#### [MOVE/RENAME/MERGE] db-cart-manager.spec.ts
- Merge `manual-search.spec.ts` and `scan-product.spec.ts` into a single class-based test file.
- Ensure strict cohesion between Scan and Search actions.
#### [MOVE/RENAME/EXPAND] db-price-consensus-engine.spec.ts
- Move from `pricing-consensus.spec.ts`.
- Expand with 100% coverage for mean-based margin, 72h window, outlier logic, and **dual-storage (Update + Append)**.

#### [NEW] job-product-hydrator.spec.ts
#### [NEW] remote-product-hydrator.spec.ts

### Context Intelligence Header

Every test file created or updated in this task MUST start with the following comment block:

```typescript
/**
 * CONTEXT_INTELLIGENCE_HEADER: 006-arch-normalization
 * 
 * CORE CONSTRAINTS:
 * 1. CLEAN ARCHITECTURE: Every use case MUST implement a domain interface.
 * 2. SYMMETRIC STRUCTURE: Tests MUST match implementation filename and hierarchy.
 * 3. NOMENCLATURE: Use Nature-Role (e.g., DbCartManager). NO "Service" suffix for use cases.
 * 4. TDD STRICTNESS: Code MUST comply with these tests. NEVER modify tests to match code without user consent.
 * 5. ATOMICITY: Tests MUST be granular and cover success, failure, and edge cases.
 * 
 * BUSINESS RULES:
 * - Pricing Consensus: 5 unique users, 2% mean-based margin, 72h window, >30% outlier detection.
 * - Storage: Update MarketProductPrice (isVerified: true) AND Append to PriceHistory.
 */
```

## Verification Plan

### Automated Tests & Context Validation

1.  **Architecture Check (LSP/Typecheck)**:
    ```bash
    pnpm --filter backend typecheck
    ```
2.  **Symmetry & Header Validation**:
    - Verify `tests/unit/application/usecases/*.spec.ts` symmetry with `src/application/usecases/*.ts`.
    - Verify presence of `CONTEXT_INTELLIGENCE_HEADER` in all modified/new files.
3.  **Detailed Unit Test Execution**:
    ```bash
    pnpm --filter backend test
    ```
    - Check that all test descriptions are detailed (≥50 characters) and prefixed (e.g., `[PR-CONSENSUS-SUCCESS]`).
4.  **Linting & Cohesion**:
    ```bash
    pnpm lint
    ```

### Manual Verification
- Review `db-price-consensus-engine.spec.ts` to ensure it explicitly tests the **mean-based** margin calculation AND the **dual-storage** (Update + Append) logic.
- Verify schema migrations manually if applicable.
