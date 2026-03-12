import type { AddProductIdentityRepository } from './add-product-identity-repository';
import type { GetProductIdentityByValueRepository } from './get-product-identity-by-value-repository';
import type { ProductIdentity } from '@/domain';

export type ProductIdentityRepositories = AddProductIdentityRepository &
  GetProductIdentityByValueRepository & {
    searchIdentities(query: string): Promise<ProductIdentity[]>;
  };

export * from './add-canonical-product-repository';
export * from './add-product-identity-repository';
export * from './get-canonical-product-by-id-repository';
export * from './get-product-identity-by-value-repository';
export * from './physical-ean-repository';
export * from './price-report-repository';
export * from './update-canonical-product-repository';
