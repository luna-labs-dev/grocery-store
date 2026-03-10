# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

This feature focuses on elevating the mobile user experience to a "premium" level by implementing smooth bottom-sheet interactions, haptic feedback, and fluid page transitions. We will leverage `vaul` for drawers, `motion` for animations, and the web `vibration` API for sensory confirmation.

## Technical Context

**Language/Version**: React 19 (TypeScript)
**Primary Dependencies**: `vaul`, `motion`, `tailwindcss` v4
**Storage**: Local Storage (for UI preferences)
**Testing**: Vitest (for haptic hook logic), Playwright (for drawer/animation visual regression)
**Target Platform**: Mobile Web (iOS Safari, Android Chrome)
**Project Type**: Web application (Frontend)
**Performance Goals**: 60fps animations, <100ms haptic response
**Constraints**: Respect `prefers-reduced-motion`, silent haptic fallback, "Emerald/Navy" theme

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify alignment with [Grocery Store Constitution](file:///home/tiago/01-dev-env/personal-repos/grocery-store/.specify/memory/constitution.md):
- [x] **Clean Architecture**: UI logic isolated in components and hooks. **Clean Code Purist** audit required for hook modularity.
- [ ] **Golden Product Logic**: N/A for this UI-only feature.
- [x] **ABAC Compliance**: No new sensitive data access; standard group scoping applies.
- [x] **OSS Resilience**: Using standard OSS libraries (`vaul`, `motion`).

## Project Structure

### Documentation (this feature)

```text
specs/003-mobile-ui-polish/
├── plan.md              # This file
├── research.md          # Completed (Phase 0)
├── data-model.md        # N/A
├── quickstart.md        # Phase 1 output
├── contracts/           # N/A
└── tasks.md             # Phase 2 output
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
│   └── use-haptics.ts       # New haptic logic
└── lib/
    └── animations.ts        # Shared Framer Motion variants
```

**Structure Decision**: Standardizing on `vaul` for mobile-native interactions and a centralized animations library.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation                  | Why Needed         | Simpler Alternative Rejected Because |
| -------------------------- | ------------------ | ------------------------------------ |
| [e.g., 4th project]        | [current need]     | [why 3 projects insufficient]        |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient]  |
