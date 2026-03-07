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
        event.markFailed('Unknown event type: ' + event.type);
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

        if (externalData) {
          const cp =
            await this.canonicalProductRepository.getById(canonicalProductId);
          if (cp) {
            // Update using CanonicalProduct constructor or methods if available
            // Note: Since Domain Entities should encapsulate logic, if there is no `update` method we reconstruct.
            // Let's assume CanonicalProduct.create works for updating since it accepts CreateProps and ID.
            const updatedCp = Object.assign(cp, {
              props: {
                ...cp.props,
                name: externalData.name,
                brand: externalData.brand ?? cp.props.brand,
                description: externalData.description ?? cp.props.description,
                updatedAt: new Date(),
              },
            });

            await this.canonicalProductRepository.update(updatedCp);
          }
        }

        event.markCompleted();
        await this.outboxRepository.update(event);
      } catch (error: any) {
        event.markFailed(error.message || 'Unknown error');
        await this.outboxRepository.update(event);
      }
    }
  }
}
