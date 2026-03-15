# Research: Cart Workflow Completion

## Decisions

### 1. Barcode Scanning Library & UX
- **Decision**: `react-zxing` inside a `Drawer` (Vaul/Radix).
- **Rationale**: Provides high-performance WASM decoding. Using a Drawer provides a dedicated backdrop that blocks background interaction and handles "close on tap" natively.
- **Permissions Handling**: If camera access is denied/unavailable, the camera view will be replaced by an "Access Denied" state with a clear "Enter Manually" recovery path.
- **Improved UX**: Decoupled `isScanning` from `isPaused` to keep the feed live during background processing.

### 2. External API Integration & Resilience
- **Decision**: Composite client with `Buidler` (Circuit Breaker) and `Axios`.
- **Rationale**: Mandated by OSS Resilience (Principle V). 2000ms timeout protects UI from slow fetches. **Open Food Facts** is prioritized.

### 3. Background Data Hydration
- **Decision**: Outbox Pattern + Background Worker.
- **Rationale**: Ensures eventual consistency. Raw JSON stored in `ExternalFetchLog`. Polling interval set to 5000ms.

### 4. Fuzzy Search Strategy & Frontend Integration
- **Decision**: PostgreSQL `ILIKE` on `ProductIdentity` + **Orval Infinite Queries**.
- **Rationale**: 
  - Backend: Simple and effective local search.
  - Frontend: Mandated **Orval-only** integration. Orval is configured with `useInfinite: true` to generate `useSearchProductsInfinite` hooks.
- **Nomenclature**: Parameters renamed from `q` to `searchQuery` to adhere to Clean Code principles.
- **Route Naming**: Strictly **singular** (`/product`) as per guidelines.

### 5. Variable-Weight Barcode Parsing
- **Decision**: Custom `VariableWeightParser` for EAN-13 starting with '2'.
- **Rationale**: Standard Brazilian hypermarket practice for price/weight embedded barcodes.

### 6. User Experience & Connectivity
- **Decision**: Online-only for scanner logic; Read-only metadata in confirmation drawer.
- **Rationale**: Focuses on core value while reducing frontend complexity.
