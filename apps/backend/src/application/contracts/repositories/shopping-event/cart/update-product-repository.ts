import type { Product } from '@/domain';

export interface UpdateProductRepository {
  update: (product: Product) => Promise<void>;
}
