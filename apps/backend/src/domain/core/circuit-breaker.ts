export enum CircuitBreakerState {
  Closed = 'CLOSED',
  Open = 'OPEN',
  HalfOpen = 'HALF_OPEN',
}

export interface CircuitBreakerOptions {
  failureThreshold: number;
  resetTimeoutMs: number;
}

export class CircuitBreaker {
  private state: CircuitBreakerState = CircuitBreakerState.Closed;
  private failureCount = 0;
  private lastFailureTime?: number;

  constructor(private readonly options: CircuitBreakerOptions) {}

  public async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === CircuitBreakerState.Open) {
      if (
        Date.now() - (this.lastFailureTime ?? 0) >
        this.options.resetTimeoutMs
      ) {
        this.state = CircuitBreakerState.HalfOpen;
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failureCount = 0;
    this.state = CircuitBreakerState.Closed;
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    if (this.failureCount >= this.options.failureThreshold) {
      this.state = CircuitBreakerState.Open;
    }
  }

  public getState(): CircuitBreakerState {
    return this.state;
  }
}
