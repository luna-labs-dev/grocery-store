# Quickstart: Mobile UI/UX Polish

This document provides a quick reference for the key UI components and hooks introduced or standardized in this feature.

## 1. Using Drawers (Mobile Bottom Sheets)

Replace old inline modals or raw dialogs on mobile with `ResponsiveDrawer`.

```tsx
import { ResponsiveDrawer } from '@/components/shared/responsive-drawer';
import { Button } from '@/components/ui/button';

// Usage
<ResponsiveDrawer
  title="Edit Profile"
  description="Make changes to your profile here."
  trigger={<Button size="sm">Edit</Button>}
>
  <div className="p-4">
    {/* Drawer Content */}
  </div>
</ResponsiveDrawer>
```

## 2. Using Haptics

Wrap key mobile interactions with sensory feedback.

```tsx
import { useHaptics } from '@/hooks/use-haptics';

const MyComponent = () => {
  const haptics = useHaptics();

  const handleDelete = () => {
    haptics.warning(); // Heavy pulse for danger actions
    // proceed...
  };

  const handleSelect = () => {
    haptics.selection(); // Light tap
    // proceed...
  };
  
  // Available: success(), error(), warning(), impact(), selection(), light()
}
```

## 3. Global Design System Rules

**Buttons**:
- NEVER use large buttons for secondary actions.
- Default to `size="sm"` or explicit `h-9` for list actions, filters, edit tools, etc.
- Only use `size="xl"` (44px) for primary form submission or a single Hero action on a specialized screen.

**Spacing & Gaps**:
- Standardize all `<div className="flex gap-*">` and `grid gap-*` to `gap-4`.
- **Structural Padding**: Standardize `Page.Content` and `Page.Header` to `px-4 pt-4` (Mobile) and `md:p-8` (Desktop) to ensure visual balance.
- **Extreme Density**: Specialized components (like Group Cards) may use `gap-2` and `p-3`, but must remain centered within a balanced padding container.
