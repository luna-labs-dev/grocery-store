import { useCallback } from 'react';
import { useSettings } from './use-settings';

/**
 * useHaptics hook provides a simple interface for the Web Vibration API.
 * Patterns are designed to feel like native iOS/Android feedback.
 */
export const useHaptics = () => {
  const hapticsEnabled = useSettings((state) => state.hapticsEnabled);
  const isSupported =
    typeof window !== 'undefined' && !!window.navigator.vibrate;

  const trigger = useCallback(
    (pattern: number | number[]) => {
      if (isSupported && hapticsEnabled) {
        window.navigator.vibrate(pattern);
      }
    },
    [isSupported, hapticsEnabled],
  );

  const success = useCallback(() => {
    trigger([10, 30, 10]);
  }, [trigger]);

  const error = useCallback(() => {
    trigger([50, 100, 50, 100, 50]);
  }, [trigger]);

  const warning = useCallback(() => {
    trigger([30, 100, 30]);
  }, [trigger]);

  const impact = useCallback(() => {
    trigger(10);
  }, [trigger]);

  const light = useCallback(() => {
    trigger(5);
  }, [trigger]);

  const medium = useCallback(() => {
    trigger(15);
  }, [trigger]);

  const heavy = useCallback(() => {
    trigger(30);
  }, [trigger]);

  const selection = useCallback(() => {
    trigger(1);
  }, [trigger]);

  return {
    success,
    error,
    warning,
    impact,
    light,
    medium,
    heavy,
    selection,
  };
};
