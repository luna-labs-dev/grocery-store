import type { CanonicalProduct } from '@/domain';

export interface AddCanonicalProductRepository {
  add: (canonicalProduct: CanonicalProduct, transaction?: any) => Promise<void>;
}
