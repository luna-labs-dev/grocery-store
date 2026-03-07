import { injectable } from 'tsyringe';
import type {
  ExternalProductClient,
  ExternalProductData,
} from '@/application/contracts/external-product-client';

@injectable()
export class UpcItemDbClient implements ExternalProductClient {
  private readonly baseUrl = 'https://api.upcitemdb.com/prod/trial/lookup';

  async fetchByBarcode(barcode: string): Promise<ExternalProductData | null> {
    try {
      const response = await fetch(`${this.baseUrl}?upc=${barcode}`);

      if (!response.ok) {
        return null;
      }

      const data = await response.json();

      if (data.code !== 'OK' || !data.items || data.items.length === 0) {
        return null;
      }

      const item = data.items[0];

      if (!item.title) {
        return null;
      }

      return {
        name: item.title,
        brand: item.brand || undefined,
        description: item.description || undefined,
      };
    } catch (error) {
      return null;
    }
  }
}
