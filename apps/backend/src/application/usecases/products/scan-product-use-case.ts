import { inject, injectable } from 'tsyringe';
import type { ExternalProductClient } from '@/application/contracts/external-product-client';
import type { OutboxEventRepositories } from '@/application/contracts/repositories/outbox-event-repository';
import type { PhysicalEanRepository } from '@/application/contracts/repositories/physical-ean-repository';
import type { ProductIdentityRepository } from '@/application/contracts/repositories/product-identity-repository';
import { parseVariableWeight } from '@/application/utils/variable-weight-parser';
import type { OutboxEvent } from '@/domain/entities/outbox-event';
import { injection } from '@/main/di/injection-tokens';

export type ScanMatchType =
  | 'LOCAL'
  | 'EXTERNAL'
  | 'VARIABLE_WEIGHT'
  | 'NOT_FOUND';

export interface ScanProductResult {
  matchType: ScanMatchType;
  product?: {
    id?: string;
    name: string;
    brand?: string;
    imageUrl?: string;
  };
  variableWeight?: {
    totalPrice?: number;
    weightInGrams?: number;
  };
  requiresPriceConfirmation: boolean;
  source: 'local' | 'external' | 'variable-weight' | 'none';
}

@injectable()
export class ScanProductUseCase {
  constructor(
    @inject(injection.infra.physicalEanRepository)
    private physicalEanRepo: PhysicalEanRepository,
    @inject(injection.infra.productIdentityRepositories)
    private productIdentityRepo: ProductIdentityRepository,
    @inject(injection.infra.compositeProductClient)
    private externalClient: ExternalProductClient,
    @inject(injection.infra.outboxEventRepositories)
    private outboxRepo: OutboxEventRepositories,
  ) {}

  async execute(barcode: string): Promise<ScanProductResult> {
    // 1. Check Variable Weight (Prefix 2)
    const vwResult = parseVariableWeight(barcode);

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

    // 2. Check Local Database
    const localEan = await this.physicalEanRepo.findByBarcode(barcode);
    if (localEan) {
      const identity = await this.productIdentityRepo.getById(
        localEan.productIdentityId,
      );
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
    }

    // 3. External Fallback
    const externalResult = await this.externalClient.fetchByBarcode(barcode);
    if (externalResult) {
      await this.outboxRepo.add({
        type: 'ProductScanned',
        payload: externalResult,
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
