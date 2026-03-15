# Quickstart: Feature 003

## Prerequisites
- **Backend Secrets**: Ensure `OPEN_FOOD_FACTS_API_KEY` (if any) and `UPC_ITEM_DB_KEY` are in `.env`.
- **Database**: Run migrations (`pnpm drizzle-kit push`) to create `physical_eans`, etc.

## Development Workflow
1. **Backend**: Implement the `ScanProductUseCase` and `ManualSearchUseCase`.
2. **Schema**: Verify `product-schemas.ts` matches the contract (`searchQuery` instead of `q`).
3. **Orval**: Run `pnpm orval` to update frontend hooks.
4. **Frontend**:
   - Use `useScanProduct` in `use-scan-product.ts`.
   - Use `useSearchProductsInfinite` in `product-search.tsx`.
   - Wrap the scanner in a `Drawer` in the Details page.
   - Handle the `TrackKindSettings` error state for "Access Denied".

## Testing
- Unit: `pnpm vitest apps/backend/src/application/usecases/products`
- Contract: `pnpm vitest apps/backend/tests/contract/product`
- UI: Use the simulated scanner tool; test denied permissions by mocking `navigator.mediaDevices.getUserMedia` rejection.
