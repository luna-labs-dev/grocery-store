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
export class UpcItemDbClient implements ExternalProductClient {
  private readonly httpClient: AxiosInstance;
  private readonly circuitBreaker: CircuitBreaker;

  constructor(
    @inject(Buidler)
    private readonly buidler: Buidler,
  ) {
    const config = env.externalProducts.upcItemDb;
    this.httpClient = axios.create({
      baseURL: config.baseURL,
      timeout: 2500,
      headers: config.apiKey ? { user_key: config.apiKey } : undefined,
    });

    axiosRetry(this.httpClient, {
      retries: 1,
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition: (error) => {
        return axiosRetry.isNetworkOrIdempotentRequestError(error);
      },
    });

    this.circuitBreaker = this.buidler.createCircuitBreaker({
      name: 'UPCItemDB',
      failureThreshold: 2,
      resetTimeoutMs: 60000,
    });
  }

  async fetchByBarcode(
    barcode: string,
  ): Promise<ExternalProductMatch | undefined> {
    try {
      return await this.circuitBreaker.execute(async () => {
        try {
          const response = await this.httpClient.get('/', {
            params: { upc: barcode },
          });

          const { items } = response.data;

          if (!items || items.length === 0) {
            return undefined;
          }

          const item = items[0];

          if (!item.title) {
            return undefined;
          }

          return {
            name: item.title,
            brand: item.brand || undefined,
            description: item.description || undefined,
            source: 'UPCITEMDB',
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
