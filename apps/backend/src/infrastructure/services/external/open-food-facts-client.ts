import axios, { type AxiosInstance } from 'axios';
import { injectable } from 'tsyringe';
import type {
  ExternalProductClient,
  ExternalProductResult,
} from '@/application/contracts/services/external-product-client';
import { createCircuitBreaker } from '@/infrastructure/services/resilience/circuit-breaker-factory';
import { env } from '@/main/config/env';

@injectable()
export class OpenFoodFactsClient implements ExternalProductClient {
  private axiosInstance: AxiosInstance;
  private breaker = createCircuitBreaker('OpenFoodFacts');

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: env.externalProducts.off.baseURL,

      timeout: 2000,
    });
  }

  async fetchByBarcode(barcode: string): Promise<ExternalProductResult | null> {
    return this.breaker.execute(async () => {
      try {
        const response = await this.axiosInstance.get(
          `/api/v2/product/${barcode}.json`,
        );
        const product = response.data?.product;

        if (!product || response.data.status === 0) {
          return null;
        }

        return {
          barcode,
          name: product.product_name || 'Unknown Product',
          brand: product.brands,
          imageUrl: product.image_url,
          rawResponse: response.data,
          source: 'OFF',
        };
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          return null;
        }
        throw error;
      }
    });
  }
}
