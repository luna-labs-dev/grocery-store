# Specification Analysis Report: Codebase Reorganization

**Date**: 2026-03-17
**Feature**: `004-cleanup-architecture`

## Findings Overview

| ID  | Category      | Severity | Location(s)                                                                                          | Summary                                                                 | Recommendation                                                              |
| --- | ------------- | -------- | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| A1  | Layering      | CRITICAL | `src/application/usecases/cart-service.ts`                                                           | `CartService` implements complex product discovery logic (Scan/Search). | Delegate to `ScanProductUseCase` and `ManualSearchUseCase`.                 |
| A2  | Duplication   | CRITICAL | `src/application/usecases/products/scan-product-use-case.ts`                                         | Logic redundant with `CartService.scanProduct`.                         | Unify implementation in `ScanProductUseCase`.                               |
| A3  | Duplication   | HIGH     | `src/domain/products/variable-weight-parser.ts` vs `src/application/utils/variable-weight-parser.ts` | Redundant parsers for variable weight barcodes.                         | Unify in `src/domain/products/` if pure business logic.                     |
| A4  | Inconsistency | HIGH     | `src/application/contracts/repositories/product-identity-repository.ts`                              | `ProductIdentity` interface conflicts with Domain entity.               | Use Domain entity as the source of truth for repository generic interfaces. |
| A5  | Ambiguity     | MEDIUM   | `CartService.scanProduct:L293`                                                                       | `TODO` placeholder in production-level code.                            | Implement price derivation logic or document as a known limitation.         |
| A6  | Separation    | MEDIUM   | `src/application/contracts/repositories/product-hierarchy/`                                          | Fragmented and deeply nested repository aggregation.                    | Flatten and group by Aggregate Root context.                                |

## Coverage Summary Table

| Requirement Key               | Has Task? | Task IDs   | Notes                              |
| ----------------------------- | --------- | ---------- | ---------------------------------- |
| FR-001: Move implementations  | Yes       | T008, T012 | Targets Application layer cleanup. |
| FR-002: Usecase Interfaces    | Yes       | T001, T008 | Targets Domain layer purity.       |
| FR-003: Consolidate Contracts | Yes       | T006       | Repository interface cleanup.      |
| FR-004: Remove Duplication    | Yes       | T004, T005 | VariableWeightParser unification.  |
| FR-005: DI Registration       | Yes       | T003, T018 | Dependency Inversion enforcement.  |

## Constitution Alignment Issues

- **Violation of Principle I**: Multiple cases of "Logic in Domain" or "Logic in God Object" identified (A1, A2).
- **Violation of Principle VI**: Drifting nomenclature between `ProductIdentity` and `PhysicalEAN` repositories.

## Metrics

- Total Requirements: 5
- Total Tasks: 21
- Coverage %: 100%
- Ambiguity Count: 1 (TODO ref)
- Duplication Count: 2
- Critical Issues Count: 2

## Next Actions

1.  **Resolve CRITICAL Issues (A1, A2)**: The refactoring of `CartService` to delegate scanning and searching is the highest priority.
2.  **Unify Parsers (A3)**: Stop logic duplication by selecting the canonical `VariableWeightParser`.
3.  **Execute Planning Update**: Proceed to implement tasks from `tasks.md`.

Would you like me to suggest concrete remediation edits for the top issues?
