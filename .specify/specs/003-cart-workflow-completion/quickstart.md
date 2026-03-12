# Quickstart: Cart Workflow

## Scanning Workflow
1. Shopper opens scanning interface (`ScannerOverlay`).
2. `react-zxing` captures barcode and sends to backend: `GET /api/products/scan/:barcode`.
3. Backend checks local `PhysicalEAN`.
4. If miss, backend triggers `CompositeExternalProductClient` (OFF/UPCitemdb).
5. If match found externally, `OutboxEvent` (ProductScanned) is emitted for background hydration.
6. `PriceConfirmationDrawer` opens in Frontend with Name, Brand, and Image.
7. Shopper confirms price and item is added to cart.

## Manual Search Workflow
1. Shopper enters query in search bar.
2. Backend receives `GET /api/products/search?q=...&page=...`.
3. Fuzzy match across `ProductIdentity` (Name/Brand) within local catalog only.
4. `Infinite Scroll` loads more results in the UI.

## Environment Setup
Ensure the following variables are in `.env`:
- `OFF_BASE_URL`
- `UPCITEMDB_BASE_URL`
- `UPCITEMDB_API_KEY` (Backend Secret)
