import type { Market } from '@/domain';

export interface AddMarketsRepositoryParams {
  markets: Market[];
  latitude: number;
  longitude: number;
}

export interface AddMarketRepository {
  add: (market: Market) => Promise<void>;
  addMany: (params: AddMarketsRepositoryParams) => Promise<Market[]>;
}
