import 'reflect-metadata';
import { describe, expect, it, vi } from 'vitest';
import { OpenFoodFactsClient } from '@/infrastructure/services/open-food-facts-client';

describe('OpenFoodFactsClient', () => {
  it('should fetch product data by barcode successfully', async () => {
    // We will use global fetch and mock it
    const fakeFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        status: 1,
        product: {
          product_name: 'Nutella',
          brands: 'Ferrero',
          generic_name: 'Hazelnut spread',
        },
      }),
    });
    global.fetch = fakeFetch;

    const client = new OpenFoodFactsClient();
    const result = await client.fetchByBarcode('3017620422003');

    expect(fakeFetch).toHaveBeenCalledWith(
      'https://world.openfoodfacts.org/api/v0/product/3017620422003.json',
    );
    expect(result).toEqual({
      name: 'Nutella',
      brand: 'Ferrero',
      description: 'Hazelnut spread',
    });
  });

  it('should return null if product is not found', async () => {
    const fakeFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        status: 0,
        status_verbose: 'product not found',
      }),
    });
    global.fetch = fakeFetch;

    const client = new OpenFoodFactsClient();
    const result = await client.fetchByBarcode('123456789');

    expect(result).toBeNull();
  });

  it('should handle network errors gracefully and return null', async () => {
    const fakeFetch = vi.fn().mockRejectedValue(new Error('Network error'));
    global.fetch = fakeFetch;

    const client = new OpenFoodFactsClient();
    const result = await client.fetchByBarcode('123456789');

    expect(result).toBeNull();
  });
});
