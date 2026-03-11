# Tasks: Mobile UI/UX Polish

## 🛠️ Technical Preparation

- [ ] **Task PREP-001**: Define "Emerald/Navy" theme variables in `index.css` [ ]
    - [ ] Add primary/secondary colors
    - [ ] Add glassmorphism utility classes
- [ ] **Task PREP-002**: Create shared `animations.ts` in `lib/` [ ]
    - [ ] **Test**: Create `lib/animations.spec.ts` (Red) [ ]
    - [ ] Define reusable spring/fade variants
    - [ ] Implement reduced-motion detection helper
- [ ] **Task PREP-003**: Accessibility Audit - Tap Targets [ ]
    - [ ] Verify all interactive elements meet 44x44px target (FR-005)

## 🧪 Base Infrastructure

- [ ] **Task INFRA-001**: Implement `use-haptics` hook [ ]
    - [ ] **Test**: Create `hooks/use-haptics.spec.ts` (Red) [ ]
    - [ ] Create `apps/frontend/src/hooks/use-haptics.ts`
    - [ ] Implement pattern matching (success/error/impact)
    - [ ] Add silent fallback for unsupported devices
- [ ] **Task INFRA-002**: Refactor `ResponsiveDrawer` to use new `drawer.tsx` [ ]
    - [ ] Create `apps/frontend/src/components/ui/drawer.tsx` using `vaul`
    - [ ] Update `ResponsiveDrawer` to leverage the new UI component
- [ ] **Task INFRA-003**: Implement `useSettings` store for UI Preferences [ ]
    - [ ] **Test**: Create `hooks/use-settings.spec.ts` (Red) [ ]
    - [ ] Create Zustand store with localStorage persistence (FR-006)
    - [ ] **Clean Code Audit**: Verify hook simplicity and single responsibility (SOLID)

## 📱 User Story 1: Premium Bottom Sheet Interactions

- [ ] **Task US1-001**: Update Product Details to use Bottom Sheet [ ]
    - [ ] Integrate `ResponsiveDrawer` in `ShoppingList` item click
    - [ ] Verify momentum-based dragging works
- [ ] **Task US1-002**: Add Haptic Feedback to Drawer [ ]
    - [ ] Trigger `impact` haptic on drag threshold/dismissal

## 📱 User Story 2: Haptic Feedback for Cart Actions

- [ ] **Task US2-001**: Integrate Haptics in Cart Actions [ ]
    - [ ] Add `useHaptics` call to "Add to Cart" button (Success pattern)
    - [ ] Add `useHaptics` call to item removal (Impact pattern)

## 📱 User Story 3: Theme Consistency

- [ ] **Task US3-001**: Apply Theme Consistency Audit [ ]
    - [ ] Profile & Settings buttons/backgrounds update
    - [ ] Verify "Emerald/Navy" contrast ratios

## 📱 User Story 4: Animated State Transitions

- [ ] **Task US4-001**: Add Page Entry Transitions [ ]
    - [ ] Wrap main routes with `motion.div`
    - [ ] Implement fade-in orchestrations
    - [ ] Verify `prefers-reduced-motion` bypasses these animations

## 📱 User Story 5: Group Section Polish

- [ ] **Task US5-001**: Modernize `GroupSettingsPage` Layout (FR-008) [ ]
    - [ ] Apply `Page` architecture (standardized `pt-2`)
    - [ ] Update Grid to stack aggressively on mobile
    - [ ] Ensure 44px tap targets for all buttons
- [ ] **Task US5-002**: Mobile Polish for `ManageGroupsPage` (FR-008) [ ]
    - [ ] Standardize gaps between group cards to `gap-2`
    - [ ] Implement vertical stack layout for mobile cards
    - [ ] Ensure tap targets match 44px mandate
- [ ] **Task US5-003**: Sensory Updates for Group Actions [ ]
    - [ ] Add haptics for "Delete Group" (Warning pattern)
    - [ ] Add haptics for "Regenerate Invite" (Medium impact)

## 🏁 Final Verification & Quality

- [ ] **Task V-001**: Performance Profiling [ ]
    - [ ] Verify 60FPS animations on mobile (SC-002)
- [ ] **Task V-002**: Clean Code Final Review [ ]
    - [ ] Audit all new files for SOLID compliance and DRY principles
- [ ] **Task V-003**: Run `quickstart.md` validation [ ]

## 🖥️ Phase 11: Desktop Responsiveness (FR-012) - REOPENED

- [x] **Task D-001**: Responsive `ManageGroupsPage` [x]
    - [x] Update grid to `md:grid-cols-2`, `lg:grid-cols-3`
- [x] **Task D-002**: Constrained `GroupDetails` Layout [x]
    - [x] Implement dual-pane layout: Member list (left) + Action cards (right)
- [x] **Task D-003**: Constrained `GroupSettingsPage` Layout [x]
    - [x] Wrap forms in `max-w-2xl` and add desktop-friendly container styles
- [ ] **Task D-004**: Global Desktop Padding Audit [ ]
    - [ ] Verify `md:p-8` or `md:p-12` on all group pages for spaciousness

## 🌍 Phase 12: Global Frontend Design System Audit (FR-013, FR-014, FR-015)

- [x] **Task G-001**: Global Button Sizing Standardization [x]
- [x] **Task G-002**: Global Gap/Spacing Standardization [x]
- [x] **Task G-003**: Mobile Overflow & Component Audit [x]

## 💎 Phase 13: Extreme Layout Refinements (Remediation)

- [x] **Task R-001**: Reconcile Padding Imbalances (FR-008, FR-014) [x]
    - [x] Update `Page.Content` to use `px-4 pt-4` (balanced) instead of `pt-2`.
    - [x] Sync `Page.Header` horizontal padding with `Page.Content`.
- [x] **Task R-002**: Move Invite UI to Trigger-based Drawer on Mobile (FR-011) [x]
    - [x] Refactor inline invite form to a `vaul` drawer.
    - [x] Add "Add Member" icon trigger to header.
- [x] **Task R-003**: Implement Sticky-Scroll-Sticky for `GroupDetails` (FR-009) [x]
    - [x] Pin Header and Footer/Global-Actions; allow member list to scroll.
- [ ] **Task R-004**: Final TDD Coverage Gate (Principle III) [ ]
    - [ ] Run `vitest --coverage` and ensure 100% on new group features.
