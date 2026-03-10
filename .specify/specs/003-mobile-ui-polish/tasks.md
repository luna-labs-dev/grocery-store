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

## 🏁 Final Verification & Quality

- [ ] **Task V-001**: Performance Profiling [ ]
    - [ ] Verify 60FPS animations on mobile (SC-002)
- [ ] **Task V-002**: Clean Code Final Review [ ]
    - [ ] Audit all new files for SOLID compliance and DRY principles
- [ ] **Task V-003**: Run `quickstart.md` validation [ ]
