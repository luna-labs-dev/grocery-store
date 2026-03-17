# Implementation Plan: Codebase Reorganization and Architectural Alignment

**Branch**: `004-cleanup-architecture` | **Date**: 2026-03-17 | **Spec**: [spec.md](file:///home/tiago/01-dev-env/personal-repos/grocery-store/specs/004-cleanup-architecture/spec.md)
**Input**: Feature specification from `/specs/004-cleanup-architecture/spec.md`

## Summary

This feature involves a structural reorganization of the backend codebase to strictly adhere to **Clean Architecture > Clean Code > SOLID**. The primary approach is to move all Use Case implementations to the Application layer, ensure Domain only contains interfaces and entities, and eliminate logic duplication between God Services and specialized Use Cases.

**Strategy: Atomic Validation**
Every change must be performed as an atomic unit. No step may proceed until the following validations pass:
1. **Lint**: `pnpm biome check`
2. **Typecheck**: `pnpm tsc`
3. **Tests**: Relevant unit tests and regression suite (`pnpm vitest run`)

## Technical Context

**Language/Version**: TypeScript 5.7+, Node.js 22+  
**Primary Dependencies**: Fastify, Drizzle ORM, tsyringe, Zod, Axios, Buidler  
**Storage**: PostgreSQL (via Drizzle)  
**Testing**: Vitest  
**Target Platform**: Linux Server  
**Project Type**: Monorepo (pnpm workspaces) - Backend Service  
**Performance Goals**: <2000ms external sync timeout, responsive API response times  
**Constraints**: Absolute separation of layers (Domain/Application/Infrastructure/API/Main)  
**Scale/Scope**: Structural cleanup of the entire backend workspace

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Principle I (Supreme Architectural Priority)**: The plan is centered on enforcing Clean Architecture > Clean Code > SOLID.
- [x] **Principle II (Separation of Concerns)**: All implementations will be moved to the Application layer.
- [x] **Principle III (TDD)**: 100% coverage mandatory for refactored components.
- [x] **Principle VI (Nomenclature)**: Strict kebab-case for files and PascalCase for classes.

## Project Structure

### Documentation (this feature)

```text
specs/004-cleanup-architecture/
├── plan.md              # This file
├── spec.md              # Feature specification
└── checklists/
    └── requirements.md  # Spec quality checklist
```

### Source Code (Backend)

The core structure will be aligned as follows:

```text
apps/backend/src/
├── api/                # API controllers and Zod helpers
│   ├── controllers/
│   └── helpers/
├── application/        # Use Case implementations and Repository contracts
│   ├── contracts/
│   └── usecases/
├── domain/             # Entities, Exceptions, and Use Case interfaces
│   ├── core/           # Core logic (e.g., VariableWeightParser in domain/core/logic)
│   ├── entities/
│   └── usecases/
├── infrastructure/     # Database (Drizzle) and external service implementations
│   ├── repositories/
│   └── services/
└── main/               # DI Container and Config
    ├── di/
    └── fastify/
```

**Structure Decision**: Standard Clean Architecture layout. Unified domain logic (e.g. `VariableWeightParser`) resides in `domain/core/logic`.

## Complexity Tracking

| Violation                   | Why Needed               | Simpler Alternative Rejected Because                                          |
| --------------------------- | ------------------------ | ----------------------------------------------------------------------------- |
| Fragmentation of Interfaces | Mandatory for Decoupling | Direct class usage in Domain is a hard violation of Clean Architecture.       |
| Entity Consolidation        | Unify Identity Model     | Keeping PhysicalEAN separate creates duplication in scan/manual search logic. |
