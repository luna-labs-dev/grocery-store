import type { Variants } from 'motion/react';

/**
 * Shared spring configuration for native-like feel
 */
export const springTransition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
} as const;

/**
 * Shared fade-in variants
 */
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

/**
 * Shared slide-up variants for mobile drawers
 */
export const slideUp: Variants = {
  initial: { y: '100%' },
  animate: { y: 0, transition: springTransition },
  exit: { y: '100%', transition: { ...springTransition, damping: 40 } },
};

/**
 * Helper to check if reduced motion is preferred
 */
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};
