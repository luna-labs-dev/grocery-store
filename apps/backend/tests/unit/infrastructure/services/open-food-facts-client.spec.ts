import 'reflect-metadata';
import axios from 'axios';
import { beforeEach, describe, expect, it, type Mocked, vi } from 'vitest';
import { OpenFoodFactsClient } from '@/infrastructure/services/open-food-facts-client';
import type { Buidler } from '@/infrastructure/services/resilience/buidler';

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

describe('OpenFoodFactsClient', () => {
  let client: OpenFoodFactsClient;
  const mockBuilder = {
    createCircuitBreaker: vi.fn().mockReturnValue({
      execute: vi.fn((cb) => cb()),
    }),
  } as unknown as Mocked<Buidler>;

  beforeEach(() => {
    vi.clearAllMocks();
    client = new OpenFoodFactsClient(mockBuilder as unknown as never);
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
    });
  });

  it('should return null if product is not found', async () => {
    vi.mocked(axios.get).mockResolvedValue({
      data: {
        status: 0,
        status_verbose: 'product not found',
      },
    });

    const result = await client.fetchByBarcode('123456789');

    expect(result).toBeNull();
  });

  it('should handle network errors gracefully and return null', async () => {
    vi.mocked(axios.get).mockRejectedValue(new Error('Network error'));

    const result = await client.fetchByBarcode('123456789');

    expect(result).toBeNull();
  });
});
