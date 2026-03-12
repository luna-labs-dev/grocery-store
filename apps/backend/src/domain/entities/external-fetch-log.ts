import { Entity } from '../core';

export type ExternalFetchSource = 'OFF' | 'UPCITEMDB';
export type ExternalFetchStatus = 'SUCCESS' | 'MISS' | 'ERROR';

export interface ExternalFetchLogProps {
  barcode: string;
  source: ExternalFetchSource;
  status: ExternalFetchStatus;
  durationMs: number;
  responsePayload: Record<string, unknown> | null;
  createdAt: Date;
}

export interface CreateExternalFetchLogProps {
  barcode: string;
  source: ExternalFetchSource;
  status: ExternalFetchStatus;
  durationMs: number;
  responsePayload?: Record<string, unknown> | null;
  createdAt?: Date;
}

export class ExternalFetchLog extends Entity<ExternalFetchLogProps> {
  private constructor(props: ExternalFetchLogProps, id?: string) {
    super(props, id);
  }

  get barcode(): string {
    return this.props.barcode;
  }

  get source(): ExternalFetchSource {
    return this.props.source;
  }

  get status(): ExternalFetchStatus {
    return this.props.status;
  }

  get durationMs(): number {
    return this.props.durationMs;
  }

  get responsePayload(): Record<string, unknown> | null {
    return this.props.responsePayload;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  public static create(
    props: CreateExternalFetchLogProps,
    id?: string,
  ): ExternalFetchLog {
    return new ExternalFetchLog(
      {
        ...props,
        responsePayload: props.responsePayload ?? null,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );
  }
}
