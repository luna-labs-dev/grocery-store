import 'reflect-metadata';
import { beforeEach, describe, expect, it, type Mocked, vi } from 'vitest';
import type { ProductIdentityRepository } from '@/application/contracts/repositories/product-identity-repository';
import { DbCartManager } from '@/application/usecases/db-cart-manager';
import type { RequesterContext } from '@/domain/core/requester-context';

describe('DbCartManager.manualSearch', () => {
  let manager: DbCartManager;
  const mockProductIdentityRepo = {
    search: vi.fn(),
    getById: vi.fn(),
  } as unknown as Mocked<ProductIdentityRepository>;

  const mockCtx = {
    checkPermission: vi.fn().mockResolvedValue(undefined),
  } as unknown as Mocked<RequesterContext>;

  beforeEach(() => {
    vi.clearAllMocks();
    manager = new DbCartManager(
      null as unknown as never,
      null as unknown as never,
      mockProductIdentityRepo,
      null as unknown as never,
      null as unknown as never,
    );
  });

  it('should return empty list if query is too short', async () => {
    const result = await manager.manualSearch(mockCtx, { query: 'a' });
    expect(result.items).toHaveLength(0);
    expect(mockProductIdentityRepo.search).not.toHaveBeenCalled();
  });

  it('should return results from repository for valid query', async () => {
    mockProductIdentityRepo.search.mockResolvedValue({
      items: [
        {
          id: 'pi1',
          name: 'Coca Cola',
          brand: 'Coca Cola',
          canonicalProductId: 'cp1',
        },
      ] as unknown as never,
      total: 1,
    });

    const result = await manager.manualSearch(mockCtx, { query: 'Coca' });

    expect(result.items).toHaveLength(1);
    expect(result.items[0].name).toBe('Coca Cola');
    expect(mockProductIdentityRepo.search).toHaveBeenCalledWith('Coca', 0, 10);
  });
});
