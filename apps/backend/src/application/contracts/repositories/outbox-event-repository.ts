import type { OutboxEvent } from '@/domain/entities/outbox-event';

export interface AddOutboxEventRepository {
  add(event: OutboxEvent): Promise<void>;
}

export interface GetPendingOutboxEventsRepository {
  getPending(limit?: number): Promise<OutboxEvent[]>;
}

export interface UpdateOutboxEventRepository {
  update(event: OutboxEvent): Promise<void>;
}

export type OutboxEventRepositories = AddOutboxEventRepository &
  GetPendingOutboxEventsRepository &
  UpdateOutboxEventRepository;
