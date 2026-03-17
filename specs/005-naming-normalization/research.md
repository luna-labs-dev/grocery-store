# Research: Naming Categorization (Nature-Role Hybrid)

**Feature**: Naming Normalization and Semantic Refactor
**Status**: Complete

## Decision: Nature-Role Hybrid Convention

This hybrid approach ensures high semantic alignment by combining the **Technical Nature** (prefix) with the **Functional Role** (suffix).

### 01. Technical Nature (Prefix)
- `db-`: Strictly internal database orchestration.
- `remote-`: External API/Client orchestration.
- `job-`: Background / Asynchronous orchestration (Outbox, BullMQ, Job processors).

### 02. Functional Role (Suffix)
- `Manager`: Lifecycle and state orchestration of a main aggregate/entity.
- `Resolver`: Resolving a specific input (e.g., barcode) to a populated entity.
- `Finder`: Search and discovery logic.
- `Hydrator`: Data enrichment processes (e.g., adding images/details from external sources).
- `Engine`: Complex calculations, rulesets, or consensus algorithms.
- `Worker`: Execution unit for asynchronous/background tasks.

## Decision: Typos and Infrastructure
- **Buidler**: Renamed to `ResilienceService` (fixing typo and using Service suffix for infrastructural utility).
- **External Clients**: Renamed from `...Client` to `...Service` (e.g., `OpenFoodFactsService`) as per backend mandate.
