# Quickstart: Pricing Truth Consensus Engine

## 🚀 Running the Consensus Audit

To verify the pricing consensus logic:

1. **Unit Tests (Algorithm Verification)**:
   ```bash
   cd apps/backend
   npm run test:unit tests/services/ConsensusService.spec.ts
   ```

2. **Integration Tests (Pricing Flow)**:
   ```bash
   cd apps/backend
   npm run test:int tests/integration/PricingConsensus.it.spec.ts
   ```

3. **Manual Verification**:
   - Submit 5 reports for the same product at the same market from 5 different accounts.
   - Verify that the `MarketProductPrice` status transitions from `pending` to `verified`.
   - Submit a report with >30% price variance and verify it is flagged as an `outlier`.
