import { inject, injectable } from 'tsyringe';
import type { ExternalProductClient } from '@/application/contracts/external-product-client';
import type { OutboxEventRepositories } from '@/application/contracts/repositories/outbox-event-repository';
import type { ProductIdentityRepository } from '@/application/contracts/repositories/product-identity-repository';
import { VariableWeightParser } from '@/domain/core/logic/variable-weight-parser';
import type { OutboxEvent } from '@/domain/entities/outbox-event';
import type {
  IScanProductUseCase,
  ScanProductResult,
} from '@/domain/usecases/scan-product.interface';
import { injection } from '@/main/di/injection-tokens';

@injectable()
export class ScanProductUseCase implements IScanProductUseCase {
  constructor(
    @inject(injection.infra.productIdentityRepositories)
    private productIdentityRepo: ProductIdentityRepository,
    @inject(injection.infra.compositeProductClient)
    private externalClient: ExternalProductClient,
    @inject(injection.infra.outboxEventRepositories)
    private outboxRepo: OutboxEventRepositories,
  ) {}

  async execute(barcode: string): Promise<ScanProductResult> {
    // 1. Check Variable Weight (Prefix 2)
    const vwResult = VariableWeightParser.parse(barcode);

    if (vwResult) {
      return {
        matchType: 'VARIABLE_WEIGHT',
        variableWeight: {
          totalPrice: vwResult.totalPrice,
          weightInGrams: vwResult.weightInGrams,
        },
        requiresPriceConfirmation: true,
        source: 'variable-weight',
      };
    }

    // 2. Check Local Database (Consolidated Identity)
    const identity = await this.productIdentityRepo.getByValue('EAN', barcode);
    if (identity) {
      return {
        matchType: 'LOCAL',
        product: {
          id: identity.id,
          name: identity.name ?? 'Produto sem nome',
          brand: identity.brand || undefined,
          imageUrl: identity.imageUrl || undefined,
        },
        requiresPriceConfirmation: true,
        source: 'local',
      };
    }

    // 3. External Fallback
    const externalResult = await this.externalClient.fetchByBarcode(barcode);
    if (externalResult) {
      await this.outboxRepo.add({
        type: 'ProductScanned',
        payload: { barcode, source: externalResult.source },
      } as OutboxEvent);

      return {
        matchType: 'EXTERNAL',
        product: {
          name: externalResult.name,
          brand: externalResult.brand,
          imageUrl: externalResult.imageUrl,
        },
        requiresPriceConfirmation: true,
        source: 'external',
      };
    }

    return {
      matchType: 'NOT_FOUND',
      requiresPriceConfirmation: false,
      source: 'none',
    };
  }
}
