# Implementation Plan: Cart Workflow Completion

**Branch**: `003-cart-workflow-completion` | **Date**: 2026-03-12 | **Spec**: [.specify/specs/003-cart-workflow-completion/spec.md](file:///home/tiago/01-dev-env/personal-repos/grocery-store/.specify/specs/003-cart-workflow-completion/spec.md)
**Input**: Feature specification from `/.specify/specs/003-cart-workflow-completion/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Complete the cart workflow by implementing a robust product scanning system with external fallbacks (Open Food Facts & UPCitemdb) and manual fuzzy search. This implementation spans the full stack, integrating `react-zxing` for high-performance scanning and a resilient backend pipeline. Key design refinements include:
- **Nomenclature**: Transitioned from `q` to `searchQuery` for all search-related APIs.
- **Scanner UX**: Moved into a `Drawer` (Vaul) to prevent background interaction, with a dedicated "Access Denied" state for camera permissions.
- **Contract Safety**: Mandated Orval-generated hooks (with `useInfinite: true` support) and singular API routes (`/product`).

## Technical Context

**Language/Version**: TypeScript 5.7+ (Strict) | Node.js 22+ (Backend) | React 19 (Frontend)
**Primary Dependencies**: Fastify, Drizzle ORM, tsyringe, Axios, Buidler (Backend) | TanStack Query, Orval, react-zxing, Vaul (Frontend)
**Storage**: PostgreSQL (hosted)
**Testing**: vitest (100% logic coverage mandated)
**Target Platform**: WASM-powered Scanning in Browsers (Mobile-first)
**Project Type**: Web Application (Monorepo)
**Performance Goals**: Local match < 100ms | External fallback < 2500ms total
**Constraints**: < 2000ms circuit breaker | Singular API routes | Orval-only frontend API calls | `searchQuery` naming parameter.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify alignment with [Grocery Store Constitution](file:///home/tiago/01-dev-env/personal-repos/grocery-store/.specify/memory/constitution.md):
- [x] **Clean Architecture**: Backend layers (Domain, App, Infra, API) are strictly separated.
- [x] **Golden Product Logic**: Data flow follows Canonical -> Identity -> EAN.
- [x] **ABAC Compliance**: Permissions evaluated via `RequesterContext`.
- [x] **OSS Resilience**: Open Food Facts prioritized; Circuit breakers implemented.
- [x] **Fiscal Ground Truth**: Mandatory price confirmation via Drawer (FR-008).
- [x] **Monorepo & pnpm**: Managed exclusively via pnpm workspaces (Principle VIII).
- [x] **Organizational Cohesion**: Singular routes (/product) and kebab-case naming enforced (Principle VI).

## Project Structure

### Documentation (this feature)

```text
.specify/specs/003-cart-workflow-completion/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
apps/
├── backend/
│   ├── src/
│   │   ├── api/             # Singular controllers (e.g., product-controller.ts)
│   │   ├── application/     # UseCases (ScanProduct, ManualSearch)
│   │   ├── domain/          # Entities & Usecase Definitions
│   │   └── infrastructure/  # Repositories & External Clients (OFF, UPCitemdb)
├── frontend/
│   ├── src/
│   │   ├── features/        # shopping-event, manual-search
│   │   ├── infrastructure/  # Orval-generated endpoints.ts
│   │   └── config/          # custom-http-client.ts for Orval
```

**Structure Decision**: Using established monorepo structure with Clean Architecture (Backend) and Feature-Slicing (Frontend). Orval bridge provides the contract safely.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
| N/A       |            |                                      |
