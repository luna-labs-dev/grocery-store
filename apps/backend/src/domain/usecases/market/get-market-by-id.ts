import type { Market } from '../../entities';

export interface GetMarketByIdParams {
  marketId: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}
export interface GetMarketById {
  execute(params: GetMarketByIdParams): Promise<Market>;
}
