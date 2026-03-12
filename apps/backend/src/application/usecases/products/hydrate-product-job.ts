import { inject, injectable } from 'tsyringe';
import type { ExternalProductClient } from '@/application/contracts/external-product-client';
import type {
  AddCanonicalProductRepository,
  OutboxEventRepositories,
  ProductIdentityRepositories,
} from '@/application/contracts/repositories';
import {
  CanonicalProduct,
  type OutboxEvent,
  ProductIdentity,
} from '@/domain/entities';
import { injection } from '@/main/di/injection-tokens';

@injectable()
export class HydrateProductJob {
  constructor(
    @inject(injection.infra.outboxEventRepositories)
    private readonly outboxRepo: OutboxEventRepositories,
    @inject(injection.infra.canonicalProductRepositories)
    private readonly canonicalProductRepo: AddCanonicalProductRepository,
    @inject(injection.infra.compositeProductClient)
    readonly _externalClient: ExternalProductClient,
    @inject(injection.infra.productIdentityRepositories)
    private readonly productIdentityRepo: ProductIdentityRepositories,
  ) {}

  async run(): Promise<void> {
    const pendingEvents = await this.outboxRepo.getPending();

    for (const event of pendingEvents) {
      if (event.type === 'ProductScanned') {
        try {
          await this.processProductScanned(event);
          event.markCompleted();
          await this.outboxRepo.update(event);
        } catch (error) {
          event.markFailed(
            error instanceof Error ? error.message : String(error),
          );
          await this.outboxRepo.update(event);
        }
      }
    }
  }

  private async processProductScanned(event: OutboxEvent): Promise<void> {
    const payload = event.payload as {
      barcode: string;
      name: string;
      brand?: string;
      imageUrl?: string;
      description?: string;
    };
    const { barcode, name, brand, imageUrl, description } = payload;

    // 1. Check if Identity already exists (idempotency)
    const existing = await this.productIdentityRepo.getByValue('EAN', barcode);
    if (existing) return;

    // 2. Create Canonical Product
    const canonical = CanonicalProduct.create({
      name,
      brand,
      description,
    });

    await this.canonicalProductRepo.add(canonical);

    // 3. Create Product Identity
    const identity = ProductIdentity.create({
      canonicalProductId: canonical.id,
      type: 'EAN',
      value: barcode,
      name,
      brand,
      imageUrl,
    });

    await this.productIdentityRepo.add(identity);
  }
}
