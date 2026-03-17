import type { OutboxEvent } from '@/domain/entities/outbox-event';

export interface IHydrateProductUseCase {
  execute(event: OutboxEvent): Promise<void>;
}

export interface IHydrateProductJob {
  execute(): Promise<void>;
}
