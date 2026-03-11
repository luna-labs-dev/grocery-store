/**
 * @vitest-environment jsdom
 */
import { describe, expect, it, vi } from 'vitest';
import { prefersReducedMotion, slideUp, springTransition } from './animations';

describe('animations config', () => {
  describe('springTransition', () => {
    it('should have standard spring properties', () => {
      expect(springTransition.type).toBe('spring');
      expect(springTransition.stiffness).toBe(300);
      expect(springTransition.damping).toBe(30);
    });
  });

  describe('slideUp', () => {
    it('should define initial y as 100%', () => {
      expect(slideUp.initial).toEqual({ y: '100%' });
    });

    it('should define animate y as 0', () => {
      expect(slideUp.animate).toEqual({ y: 0, transition: springTransition });
    });
  });

  describe('prefersReducedMotion', () => {
    it('should return true if matchMedia matches reduce', () => {
      window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      expect(prefersReducedMotion()).toBe(true);
    });

    it('should return false if matchMedia matches no-preference', () => {
      window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-reduced-motion: no-preference)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      expect(prefersReducedMotion()).toBe(false);
    });
  });
});
