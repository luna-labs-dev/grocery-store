# Implementation Plan: Mobile UI/UX Polish

**Branch**: `002-mobile-ui-polish` | **Date**: 2026-03-10 | **Spec**: [spec.md](file:///home/tiago/01-dev-env/personal-repos/grocery-store/.specify/specs/002-mobile-ui-polish/spec.md)
**Input**: Feature specification from `/.specify/specs/002-mobile-ui-polish/spec.md`

## Summary

This feature focuses on elevating the mobile user experience to a "premium" level by implementing smooth bottom-sheet interactions, haptic feedback, fluid page transitions, and extreme mobile layout density. It also includes comprehensive desktop responsiveness constraints and a global UI audit to strictly enforce the design system (compact buttons, consistent gap-4 spacing).

## Technical Context

**Language/Version**: React 19 (TypeScript)
**Primary Dependencies**: `vaul`, `motion`, `tailwindcss` v4
**Storage**: Local Storage (for UI preferences)
**Testing**: Vitest, Playwright
**Target Platform**: Mobile Web & Desktop Web (Responsive)
**Project Type**: Web application (Frontend)
**Performance Goals**: 60fps animations, <100ms haptic response
**Constraints**: Respect `prefers-reduced-motion`, silent haptic fallback, "Emerald/Navy" theme

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify alignment with [Grocery Store Constitution](file:///home/tiago/01-dev-env/personal-repos/grocery-store/.specify/memory/constitution.md):
- [x] **Clean Architecture**: Are layers (Domain, App, Infra, API) strictly separated?
- [x] **Golden Product Logic**: Does data flow follow the Canonical -> Identity hierarchy? (N/A for UI)
- [x] **ABAC Compliance**: Are permissions evaluated via `RequesterContext`? (N/A)
- [x] **OSS Resilience**: Avoiding non-OSS tech? Circuit breakers for external APIs? (Yes, `vaul`/`motion`).

## Project Structure

### Documentation (this feature)

```text
.specify/specs/002-mobile-ui-polish/
├── plan.md              # This file
├── research.md          # Completed (Phase 0)
├── data-model.md        # Feature Data Model
├── quickstart.md        # Usage Guide
└── tasks.md             # Tasks Log
```

### Source Code

```text
apps/frontend/src/
├── components/
│   ├── ui/
│   │   ├── drawer.tsx       # Vaul integration
│   │   └── haptic-button.tsx
│   └── shared/
│       └── responsive-drawer.tsx # Refactor to use new drawer logic
├── hooks/
│   ├── use-haptics.ts       # New haptic logic
│   └── use-settings.ts      # Local UI preference storage
├── lib/
│   └── animations.ts        # Shared Framer Motion variants
└── features/group/
    ├── pages/
    │   ├── manage-groups-page.tsx
    │   └── group-settings-page.tsx
    └── components/
        └── group-details.tsx
```

**Structure Decision**: Standardizing on `vaul` for mobile-native interactions, a centralized animations library, and responsive Tailwind UI patterns.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
| None      | N/A        | N/A                                  |

## Execution Phases

### Included Previous Phases
- Phases 1-10 (Implemented UI Polish, Haptics, Drawer, Extreme Density for Group Section).

### Phase 11: Desktop Responsiveness (FR-012) - REOPENED
- [MODIFY] `manage-groups-page.tsx`: Add `max-w-6xl mx-auto` container; update grid to `md:grid-cols-2 lg:grid-cols-3` with `gap-6`.
- [MODIFY] `group-details.tsx`: 
  - Implement dual-pane layout: `flex flex-col md:flex-row gap-8`.
  - Left pane (70%): Member list.
  - Right pane (30%): Sticky action cards (Invite, Group Info).
- [MODIFY] `group-settings-page.tsx`: 
  - Wrap content in `max-w-2xl mx-auto`.
  - Add `md:p-8 md:bg-navy-900/50 md:rounded-xl md:border md:border-emerald-500/20`.

### Phase 12: Global Frontend Design System Audit (FR-013, FR-014, FR-015)
- [MODIFY] **Global Button Sizing**: Search and replace `Button` references. Mandate `size="sm"` or `h-9` for secondary/utility actions. Keep `xl` only for primary flows.
- [MODIFY] **Global Structural Spacing**: Search for `gap-*` classes on flex/grid containers. Standardize arbitrary spacing to `gap-4` structural defaults. Standardize container paddings to `p-4`.
- [MODIFY] **Mobile Overflow Patching**: Identify desktop-first structures (e.g., `<table`, `overflow-visible`) and wrap them in mobile-friendly scroll containers or refactor to stack layouts for `xs`/`sm` viewports.

### Phase 13: Extreme Layout Refinements (Remediation)
- [MODIFY] `manage-groups-page.tsx`: 
  - Reconcile padding: Change `pt-2` to `px-4 pt-4` on `Page.Content`.
  - Fix header alignment: Ensure `Page.Header` and `Page.Content` use identical horizontal padding.
- [MODIFY] `group-details.tsx`:
  - **FR-009**: Implement `Sticky-Scroll-Sticky` via `sticky top-0` (Header), `overflow-y-auto` (List), and `sticky bottom-0` (Footer/Action).
  - **FR-011**: Move Invite form to a `ResponsiveDrawer` triggered by the "Add Member" icon.
- [MODIFY] `group-settings-page.tsx`:
  - Enforce `px-4 pt-4` uniform padding.
  - Scale down inputs: Use `h-10` or `h-9` for desktop-friendly inputs instead of mobile-oversized ones.
