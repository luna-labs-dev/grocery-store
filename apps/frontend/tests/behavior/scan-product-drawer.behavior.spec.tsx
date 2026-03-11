import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AddProductToCartDrawer } from '../../src/features/shopping-event/features/shopping-event-details/components/cart/add-product-to-cart-drawer';

// Mock components from @/components
vi.mock('@/components', () => ({
  Drawer: ({ children, open, onOpenChange: _ }: any) => (
    <div data-testid="drawer" data-open={open}>
      {children}
    </div>
  ),
  DrawerContent: ({ children }: any) => (
    <div data-testid="drawer-content">{children}</div>
  ),
  DrawerHeader: ({ children }: any) => <div>{children}</div>,
  DrawerTitle: ({ children }: any) => <div>{children}</div>,
  DrawerDescription: ({ children }: any) => <div>{children}</div>,
  DrawerFooter: ({ children }: any) => <div>{children}</div>,
  DrawerTrigger: ({ children }: any) => (
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
      Root: ({ children, onSuccess, onCancel }: any) => (
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
      Fields: () => <div data-testid="product-form-fields" />,
      Actions: () => <div data-testid="product-form-actions" />,
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
