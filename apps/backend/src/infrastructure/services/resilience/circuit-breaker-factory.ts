import { CircuitBreaker } from '@/domain/core/circuit-breaker';

export type CircuitBreakerFactory = (name: string) => CircuitBreaker;

export const createCircuitBreaker: CircuitBreakerFactory = (
  _name: string,
): CircuitBreaker => {
  return new CircuitBreaker({
    failureThreshold: 5,
    resetTimeoutMs: 10000,
  });
};
