import type { ProductIdentity } from '@/domain';

export interface GetProductIdentityByValueRepository {
  getByValue: (
    type: string,
    value: string,
  ) => Promise<ProductIdentity | undefined>;
}
