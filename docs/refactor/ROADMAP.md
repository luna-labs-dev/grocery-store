# 🎯 Scrum Refactor Backlog: Strategic Roadmap

This backlog follows Scrum patterns to ensure every technical task delivers clear user value and satisfies strict architectural guardrails.

## 🏁 Definition of Done (DoD) - Applied to ALL Tasks
- [ ] Code passes Vitest unit/integration tests with 100% coverage on new logic.
- [ ] Zod schema verification for every API boundary.
- [ ] OSS Compliance: No non-OSS licensed dependencies (Valkey, PostgreSQL, etc.).
- [ ] Test Isolation: Automatic `FLUSHDB` (Valkey) and DB truncation between runs.
- [ ] Mobile-first responsive check (Google Pixel 7 / iPhone 14 Pro simulation).
- [ ] Documentation updated (Swagger/MD).

---

## 🏗️ Epic 0: Infrastructure & Dev Environment
**User Value**: "As a developer, I want a reliable and open-source local environment so I can build features without licensing concerns or manual setup."

### Story 0: OSS Infrastructure Setup
**AC**:
- `docker-compose.yml` provides PostgreSQL and Valkey (not Redis).
- Environment variables are standardized across dev/test.
- **Technical Tasks**:
    - [ ] Replace Redis with `valkey/valkey` in Compose.
    - [ ] Setup Healthchecks for all services.
    - [ ] Configure `Pino` with Correlation IDs for socket/HTTP tracing.
    - [ ] Create `scripts/dev-up.sh` for one-click environment readiness.

---

## 🛡️ Epic 1: Identity, Groups & ABAC
**User Value**: "As a shopper, I want to securely access my data and share groups with others so we can collaborate on lists."

### Story 1: Better Auth Integration
**AC**:
- Authentication works without external clerk deps.
- Session persists in Valkey (sub-50ms latency).
- **Technical Tasks**:
    - [ ] Setup `better-auth` middleware.
    - [ ] Implement `@/infrastructure/cache/valkey-adapter`.
    - [ ] TDD: `auth-migration-usecase.spec.ts`.

### Story 2: Flexible Collaboration Groups
**AC**:
- User can be in $N$ groups simultaneously.
- QR/Link invitation joins a user instantly.
- **Technical Tasks**:
    - [ ] Many-to-Many Drizzle Schema.
    - [ ] `InviteMember` UseCase with UUID tokens.
    - [ ] TDD: `group-entity.spec.ts`, `invite-member.spec.ts`.

### Story 3: ABAC Security Layer
**AC**:
- Users cannot read/write data from groups they don't belong to.
- Permissions context cached in session.
- **Technical Tasks**:
    - [ ] `PermissionService` (Policy Engine).
    - [ ] UseCase Decorators for ABAC checks.
    - [ ] TDD: `evaluate-permission.spec.ts`.

---

## 📦 Epic 2: The "Golden Product" Engine
**User Value**: "As a user, I want scanned products to be accurate and enriched automatically so I don't have to type data manually."

### Story 4: Multi-Tier Product Hierarchy
**AC**:
- Barcode lookup maps to a conceptual "Canonical" parent.
- **Technical Tasks**:
    - [ ] Hierarchy table migrations.
    - [ ] TDD: `canonical-product.spec.ts`, `product-identity.spec.ts`.

### Story 5: External Sourcing Harmony
**AC**:
- Scanner falls back to Open Food Facts/UPCitemdb when local miss occurs.
- **Technical Tasks**:
    - [ ] `ExternalProductClient` (OFF + UPCitemdb).
    - [ ] Async hydration queue (Outbox Pattern).

---

## ⚡ Epic 3: Real-Time Collaborative Shopping
**User Value**: "As a group member, I want to see what others are adding to the cart instantly so we don't buy the same things twice."

### Story 6: Interactive Shopping Rooms
**AC**:
- Visual indicator when User B adds an item while User A is watching.
- **Technical Tasks**:
    - [ ] Socket.io Room orchestration (Fastify).
    - [ ] TDD: `shopping-sync.spec.ts`.

### Story 7: Pricing Truth (Consensus)
**AC**:
- Price is "Verified" only after 5 concurrent reports.
- **Technical Tasks**:
    - [ ] Consensus Aggregator logic.
    - [ ] Outlier detection filter.
    - [ ] TDD: `pricing-consensus.spec.ts`.

---

## 🎨 Epic 4: "Grocery Modern" UX/UI
**User Value**: "As a mobile user, I want the app to feel like a premium native application with smooth transitions and haptics."

### Story 8: Design System & Mobile UX
**AC**:
- App follows "Emerald/Navy" theme.
- Bottom sheet navigation for all secondary actions.
- **Technical Tasks**:
    - [ ] `shadcn/ui` custom config.
    - [ ] Vaul drawer integration.
    - [ ] Haptic Feedback Hook implementation (`useHaptics`).

---

## 🧪 Epic 5: Zero-Hallucination QA
**User Value**: "As an owner, I want the system to be bug-free so I can trust the shopping totals."

### Story 9: Total Coverage Suite
**AC**:
- Critical User Journeys (CUJs) verified by Playwright.
- No regression on Shopping Event totals.
- **Technical Tasks**:
    - [ ] Playwright E2E Master Suite.
    - [ ] Fulfilling all backend `test.todo`.
