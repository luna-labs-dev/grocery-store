import type { ProductIdentity } from '@/domain/entities/product-identity';

export interface ProductIdentityRepository {
  getById(id: string): Promise<ProductIdentity | undefined>;
  getByValue(type: string, value: string): Promise<ProductIdentity | undefined>;
  save(identity: ProductIdentity): Promise<void>;
  add(identity: ProductIdentity): Promise<void>;
  search(
    query: string,
    pageIndex: number,
    pageSize: number,
  ): Promise<{ items: ProductIdentity[]; total: number }>;
}
