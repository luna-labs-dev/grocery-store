import 'reflect-metadata';
import { beforeEach, describe, expect, it, type Mocked, vi } from 'vitest';
import type { ExternalProductClient } from '@/application/contracts/external-product-client';
import type { OutboxEventRepositories } from '@/application/contracts/repositories/outbox-event-repository';
import type { ProductIdentityRepository } from '@/application/contracts/repositories/product-identity-repository';
import { DbCartManager } from '@/application/usecases/db-cart-manager';

describe('DbCartManager.scanProduct', () => {
  let manager: DbCartManager;
  const mockProductIdentityRepo = {
    getByValue: vi.fn(),
  } as unknown as Mocked<ProductIdentityRepository>;

  const mockExternalService = {
    fetchByBarcode: vi.fn(),
  } as unknown as Mocked<ExternalProductClient>;

  const mockOutboxRepo = {
    add: vi.fn(),
  } as unknown as Mocked<OutboxEventRepositories>;

  beforeEach(() => {
    vi.clearAllMocks();
    manager = new DbCartManager(
      null as unknown as never,
      null as unknown as never,
      mockProductIdentityRepo,
      mockExternalService,
      mockOutboxRepo,
    );
  });

  it('should return found product if it exists in repository', async () => {
    mockProductIdentityRepo.getByValue.mockResolvedValue({
      id: 'p1',
      name: 'Existing Product',
      barcode: '123',
    } as unknown as never);

    const result = await manager.scanProduct({ barcode: '123' });

    expect(result.matchType).toBe('LOCAL');
    expect(result.product?.name).toBe('Existing Product');
  });

  it('should return matchType NOT_FOUND if not in repository and external fails', async () => {
    mockProductIdentityRepo.getByValue.mockResolvedValue(undefined);
    mockExternalService.fetchByBarcode.mockResolvedValue(undefined);

    const result = await manager.scanProduct({ barcode: '999' });

    expect(result.matchType).toBe('NOT_FOUND');
  });
});
