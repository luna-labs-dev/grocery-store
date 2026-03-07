import { inject, injectable } from 'tsyringe';
import type { ExternalProductClient } from '@/application/contracts/external-product-client';
import type {
  GetCanonicalProductByIdRepository,
  OutboxEventRepositories,
  UpdateCanonicalProductRepository,
} from '@/application/contracts/repositories';
import { injection } from '@/main/di/injection-tokens';

const { infra } = injection;

@injectable()
export class HydrateProductJob {
  constructor(
    @inject(infra.outboxEventRepositories)
    private readonly outboxRepository: OutboxEventRepositories,
    @inject(infra.canonicalProductRepositories)
    private readonly canonicalProductRepository: UpdateCanonicalProductRepository &
      GetCanonicalProductByIdRepository,
    @inject(infra.compositeProductClient)
    private readonly externalClient: ExternalProductClient,
  ) {}

  async execute(): Promise<void> {
    const pendingEvents = await this.outboxRepository.getPending(10);

    for (const event of pendingEvents) {
      if (event.type !== 'ProductScanned') {
        event.markProcessing();
        event.markFailed(`Unknown event type: ${event.type}`);
        await this.outboxRepository.update(event);
        continue;
      }

      const { canonicalProductId, barcode } = event.payload as {
        canonicalProductId: string;
        barcode: string;
      };

      try {
        event.markProcessing();
        await this.outboxRepository.update(event);

        const externalData = await this.externalClient.fetchByBarcode(barcode);

        if (!externalData) {
          event.markFailed(`No external data found for barcode: ${barcode}`);
          await this.outboxRepository.update(event);
          continue;
        }

        const cp =
          await this.canonicalProductRepository.getById(canonicalProductId);

        if (!cp) {
          event.markFailed(
            `Canonical product not found: ${canonicalProductId}`,
          );
          await this.outboxRepository.update(event);
          continue;
        }

        cp.hydrate({
          name: externalData.name,
          brand: externalData.brand,
          description: externalData.description,
        });

        await this.canonicalProductRepository.update(cp);

        event.markCompleted();
        await this.outboxRepository.update(event);
      } catch (error: any) {
        event.markFailed(error.message || 'Unknown error');
        await this.outboxRepository.update(event);
      }
    }
  }
}
