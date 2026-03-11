# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/.specify/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Implement a robust cart workflow for the Grocery Store app, enabling product identification through EAN-13/UPC scanning. The system will prioritize local database matches, falling back to external APIs (Open Food Facts and UPCitemdb) with a 2000ms timeout and circuit breaker protection. It will also support manual fuzzy search and variable-weight barcode parsing (industry standards for barcodes starting with '2').

## Technical Context

**Language/Version**: TypeScript ~5.9.3, Node.js (via pnpm@10.29.3)
**Primary Dependencies**: NestJS, Drizzle ORM, Vite, Vitest
**Storage**: PostgreSQL
**Testing**: Vitest (`npm run test`), Playwright (E2E)
**Target Platform**: Linux (Docker-ready)
**Project Type**: Web Application (Monorepo: Frontend + Backend)
**Performance Goals**: Local matches < 100ms; External fallbacks < 2500ms
**Constraints**: 2000ms API timeout, circuit breaker required, Outbox pattern for background hydration
**Scale/Scope**: Hypermarket-scale product catalog support

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify alignment with [Grocery Store Constitution](file:///home/tiago/01-dev-env/personal-repos/grocery-store/.specify/memory/constitution.md):
- [x] **Clean Architecture**: Are layers (Domain, App, Infra, API) strictly separated? (Confirmed: Domain logic preserved in `apps/backend/src/domain`)
- [x] **Golden Product Logic**: Does data flow follow the Canonical -> Identity hierarchy? (Confirmed: `EAN` -> `ProductIdentity` -> `CanonicalProduct` mentioned in Spec)
- [x] **ABAC Compliance**: Are permissions evaluated via `RequesterContext`? (Requirement for all UseCases)
- [x] **OSS Resilience**: Avoiding non-OSS tech? Circuit breakers for external APIs? (Using OFF, circuit breaker mandated)

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
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
# [REMOVE IF UNUSED] Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [REMOVE IF UNUSED] Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [REMOVE IF UNUSED] Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]
```

**Structure Decision**: Option 2: Web Application. The project is already structured as a monorepo with `apps/backend` (NestJS) and `apps/frontend` (Vite/React).

## Verification Plan

### Automated Tests
- **Unit Tests**:
  - `pnpm test apps/backend/src/domain/products`: Verify scanning logic and barcode parsing.
  - `pnpm test apps/backend/src/infrastructure/external`: Verify API clients and circuit breaker.
- **Integration Tests**:
  - `pnpm test apps/backend/tests/integration/products`: Verify EAN -> Identity -> Canonical mapping and persistence.
- **E2E Tests**:
  - `pnpm playwright test tests/e2e/scanner.spec.ts`: Verify full UI flow from scan to item addition.

### Manual Verification
1. **Device Testing**: Scan real EAN-13 barcodes using a mobile device or emulator with camera support.
2. **Offline/Failure Simulation**: Block external API domains (OFF/UPCitemdb) and verify manual entry fallback.
3. **Variable Weight**: Use a test barcode starting with '2' and verify correct weight extraction in the cart.
