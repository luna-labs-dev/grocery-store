import 'reflect-metadata';
import { beforeEach, describe, expect, it, type Mocked, vi } from 'vitest';
import type { ExternalProductClient } from '@/application/contracts';
import type {
  AddCanonicalProductRepository,
  AddProductIdentityRepository,
  GetProductIdentityByValueRepository,
} from '@/application/contracts/repositories/product-hierarchy';
import { SearchProductsService } from '@/application/usecases/products/search-products-service';

describe('SearchProducts UseCase', () => {
  let service: SearchProductsService;
  const mockIdentityRepo = {
    getByValue: vi.fn(),
    add: vi.fn(),
  } as unknown as Mocked<
    GetProductIdentityByValueRepository & AddProductIdentityRepository
  >;
  const mockCanonicalRepo = {
    add: vi.fn(),
  } as unknown as Mocked<AddCanonicalProductRepository>;
  const mockExternalClient = {
    fetchByBarcode: vi.fn(),
  } as unknown as Mocked<ExternalProductClient>;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new SearchProductsService(
      mockIdentityRepo,
      mockCanonicalRepo,
      mockExternalClient,
    );
  });

  it('should search local GlobalProduct database first', async () => {
    vi.mocked(mockIdentityRepo.getByValue).mockResolvedValue({
      id: 'pi1',
      canonicalProductId: 'cp1',
    } as unknown as never);

    await service.search('12345678');

    expect(mockIdentityRepo.getByValue).toHaveBeenCalledWith('EAN', '12345678');
    expect(mockExternalClient.fetchByBarcode).not.toHaveBeenCalled();
  });

  it('should call ExternalProductClient if not found locally', async () => {
    vi.mocked(mockIdentityRepo.getByValue).mockResolvedValue(
      undefined as never,
    );
    vi.mocked(mockExternalClient.fetchByBarcode).mockResolvedValue({
      name: 'External Product',
      brand: 'Brand X',
      description: 'Desc',
      imageUrl: 'http://image.url',
    });

    const result = await service.search('12345678');

    expect(mockExternalClient.fetchByBarcode).toHaveBeenCalledWith('12345678');
    expect(mockCanonicalRepo.add).toHaveBeenCalled();
    expect(mockIdentityRepo.add).toHaveBeenCalled();
    expect(result?.name).toBe('External Product');
  });

  it('should handle external API failures gracefully (fallback to local only)', async () => {
    vi.mocked(mockIdentityRepo.getByValue).mockResolvedValue(
      undefined as never,
    );
    vi.mocked(mockExternalClient.fetchByBarcode).mockRejectedValue(
      new Error('API Down'),
    );

    const result = await service.search('12345678');

    expect(result).toBeNull();
    expect(mockCanonicalRepo.add).not.toHaveBeenCalled();
  });
});
