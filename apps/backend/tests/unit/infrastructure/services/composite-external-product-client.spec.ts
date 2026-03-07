import { beforeEach, describe, expect, it, vi } from 'vitest';
import 'reflect-metadata';
import { CompositeExternalProductClient } from '@/infrastructure/services/composite-external-product-client';
import { OpenFoodFactsClient } from '@/infrastructure/services/open-food-facts-client';
import { UpcItemDbClient } from '@/infrastructure/services/upcitemdb-client';

describe('CompositeExternalProductClient', () => {
  let offClient: OpenFoodFactsClient;
  let upcClient: UpcItemDbClient;
  let compositeClient: CompositeExternalProductClient;

  beforeEach(() => {
    offClient = new OpenFoodFactsClient();
    upcClient = new UpcItemDbClient();
    compositeClient = new CompositeExternalProductClient(offClient, upcClient);
  });

  it('should return result from primary client (OFF) if found', async () => {
    vi.spyOn(offClient, 'fetchByBarcode').mockResolvedValue({
      name: 'Primary Product',
      brand: 'Primary Brand',
    });
    const upcSpy = vi
      .spyOn(upcClient, 'fetchByBarcode')
      .mockResolvedValue(null);

    const result = await compositeClient.fetchByBarcode('123');

    expect(result).toEqual({ name: 'Primary Product', brand: 'Primary Brand' });
    expect(offClient.fetchByBarcode).toHaveBeenCalledWith('123');
    expect(upcSpy).not.toHaveBeenCalled();
  });

  it('should return result from fallback client (UPC) if primary fails/not found', async () => {
    vi.spyOn(offClient, 'fetchByBarcode').mockResolvedValue(null);
    vi.spyOn(upcClient, 'fetchByBarcode').mockResolvedValue({
      name: 'Fallback Product',
    });

    const result = await compositeClient.fetchByBarcode('123');

    expect(result).toEqual({ name: 'Fallback Product' });
    expect(offClient.fetchByBarcode).toHaveBeenCalledWith('123');
    expect(upcClient.fetchByBarcode).toHaveBeenCalledWith('123');
  });

  it('should return null if both fail', async () => {
    vi.spyOn(offClient, 'fetchByBarcode').mockResolvedValue(null);
    vi.spyOn(upcClient, 'fetchByBarcode').mockResolvedValue(null);

    const result = await compositeClient.fetchByBarcode('123');

    expect(result).toBeNull();
  });
});
