# Quickstart: Cart Workflow Completion

## Setup
1. Ensure the PostgreSQL database is up and running (`pnpm db:up`).
2. Run migrations to include `PhysicalEAN` and `ExternalFetchLog` tables.
3. Configure environment variables for external APIs:
   - `OFF_API_URL=https://world.openfoodfacts.org`
   - `UPCITEMDB_API_KEY=your_key` (if applicable)

## Running Tests
- Unit tests: `pnpm test apps/backend/src/domain/products`
- Integration tests: `pnpm test apps/backend/tests/integration/products`
- Scanner flow E2E: `pnpm playwright test tests/e2e/scanner.spec.ts`

## Key UseCases
- `ScanProductUseCase`: Orchestrates the lookup and fallback.
- `FetchExternalProductUseCase`: Handles API calls and circuit breaking.
- `ManualSearchUseCase`: Handles fuzzy search logic.
