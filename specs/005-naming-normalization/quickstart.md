# Quickstart: Nature-Role Naming Conventions

This feature normalizes all backend nomenclature to strictly follow the **Nature-Role** hybrid pattern.

## 1. The Pattern

`[nature]-[role].[extension]`

### Natures (Prefix)
- `db-`: Internal database orchestration.
- `remote-`: External API/Client orchestration.
- `job-`: Background / Asynchronous orchestration.

### Roles (Suffix)
- `Manager`: Lifecycle/state orchestration of an aggregate.
- `Resolver`: Resolves input (e.g., barcode) to an entity.
- `Finder`: Search and discovery logic.
- `Engine`: Complex calculations or consensus.

## 2. Key Changes

### Interfaces (Domain)
- Removed "Service" suffix.
- Added Role suffix (e.g., `ICartManager`).

### Implementations (Application)
- Prefixed with nature (e.g., `DbCartManager`, `RemoteProductResolver`).

### Infrastructure
- Renamed `Client` to `Service` (e.g., `OpenFoodFactsService`).
- Fixed `Buidler` typo -> `ResilienceService`.

## 3. Consolidation
- `ScanProductUseCase` and `ManualSearchUseCase` are now internal methods of `DbCartManager`.
- Use `ICartManager.scanProduct()` and `ICartManager.manualSearch()`.
