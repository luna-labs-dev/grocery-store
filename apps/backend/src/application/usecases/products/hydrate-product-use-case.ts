import { inject, injectable } from 'tsyringe';
import type { ExternalProductClient } from '@/application/contracts/external-product-client';
import type { OutboxEventRepositories } from '@/application/contracts/repositories/outbox-event-repository';
import type { PhysicalEanRepository } from '@/application/contracts/repositories/physical-ean-repository';
import type { OutboxEvent } from '@/domain/entities/outbox-event';
import { injection } from '@/main/di/injection-tokens';

@injectable()
export class HydrateProductUseCase {
  constructor(
    @inject(injection.infra.outboxEventRepositories)
    private outboxRepo: OutboxEventRepositories,
    @inject(injection.infra.compositeProductClient)
    private externalClient: ExternalProductClient,
    @inject(injection.infra.physicalEanRepository)
    private physicalEanRepo: PhysicalEanRepository,
  ) {}

  async execute(event: OutboxEvent): Promise<void> {
    const { barcode } = event.payload as { barcode: string };

    try {
      const externalProduct = await this.externalClient.fetchByBarcode(barcode);

      if (!externalProduct) {
        event.markCompleted();
        await this.outboxRepo.update(event);
        return;
      }

      // 1. Check if Identity already exists (idempotency)
      const existing = await this.physicalEanRepo.findByBarcode(barcode);
      if (existing) {
        event.markCompleted();
        await this.outboxRepo.update(event);
        return;
      }

      // Logic for actual hydration... (Placeholder for now as per task)
      event.markCompleted();
      await this.outboxRepo.update(event);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      event.markFailed(message);
      await this.outboxRepo.update(event);
      throw error;
    }
  }
}
