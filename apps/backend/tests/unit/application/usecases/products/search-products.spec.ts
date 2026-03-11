import 'reflect-metadata';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SearchProductsService } from '@/application/usecases/products/search-products-service';

describe('SearchProducts UseCase', () => {
  let service: SearchProductsService;
  const mockIdentityRepo = {
    getByValue: vi.fn(),
    add: vi.fn(),
  };
  const mockCanonicalRepo = {
    add: vi.fn(),
  };
  const mockExternalClient = {
    fetchByBarcode: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    service = new SearchProductsService(
      mockIdentityRepo as any,
      mockCanonicalRepo as any,
      mockExternalClient as any,
    );
  });

  it('should search local GlobalProduct database first', async () => {
    mockIdentityRepo.getByValue.mockResolvedValue({
      id: 'pi1',
      canonicalProductId: 'cp1',
    });

    await service.search('12345678');

    expect(mockIdentityRepo.getByValue).toHaveBeenCalledWith('EAN', '12345678');
    expect(mockExternalClient.fetchByBarcode).not.toHaveBeenCalled();
  });

  it('should call ExternalProductClient if not found locally', async () => {
    mockIdentityRepo.getByValue.mockResolvedValue(null);
    mockExternalClient.fetchByBarcode.mockResolvedValue({
      name: 'External Product',
      brand: 'Brand X',
      description: 'Desc',
    });

    const result = await service.search('12345678');

    expect(mockExternalClient.fetchByBarcode).toHaveBeenCalledWith('12345678');
    expect(mockCanonicalRepo.add).toHaveBeenCalled();
    expect(mockIdentityRepo.add).toHaveBeenCalled();
    expect(result?.name).toBe('External Product');
  });

  it('should handle external API failures gracefully (fallback to local only)', async () => {
    mockIdentityRepo.getByValue.mockResolvedValue(null);
    mockExternalClient.fetchByBarcode.mockRejectedValue(new Error('API Down'));

    const result = await service.search('12345678');

    expect(result).toBeNull();
    expect(mockCanonicalRepo.add).not.toHaveBeenCalled();
  });
});
