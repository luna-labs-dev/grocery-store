import type {
  Entity,
  FetchListParams,
  FetchListResponse,
} from '../../../../domain/core';

export interface Market extends Entity {
  name: string;
  formattedAddress: string;
  city: string;
  neighborhood: string;
  latitude: number;
  longitude: number;
  distance?: number;
  createdAt: Date;
  lastUpdatedAt: Date;
}

export interface GetMarketByIdParams {
  marketId?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface GetMarketListParams extends FetchListParams {
  location: {
    latitude: number;
    longitude: number;
  };
  expand?: boolean;
}

export interface MarketListItem
  extends Pick<Market, 'id' | 'name' | 'city' | 'neighborhood' | 'distance'> {}

export interface MarketListResponse extends FetchListResponse<MarketListItem> {}
