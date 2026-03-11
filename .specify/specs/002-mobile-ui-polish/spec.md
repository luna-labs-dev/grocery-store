# Feature Specification: Mobile UI/UX Polish

**Feature Branch**: `002-mobile-ui-polish`  
**Created**: 2026-03-10  
**Status**: Draft  
**Input**: User description: "Mobile UI/UX Polish: Enhance animations, haptics, bottom sheets, and theme consistency for a premium mobile experience."

## Clarifications

### Session 2026-03-10
- Q: How should the app behave for users who have "reduced motion" enabled at the OS level? → A: Respect OS preferences (Disable spring/slide animations and use simple crossfades/instant transitions).
- Q: What should happen if the device doesn't support the requested haptic pattern? → A: Graceful failure (Silent) - ignore the haptic call and rely on visual UI.
- Q: Where should user preferences regarding these UI features be stored? → A: Local Storage - Persist toggles locally on the device (e.g., via Zustand/localStorage).
- Q: For the global `h-9` button mandate, should this apply to ALL buttons or only secondary ones? → A: Primary form/page actions remain standard (44px) for accessibility; only secondary/utility buttons become `sm`/`h-9`.
- Q: For confirmation dialogs (e.g., Delete Group, Regenerate Invite), what should the mobile behavior be? → A: Adaptive component: Bottom Drawer on mobile, centered Dialog on desktop.

## Team & Specialist Guidance

This feature leverages high-end design aesthetics and front-end performance. The following specialists are the primary guardians:

- **✨ UX/UI Specialist**: Guardian of delight. Leads the definition of easing functions, haptic intensities, and visual hierarchy.
- **🎨 Shadcn Architect**: Design system lead. Ensures all components (Bottom Sheets, Buttons, Inputs) follow the "Emerald/Navy" theme tokens and atomic design patterns.
- **💻 Frontend Specialist**: Technical lead. Ensures Framer Motion animations are performant (60fps) and `useHaptics` is accessible across devices.
- **🧼 Clean Code Purist**: Guardian of elegance. Ensures that all new hooks (`useHaptics`, `useSettings`) and components are modular, strictly typed, and follow SOLID principles.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Premium Bottom Sheet Interactions (Priority: P1)

As a mobile shopper, I want secondary actions (like product details or group settings) to appear in a smooth bottom sheet so the app feels native to my device.

**Why this priority**: Core mobile navigation pattern that elevates the "premium" feel.

**Independent Test**: Trigger a "Product Details" view and verify it uses a `Vaul` drawer with momentum-based dragging.

**Acceptance Scenarios**:

1. **Given** the mobile view, **When** I tap a product item, **Then** a bottom sheet slides up from the bottom with a spring animation.
2. **Given** an open bottom sheet, **When** I drag it down beyond the threshold, **Then** it dismisses smoothly with haptic feedback.

---

### User Story 2 - Haptic Feedback for Cart Actions (Priority: P2)

As a shopper, I want to feel a subtle vibration when I add an item to the cart or complete an action so I have physical confirmation of my success.

**Why this priority**: Essential for the "premium" sensory experience on mobile.

**Independent Test**: Use a device/simulator with haptics enabled. Trigger an "Add to Cart" action and verify `useHaptics('success')` is called.

**Acceptance Scenarios**:

1. **Given** the app is open on a haptic-capable device, **When** I successfully add a product, **Then** I feel a short, crisp vibration.

---

### User Story 3 - "Emerald/Navy" Theme Consistency (Priority: P2)

As a user, I want the entire app to follow a consistent, high-contrast theme so it looks polished and professional.

**Why this priority**: Brand identity and visual trust.

**Acceptance Scenarios**:

1. **Given** standard pages (Login, Profile, Shopping), **When** viewed, **Then** all primary buttons use the "Emerald" accent and backgrounds use the "Navy" palette with proper glassmorphism where specified.

---

### User Story 4 - Animated State Transitions (Priority: P3)

As a user, I want transitions between pages and loading states to be fluid rather than "jumpy" so the experience feels continuous.

**Why this priority**: Reduces cognitive load and enhances the "premium" feel.

**Acceptance Scenarios**:

1. **Given** a page change, **When** navigating, **Then** the new content fades in or slides in using Framer Motion orchestrations.

### User Story 5 - Group Section Polish (Extreme Edition) (Priority: P1)
As a user, I want the Group Section to feel extremely compact and native on mobile, with efficient use of space and a specialized layout for group details that keeps critical information and actions always accessible.

