import type { Market } from '../entities';

export interface GetMarketByIdParams {
  marketId: string;
}

export interface GetMarketListParams {
  search?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  expand?: boolean;
  pageIndex: number;
  pageSize: number;
  orderBy: 'createdAt' | 'distance';
  orderDirection: 'desc' | 'asc';
}

export interface GetMarketListResult {
  total: number;
  markets: Market[];
}

export interface IMarketManager {
  getMarketById(params: GetMarketByIdParams): Promise<Market>;
  getMarketList(params: GetMarketListParams): Promise<GetMarketListResult>;
}
