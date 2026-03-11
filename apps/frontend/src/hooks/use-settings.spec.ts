/**
 * @vitest-environment jsdom
 */
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { useSettings } from './use-settings';

describe('useSettings', () => {
  beforeEach(() => {
    localStorage.clear();
    // Reset Zustand state as best as possible for each test
    useSettings.setState({
      hapticsEnabled: true,
      animationsEnabled: true,
      reducedMotion: false,
    });
  });

  it('should have initial values', () => {
    const { result } = renderHook(() => useSettings());

    expect(result.current.hapticsEnabled).toBe(true);
    expect(result.current.animationsEnabled).toBe(true);
    expect(result.current.reducedMotion).toBe(false);
  });

  it('should update haptics status', () => {
    const { result } = renderHook(() => useSettings());

    act(() => {
      result.current.setHapticsEnabled(false);
    });

    expect(result.current.hapticsEnabled).toBe(false);
  });

  it('should update animations status', () => {
    const { result } = renderHook(() => useSettings());

    act(() => {
      result.current.setAnimationsEnabled(false);
    });

    expect(result.current.animationsEnabled).toBe(false);
  });

  it('should update reduced motion preference', () => {
    const { result } = renderHook(() => useSettings());

    act(() => {
      result.current.setReducedMotion(true);
    });

    expect(result.current.reducedMotion).toBe(true);
  });
});