**Acceptance Scenarios**:
1. **Given** the `GroupDetails` page on mobile, **When** I scroll, **Then** the group header and "Invite" button stay pinned to the top, and the "Leave Group" button stays pinned to the bottom.
2. **Given** the `ManageGroupsPage`, **When** viewed on mobile, **Then** group cards use a vertical stack layout with `gap-2` spacing, minimal padding (`p-3`), and smaller fonts, placing the Group Name visually above secondary details to optimize information hierarchy.
3. **Given** the `GroupSettingsPage` on mobile, **When** viewed, **Then** it uses a strict single-column layout with uniform `px-4 pt-4` padding to ensure visual balance.
4. **Given** critical group actions (Delete Group, Regenerate Invite), **When** triggered on mobile, **Then** they trigger appropriate haptic feedback (e.g., Warning pattern for Delete, Impact pattern for Regenerate).
5. **Given** the "Invite" action on mobile, **When** triggered, **Then** it opens a `Vaul` bottom-drawer instead of an inline form (FR-011).

### User Story 6 - Desktop Responsiveness Polish (Priority: P2)
As a desktop user, I want the Group Section pages to adapt gracefully to larger screens without feeling stretched out or comically large, so that the web app feels like a first-class desktop citizen.

**Acceptance Scenarios**:
1. **Given** the `ManageGroupsPage` on a desktop viewport (`md` and up), **When** viewed, **Then** the group cards should render in a multi-column grid (`grid-cols-2` or `grid-cols-3`) utilizing the horizontal space, with `max-w-6xl` container centering.
2. **Given** the `GroupDetails` page on a desktop viewport, **When** viewed, **Then** the member list and group actions should expand into a dual-pane layout (Member list left, Actions/Invite right) to utilize the wider screen effectively (FR-012).
3. **Given** the `GroupSettingsPage` on a desktop viewport, **When** viewed, **Then** the forms should be constrained to `max-w-2xl` and centered, with uniform `p-8` padding for a spacious "desktop-first" feel.

### User Story 7 - Global Design System Consistency (Priority: P1)
As a user, I want the entire application to feel unified, with consistent button sizes, standard `gap-4` spacing, and no broken mobile views, so the app feels like a professional, cohesive product.

**Acceptance Scenarios**:
1. **Given** any page in the frontend, **When** viewed on mobile, **Then** no elements cause horizontal overflow (no non-mobile components leaking into mobile view).
2. **Given** standard forms and lists, **When** comparing actions, **Then** secondary buttons are uniformly compact, and general spacing defaults to `gap-4` for consistency.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST integrate `vaul` for all mobile drawers/bottom sheets.
- **FR-002**: System MUST implement a `useHaptics` hook that supports 'success', 'warning', 'error', and 'impact' patterns.
- **FR-003**: System MUST utilize Framer Motion for transitions, respecting `prefers-reduced-motion`.
- **FR-004**: System MUST adhere to the "Emerald/Navy" theme tokens.
- **FR-005**: All interactive elements MUST have a minimum "Tap Target" size of 44x44px.
- **FR-006**: System MUST persist user UI preferences in local storage.
- **FR-007**: All new logic MUST be 100% test-covered (TDD).
- **FR-008**: Group management pages MUST use the responsive `Page` architecture with standardized **balanced** paddings (`px-4 pt-4` for mobile content) to avoid top-vs-side offset visual artifacts.
- **FR-009**: The `GroupDetails` page MUST implement a "Sticky-Scroll-Sticky" architecture on mobile.
- **FR-010**: All Group Cards (in `ManageGroupsPage`) MUST be "Extreme Compact".
- **FR-011**: The Invite UI on mobile MUST be trigger-based (Drawer/Modal) rather than embedded in the page flow.
- **FR-012**: All Group Section pages (`ManageGroupsPage`, `GroupDetails`, `GroupSettingsPage`) MUST be fully responsive on Desktop devices, utilizing available space with multi-column grids or constrained center columns to avoid stretched-out UI components.
- **FR-013**: The Design System MUST uniformly enforce compact buttons (`size="sm"` or `h-9`/`h-10`) by default across the entire frontend, unless a hero action explicitly requires `xl`.
- **FR-014**: All standard container spacings and flex/grid gaps MUST default to `gap-4` or `p-4` structurally, deviating only for intentional extreme density (like Group Cards).
- **FR-015**: Mobile views MUST NOT render desktop-specific components (e.g., large data tables without responsive scroll, non-wrapping horizontal navs) that cause horizontal overflow or usability issues.

### Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of primary interactions trigger appropriate haptic feedback.
- **SC-002**: All animations maintain 60FPS on mid-range mobile devices.
- **SC-003**: 100% of drawers/modals on mobile follow the bottom-sheet pattern.
- **SC-004**: `GroupDetails` member list scrolls between fixed header/footer without trapping global page scroll.
- **SC-005**: All administrative buttons meet the 44px mandate but with compact visual weighting (e.g. smaller fonts, minimal internal padding).
- **SC-006**: 0 horizontal overflow issues in `GroupSettingsPage`.

## Assumptions

- We assume the user is using a modern smartphone (iOS/Android) for these features.
- We assume Framer Motion is the standard animation library for the React project.
