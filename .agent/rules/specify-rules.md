---
trigger: always_on
---

# grocery-store Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-03-19

## Active Technologies
- TypeScript ~5.9.3, Node.js (via pnpm@10.29.3) + NestJS, Drizzle ORM, Vite, Vitest (003-cart-workflow-completion)
- TypeScript 5.4+ + Fastify (API), Zod (Validation), tsyringe (DI), Axios (HTTP), Buidler (Circuit Breaker), Drizzle ORM (DB) (003-cart-workflow-completion)
- PostgreSQL (via Drizzle) (003-cart-workflow-completion)
- TypeScript 5.7+ (Strict) | Node.js 22+ (Backend) | React 19 (Frontend) + Fastify, Drizzle ORM, tsyringe, Axios, Buidler (Backend) | TanStack Query, Orval, react-zxing, Vaul (Frontend) (003-cart-workflow-completion)
- PostgreSQL (hosted) (003-cart-workflow-completion)
- TypeScript 5.7+ (Strict), Node.js 22+ + Fastify, tsyringe (DI), Drizzle ORM (006-arch-normalization)
- TypeScript ~5.9.3, Node.js 22+ + Fastify 5.7+, Zod, tsyringe, Orval, fastify-type-provider-zod (007-exception-handling-std)

- (001-global-blueprint)

## Project Structure

```text
src/
tests/
```

## Commands

# Add commands for 

## Code Style

- **Naming**: Follow standard Nature-Role conventions (e.g., `DbCartManager`, `IPriceConsensusEngine`).
- **Tests (ABSOLUTE RULE)**: 
  - Every test file MUST include a `CONTEXT_INTELLIGENCE_HEADER`.
  - Test descriptions MUST be ≥ 50 chars and prefixed (e.g., `[PR-CONSENSUS-SUCCESS]`).
  - Follow strict TDD: Code MUST comply with tests.
- **Verification**: Always run root-level `pnpm lint`, `pnpm test`, and `pnpm --filter backend typecheck`.
- **Plan Evolution (ABSOLUTE RULE)**: Implementation plans MUST be cumulative across ALL runs (analyze, plan, etc.). Never remove agreed-upon sections. Expand only. (Principle IX v1.9.0).

## Recent Changes
- 007-exception-handling-std: Added TypeScript ~5.9.3, Node.js 22+ + Fastify 5.7+, Zod, tsyringe, Orval, fastify-type-provider-zod
- 006-arch-normalization: Added TypeScript 5.7+ (Strict), Node.js 22+ + Fastify, tsyringe (DI), Drizzle ORM


<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
