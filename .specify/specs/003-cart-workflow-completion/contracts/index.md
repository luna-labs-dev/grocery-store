# API Contracts: Product Scanning & Search

## 1. Scan Product
**Endpoint**: `GET /api/products/scan/:barcode`  
**Description**: Scans a barcode. Checks internal DB first, then falls back to OFF/UPCitemdb.

### Request
```typescript
const scanProductParamsSchema = z.object({
  barcode: z.string().describe('GTIN-13 or UPC-A barcode'),
});
```

### Response (200 OK)
```typescript
const scanProductResponseSchema = z.object({
  product: z.object({
    id: z.string(),
    name: z.string(),
    brand: z.string().nullable(),
    imageUrl: z.string().url().nullable(),
  }).nullable(),
  matchType: z.enum(['INTERNAL', 'EXTERNAL', 'NONE']),
});
```

---

## 2. Manual Search
**Endpoint**: `GET /api/products/search`  
**Description**: Fuzzy search across Product Identity name and brand.

### Request
```typescript
const manualSearchQuerySchema = z.object({
  query: z.string().min(2).describe('Search keyword'),
});
```

### Response (200 OK)
```typescript
const manualSearchResponseSchema = z.object({
  products: z.array(z.object({
    id: z.string(),
    name: z.string(),
    brand: z.string().nullable(),
    imageUrl: z.string().url().nullable(),
  })),
});
```
