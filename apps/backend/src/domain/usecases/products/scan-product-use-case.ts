import { inject, injectable } from 'tsyringe';
import type { ExternalProductClient } from '../../products/external-product-client';
import type { ProductRepository } from '../../products/product-repository';
import type { OutboxEventRepositories } from '@/application/contracts/repositories';
import { OutboxEvent } from '@/domain/entities/outbox-event';
import { VariableWeightParser } from '@/domain/products/variable-weight-parser';

interface ScanProductRequest {
  barcode: string;
}

interface ScanProductResponse {
  product: {
    id: string;
    name: string;
    brand?: string;
    imageUrl?: string;
    price?: number;
  } | null;
  matchType: 'INTERNAL' | 'EXTERNAL' | 'NONE';
}

@injectable()
export class ScanProductUseCase {
  constructor(
    @inject('ProductRepository')
    private readonly productRepository: ProductRepository,
    @inject('OpenFoodFactsClient')
    private readonly offClient: ExternalProductClient,
    @inject('UPCitemdbClient')
    private readonly upcClient: ExternalProductClient,
    @inject('OutboxEventRepositories')
    private readonly outboxRepository: OutboxEventRepositories,
  ) {}

  async execute(request: ScanProductRequest): Promise<ScanProductResponse> {
    let { barcode } = request;
    let weightValue: number | undefined;

    // 0. Variable Weight Check
    if (VariableWeightParser.isVariableWeight(barcode)) {
      const parsed = VariableWeightParser.parse(barcode);
      barcode = parsed.baseEan;
      weightValue = parsed.value;
    }

    // 1. Local Database Match (PhysicalEAN)
    const physicalEan =
      await this.productRepository.findPhysicalByBarcode(barcode);
    if (physicalEan) {
      const identity = await this.productRepository.findIdentityById(
        physicalEan.productIdentityId,
      );
      if (identity) {
        return {
          product: {
            id: identity.id,
            name: identity.name || 'Unknown',
            brand: identity.brand,
            imageUrl: identity.imageUrl,
          },
          matchType: 'INTERNAL',
        };
      }
    }

    // 2. Check for direct ProductIdentity match (legacy or non-physical EAN)
    const directIdentity =
      await this.productRepository.findIdentityByEAN(barcode);
    if (directIdentity) {
      return {
        product: {
          id: directIdentity.id,
          name: directIdentity.name || 'Unknown',
          brand: directIdentity.brand,
          imageUrl: directIdentity.imageUrl,
          price: weightValue, // Incorporate the parsed value if it's a variable weight item
        },
        matchType: 'INTERNAL',
      };
    }

    // 3. External Fallback (OFF)
    const offMatch = await this.offClient.fetchByBarcode(barcode);
    if (offMatch) {
      // Fire outbox event for background hydration
      // We don't have a specific entity for the event yet, following existing pattern
      await this.outboxRepository.add(
        OutboxEvent.create({
          type: 'ProductScanned',
          payload: { barcode, source: 'OFF' },
        }),
      );

      return {
        product: {
          id: `TEMP_${barcode}`, // Temporary ID for frontend, hydration happens in background
          name: offMatch.name,
          brand: offMatch.brand,
          imageUrl: offMatch.imageUrl,
        },
        matchType: 'EXTERNAL',
      };
    }

    // 4. External Fallback (UPCitemdb)
    const upcMatch = await this.upcClient.fetchByBarcode(barcode);
    if (upcMatch) {
      await this.outboxRepository.add(
        OutboxEvent.create({
          type: 'ProductScanned',
          payload: { barcode, source: 'UPCITEMDB' },
        }),
      );

      return {
        product: {
          id: `TEMP_${barcode}`,
          name: upcMatch.name,
          brand: upcMatch.brand,
          imageUrl: upcMatch.imageUrl,
        },
        matchType: 'EXTERNAL',
      };
    }

    return {
      product: null,
      matchType: 'NONE',
    };
  }
}
// Note: Duplicate scan detection (FR-007) is orchestrated by the caller (e.g., ShoppingEventService)
// by checking if the product is already in the cart and incrementing quantity accordingly.
