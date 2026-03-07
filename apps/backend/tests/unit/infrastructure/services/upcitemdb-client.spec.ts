import 'reflect-metadata';
import { describe, expect, it, vi } from 'vitest';
import { UpcItemDbClient } from '@/infrastructure/services/upcitemdb-client';

describe('UpcItemDbClient', () => {
  it('should fetch product data by barcode successfully', async () => {
    const fakeFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        code: 'OK',
        items: [
          {
            ean: '123456789',
            title: 'Sample Product',
            brand: 'Sample Brand',
            description: 'Sample Description',
          },
        ],
      }),
    });
    global.fetch = fakeFetch;

    const client = new UpcItemDbClient();
    const result = await client.fetchByBarcode('123456789');

    expect(fakeFetch).toHaveBeenCalledWith(
      'https://api.upcitemdb.com/prod/trial/lookup?upc=123456789',
    );
    expect(result).toEqual({
      name: 'Sample Product',
      brand: 'Sample Brand',
      description: 'Sample Description',
    });
  });

  it('should return null if product is not found', async () => {
    const fakeFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        code: 'INVALID_UPC',
        items: [],
      }),
    });
    global.fetch = fakeFetch;

    const client = new UpcItemDbClient();
    const result = await client.fetchByBarcode('000');

    expect(result).toBeNull();
  });

  it('should handle network errors gracefully and return null', async () => {
    const fakeFetch = vi.fn().mockRejectedValue(new Error('Network error'));
    global.fetch = fakeFetch;

    const client = new UpcItemDbClient();
    const result = await client.fetchByBarcode('123456789');

    expect(result).toBeNull();
  });
});
