# Implementation Plan: Global Product Blueprint

**Branch**: `001-global-blueprint` | **Date**: 2026-03-10 | **Spec**: [spec.md](./spec.md)

## Summary
Establish a unified, full-stack blueprint and testing infrastructure that ensures 100% verification from the DB layer to the UI surface. This plan addresses the "Testing Desert" in the frontend and the "Zombie Logic" in the backend.

## Technical Context
**Language/Version**: TypeScript 5.4+ (Full Monorepo)  
**Primary Dependencies**: Vitest, Playwright, React Testing Library, Drizzle ORM  
**Testing**: Multi-tier (Unit, Integration, E2E, Behavioral)  
**Performance Goals**: 100% Logic Path Coverage  

## Constitution Check
- [ ] **Clean Architecture**: Verified layers in Backend; need to enforce in Frontend hooks.
- [ ] **TDD & Total Coverage**: Currently failing in Frontend. This plan is the remediation.
- [ ] **ABAC Compliance**: Verification task added to the audit.
- [ ] **Organizational Cohesion**: Root hygiene verified; spec is in `.specify/.specify/specs/`.

## Project Structure (New Infrastructure)

```text
.
├── apps/
│   ├── backend/
│   │   └── vitest.config.ts    # [NEW] Enhanced with coverage gates
│   └── frontend/
│       ├── vitest.config.ts    # [NEW] Frontend testing target
│       └── tests/behavior/     # [NEW] Behavioral tests
├── tests/
│   └── e2e/
│       └── playwright/         # [NEW] Global CUJ suite
```

## Phase 1: Infrastructure Design
1. **Monorepo Testing Standardization**: Setup Vitest in the frontend app to mirror the backend pattern.
2. **Behavioral Contract**: Define how UI components are verified (Interaction over Implementation).
3. **CUJ Mapping**: Finalize the list of critical journeys (Scan, Sync, Auth) for E2E.
