import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AddProductToCartDrawer } from '../../src/features/shopping-event/features/shopping-event-details/components/cart/add-product-to-cart-drawer';

// Mock components from @/components
vi.mock('@/components', () => ({
  Drawer: ({
    children,
    open,
    onOpenChange: _,
  }: {
    children: React.ReactNode;
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }) => (
    <div data-testid="drawer" data-open={open}>
      {children}
    </div>
  ),

  DrawerContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="drawer-content">{children}</div>
  ),
  DrawerHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DrawerTitle: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DrawerDescription: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DrawerFooter: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DrawerTrigger: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="drawer-trigger">{children}</div>
  ),
}));

// Mock hooks
vi.mock('@/hooks', () => ({
  useHaptics: () => ({
    selection: vi.fn(),
    success: vi.fn(),
  }),
}));

// Mock ProductFormComposite USING ALIASED PATH
vi.mock(
  '@/features/shopping-event/features/shopping-event-details/components/cart/product-form-composite',
  () => ({
    ProductFormComposite: {
      root: ({
        children,
        onSuccess,
        onCancel,
      }: {
        children: React.ReactNode;
        onSuccess: () => void;
        onCancel: () => void;
      }) => (
        <div data-testid="product-form-root">
          {children}
          <button type="button" data-testid="mock-success" onClick={onSuccess}>
            Success
          </button>
          <button type="button" data-testid="mock-cancel" onClick={onCancel}>
            Cancel
          </button>
        </div>
      ),

      fields: () => <div data-testid="product-form-fields" />,
      actions: () => <div data-testid="product-form-actions" />,
    },
  }),
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe('AddProductToCartDrawer Behavior', () => {
  const shoppingEventId = 'test-event-id';

  it('should render the trigger children', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AddProductToCartDrawer shoppingEventId={shoppingEventId}>
          <button type="button">Open Scanner</button>
        </AddProductToCartDrawer>
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByText('Open Scanner'));

    expect(screen.getByText('Open Scanner')).toBeInTheDocument();
  });

  it('should close the drawer when onSuccess is called in the form', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AddProductToCartDrawer shoppingEventId={shoppingEventId}>
          <button type="button">Open Scanner</button>
        </AddProductToCartDrawer>
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByText('Open Scanner'));

    const successBtn = screen.getByTestId('mock-success');
    fireEvent.click(successBtn);

    const drawer = screen.getByTestId('drawer');
    expect(drawer).toHaveAttribute('data-open', 'false');
  });

  it('should close the drawer when onCancel is called in the form', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AddProductToCartDrawer shoppingEventId={shoppingEventId}>
          <button type="button">Open Scanner</button>
        </AddProductToCartDrawer>
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByText('Open Scanner'));

    const cancelBtn = screen.getByTestId('mock-cancel');
    fireEvent.click(cancelBtn);

    const drawer = screen.getByTestId('drawer');
    expect(drawer).toHaveAttribute('data-open', 'false');
  });
});
