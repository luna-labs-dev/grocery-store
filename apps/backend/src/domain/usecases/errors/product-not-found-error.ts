import type { UseCaseError } from '@/domain/core';

export class ProductNotFoundError extends Error implements UseCaseError {
  code: string;
  uuid?: string;
  constructor(uuid?: string) {
    super('The Product was not found');
    this.name = 'ProductNotFoundError';
    this.code = 'PRODUCT_NOT_FOUND_ERROR';
    this.uuid = uuid;
  }
}
