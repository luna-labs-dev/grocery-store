# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/.specify/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Complete the cart workflow by implementing a robust product scanning system with external fallbacks (Open Food Facts & UPCitemdb) and manual fuzzy search. This implementation spans the full stack, integrating `react-zxing` for high-performance scanning in the browser and a resilient backend pipeline. Mandatory price confirmation (FR-008) is enforced for every item.

## Technical Context

**Package Manager**: `pnpm` (exclusive) via `pnpm workspaces` (Principle VIII)

### [Backend (apps/backend)]
- **Primary Dependencies**: Fastify (API), Zod (Validation), tsyringe (DI), Axios (HTTP), Buidler (Circuit Breaker), Drizzle ORM (DB)  
- **Storage**: PostgreSQL (via Drizzle)  
- **Performance**: Local matches < 100ms, External fallbacks < 2500ms total.  
- **Constraints**: 2000ms circuit breaker timeout, ABAC mandatory via RequesterContext.

### [Frontend (apps/frontend)]
- **Primary Dependencies**: React 19, Vite, TanStack (Query, Router), Tailwind CSS 4, Radix UI, `react-zxing` (WASM scanner), `lucide-react`, `sonner` (toasts), `motion` (animations), `vaul` (drawers).
- **Patterns**: Feature-slicing architecture, Infinite Scroll for search, state managed via TanStack Query and Zustand.


## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify alignment with [Grocery Store Constitution](file:///home/tiago/01-dev-env/personal-repos/grocery-store/.specify/memory/constitution.md):
- [x] **Clean Architecture**: Backend layers (Domain, App, Infra, API) are strictly separated.
- [x] **Golden Product Logic**: Data flow follows Canonical -> Identity -> EAN.
- [x] **ABAC Compliance**: Permissions evaluated via `RequesterContext` in UseCases.
- [x] **OSS Resilience**: Open Food Facts prioritized; Circuit breakers implemented.
- [x] **Fiscal Ground Truth**: Mandatory price confirmation (FR-008).
- [x] **Monorepo & pnpm**: Managed exclusively via pnpm workspaces (Principle VIII).


## Project Structure

### Documentation (this feature)

```text
.specify/specs/[###-feature]/
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
│   │   ├── api/             # Controllers, helpers, routes
│   │   ├── application/     # UseCase implementations, repository contracts
│   │   ├── domain/          # Entities, UseCase definitions
│   │   ├── infrastructure/  # Repositories, external clients
│   │   └── main/            # DI, server config, auth
│   └── tests/
├── frontend/
│   └── src/
│       ├── features/        # Scanning and Search UI features
│       ├── components/      # Shared UI units
│       ├── infrastructure/  # API clients
│       └── hooks/           # custom hooks for scanning/search logic
```

**Structure Decision**: Using active monorepo structure with apps/backend (Clean Architecture) and apps/frontend (Feature-sliced).


## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation                  | Why Needed         | Simpler Alternative Rejected Because |
| -------------------------- | ------------------ | ------------------------------------ |
| [e.g., 4th project]        | [current need]     | [why 3 projects insufficient]        |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient]  |
