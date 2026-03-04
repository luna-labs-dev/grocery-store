# 01-Testing Strategy: The "Zero-Hallucination" Guardrail

## 1. Philosophy: TDD-First & Total Coverage
In an AI-augmented development environment, tests are the only source of truth. If a feature isn't tested, it's considered broken. We will follow the **Red-Green-Refactor** cycle at every layer.

## 2. The Testing Pyramid

### 2.1 Tier 1: Unit Testing (Vitest)
- **Scope**: Entities, Value Objects, Domain Services, and Pure Logic.
- **Goal**: 100% coverage on complex business rules (e.g., Consensus Threshold, ABAC Policy evaluation).
- **Execution**: Mock all external dependencies. Fast and isolated.

### 2.2 Tier 2: Integration Testing (Supertest / Drizzle-mock)
- **Scope**: UseCases and Repositories.
- **Goal**: Verify data persistence and cross-layer communication.
- **Execution**: Run against a local test database (ephemeral) or high-fidelity mocks.

### 2.3 Tier 3: Frontend Component Testing (Vitest + Testing Library)
- **Scope**: Atoms, Molecules, and Logic Hooks.
- **Goal**: Verify UI behavior, state management, and Accessibility (A11y).
- **Execution**: Mock the API using MSW (Mock Service Worker).

### 2.4 Tier 4: End-to-End (E2E) Testing (Playwright)
- **Scope**: Critical User Journeys (CUJs).
- **Goal**: Realistic verification of the entire system.
- **Execution**: Parallel execution in a staging-like environment.

## 3. Domain-Specific Testing Guards

| Domain          | Testing Focus                                                                              |
| :-------------- | :----------------------------------------------------------------------------------------- |
| **Products**    | Mocking external Global Product APIs. Verifying fuzzy search and price consensus logic.    |
| **Groups**      | Testing many-to-many relationship boundaries and invitation token expiry.                  |
| **Auth & ABAC** | FMEA (Failure Mode and Effects Analysis) on permission checks. "Malicious User" scenarios. |
| **Real-Time**   | Simulated high-concurrency updates to verify Socket.io room isolation and sync speed.      |
| **Frontend**    | Visual Regression tests for "Grocery Modern" identity. Responsive breakpoint testing.      |

## 4. AI-Guard Directives (Backend Architect Elite)
- **SCAR_06: The "Lying" Test**: Avoid shallow tests that "pass everything". Every test must include a **Negative Scenario** (e.g., "Expect failure when price is negative").
- **Dumb Test Data**: Use `faker` or similar for realistic, varied data to catch edge cases in string/number formatting.
- **Flakiness Zero-Tolerance**: Any flaky test (Playwright) must be fixed or quarantined immediately.

---
**Authored by**: Backend Architect Elite / Solutions Architect
**Status**: DRAFT
