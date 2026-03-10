# Implementation Plan: Pricing Truth Consensus Engine

**Branch**: `004-pricing-consensus` | **Date**: 2026-03-10 | **Spec**: [spec.md](./spec.md)

## Summary
Implement a robust, crowdsourced pricing verification engine using the "5-User Rule" and automated outlier detection to ensure data integrity in the "Golden Product" ecosystem.

## Technical Context
**Language/Version**: TypeScript 5.4+  
**Primary Dependencies**: NestJS, Drizzle ORM, Valkey  
**Testing**: TDD with Vitest (100% coverage mandatory)

## Constitution Check
- [x] **Clean Architecture**: Use `ConsensusService` to isolate domain logic.
- [x] **TDD & Total Coverage**: Red-Green-Refactor enforced in tasks.
- [x] **"Golden Product" Hierarchy**: All reports link to `ProductIdentity`.

## Project Structure (New Logic)

```text
apps/backend/src/
├── domain/prices/
│   ├── ConsensusEngine.ts     # [NEW] Pure logic for consensus
│   └── UserReputation.ts      # [NEW] Weighting logic
├── services/
│   └── ConsensusService.ts    # [NEW] Application orchestration
└── persistence/
    └── schemas/
        └── price-reports.ts   # [NEW] Drizzle schema updates
```

## Phases
1. **Infrastructure**: Update database schemas and Valkey cache keys.
2. **Domain Logic**: Implement the 5-User Rule and regional outlier detection.
3. **Integration**: Connect the `PriceReport` submission flow to the `ConsensusService`.
4. **Real-time**: Emit Socket.io events upon successful verification.
