import type { UseCaseError } from '@/domain/core';

export class EmptyCartError extends Error implements UseCaseError {
  code: string;
  uuid?: string;
  extras?: any;
  constructor(uuid?: string) {
    super('The Shopping Event cannot be ended with an empty cart');
    this.name = 'EmptyCartError';
    this.code = 'EMPTY_CART_ERROR';
    this.uuid = uuid;
  }
}
