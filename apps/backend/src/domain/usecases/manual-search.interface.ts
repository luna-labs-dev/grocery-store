import type { ProductIdentity } from '@/domain/entities/product-identity';

export interface IManualSearchUseCase {
  execute(
    query: string,
    pageIndex?: number,
    pageSize?: number,
  ): Promise<{ items: ProductIdentity[]; total: number }>;
}
