# Quickstart: Receipt Reconciliation & Fiscal Audit

## 🚀 Running the Fiscal Audit

To verify the reconciliation logic:

1. **Unit Tests (Parser & Decoder)**:
   ```bash
   cd apps/backend
   npm run test:unit tests/services/NfcEDecoder.spec.ts
   ```

2. **Integration Tests (SEFAZ Simulation)**:
   ```bash
   cd apps/backend
   npm run test:int tests/integration/FiscalAudit.it.spec.ts
   ```

3. **Manual Verification**:
   - Log in and start a shopping session.
   - Use the `/api/audit/ticket` endpoint with a test NFC-e access key.
   - Verify that the prices in your session are overridden by the fiscal data.
   - Check the `PriceAudit` log for any discrepancies.
