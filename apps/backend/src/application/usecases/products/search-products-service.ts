import { inject, injectable } from 'tsyringe';
import type { ExternalProductClient } from '@/application/contracts';
import type { AddCanonicalProductRepository } from '@/application/contracts/repositories/product-hierarchy';
import type { ProductIdentityRepository } from '@/application/contracts/repositories/product-identity-repository';
import { CanonicalProduct, ProductIdentity } from '@/domain';
import { injection } from '@/main/di/injection-tokens';

const { infra } = injection;

@injectable()
export class SearchProductsService {
  constructor(
    @inject(infra.productIdentityRepositories)
    private readonly productIdentityRepository: ProductIdentityRepository,
    @inject(infra.canonicalProductRepositories)
    private readonly canonicalProductRepository: AddCanonicalProductRepository,
    @inject(infra.compositeProductClient)
    private readonly externalProductClient: ExternalProductClient,
  ) {}

  async search(barcode: string): Promise<CanonicalProduct | null> {
    // 1. Search local first
    const identity = await this.productIdentityRepository.getByValue(
      'EAN',
      barcode,
    );
    if (identity) {
      // Logic to fetch CP by identity.canonicalProductId would go here
      return null;
    }

    // 2. Call External API if not found
    try {
      const result = await this.externalProductClient.fetchByBarcode(barcode);
      if (result) {
        // 3. Populate local database
        const cp = CanonicalProduct.create({
          name: result.name,
          brand: result.brand,
          description: result.description,
        });
        await this.canonicalProductRepository.add(cp);

        const pi = ProductIdentity.create({
          canonicalProductId: cp.id,
          type: 'EAN',
          value: barcode,
        });
        await this.productIdentityRepository.add(pi);

        return cp;
      }
    } catch (_error) {
      // Graceful failure
    }

    return null;
  }
}
