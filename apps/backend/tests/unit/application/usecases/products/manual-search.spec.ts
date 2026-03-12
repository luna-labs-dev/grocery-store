import 'reflect-metadata';
import { beforeEach, describe, expect, it, type Mocked, vi } from 'vitest';
import type { ProductIdentityRepository } from '@/application/contracts/repositories/product-identity-repository';
import { ManualSearchUseCase } from '@/application/usecases/products/manual-search-use-case';

describe('ManualSearchUseCase', () => {
  let useCase: ManualSearchUseCase;
  const mockProductIdentityRepo = {
    search: vi.fn(),
    getById: vi.fn(),
  } as unknown as Mocked<ProductIdentityRepository>;

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = new ManualSearchUseCase(mockProductIdentityRepo);
  });

  it('should return empty list if query is too short', async () => {
    const result = await useCase.execute('a');
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

    const result = await useCase.execute('Coca');

    expect(result.items).toHaveLength(1);
    expect(result.items[0].name).toBe('Coca Cola');
    expect(mockProductIdentityRepo.search).toHaveBeenCalledWith('Coca', 0, 10);
  });
});
