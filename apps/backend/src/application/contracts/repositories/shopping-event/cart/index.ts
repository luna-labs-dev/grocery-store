import type { AddProductRepository } from './add-product-repository';
import type { RemoveProductRepository } from './remove-product-repository';
import type { UpdateProductRepository } from './update-product-repository';

export * from './add-product-repository';
export * from './remove-product-repository';
export * from './update-product-repository';

export type ProductRepositories = AddProductRepository &
  UpdateProductRepository &
  RemoveProductRepository;
