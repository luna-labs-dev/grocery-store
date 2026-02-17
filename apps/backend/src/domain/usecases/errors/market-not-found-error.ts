import type { UseCaseError } from '@/domain';

export class MarketNotFoundError extends Error implements UseCaseError {
  code: string;
  uuid?: string;

  constructor(uuid?: string) {
    super('The Market was not found');
    this.name = 'MarketNotFoundError';
    this.code = 'MARKET_NOT_FOUND_ERROR';
    this.uuid = uuid;
  }
}
