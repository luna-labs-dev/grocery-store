import type { UseCaseError } from '@/domain/core';

export class MarketAlreadyExistsError extends Error implements UseCaseError {
  code: string;
  uuid?: string;

  constructor() {
    super('This market already exists');
    this.name = 'MarketAlreadyExistsError';
    this.code = 'MARKET_ALREADY_EXISTS_ERROR';
  }
}
