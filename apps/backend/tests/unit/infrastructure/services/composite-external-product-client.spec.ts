import { beforeEach, describe, expect, it, type Mocked, vi } from 'vitest';
import 'reflect-metadata';
import type { ExternalProductClient } from '@/application/contracts/services/external-product-client';
import { CompositeExternalProductClient } from '@/infrastructure/services/composite-external-product-client';

describe('CompositeExternalProductClient', () => {
  let offClient: Mocked<ExternalProductClient>;
  let upcClient: Mocked<ExternalProductClient>;
  let compositeClient: CompositeExternalProductClient;

  beforeEach(() => {
    offClient = {
      fetchByBarcode: vi.fn(),
    } as unknown as Mocked<ExternalProductClient>;
    upcClient = {
      fetchByBarcode: vi.fn(),
    } as unknown as Mocked<ExternalProductClient>;
    compositeClient = new CompositeExternalProductClient(offClient, upcClient);
  });

  it('should return result from primary client (OFF) if found', async () => {
    vi.mocked(offClient.fetchByBarcode).mockResolvedValue({
      barcode: '123',
      name: 'Primary Product',
      brand: 'Primary Brand',
      imageUrl: 'http://image.url',
      rawResponse: {},
      source: 'OFF',
    });
    vi.mocked(upcClient.fetchByBarcode).mockResolvedValue(null);

    const result = await compositeClient.fetchByBarcode('123');

    expect(result).toEqual(
      expect.objectContaining({
        name: 'Primary Product',
        brand: 'Primary Brand',
      }),
    );
    expect(offClient.fetchByBarcode).toHaveBeenCalledWith('123');
    expect(upcClient.fetchByBarcode).not.toHaveBeenCalled();
  });

  it('should return result from fallback client (UPC) if primary fails/not found', async () => {
    vi.mocked(offClient.fetchByBarcode).mockResolvedValue(null);
    vi.mocked(upcClient.fetchByBarcode).mockResolvedValue({
      barcode: '123',
      name: 'Fallback Product',
      brand: 'Fallback Brand',
      imageUrl: 'http://image.url',
      rawResponse: {},
      source: 'UPCITEMDB',
    });

    const result = await compositeClient.fetchByBarcode('123');

    expect(result).toEqual(
      expect.objectContaining({ name: 'Fallback Product' }),
    );
    expect(offClient.fetchByBarcode).toHaveBeenCalledWith('123');
    expect(upcClient.fetchByBarcode).toHaveBeenCalledWith('123');
  });

  it('should return null if both fail', async () => {
    vi.mocked(offClient.fetchByBarcode).mockResolvedValue(null);
    vi.mocked(upcClient.fetchByBarcode).mockResolvedValue(null);

    const result = await compositeClient.fetchByBarcode('123');

    expect(result).toBeNull();
  });
});
