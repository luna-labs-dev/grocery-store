import { Entity } from '../core';

export interface OutboxEventProps<T = unknown> {
  type: string;
  payload: T;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  lastError: string | null;
  retryCount: number;
  createdAt: Date;
  processedAt: Date | null;
}

export interface CreateOutboxEventProps<T = unknown> {
  type: string;
  payload: T;
}

export class OutboxEvent<T = unknown> extends Entity<OutboxEventProps<T>> {
  private constructor(props: OutboxEventProps<T>, id?: string) {
    super(props, id);
  }

  get type(): string {
    return this.props.type;
  }

  get payload(): T {
    return this.props.payload;
  }

  get status(): 'pending' | 'processing' | 'completed' | 'failed' {
    return this.props.status;
  }

  get lastError(): string | null {
    return this.props.lastError;
  }

  get retryCount(): number {
    return this.props.retryCount;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get processedAt(): Date | null {
    return this.props.processedAt;
  }

  public markProcessing(): void {
    if (this.props.status !== 'pending' && this.props.status !== 'failed') {
      throw new Error(`Cannot process event with status ${this.props.status}`);
    }
    this.props.status = 'processing';
  }

  public markCompleted(): void {
    if (this.props.status !== 'processing') {
      throw new Error(`Cannot complete event with status ${this.props.status}`);
    }
    this.props.status = 'completed';
    this.props.processedAt = new Date();
    this.props.lastError = null;
  }

  public markFailed(error: string): void {
    if (this.props.status !== 'processing') {
      throw new Error(`Cannot fail event with status ${this.props.status}`);
    }
    this.props.status = 'failed';
    this.props.lastError = error;
    this.props.retryCount += 1;
  }

  public static create<T = unknown>(
    props: CreateOutboxEventProps<T>,
    id?: string,
  ): OutboxEvent<T> {
    return new OutboxEvent(
      {
        ...props,
        status: 'pending',
        lastError: null,
        retryCount: 0,
        createdAt: new Date(),
        processedAt: null,
      },
      id,
    );
  }

  public static reconstitute<T = unknown>(
    props: OutboxEventProps<T>,
    id: string,
  ): OutboxEvent<T> {
    return new OutboxEvent(props, id);
  }
}
