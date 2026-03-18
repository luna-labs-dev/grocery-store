import { injectable } from 'tsyringe';
import {
  CircuitBreaker,
  type CircuitBreakerOptions,
} from '@/domain/core/circuit-breaker';

export interface ResilienceServiceOptions extends CircuitBreakerOptions {
  name: string;
}

@injectable()
export class ResilienceService {
  public createCircuitBreaker(
    options: ResilienceServiceOptions,
  ): CircuitBreaker {
    return new CircuitBreaker(options);
  }
}
