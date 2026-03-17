import 'reflect-metadata';
import { beforeEach, describe, expect, it, type Mocked, vi } from 'vitest';
import type {
  ExternalProductClient,
  ExternalProductMatch,
} from '@/application/contracts/external-product-client';
import type { OutboxEventRepositories as OutboxRepository } from '@/application/contracts/repositories/outbox-event-repository';
import type { ProductIdentityRepository } from '@/application/contracts/repositories/product-identity-repository';
import { ScanProductUseCase } from '@/application/usecases/products/scan-product-use-case';

describe('ScanProductUseCase', () => {
  let useCase: ScanProductUseCase;
  const mockProductIdentityRepo = {
    getByValue: vi.fn(),
  } as unknown as Mocked<ProductIdentityRepository>;
  const mockExternalClient = {
    fetchByBarcode: vi.fn(),
  } as unknown as Mocked<ExternalProductClient>;
  const mockOutboxRepo = {
    add: vi.fn(),
    getPending: vi.fn(),
    update: vi.fn(),
  } as unknown as Mocked<OutboxRepository>;

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = new ScanProductUseCase(
      mockProductIdentityRepo,
      mockExternalClient,
      mockOutboxRepo,
    );
  });

  it('should return VARIABLE_WEIGHT for barcodes starting with 2', async () => {
    const barcode = '2012340050007'; // Price 5.00
    const result = await useCase.execute(barcode);

    expect(result.matchType).toBe('VARIABLE_WEIGHT');
    expect(result.variableWeight?.totalPrice).toEqual(5.0);

    expect(result.requiresPriceConfirmation).toBe(true);
  });

  it('should return LOCAL for internal matches and require confirmation', async () => {
    const barcode = '7891234567890';
    const mockProduct = {
      id: 'pi1',
      name: 'Coca Cola',
      brand: 'Coca Cola',
      imageUrl: 'http://image.url',
    } as unknown as never;

    vi.mocked(mockProductIdentityRepo.getByValue).mockResolvedValue(
      mockProduct,
    );

    const result = await useCase.execute(barcode);

    expect(result.matchType).toBe('LOCAL');
    expect(result.product).toEqual(mockProduct);
    expect(result.requiresPriceConfirmation).toBe(true);
    expect(mockProductIdentityRepo.getByValue).toHaveBeenCalledWith(
      'EAN',
      barcode,
    );
  });

  it('should return EXTERNAL, require confirmation, and emit outbox event if not found locally', async () => {
    const barcode = '3017620422003';
    const externalResult: ExternalProductMatch = {
      name: 'Nutella',
      brand: 'Ferrero',
      imageUrl: 'http://nutella.url',
      rawPayload: { foo: 'bar' },
      source: 'OFF',
    };

    vi.mocked(mockProductIdentityRepo.getByValue).mockResolvedValue(undefined);
    vi.mocked(mockExternalClient.fetchByBarcode).mockResolvedValue(
      externalResult,
    );

    const result = await useCase.execute(barcode);

    expect(result.matchType).toBe('EXTERNAL');
    expect(result.product?.name).toBe('Nutella');
    expect(result.requiresPriceConfirmation).toBe(true);
    expect(mockOutboxRepo.add).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'ProductScanned',
        payload: expect.objectContaining({
          barcode,
          source: externalResult.source,
        }),
      }),
    );
  });

  it('should return NOT_FOUND if no local and no external match', async () => {
    const barcode = '0000000000000';
    vi.mocked(mockProductIdentityRepo.getByValue).mockResolvedValue(undefined);
    vi.mocked(mockExternalClient.fetchByBarcode).mockResolvedValue(undefined);

    const result = await useCase.execute(barcode);

    expect(result.matchType).toBe('NOT_FOUND');
    expect(mockOutboxRepo.add).not.toHaveBeenCalled();
  });
});
