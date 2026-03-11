# Contract: Product Scanning

## Endpoint: GET `/api/products/scan/:barcode`

Identifies a product by its barcode (EAN-13/UPC). This endpoint follows a prioritized lookup strategy:
1. Local `PhysicalEAN` lookup.
2. External API fallback (Open Food Facts / UPCitemdb) with circuit breaker.
3. Persistence of fetched products (Outbox pattern).

### Request
- **Method**: `GET`
- **Path**: `/api/products/scan/:barcode`
- **Params**:
  - `barcode`: String (EAN-13/UPC)

### Response (200 OK)
Returns the matching `ProductIdentity` and its associated `CanonicalProduct`.

```json
{
  "barcode": "7891234567890",
  "identity": {
    "id": "uuid",
    "name": "Coca-Cola 350ml",
    "brand": "Coca-Cola",
    "imageUrl": "https://...",
    "type": "EAN"
  },
  "canonicalProduct": {
    "id": "uuid",
    "name": "Coca-Cola",
    "description": "..."
  },
  "source": "LOCAL | OFF | UPCITEMDB"
}
```

### Response (202 Accepted)
Triggered when an external fetch is initiated but exceeds the fast-response threshold. The client should poll or wait for the outbox processing if real-time hydration is desired. (Alternatively, return 200 with partial data if OFF returns immediately).

### Response (404 Not Found)
When the product is not found locally or externally.

---

## Endpoint: GET `/api/products/search`

Manual fuzzy search for products.

### Request
- **Params**:
  - `q`: Search query string

### Response (200 OK)
List of matching `CanonicalProduct` or `ProductIdentity` items.
