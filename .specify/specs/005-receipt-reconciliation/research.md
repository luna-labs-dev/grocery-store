# Research: Receipt Reconciliation & Fiscal Audit

## 🔍 Implementation Strategy

### 1. NFC-e Access Key & QR Code Handling
**Decision**: Use a dedicated `NfcEProxyService` to abstract the Brazilian SEFAZ communication.
**Rationale**: SEFAZ APIs are regional and often require specific certificates or HTML scraping. Offloading this to a proxy (e.g., a community-driven or reliable commercial one) reduces the complexity in the Core Application.

### 2. Reconciliation Matching Algorithm
**Decision**: Use EAN-13 as the primary join key, with fuzzy description matching as a fallback.
**Rationale**: Brazilian NFC-e almost always includes the EAN for commercial products. Fuzzy matching allows for identifying items where the EAN is missing but the description matches our `ProductIdentity` metadata.
**Fallback Strategy**: If no EAN/match exists, flag the item for "Manual Categorization" to help build the "Golden Product" engine.

### 3. Price Truth Persistence
**Decision**: Prices from NFC-e are marked with `source: fiscal` and `confidence: 1.0`.
**Rationale**: Fiscal data is the "Supreme Truth". It should lock the price for the specific market/EAN for the remainder of the business day.

## 🛠️ Technology Choice

### External Integration
**SEFAZ Proxy**: Research reliable libraries or external proxies for Brazilian NFC-e scraping/fetching.
**Tesseract OCR (Optional)**: If the user provides a photo instead of a QR code, OCR may be needed in Phase 2.

### Backend Implementation
**NestJS Service**: `ReconciliationEngine` as a pure service for matching `FiscalItem` -> `ProductIdentity`.
