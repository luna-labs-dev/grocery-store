# Data Model: Pricing Truth Consensus Engine

## 📊 Consensus Entities

### PriceReport
The raw report submitted by a user.
- **Fields**: `id` (UUID), `userId` (UUID), `marketId` (UUID), `ean` (String), `price` (Decimal), `status` (Enum: pending, verified, outlier), `isPromotion` (Boolean), `timestamp` (DateTime).
- **Relationships**: Many-to-One with `User`, `Market`, and `ProductIdentity`.

### UserReputation
Tracks the quality of a user's contributions.
- **Fields**: `userId` (UUID), `verifiedCount` (Int), `outlierCount` (Int), `score` (Float).
- **Validation**: `score` is recalculated every 24 hours.

### MarketProductPrice (Golden Price)
The current verified price for an item at a specific market.
- **Fields**: `marketId` (UUID), `ean` (String), `price` (Decimal), `lastVerifiedAt` (DateTime), `consensusCount` (Int).

### PriceHistory
Log of verified price changes.
- **Fields**: `id` (UUID), `marketId` (UUID), `ean` (String), `price` (Decimal), `verifiedAt` (DateTime).
