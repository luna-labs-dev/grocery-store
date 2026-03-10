# Quickstart: Mobile UI/UX Polish

## 🛠️ Verification Steps

### 1. Animations & Reduced Motion
- Open the app on a mobile device or browser with "Reduced Motion" enabled.
- Verify that page transitions and drawers appear instantly or with simple fades, NOT spring/slide animations.
- Set motion in Profile -> Accessibility -> Reduced Motion (Local Toggle) and verify it works without refresh.

### 2. Haptic Feedback
- Using Chrome DevTools "Sensor" tab or a physical Android/iOS device.
- Add an item to the cart.
- Verify subtle vibration occurs on success.
- Trigger invalid login and verify different "error" vibration pattern.

### 3. Bottom Sheets
- Navigate to the shopping list.
- Tap a product to open details.
- Verify the bottom sheet can be dragged down effortlessly to close.
- Verify the background blur (glassmorphism) matches the "Emerald/Navy" theme.

## 🧪 Automated Tests
- Run `pnpm -C apps/frontend test` specifically for `use-haptics.spec.ts`.
- Run Playwright E2E tests for visual consistency.
