import type { Product } from '@/domain';

export interface AddProductRepository {
  add(product: Product, transaction?: unknown): Promise<void>;
}
