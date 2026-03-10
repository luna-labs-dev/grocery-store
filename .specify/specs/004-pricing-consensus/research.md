# Research: Pricing Truth Consensus Engine

## 🔍 Implementation Strategy

### 1. Consensus Window & 5-User Rule
**Decision**: Use a sliding 72-hour window for active reports.
**Rationale**: Prices in grocery stores fluctuate weekly; data older than 3 days is at risk of being stale.
**Alternatives considered**: 24-hour window (too restrictive for low-traffic items), 7-day window (too slow for dynamic markets).

### 2. Weighted Reputation Algorithm
**Decision**: Use a simple linear increase in weight based on "Verified Reports Count".
**Rationale**: Minimalistic and effective for rewarding high-trust users.
**Weight Formula**: `1 + (VerifiedReports / 100)`. Max weight capped at 2.0.

### 3. Outlier Detection (Regional Variance)
**Decision**: Compare against the "Regional Market Average" (median of prices for the same Product Identity within 10km).
**Rationale**: Prices are regional. $5.00 might be an outlier in Store A but normal in Store B (same city). 
**Threshold**: 30% deviation from the median triggers an "Outlier" flag.

## 🛠️ Technology Choice

### Persistence
**Valkey**: Used for caching active consensus counts to minimize Postgres hits on high-frequency reports.
**PostgreSQL (Drizzle)**: Final source of truth for `PriceHistory`.

### Backend Implementation
**NestJS Services**: Use a dedicated `ConsensusService` triggered by every new `PriceReport`.
