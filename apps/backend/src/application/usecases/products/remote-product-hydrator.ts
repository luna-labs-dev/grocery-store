import { inject, injectable } from 'tsyringe';
import type { ExternalProductClient } from '@/application/contracts/external-product-client';
import type {
  AddCanonicalProductRepository,
  OutboxEventRepositories,
} from '@/application/contracts/repositories';
import type { ProductIdentityRepository } from '@/application/contracts/repositories/product-identity-repository';
import {
  CanonicalProduct,
  OutboxEvent,
  ProductIdentity,
} from '@/domain/entities';
import type { IProductHydrator } from '@/domain/usecases/product-hydrator';
import { injection } from '@/main/di/injection-tokens';

@injectable()
export class RemoteProductHydrator implements IProductHydrator {
  constructor(
    @inject(injection.infra.outboxEventRepositories)
    private outboxRepo: OutboxEventRepositories,
    @inject(injection.infra.canonicalProductRepositories)
    private canonicalProductRepo: AddCanonicalProductRepository,
    @inject(injection.infra.compositeProductService)
    private externalService: ExternalProductClient,
    @inject(injection.infra.productIdentityRepositories)
    private productIdentityRepo: ProductIdentityRepository,
  ) {}

  async execute(event: OutboxEvent): Promise<void> {
    const { barcode } = event.payload as { barcode: string };

    try {
      const externalProduct =
        await this.externalService.fetchByBarcode(barcode);

      if (!externalProduct) {
        event.markCompleted();
        await this.outboxRepo.update(event);
        return;
      }

      // 1. Check if Identity already exists (idempotency)
      const existing = await this.productIdentityRepo.getByValue(
        'EAN',
        barcode,
      );
      if (existing) {
        event.markCompleted();
        await this.outboxRepo.update(event);
        return;
      }

      // Logic for actual hydration...
      event.markCompleted();
      await this.outboxRepo.update(event);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      event.markFailed(message);
      await this.outboxRepo.update(event);
      throw error;
    }
  }

  async register(name: string, barcode: string): Promise<string> {
    if (barcode) {
      const identity = await this.productIdentityRepo.getByValue(
        'EAN',
        barcode,
      );

      if (identity) {
        return identity.canonicalProductId;
      }
    }

    // "Pending Hydration" strategy: Create canonical product on the fly
    const cp = CanonicalProduct.create({
      name,
      description: barcode ? 'Pending enrichment' : 'Manual entry',
    });
    await this.canonicalProductRepo.add(cp);

    if (barcode) {
      const pi = ProductIdentity.create({
        canonicalProductId: cp.id,
        type: 'EAN',
        value: barcode,
      });
      await this.productIdentityRepo.add(pi);

      // Outbox event to hydrate asynchronously
      const outboxEvent = OutboxEvent.create({
        type: 'ProductScanned',
        payload: { canonicalProductId: cp.id, barcode },
      });
      await this.outboxRepo.add(outboxEvent);
    }

    return cp.id;
  }
}
