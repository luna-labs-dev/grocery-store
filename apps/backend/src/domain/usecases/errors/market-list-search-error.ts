import type { UseCaseError } from '@/domain';

export class MarketListSearchError extends Error implements UseCaseError {
  code: string;
  uuid?: string;

  constructor(uuid?: string) {
    super('The Market List search failed');
    this.name = 'MarketListSearchError';
    this.code = 'MARKET_LIST_SEARCH_ERROR';
    this.uuid = uuid;
  }
}
