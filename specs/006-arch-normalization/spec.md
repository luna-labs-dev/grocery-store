# Feature Specification: Architectural Normalization and Use Case Cleanup

**Feature Branch**: `006-arch-normalization`  
**Created**: 2026-03-18  
**Status**: Draft  
**Input**: User description: "Address usecases without interfaces, product module structure, and unused search-products-service while strictly following Clean Architecture and SOLID."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Cleanup Unused Code and Refine Pricing Engine (Priority: P1)

Remove `SearchProductsService` as it is redundant. However, **KEEP** and **REFINE** `DbPriceConsensusEngine` to ensure it meets the requirements of the Pricing Truth Consensus feature (5-User rule, 2% margin, Outlier detection).

**Why this priority**: High priority because it preserves valuable logic while removing actual dead code and ensuring architectural consistency for a core feature.

**Independent Test**: Can be tested by running the expanded unit tests for `DbPriceConsensusEngine` and verifying it correctly handles consensus, outliers, and margin checks.

**Acceptance Scenarios**:

1. **Given** the current codebase, **When** `SearchProductsService.ts` is deleted, **Then** the project MUST still compile and run correctly.
2. **Given** `DbPriceConsensusEngine`, **When** 5 unique users report prices within a 2% margin, **Then** it MUST correctly identify consensus.
3. **Given** a price report >30% from regional average, **When** processed by the engine, **Then** it MUST be flagged as an outlier.

---

### User Story 2 - Normalize Use Case Directory Structure (Priority: P2)

Move product-related use cases (`JobProductHydrator`, `RemoteProductHydrator`, and `DbPriceConsensusEngine`) from the nested `products/` subdirectory to the root `application/usecases/` directory to maintain a consistent, flat structure.

**Why this priority**: Consistency makes the project easier to navigate and follows the established pattern of other managers.

**Independent Test**: Can be tested by verifying that all imports to the moved files are correctly updated.

**Acceptance Scenarios**:

1. **Given** the `products/` subdirectory, **When** active use cases are moved to `application/usecases/`, **Then** all internal and external references MUST be updated.
2. **Given** the new flat structure, **When** building the app, **Then** there should be no broken paths.

---

### User Story 5 - TDD Strictness & Context Intelligence (Priority: P1)

Enforce a strict TDD workflow where tests are highly detailed and immutable without user consent. Every test file MUST contain a "Context Intelligence Header" that enforces architectural and behavioral constraints directly on the AI agent.

**Why this priority**: Prevents "AI drift" where code determines tests instead of tests determining code. Ensures absolute adherence to business rules (like the 5-user, 2% margin rule).

**Independent Test**: Verify that every new/updated test file contains the standard `CONTEXT_INTELLIGENCE_HEADER` and that all test descriptions are unique, prefixed with a code (e.g., `[UC-001-SUCCESS]`), and extremely detailed.

**Acceptance Scenarios**:

1. **Given** a new test file, **When** created, **Then** it MUST contain the standard project header reminding the runner of SOLID and Clean Arch principles.
2. **Given** a test case for consensus, **When** named, **Then** it MUST describe the exact inputs, expected state changes, and final output (e.g., `[PR-CONSENSUS-001] When 5 unique users (IDs u1-u5) report price $10.00 for product P1 at market M1 within 72h, Then the status MUST transition to Verified and the Golden Price be updated`).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST NOT contain `SearchProductsService`.
## Clarifications

### Session 2026-03-18
- Q: Where should the "Verified" status and consensus price be stored? → A: Update/Insert into `MarketProductPrice` table (Current Truth) and append to `PriceHistory` table (Historical Log).
- Q: Is "User Reputation Weighting" in scope? → A: Core logic only (5 users/2% margin), but leave the architecture open for future expansion (placeholders/TODOs).
- Q: How should the 2% margin be calculated? → A: Mean-based; all 5 reports must be within 2% of their calculated average.
- Q: Storage Strategy (Composite Keys, Transactions, History Metadata)? → A: 
    - **Composite Primary Key** `(marketId, productIdentityId)` for `MarketProductPrice`.
    - **A-C-I-D Transaction**: Every consensus update MUST wrap the "Update Current" and "Append History" in a single transaction.
    - **Historical Pulsing**: New rows in `PriceHistory` MUST be added even if the price is identical (pulse of verification).
    - **Enhanced Metadata**: `PriceHistory` will include a `consensusId` (UUID) to group the contributing reports.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST NOT contain `SearchProductsService`.
- **FR-002**: `DbPriceConsensusEngine` MUST implement the **5-User Rule** with a **2% mean-based margin** check.
- **FR-003**: `DbPriceConsensusEngine` MUST enforce a **72-hour window** for consensus.
- **FR-004**: `DbPriceConsensusEngine` MUST flag reports as **outliers** if they vary >30% from the regional average.
- **FR-005**: All product-related use cases MUST reside in the root of `apps/backend/src/application/usecases/`.
- **FR-006**: Every use case MUST implement an interface defined in `apps/backend/src/domain/usecases/`.
- **FR-007**: Test files MUST match implementation filenames and follow the exact same directory hierarchy.
- **FR-008**: EVERY test file MUST include a standard **Context Intelligence Header** comment block.
- **FR-009**: Test descriptions MUST use the prefix notation `[COMPONENT-CODE-RESULT]` and provide granular detail of the scenario.
- **FR-010**: `DbPriceConsensusEngine` SHOULD be designed to allow future integration of User Reputation.
- **FR-011**: System MUST define `PriceReport`, `MarketProductPrice` and `PriceHistory` tables in the Drizzle schema.
- **FR-012**: Upon consensus, the system MUST:
    - **Update** `MarketProductPrice` with the latest verified price and `isVerified: true`.
    - **Append** a new record to `PriceHistory` for long-term tracking.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of classes in `application/usecases/` implement a domain interface.
- **SC-002**: `DbPriceConsensusEngine` unit test coverage reaches 100% for the consensus logic paths.
- **SC-003**: Zero build, lint, or typecheck failures.
- **SC-004**: 100% of test files in `tests/unit/application/usecases/` contain the `CONTEXT_INTELLIGENCE_HEADER`.
- **SC-005**: All test descriptions are ≥ 50 characters in length (ensuring detail) and follow the prefix convention.
- **SC-006**: Cohesion Check: `db-cart-manager.spec.ts` correctly partitions tests for distinct business actions (Scan vs Manual Search) within the same class context.
