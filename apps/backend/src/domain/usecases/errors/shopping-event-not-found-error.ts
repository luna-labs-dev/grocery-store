import type { UseCaseError } from '@/domain/core';

export class ShoppingEventNotFoundError extends Error implements UseCaseError {
  code: string;
  uuid?: string;

  constructor(uuid?: string) {
    super('The Shopping Event was not found');
    this.name = 'ShoppingEventNotFoundError';
    this.code = 'SHOPPING_EVENT_NOT_FOUND_ERROR';
    this.uuid = uuid;
  }
}
