import { fireEvent, render, screen } from '@testing-library/react';
import { toast } from 'sonner';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { InviteQRCode } from '../../src/features/group/components/invite-qr-code';

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
  },
}));

// Mock iconify
vi.mock('@iconify/react', () => ({
  Icon: () => <div data-testid="icon" />,
}));

// Mock domain helpers
vi.mock('@/domain', () => ({
  unsecuredCopyToClipboard: vi.fn(),
}));

describe('InviteQRCode Behavior', () => {
  const defaultProps = {
    joinUrl: 'https://example.com/join?code=123',
    inviteCode: '123456',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the QR code with the correct URL', () => {
    render(<InviteQRCode {...defaultProps} />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute(
      'src',
      expect.stringContaining(encodeURIComponent(defaultProps.joinUrl)),
    );
  });

  it('should display the invite code', () => {
    render(<InviteQRCode {...defaultProps} />);
    expect(screen.getByText(/Código: 123456/i)).toBeInTheDocument();
  });

  it('should copy the link to clipboard and show success toast when button is clicked', async () => {
    // Mock navigator.clipboard
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });

    // Mock window.isSecureContext
    Object.defineProperty(window, 'isSecureContext', {
      value: true,
      configurable: true,
    });

    render(<InviteQRCode {...defaultProps} />);
    const button = screen.getByRole('button', { name: /Copiar Link/i });

    fireEvent.click(button);

    expect(writeText).toHaveBeenCalledWith(defaultProps.joinUrl);
    expect(toast.success).toHaveBeenCalledWith('Link de convite copiado!');
  });
});
