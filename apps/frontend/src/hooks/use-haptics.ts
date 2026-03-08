import { useCallback } from 'react';

/**
 * Hook for providing tactile feedback using the navigator.vibrate API.
 * Patterns are based on standard mobile haptic feedback scales.
 */
export const useHaptics = () => {
  const vibrate = useCallback((pattern: number | number[] = 10) => {
    if (
      typeof window !== 'undefined' &&
      'navigator' in window &&
      'vibrate' in navigator
    ) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {
        // Silently fail if vibration is blocked or not supported
        console.warn('Haptic feedback failed:', e);
      }
    }
  }, []);

  const selection = useCallback(() => vibrate(10), [vibrate]);
  const light = useCallback(() => vibrate(20), [vibrate]);
  const medium = useCallback(() => vibrate(40), [vibrate]);
  const heavy = useCallback(() => vibrate(60), [vibrate]);
  const success = useCallback(() => vibrate([10, 50, 10]), [vibrate]);
  const warning = useCallback(() => vibrate([20, 30, 20]), [vibrate]);
  const error = useCallback(() => vibrate([30, 20, 30, 20, 50]), [vibrate]);

  return {
    vibrate,
    selection,
    light,
    medium,
    heavy,
    success,
    warning,
    error,
  };
};
