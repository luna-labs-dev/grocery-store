import type { Market } from '../../entities';

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

export interface GetMarketList {
  execute(params: GetMarketListParams): Promise<GetMarketListResult>;
}
