/**
 * @vitest-environment jsdom
 */
import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useHaptics } from './use-haptics';
import { useSettings } from './use-settings';

// Mock useSettings
vi.mock('./use-settings', () => ({
  useSettings: vi.fn(),
}));

describe('useHaptics', () => {
  const vibrateMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock navigator.vibrate
    Object.defineProperty(window.navigator, 'vibrate', {
      writable: true,
      value: vibrateMock,
    });

    // Default mock: haptics enabled
    vi.mocked(useSettings).mockImplementation((selector) =>
      selector({ hapticsEnabled: true } as never),
    );
  });

  it('should trigger vibrate with success pattern', () => {
    const { result } = renderHook(() => useHaptics());
    result.current.success();
    expect(vibrateMock).toHaveBeenCalledWith([10, 30, 10]);
  });

  it('should trigger vibrate with error pattern', () => {
    const { result } = renderHook(() => useHaptics());
    result.current.error();
    expect(vibrateMock).toHaveBeenCalledWith([50, 100, 50, 100, 50]);
  });

  it('should trigger vibrate with warning pattern', () => {
    const { result } = renderHook(() => useHaptics());
    result.current.warning();
    expect(vibrateMock).toHaveBeenCalledWith([30, 100, 30]);
  });

  it('should trigger vibrate with impact pattern', () => {
    const { result } = renderHook(() => useHaptics());
    result.current.impact();
    expect(vibrateMock).toHaveBeenCalledWith(10);
  });

  it('should not vibrate if haptics are disabled in settings', () => {
    vi.mocked(useSettings).mockImplementation((selector) =>
      selector({ hapticsEnabled: false } as never),
    );

    const { result } = renderHook(() => useHaptics());
    result.current.success();
    expect(vibrateMock).not.toHaveBeenCalled();
  });

  it('should not throw if navigator.vibrate is not supported', () => {
    Object.defineProperty(window.navigator, 'vibrate', {
      writable: true,
      value: undefined,
    });

    const { result } = renderHook(() => useHaptics());
    expect(() => result.current.success()).not.toThrow();
    expect(vibrateMock).not.toHaveBeenCalled();
  });
});
