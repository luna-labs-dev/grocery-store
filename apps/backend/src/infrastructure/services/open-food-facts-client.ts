import axios, { type AxiosInstance } from 'axios';
import axiosRetry from 'axios-retry';
import { inject, injectable } from 'tsyringe';
import { Buidler } from './resilience/buidler';
import type {
  ExternalProductClient,
  ExternalProductMatch,
} from '@/application/contracts/external-product-client';
import type { CircuitBreaker } from '@/domain/core/circuit-breaker';
import { env } from '@/main/config/env';

@injectable()
export class OpenFoodFactsClient implements ExternalProductClient {
  private readonly httpClient: AxiosInstance;
  private readonly circuitBreaker: CircuitBreaker;

  constructor(
    @inject(Buidler)
    private readonly buidler: Buidler,
  ) {
    this.httpClient = axios.create({
      baseURL: env.externalProducts.off.baseURL,
      timeout: 2000,
    });

    axiosRetry(this.httpClient, {
      retries: 2,
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition: (error) => {
        return (
          axiosRetry.isNetworkOrIdempotentRequestError(error) ||
          error.code === 'ECONNABORTED'
        );
      },
    });

    this.circuitBreaker = this.buidler.createCircuitBreaker({
      name: 'OpenFoodFacts',
      failureThreshold: 3,
      resetTimeoutMs: 30000,
    });
  }

  async fetchByBarcode(
    barcode: string,
  ): Promise<ExternalProductMatch | undefined> {
    try {
      return await this.circuitBreaker.execute(async () => {
        try {
          const response = await this.httpClient.get(
            `/api/v0/product/${barcode}.json`,
          );

          const { product, status } = response.data;

          if (status !== 1 || !product) {
            return undefined; // Product not found
          }

          const { product_name, brands, generic_name } = product;

          if (!product_name) {
            return undefined; // Not enough useful data
          }

          return {
            name: product_name,
            brand: brands ? brands.split(',')[0].trim() : undefined,
            description: generic_name,
            source: 'OFF',
            rawPayload: response.data,
          };
        } catch (error) {
          if (axios.isAxiosError(error) && error.response?.status === 404) {
            return undefined;
          }
          throw error;
        }
      });
    } catch (_error) {
      return undefined;
    }
  }
}
