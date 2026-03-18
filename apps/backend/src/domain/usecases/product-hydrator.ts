import type { OutboxEvent } from '@/domain/entities/outbox-event';

export interface IProductHydrator {
  execute(event: OutboxEvent): Promise<void>;
  register(name: string, barcode: string): Promise<string>;
}

export interface IHydrateProductJob {
  execute(): Promise<void>;
}
