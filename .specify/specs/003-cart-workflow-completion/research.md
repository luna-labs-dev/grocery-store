# Research: Cart Workflow Completion

## Decisions

### 1. Barcode Scanning Library
- **Decision**: `react-zxing`
- **Rationale**: Provides high-performance WASM-powered decoding for EAN-13 and UPC barcodes directly in the browser. Mandated for scan performance (SC-001).
- **Alternatives considered**: `quagga2` (deprecated), `html5-qrcode` (unstable).

### 2. External API Integration & Resilience
- **Decision**: Composite client with `Buidler` (Circuit Breaker) and `Axios`.
- **Rationale**: Mandated by OSS Resilience (Principle V). 2000ms timeout protects UI from slow fetches. Open Food Facts is prioritized.
- **Constraints**: 2000ms circuit breaker timeout.

### 3. Background Data Hydration
- **Decision**: Outbox Pattern + Background Worker.
- **Rationale**: Ensures eventual consistency and prevents blocking the user while persisting external data. Raw JSON stored in `ExternalFetchLog` for audit integrity.

### 4. Fuzzy Search Strategy
- **Decision**: PostgreSQL `ILIKE` on `ProductIdentity` table.
- **Rationale**: Simple, effective for local matches, and aligns with current database capabilities without requiring a heavy search index for the MVP.
- **Scope**: Search fuzzy across both `Product name` and `Brand`.

### 5. Variable-Weight Barcode Parsing
- **Decision**: Custom `VariableWeightParser` for EAN-13 starting with '2'.
- **Rationale**: Standard Brazilian hypermarket practice for price/weight embedded barcodes.

### 6. User Experience & Connectivity
- **Decision**: Online-only for scanner logic; Read-only metadata in confirmation drawer.
- **Rationale**: Reduces architectural complexity in the frontend while focusing on the core "price entry" user value.
