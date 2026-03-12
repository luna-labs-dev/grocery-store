export interface CreateOutboxEvent {
  type: string;
  payload: Record<string, unknown>;
}

export interface OutboxRepository {
  create(event: CreateOutboxEvent): Promise<void>;
  markAsProcessing(id: string): Promise<void>;
  markAsCompleted(id: string): Promise<void>;
  markAsFailed(id: string, error: string): Promise<void>;
}
