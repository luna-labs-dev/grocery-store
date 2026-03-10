# Research: Mobile UI/UX Polish

## 1. Bottom Sheet Implementation (`vaul`)
**Decision**: Utilize `vaul` for all drawer-based interactions.
**Rationale**: 
- Already present in `package.json` and used in `ResponsiveDrawer.tsx`.
- Provides momentum-based dragging, nested scroll support, and accessible ARIA attributes.
- Native-like feel on iOS/Android.

## 2. Animation Orchestration (`framer-motion`)
**Decision**: Use `framer-motion` (via the `motion` package already installed).
**Rationale**:
- Provides declarative API for shared element transitions.
- Supports `AnimatePresence` for exit animations.
- Built-in support for `useReducedMotion` hook to respect OS-level accessibility settings.

## 3. Haptic Feedback (`navigator.vibrate` vs `Capacitor/Native`)
**Decision**: Implement a custom `useHaptics` hook.
**Rationale**:
- For web context, `navigator.vibrate` is the standard.
- Success pattern: `[0, 10, 5, 10]` (double tap).
- Warning/Impact: `[50]` (singular strong hit).
- Must detect support via `'vibrate' in navigator` and fail silently as clarified.

## 4. Theme Consistency (`Tailwind v4`)
**Decision**: Leverage Tailwind v4 CSS variables.
**Rationale**:
- Project is using `@tailwindcss/vite` v4.
- Theme tokens (Emerald/Navy) should be defined in `apps/frontend/src/index.css` as variables.
- Enables high-performance theme switching and glassmorphism (via `backdrop-blur`).
