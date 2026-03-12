import 'reflect-metadata';
import axios from 'axios';
import { beforeEach, describe, expect, it, type Mocked, vi } from 'vitest';
import type { Buidler } from '@/infrastructure/services/resilience/buidler';
import { UpcItemDbClient } from '@/infrastructure/services/upcitemdb-client';

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

describe('UpcItemDbClient', () => {
  let client: UpcItemDbClient;
  const mockBuilder = {
    createCircuitBreaker: vi.fn().mockReturnValue({
      execute: vi.fn((cb) => cb()),
    }),
  } as unknown as Mocked<Buidler>;

  beforeEach(() => {
    vi.clearAllMocks();
    client = new UpcItemDbClient(mockBuilder as unknown as never);
  });

  it('should fetch product data by barcode successfully', async () => {
    vi.mocked(axios.get).mockResolvedValue({
      data: {
        code: 'OK',
        items: [
          {
            ean: '123456789',
            title: 'Sample Product',
            brand: 'Sample Brand',
            description: 'Sample Description',
          },
        ],
      },
    });

    const result = await client.fetchByBarcode('123456789');

    expect(axios.get).toHaveBeenCalledWith('/', {
      params: { upc: '123456789' },
    });
    expect(result).toEqual({
      name: 'Sample Product',
      brand: 'Sample Brand',
      description: 'Sample Description',
    });
  });

  it('should return null if product is not found', async () => {
    vi.mocked(axios.get).mockResolvedValue({
      data: {
        code: 'INVALID_UPC',
        items: [],
      },
    });

    const result = await client.fetchByBarcode('000');

    expect(result).toBeNull();
  });

  it('should handle network errors gracefully and return null', async () => {
    vi.mocked(axios.get).mockRejectedValue(new Error('Network error'));

    const result = await client.fetchByBarcode('123456789');

    expect(result).toBeNull();
  });
});
