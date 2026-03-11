# Data Model: Mobile UI/UX Polish

## Entities

### `UserSettings`
Represents the client-side UI preferences persisted in `localStorage`.

- **Attributes**:
    - `hapticsEnabled` (boolean): Whether vibration feedback is active. Default: `true`.
    - `animationsEnabled` (boolean): Whether Framer Motion transitions run. Default: `true` (overridden by OS `prefers-reduced-motion`).
    - `theme` (string): UI theme preference ('system', 'light', 'dark'). Default: 'system'.

- **Validation Rules**:
    - Must fall back safely if `localStorage` is inaccessible.
    - Haptics must silently fail if hardware does not support the Web Vibration API.

### State Transitions (Transitions)
- **Haptic Context**: Triggers via `useHaptics` hook.
    - `success`: Light, distinct tap.
    - `error`: Double heavy pulse.
    - `warning`: Long pulse.
    - `impact`/`selection`: Minimal, barely perceptible tap.
