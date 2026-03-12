# API Contract: Product Scanning & Search

## 1. Scan Product
Detects a product by barcode.

**Endpoint:** `GET /api/products/scan/:barcode`
**Response:** `200 OK`
```json
{
  "id": "uuid",
  "name": "string",
  "brand": "string",
  "imageUrl": "url",
  "requiresPriceConfirmation": true,
  "source": "local|external",
  "isVariableWeight": boolean,
  "extractedWeight": number?
}
```
**Errors:**
- `404 Not Found`: No data found locally or externally (Trigger manual entry).
- `503 Service Unavailable`: Circuit breaker tripped (Fall back to manual).

## 2. Product Search (Manual)
Fuzzy search across the local catalog.

**Endpoint:** `GET /api/products/search`
**Query Params:**
- `q`: string (Search term)
- `page`: number (Default: 1)
- `limit`: number (Default: 20)

**Response:** `200 OK`
```json
{
  "items": [
    {
      "id": "uuid",
      "name": "string",
      "brand": "string",
      "imageUrl": "string"
    }
  ],
  "meta": {
    "total": number,
    "hasMore": boolean
  }
}
```
