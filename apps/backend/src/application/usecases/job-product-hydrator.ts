import { inject, injectable } from 'tsyringe';
import type { ExternalProductClient } from '@/application/contracts/external-product-client';
import type {
  AddCanonicalProductRepository,
  OutboxEventRepositories,
} from '@/application/contracts/repositories';
import type { ProductIdentityRepository } from '@/application/contracts/repositories/product-identity-repository';
import {
  CanonicalProduct,
  type OutboxEvent,
  ProductIdentity,
} from '@/domain/entities';
import { ProductNotFoundException } from '@/domain/exceptions';
import type { IHydrateProductJob } from '@/domain/usecases/product-hydrator';
import { injection } from '@/main/di/injection-tokens';

@injectable()
export class JobProductHydrator implements IHydrateProductJob {
  constructor(
    @inject(injection.infra.outboxEventRepositories)
    private readonly outboxRepo: OutboxEventRepositories,
    @inject(injection.infra.canonicalProductRepositories)
    private readonly canonicalProductRepo: AddCanonicalProductRepository,
    @inject(injection.infra.compositeProductService)
    private readonly externalService: ExternalProductClient,
    @inject(injection.infra.productIdentityRepositories)
    private readonly productIdentityRepo: ProductIdentityRepository,
  ) {}

  async execute(): Promise<void> {
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
      source: string;
    };
    const { barcode } = payload;

    // 1. Check if Identity already exists (idempotency)
    const existing = await this.productIdentityRepo.getByValue('EAN', barcode);
    if (existing) return;

    // 2. Fetch external data
    const externalProduct = await this.externalService.fetchByBarcode(barcode);
    if (!externalProduct) {
      throw new ProductNotFoundException({ barcode });
    }

    // 3. Create Canonical Product
    const canonical = CanonicalProduct.create({
      name: externalProduct.name,
      brand: externalProduct.brand,
      description: externalProduct.description,
    });

    await this.canonicalProductRepo.add(canonical);

    // 4. Create Product Identity
    const identity = ProductIdentity.create({
      canonicalProductId: canonical.id,
      type: 'EAN',
      value: barcode,
      name: externalProduct.name,
      brand: externalProduct.brand,
      imageUrl: externalProduct.imageUrl,
      source: externalProduct.source,
    });

    await this.productIdentityRepo.add(identity);
  }
}
