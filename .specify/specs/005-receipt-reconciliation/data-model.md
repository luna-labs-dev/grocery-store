# Data Model: Receipt Reconciliation & Fiscal Audit

## 📄 Fiscal Entities

### FiscalRecord
Metadata from the SEFAZ response.
- **Fields**: `id` (UUID), `accessKey` (String, Unique), `marketName` (String), `cnpj` (String), `issuedAt` (DateTime), `totalAmount` (Decimal).
- **Relationships**: One-to-Many with `FiscalItem`.

### FiscalItem
Individual lines on the receipt.
- **Fields**: `recordId` (UUID), `ean` (String, Optional), `description` (String), `quantity` (Float), `unitPrice` (Decimal), `totalPrice` (Decimal).
- **Relationships**: Linked to `ProductIdentity` if matched.

### PriceAudit
Discrepancies found during reconciliation.
- **Fields**: `id` (UUID), `shoppingSessionId` (UUID), `fiscalItemId` (UUID), `manualPrice` (Decimal), `fiscalPrice` (Decimal), `status` (Enum: resolved, conflict).
