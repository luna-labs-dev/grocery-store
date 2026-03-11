import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useHaptics } from '@/hooks/use-haptics';

describe('useHaptics', () => {
  it('should call navigator.vibrate with correct patterns', () => {
    const vibrateSpy = vi.fn();
    Object.defineProperty(navigator, 'vibrate', {
      value: vibrateSpy,
      configurable: true,
    });

    const { result } = renderHook(() => useHaptics());

    result.current.success();
    expect(vibrateSpy).toHaveBeenCalledWith([10, 30, 10]);

    result.current.error();
    expect(vibrateSpy).toHaveBeenCalledWith([50, 100, 50, 100, 50]);

    result.current.impact();
    expect(vibrateSpy).toHaveBeenCalledWith(10);
  });

  it('should not throw if navigator.vibrate is undefined', () => {
    Object.defineProperty(navigator, 'vibrate', {
      value: undefined,
      configurable: true,
    });

    const { result } = renderHook(() => useHaptics());

    expect(() => result.current.success()).not.toThrow();
  });
});
