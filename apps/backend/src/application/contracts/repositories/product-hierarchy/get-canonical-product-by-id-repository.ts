import type { CanonicalProduct } from '@/domain';

export interface GetCanonicalProductByIdRepository {
  getById: (id: string) => Promise<CanonicalProduct | undefined>;
}
