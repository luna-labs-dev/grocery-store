# Feature Specification: Codebase Reorganization and Architectural Alignment

**Feature Branch**: `004-cleanup-architecture`  
**Created**: 2026-03-17  
**Status**: Draft  
**Input**: User description: "Organize the code and fix Clean Architecture/SOLID violations"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Maintainable Use Case Governance (Priority: P1)

As a Developer, I want to have clear boundaries between Domain and Application layers so that I can modify business logic without touching infrastructure and vice-versa.

**Why this priority**: High. This is the core of Clean Architecture and directly addresses the "usecases inside domain layer" and "crap all over the code" complaints.

**Independent Test**: Can be verified by ensuring `src/domain/usecases` ONLY contains interfaces and DTOs, while `src/application/usecases` contains all logic implementations.

**Acceptance Scenarios**:

1. **Given** a use case interface in `src/domain/usecases`, **When** I check the repository, **Then** I find zero class implementations in the `src/domain` directory tree.
2. **Given** a business rule (e.g., Variable Weight Parsing), **When** I search the codebase, **Then** I find a single, canonical implementation in the correct layer (Application/Utils or Domain/Entities if pure logic).

---

### User Story 2 - SOLID Repository Implementation (Priority: P2)

As a Backend Architect, I want repository contracts to be stable and well-defined so that persistent logic is decoupled from business logic.

**Why this priority**: Medium. Addresses "removing interfaces" and "removed interfaces" complaints.

**Independent Test**: Check that all Drizzle repositories implement explicit interfaces at `src/application/contracts/repositories` without logic leakage.

**Acceptance Scenarios**:

1. **Given** a repository implementation, **When** it interacts with the database, **Then** it must strictly follow the interface defined in the application contract layer.
2. **Given** the `CartService`, **When** it needs to search or scan products, **Then** it delegates to specialized UseCase classes rather than implementing the logic internally.

---

### Edge Cases

- **Duplicate Logic**: Handling cases where two different "God Objects" (e.g., `CartService` and `ShoppingEventService`) both try to own the same repository interaction.
- **Circuit Breaker Integration**: Ensuring that external calls (e.g., `OpenFoodFacts`) within use cases are properly guarded even after reorganization.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST move all Use Case implementations to `src/application/usecases`.
- **FR-002**: The system MUST declare all Use Case interfaces in `src/domain/usecases`.
- **FR-003**: The system MUST consolidate `ProductIdentity` and `PhysicalEAN` into a single `ProductIdentity` entity and repository contract.
- **FR-004**: The system MUST remove duplicated `VariableWeightParser` and unify it into `src/domain/core/logic/variable-weight-parser.ts`.
- **FR-005**: All DI registrations MUST use explicit interface tokens defined in `src/main/di/injection-tokens.ts`.

### Key Entities *(include if feature involves data)*

- **RequesterContext**: Mandatory for all use case executions to evaluate permissions and identity.
- **Repository Contracts**: Abstract interfaces defining the persistence capabilities for each Aggregate Root.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- [x] **SC-001**: 100% of Domain Layer components are free of implementation details and infrastructure dependencies.
- [x] **SC-002**: Use Case complexity orchestrated by "God Objects" is reduced by delegation to specialized, single-purpose components.
- [x] **SC-003**: System integrity is preserved with all functional and regression tests passing.
- [x] **SC-004**: Code quality standards are satisfied across all refactored components without any justified exceptions.

## Clarifications

### Session 2026-03-17

- Q: Where should the unified `VariableWeightParser` reside? → A: `src/domain/core/logic`
- Q: How should `ProductIdentity` and `PhysicalEAN` be consolidated? → A: Merge into a single `ProductIdentity` (EAN as type)
