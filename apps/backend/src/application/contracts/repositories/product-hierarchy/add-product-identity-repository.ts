import type { ProductIdentity } from '@/domain';

export interface AddProductIdentityRepository {
  add: (
    productIdentity: ProductIdentity,
    transaction?: unknown,
  ) => Promise<void>;
}
