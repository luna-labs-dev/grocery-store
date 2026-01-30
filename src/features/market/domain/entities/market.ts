import type {
  Entity,
  FetchListResponse,
  NewResponse,
} from '../../../../domain/core';

export interface Market extends Entity {
  code: string;
  name: string;
  createdAt: Date;
  createdBy: string;
}

export interface GetMarketByIdParams {
  marketId?: string;
}

export interface NewMarketParams {
  marketName: string;
}

export interface UpdateMarketParams {
  marketId: string;
  marketName: string;
}

export interface MarketResponse extends NewResponse {
  code: string;
  name: string;
}

export interface MarketListItem extends Pick<Market, 'id' | 'code' | 'name'> {}

export interface MarketListResponse extends FetchListResponse<MarketListItem> {}
