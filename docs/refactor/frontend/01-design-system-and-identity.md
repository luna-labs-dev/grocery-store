# 01-Design System & Visual Identity: "Grocery Modern"

## 1. Visual Identity & Aesthetic
The new identity moves away from generic "Utility" and towards a **Premium, High-Contrast, and Tactile** experience. We call this "Grocery Modern".

### 1.1 Color Palette (HSL based)
- **Brand Primary**: `hsl(142, 70%, 45%)` (Emerald Green - symbol of freshness).
- **Brand Secondary**: `hsl(25, 95%, 50%)` (Productive Orange - for actions/promos).
- **Surface (Dark Mode)**: `hsl(222, 47%, 11%)` (Deep Navy).
- **Surface (Light Mode)**: `hsl(0, 0%, 98%)`.
- **Accent**: Glassmorphism with `backdrop-blur-md` for overlays.

### 1.2 Typography
- **Primary Font**: `Inter` or `Outfit` (sans-serif) for clean readability.
- **Weights**: `400` (Regular), `600` (Semi-bold) for titles, `700` (Bold) for highlights.

## 2. Design Tokens (Shadcn/UI Foundation)
We will leverage `shadcn/ui` but with a custom "Mobile-First" layer.

| Token       | Rule                                                                   |
| :---------- | :--------------------------------------------------------------------- |
| **Radius**  | `0.75rem` (Slightly rounded for a friendly, modern feel)               |
| **Shadows** | Soft, layered shadows (`box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1)`) |
| **Gaps**    | Standardized `4, 8, 16, 24px` spacing system                           |

## 3. Responsive Strategy: "The Foldable-First Approach"
1.  **Mobile (320px - 480px)**: The "Native" experience. Bottom navigation bar, floating action buttons (FAB), full-width cards.
2.  **Tablet (481px - 1024px)**: Side navigation appears. Multi-colum grid for product cards.
3.  **Desktop (> 1025px)**: Dashboard-style layout. Extended filters and secondary sidebars for "Cart Preview".

## 4. Native App Emulation (Mobile UX)
- **Haptic Feedback**: Micro-vibrations on product add/scan.
- **Gestures**: Swipe left to delete from cart, swipe right to mark as "Grabbed".
- **Bottom Sheets**: Use `vaul` (drawer) for product details and market selection instead of standard modals.
- [x] **Safe Area**: Strict adherence to `env(safe-area-inset-bottom)` for iOS/Android notches.
- [x] **A11y (Grocery Wild)**: High-contrast colors and `48px` minimum touch targets for high-glare environments.
- [x] **Pull-to-Refresh**: Native-like list syncing.
- [x] **Logic Isolation**: All state/sync logic moved to `useCart` and `useGroup` custom hooks; components are purely presentational.
- [x] **Resilience Layer**: PWA Service Worker for offline-first canonical product access.
- [x] **Skeleton States**: High-fidelity `shcn` skeleton screens for all async loading boundaries.

---
**Authored by**: Shadcn Design Architect / Solutions Architect
**Status**: DRAFT
