import type { Product } from '@/domain';

export interface UpdateProductRepository {
  update(product: Product, transaction?: unknown): Promise<void>;
}
