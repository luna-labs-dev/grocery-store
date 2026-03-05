# Product Logic Refactor: The Master Plan

This document serves as the entry point for the comprehensive products logic refactor. The planning is divided into specialized domains for better readability and implementation guidance.

## 1. Executive Summary
We are moving from an ephemeral, transaction-based product model to a **"Golden Product"** ecosystem. This model uses a 4-tier hierarchy:
1.  **Canonical Products**: Conceptual groups (e.g., "Coca-Cola").
2.  **Product Identities**: Specific variants and sizes (e.g., "Coca-Cola 330ml Can").
3.  **Physical EANs**: Barcodes mapping to an Identity (e.g., Seasonal/Normal editions).
4.  **Market-Specific Prices**: Crowdsourced data linked to the *Product Identity*.

## 2. Detailed Specifications

| Domain                      | Description                                                                  | Link                                                                                               |
| :-------------------------- | :--------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------- |
| **01 - Architecture**       | Entity relationships, "Golden Product" hierarchy, and ERD.                   | [products/01-data-model-and-architecture.md](./products/01-data-model-and-architecture.md)         |
| **02 - API Integration**    | External sourcing strategy (Open Food Facts, UPCitemdb).                     | [products/02-external-api-integration.md](./products/02-external-api-integration.md)               |
| **03 - Search & Grouping**  | EAN/GTIN matching, variant grouping, and fuzzy search.                       | [products/03-search-and-canonicalization.md](./products/03-search-and-canonicalization.md)         |
| **04 - Shopping Lifecycle** | Cart management, price reporting, and consensus logic.                       | [products/04-shopping-event-and-cart.md](./products/04-shopping-event-and-cart.md)                 |
| **05 - Lists & Voice**      | Pre-shopping lists and Alexa/Google Home integrations.                       | [products/05-shopping-lists-and-integrations.md](./products/05-shopping-lists-and-integrations.md) |
| **06 - Groups & Sharing**   | Replacing "Family" with flexible many-to-many groups.                        | [groups/01-flexible-groups-and-sharing.md](./groups/01-flexible-groups-and-sharing.md)             |
| **07 - Auth & ABAC**        | Better Auth migration, ABAC (Master/Admin/Mod), and Configurable Thresholds. | [auth/01-auth-strategy.md](./auth/01-auth-strategy.md)                                             |
| **08 - Real-Time Sync**     | Socket.io integration for live shopping updates.                             | [realtime/01-realtime-sync-strategy.md](./realtime/01-realtime-sync-strategy.md)                   |
| **09 - Frontend & UX**      | Native-like mobile-first UI and Design System.                               | [frontend/01-design-system-and-identity.md](./frontend/01-design-system-and-identity.md)           |
| **10 - Frontend Review**    | Peer review from Specialist, Design, and Solutions roles.                    | [frontend/03-architectural-review.md](./frontend/03-architectural-review.md)                       |
| **11 - Testing Strategy**   | Multi-tier QA framework (Unit, Integration, E2E).                            | [testing/01-testing-strategy.md](./testing/01-testing-strategy.md)                                 |
| **12 - Test Blueprints**    | Drafting `test.todo` for core entities and use cases.                        | [Back-end Test Suite](../../apps/backend/tests/)                                                   |
| **13 - Master Roadmap**     | Breakdown into Epics, Tasks, and Subtasks.                                   | [ROADMAP.md](./ROADMAP.md)                                                                         |

## 3. Core Directives (Retail Nexus Veteran)
- **Offline First**: Scanned barcodes must work without a connection; hydration happens background/later.
- **Circuit Breakers**: External APIs (OFF/UPCitemdb) must have aggressive timeouts (2000ms).
- **Weigh-Scale Barcodes**: Logic must handle variable-weight barcodes (e.g., EAN-13 starting with '2').
- **OSS Guard**: No non-OSS licensed tech (Valkey over Redis).

## 4. Architectural Scars & Guardrails (Technical Deep-Dive)
- **SCAR_07: The Signal Dead-Zone**: Hypermarket basements kill RF. Result: Partial Carts.
    - *Defense*: Frontend Outbox Pattern + Lamport Clocks for sync resolution.
- **SCAR_08: Image Link Decay**: External product images disappear.
    - *Defense*: Proxy/Cache strategy in the `ExternalProductClient`.
- **SCAR_09: Migration Lock-In**: Moving "Family" -> "Group" with live events.
    - *Defense*: Shadow Mapping during migration (Dual-write or backward-compatible schema).
- **SCAR_10: State Pollution**: Valkey state bleeding between test runs.
    - *Defense*: Namespaced keys + `FLUSHDB` in integration test teardown.

## 4. Next Steps
1.  **Infrastructure Setup**: Database schema migrations for new tables.
2.  **API Client**: Implementation of the `ExternalProductClient`.
3.  **Auth & Groups**: Migration to Better Auth, Groups model, and ABAC Security Layer.
4.  **Ops & Governance**: Implementation of `ConfigService`, `SettingsRepository`, and Admin Dashboards.
5.  **Core Use Cases**: Implementation of the search and consensus logic.
5.  **Frontend & Real-Time**: Rebuilding the UI with the new Design System and Socket.io.
6.  **Quality Assurance**: Full suite execution (Unit -> Integration -> E2E).

---
**Authored by**: Solutions Architect, Retail Nexus Veteran & Ops Commander
**Date**: March 2026
