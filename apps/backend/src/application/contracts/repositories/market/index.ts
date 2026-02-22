import type { AddMarketRepository } from './add-market-repository';
import type { GetMarketByIdRepository } from './get-market-by-id-repository';
import type { GetMarketListRepository } from './get-market-list-repository';
import type { UpdateMarketRepository } from './update-market-repository';

export type MarketRepositories = AddMarketRepository &
  UpdateMarketRepository &
  GetMarketByIdRepository &
  GetMarketListRepository;

export * from './add-market-repository';
export * from './get-market-by-id-repository';
export * from './get-market-list-repository';
export * from './update-market-repository';
