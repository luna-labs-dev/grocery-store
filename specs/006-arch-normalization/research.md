# Research: Architectural Normalization and Use Case Cleanup

## Decision 1: Keeping and Refining DbPriceConsensusEngine

- **Decision**: Keep and refine `DbPriceConsensusEngine.ts` instead of removing it.
- **Rationale**: 
    - The engine implements partially completed logic for pricing truth consensus (P1/P2 of the 004-pricing-consensus spec). 
    - Throwing away working code that aligns with future requirements is inefficient.
    - Instead of removal, we will normalize it by moving it to the root `usecases/`, creating a proper domain interface (`IPriceConsensusEngine`), and expanding unit tests to cover missing scenarios (2% margin, window filtering, etc.).
- **Alternatives Considered**: 
    - Removal: Initially proposed but rejected based on user feedback and future feature requirements.

## Decision 2: Flattening usecases/products Directory

- **Decision**: Move `JobProductHydrator.ts` and `RemoteProductHydrator.ts` to `apps/backend/src/application/usecases/` and delete the `products/` subdirectory.
- **Rationale**: 
    - Consistency with other "Managers" (Cart, Group, Market, User, ShoppingEvent) which are all flat in `application/usecases/`.
    - Simplifies imports and DI registration.
- **Alternatives Considered**: 
    - Keeping the subdirectory: Rejected to maintain a flat, consistent structure for implementation logic.

## Decision 5: Context Intelligence & TDD Guardrails

- **Decision**: Implement a mandatory `CONTEXT_INTELLIGENCE_HEADER` in all test files and enforce a strict "Test-First" implementation approach.
- **Rationale**: 
    - Prevents agents from modifying tests to match incorrect code (AI Drift).
    - Ensures that business rules defined in tests are treated as the ultimate source of truth.
    - Uses header comments as a persistent prompt for any agent reading the file, reminding it of Clean Architecture and SOLID constraints.
- **Alternatives Considered**: 
    - Relying on external specs: Rejected because co-locating the rules within the test code provides immediate "context awareness" for agents working on that file.
