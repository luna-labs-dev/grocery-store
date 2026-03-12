import { inject, injectable } from 'tsyringe';
import type { ProductRepository } from '../../products/product-repository';

interface ManualSearchRequest {
  query: string;
}

interface ManualSearchResponse {
  products: {
    id: string;
    name: string;
    brand?: string;
    imageUrl?: string;
  }[];
}

@injectable()
export class ManualSearchUseCase {
  constructor(
    @inject('ProductRepository')
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(request: ManualSearchRequest): Promise<ManualSearchResponse> {
    const { query } = request;

    if (!query || query.length < 2) {
      return { products: [] };
    }

    const results = await this.productRepository.searchIdentities(query);

    return {
      products: results.map((identity) => ({
        id: identity.id,
        name: identity.name || 'Unknown',
        brand: identity.brand,
        imageUrl: identity.imageUrl,
      })),
    };
  }
}
