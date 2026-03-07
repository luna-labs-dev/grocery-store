import { injectable } from 'tsyringe';
import type {
  ExternalProductClient,
  ExternalProductData,
} from '@/application/contracts/external-product-client';

@injectable()
export class OpenFoodFactsClient implements ExternalProductClient {
  private readonly baseUrl = 'https://world.openfoodfacts.org/api/v0/product';

  async fetchByBarcode(barcode: string): Promise<ExternalProductData | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${barcode}.json`);

      if (!response.ok) {
        return null;
      }

      const data = await response.json();

      if (data.status !== 1 || !data.product) {
        return null; // Product not found
      }

      const { product_name, brands, generic_name } = data.product;

      if (!product_name) {
        return null; // Not enough useful data
      }

      return {
        name: product_name,
        brand: brands ? brands.split(',')[0].trim() : undefined,
        description: generic_name,
      };
    } catch (error) {
      // Return null on network or parsing error out of caution (resilience)
      return null;
    }
  }
}
