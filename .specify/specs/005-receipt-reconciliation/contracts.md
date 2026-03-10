# API Contracts: Receipt Reconciliation & Fiscal Audit

## 🏢 Fiscal Audit API

### Ticket Submission
- **POST** `/api/audit/ticket`: Submit NFC-e access key or QR code.
  - **Payload**: `{accessKey: string, sessionId?: UUID}`.
  - **Response**: `200 OK` with `{auditId, matchedItemsCount, unmatchedItemsCount, priceDeltas: [...]}`.

### Audit Summary
- **GET** `/api/audit/:auditId`: Get reconciliation details.
  - **Response**: `{fiscalData, disparities: [...]}`.

## ⚡ Real-Time Events
- `audit:completed`: Emitted after matching logic finishes. Payload includes summary of price updates.
- `audit:disparity_found`: Emitted for each item where manual price != fiscal price.
