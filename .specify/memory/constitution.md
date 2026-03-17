<!--
# Sync Impact Report
- Version change: 1.3.0 -> 1.4.0
- List of modified principles:
    - Principle VI: Organizational Cohesion & Nomenclature -> Refined to prioritize the memory guidelines.
- Added sections: Direct reference to `.specify/memory/guidelines.md` as the source of strict technical truth.
- Templates requiring updates:
    - .specify/templates/plan-template.md (✅ updated)
- Follow-up TODOs: Ensure all agents read .specify/memory/guidelines.md in every interaction.
-->

# Grocery Store Constitution

## Core Principles

### I. Supreme Architectural Priority: Clean Architecture > Clean Code > SOLID
This is the most important rule in the codebase and is **mandatory** for every implementation.
1. **Clean Architecture**: maintain strict boundaries between Domain, Application, Infrastructure, API, and Main layers. Domain logic must be pure.
2. **Clean Code**: prioritize readability, simplicity, and maintainability.
3. **SOLID**: strictly adhere to Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion.

### II. Separation of Concerns
Maintain strict boundaries between Domain, Application, Infrastructure, API, and Main layers. Domain logic must be pure and free of external dependencies. Repositories must handle the persistence of entire Aggregate Roots atomically.

### II. "Golden Product" Hierarchy
Every physical product (EAN) maps to a Product Identity, which in turn maps to a conceptual Canonical Product. Market-specific data (price/availability) always links to the Product Identity to ensure data consistency across the ecosystem.

### III. Test-Driven Development (TDD) & Total Coverage
Mandatory Red-Green-Refactor. All new logic requires 100% test coverage (Vitest). Verification MUST include both success paths and failure scenarios (exception handling) for every API boundary and usecase. **Running `vitest`, `tsc`, and `biome check` after every implementation is mandatory to ensure state integrity.**

### IV. Secure Authorization Context (ABAC)
Security checks MUST use the `RequesterContext` for authenticated users and scoped groups. Usecases must explicitly evaluate permissions using the context's policy engine rather than scattered manual repository checks.

### V. OSS Resilience & Circuit Breakers
The technology stack must prioritize Open Source (e.g., Valkey over Redis, PostgreSQL). Integration with external services (e.g., OFF) must be guarded by aggressive circuit breakers (2000ms timeout) and offline-first sync patterns.

### VI. Organizational Cohesion & Nomenclature
The project maintains a strict directory hierarchy and naming standards defined in [guidelines.md](file:///home/tiago/01-dev-env/personal-repos/grocery-store/.specify/memory/guidelines.md). These guidelines are absolute and non-negotiable.

- **Files**: MUST use **kebab-case**.
- **Code**: Classes/Interfaces MUST use **PascalCase**; Variables/Tokens MUST use **camelCase**.
- **Database**: Tables MUST use **snake_case**; Columns MUST use **camelCase**; Enums/Roles MUST use **kebab-case**.
- **Authority**: All technical decisions must align with `.specify/memory/guidelines.md`.

### VII. Fiscal Ground Truth & Audit Integrity
Integrated fiscal data (e.g., Brazilian NFC-e) is the supreme source of truth for pricing and product validation. When a fiscal record matches a shopping event, its data MUST supersede manual user entries in the "Golden Product" engine.

### VIII. Monorepo & Package Management
The project is a Monorepo managed exclusively via `pnpm` with `pnpm workspaces`. Use of other package managers (npm, yarn) is strictly forbidden to ensure dependency consistency and efficient workspace management.

## Clean Code & Minimalism

"Rule of Simplicity": Before implementation, find the most elegant core of the logic. Avoid over-engineering. All new code must be audited against SOLID principles. Technical debt must be rejected in favor of maintainable, clean solutions. Use strict typing; `any` is forbidden unless explicitly justified.

## Database & Persistence Integrity

All write operations involving multiple tables MUST be orchestrated within a transaction using a `TransactionManager` at the service layer. Every relation must be backed by physical Foreign Key constraints. All Primary Keys must be UUIDs. Tables must include `createdAt` and `updatedAt` audit timestamps.

## Governance

This constitution supersedes all other project practices. Amendments require documentation in a Sync Impact Report and a semantic version bump. PR reviews must verify compliance with these core principles and the associated guidelines.

**Version**: 1.5.0 | **Ratified**: 2026-03-10 | **Last Amended**: 2026-03-11
