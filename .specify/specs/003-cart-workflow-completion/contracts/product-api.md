# API Contracts: Product Scanning & Search

## 1. Product Scan
Standardized singular endpoint for barcode lookups.

**Endpoint**: `GET /api/product/scan/:barcode`
**OperationId**: `scanProduct`

### Response (200 OK)
```json
{
  "barcode": "7891234567890",
  "matchType": "LOCAL",
  "product": {
    "id": "uuid",
    "name": "Coca-Cola 350ml",
    "brand": "Coca-Cola",
    "imageUrl": "https://...",
    "canonicalProductId": "uuid"
  },
  "requiresPriceConfirmation": true
}
```

---

## 2. Manual Product Search
Search local catalog with pagination support for infinite scroll.

**Endpoint**: `GET /api/product/search`
**OperationId**: `searchProducts`
**Query Params**:
- `searchQuery`: String (min 2 chars)
- `pageIndex`: Number (default 0)
- `pageSize`: Number (default 10)

### Response (200 OK)
```json
{
  "items": [
    {
      "id": "uuid",
      "name": "Apples",
      "brand": "Organic",
      "imageUrl": "https://...",
      "canonicalProductId": "uuid"
    }
  ],
  "total": 125,
  "nextPageIndex": 1
}
```

---

## 3. Frontend Integration (Orval)
All hooks are generated via Orval.
- `useScanProduct`: Mutation for scanning.
- `useSearchProductsInfinite`: Infinite query for manual search.
