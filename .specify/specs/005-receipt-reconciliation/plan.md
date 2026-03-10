# Implementation Plan: Receipt Reconciliation & Fiscal Audit

**Branch**: `005-receipt-reconciliation` | **Date**: 2026-03-10 | **Spec**: [spec.md](./spec.md)

## Summary
Implement the "Fiscal Ground Truth" principle by integrating Brazilian NFC-e data as the supreme source of truth for pricing and product validation.

## Technical Context
**Language/Version**: TypeScript 5.4+  
**Primary Dependencies**: NestJS, Drizzle ORM  
**Testing**: TDD with Vitest (100% coverage mandatory)

## Constitution Check
- [x] **Fiscal Ground Truth**: Supreme source of truth for pricing.
- [x] **Clean Architecture**: Use `ReconciliationEngine` to isolate domain logic.
- [x] **TDD & Total Coverage**: Red-Green-Refactor enforced in tasks.

## Project Structure (New Logic)

```text
apps/backend/src/
├── domain/fiscal/
│   ├── ReconciliationEngine.ts # [NEW] Pure matching logic
│   └── NfcEDecoder.ts          # [NEW] NFC-e parsing logic
├── services/
│   ├── AuditService.ts         # [NEW] Application orchestration
│   └── NfcEProxyService.ts     # [NEW] External interface for SEFAZ
└── persistence/
    └── schemas/
        └── fiscal-records.ts   # [NEW] Drizzle schema updates
```

## Phases
1. **Infrastructure**: Update database schemas for fiscal records and audits.
2. **Decoding**: Implement the `NfcEDecoder` to parse NFC-e data.
3. **Reconciliation**: Implement the `ReconciliationEngine` for product matching.
4. **Integration**: Connect the `AuditService` to the shopping session flow.
