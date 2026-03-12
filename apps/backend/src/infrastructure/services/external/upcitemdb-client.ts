import axios, { type AxiosInstance } from 'axios';
import { injectable } from 'tsyringe';
import type {
  ExternalProductClient,
  ExternalProductResult,
} from '@/application/contracts/services/external-product-client';
import { createCircuitBreaker } from '@/infrastructure/services/resilience/circuit-breaker-factory';
import { env } from '@/main/config/env';

@injectable()
export class UpcItemDbClient implements ExternalProductClient {
  private axiosInstance: AxiosInstance;
  private breaker = createCircuitBreaker('UPCitemdb');

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: env.externalProducts.upcItemDb.baseURL,
      timeout: 2000,
      headers: {
        'user-key': env.externalProducts.upcItemDb.apiKey,
      },
    });
  }

  async fetchByBarcode(barcode: string): Promise<ExternalProductResult | null> {
    return this.breaker.execute(async () => {
      try {
        const response = await this.axiosInstance.get(`/lookup?upc=${barcode}`);
        const product = response.data?.items?.[0];

        if (!product) {
          return null;
        }

        return {
          barcode,
          name: product.title || 'Unknown Product',
          brand: product.brand,
          imageUrl: product.images?.[0],
          rawResponse: response.data,
          source: 'UPCITEMDB',
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
