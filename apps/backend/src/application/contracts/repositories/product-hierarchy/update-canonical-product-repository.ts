import type { CanonicalProduct } from '@/domain/entities';

export interface UpdateCanonicalProductRepository {
  update(canonicalProduct: CanonicalProduct): Promise<void>;
}
