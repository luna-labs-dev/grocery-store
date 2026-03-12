import { injectable } from 'tsyringe';
import {
  CircuitBreaker,
  type CircuitBreakerOptions,
} from '@/domain/core/circuit-breaker';

export interface BuidlerOptions extends CircuitBreakerOptions {
  name: string;
}

@injectable()
export class Buidler {
  public createCircuitBreaker(options: BuidlerOptions): CircuitBreaker {
    return new CircuitBreaker(options);
  }
}
