import type { Product } from './product';
import type { ShoppingEventStatus } from './status';
import type { Entity, FetchListParams, FetchListResponse } from '@/domain';
import type { Market } from '@/features/market';

export interface ShoppingEventCalculatedTotals {
  retailTotal: number;
  wholesaleTotal: number;
  paidValue: number;
  savingsValue: number;
  savingsPercentage: number;
  retailPaidDifferenceValue?: number;
  wholesalePaidDifferenceValue?: number;
  totalItemsDistinct: number;
  totalItemsQuantity: number;
  averagePricePerUnit: number;
  highestPrice: number;
  lowestPrice: number;
}

export interface ShoppingEvent extends Entity {
  status: ShoppingEventStatus;
  market: Market;
  totals: ShoppingEventCalculatedTotals;
  products: Product[];
  createdAt: Date;
  finishedAt?: Date;
  createdBy: string;
}

type ShoppingEventSortBy = keyof Pick<ShoppingEvent, 'createdAt'>;

export interface FetchShoppingEventListPeriod {
  start: Date;
  end: Date;
}

export interface FetchShoppingEventListParams
  extends FetchListParams<ShoppingEventSortBy> {
  status?: ShoppingEventStatus;
  period?: FetchShoppingEventListPeriod;
}

export interface ShoppingEventListItem
  extends Pick<ShoppingEvent, 'id' | 'status' | 'createdAt'> {
  market: string;
  totals: Pick<
    ShoppingEventCalculatedTotals,
    | 'retailTotal'
    | 'wholesaleTotal'
    | 'totalItemsDistinct'
    | 'totalItemsQuantity'
    | 'savingsPercentage'
  >;
}

export interface ShoppingEventListResponse
  extends FetchListResponse<ShoppingEventListItem> {}

export interface GetShoppingEventByIdParams {
  shoppingEventId?: string;
}

export interface StartShoppingEventParams {
  marketId: string;
}

export interface StartShoppingEventResult {
  id: string;
  market: string;
  status: string;
  createdAt: Date;
}

export interface EndShoppingEventParams {
  shoppingEventId: string;
  params: {
    totalPaid: number;
  };
}

export interface EndShoppingEventResult
  extends Omit<ShoppingEvent, 'products'> {}

export interface ProductCartMutation {
  shoppingEventId?: string;
}
