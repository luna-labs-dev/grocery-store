# Research: Global Product Blueprint

## 🔍 Implementation Audit

### Backend Coverage Gaps
The backend has a solid foundation with `vitest` and `drizzle-kit`, but several critical use cases are currently "Zombie Logic" (implemented but untested via `test.todo`):
- **Pricing Consensus**: `pricing-consensus.spec.ts` is missing.
- **Product Search**: Local DB lookup and `ExternalProductClient` fallback are untested.
- **Invitations**: Token validation and expiration logic in `invite-member.spec.ts` are incomplete.

### Frontend Infrastructure Gaps
The frontend is currently a **"Testing Desert"**. `package.json` shows zero testing dependencies.
- **Missing**: `vitest`, `playwright`, `@testing-library/react`.
- **Status**: Visual components and hooks are unverified.

## 🛠️ Infrastructure Strategy

### 1. Full-Stack Verification (Playwright)
**Decision**: Implement a global `tests/e2e/playwright` suite in the monorepo root (or within `apps/frontend`) to verify CUJs.
**Rationale**: Playwright is the industry standard for cross-browser, reliable E2E tests that can verify both the real-time Sockets and the UI state.

### 2. Frontend Behavioral Testing (Vitest Browser Mode)
**Decision**: Add `vitest` with `@testing-library/react` and Browser Mode to `apps/frontend`.
**Rationale**: Allows testing component behaviors like "Drawer revealing on click" and "Search filtering" without the overhead of full E2E.

### 3. Coverage Enforcement (Quality Gates)
**Decision**: Configure mandatory coverage thresholds (100% logic coverage) in `apps/backend/vitest.config.ts`.
**Rationale**: Aligns with **Principle III: TDD & Total Coverage** of the Constitution.

## 🏁 Critical User Journeys (CUJs) to Roadmap
1. **User Auth**: Sign up -> Sign in -> Session verify.
2. **Product Flow**: Scan barcode -> Hydrate from OFF -> Add to Cart.
3. **Collaboration**: Create group -> Generate QR -> Peer joins -> Real-time sync check.
4. **Consensus**: 5 users report different prices -> System verifies median price.

## 🛑 Gap Discovery Phase 1
- **Entity Identification**: Verify all 4 tiers of the "Golden Product" are present in Drizzle schema.
- **Permission Audit**: Verify every mutation in `AdminController` has a `checkPermission` call.
