import 'reflect-metadata';
import axios from 'axios';
import { beforeEach, describe, expect, it, type Mocked, vi } from 'vitest';
import { OpenFoodFactsService } from '@/infrastructure/services/open-food-facts-service';
import type { ResilienceService } from '@/infrastructure/services/resilience/resilience-service';

vi.mock('axios', () => {
  const mockAxios = {
    get: vi.fn(),
    create: vi.fn().mockReturnThis(),
    interceptors: {
      request: { use: vi.fn(), eject: vi.fn() },
      response: { use: vi.fn(), eject: vi.fn() },
    },
    isAxiosError: vi.fn().mockReturnValue(false),
  };
  return {
    default: mockAxios,
    isAxiosError: vi.fn().mockReturnValue(false),
  };
});

// Mock axios-retry to avoid its internal logic
vi.mock('axios-retry', () => ({
  default: vi.fn(),
}));

describe('OpenFoodFactsService', () => {
  let client: OpenFoodFactsService;
  const mockBuilder = {
    createCircuitBreaker: vi.fn().mockReturnValue({
      execute: vi.fn((cb) => cb()),
    }),
  } as unknown as Mocked<ResilienceService>;

  beforeEach(() => {
    vi.clearAllMocks();
    client = new OpenFoodFactsService(mockBuilder as unknown as never);
  });

  it('should fetch product data by barcode successfully', async () => {
    vi.mocked(axios.get).mockResolvedValue({
      data: {
        status: 1,
        product: {
          product_name: 'Nutella',
          brands: 'Ferrero',
          generic_name: 'Hazelnut spread',
        },
      },
    });

    const result = await client.fetchByBarcode('3017620422003');

    expect(axios.get).toHaveBeenCalledWith(
      '/api/v0/product/3017620422003.json',
    );
    expect(result).toEqual({
      name: 'Nutella',
      brand: 'Ferrero',
      description: 'Hazelnut spread',
      source: 'OFF',
      rawPayload: {
        status: 1,
        product: {
          product_name: 'Nutella',
          brands: 'Ferrero',
          generic_name: 'Hazelnut spread',
        },
      },
    });
  });

  it('should return undefined if product is not found', async () => {
    vi.mocked(axios.get).mockResolvedValue({
      data: {
        status: 0,
        status_verbose: 'product not found',
      },
    });

    const result = await client.fetchByBarcode('123456789');

    expect(result).toBeUndefined();
  });

  it('should handle network errors gracefully and return undefined', async () => {
    vi.mocked(axios.get).mockRejectedValue(new Error('Network error'));

    const result = await client.fetchByBarcode('123456789');

    expect(result).toBeUndefined();
  });
});
