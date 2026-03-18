import type { RequesterContext } from '../core/requester-context';
import type { ShoppingEvent, ShoppingEventStatus } from '../entities';
export interface StartShoppingEventParams {
  marketId: string;
}

export interface EndShoppingEventParams {
  shoppingEventId: string;
  totalPaid: number;
}

export interface GetShoppingEventListParams {
  status?: ShoppingEventStatus;
  period?: {
    start: Date;
    end: Date;
  };
  pageIndex: number;
  pageSize: number;
  orderBy: string;
  orderDirection: 'ASC' | 'DESC';
}

export interface GetShoppingEventListResult {
  total: number;
  shoppingEvents: ShoppingEvent[];
}

export interface GetShoppingEventByIdParams {
  shoppingEventId: string;
}

export interface IShoppingEventManager {
  startShoppingEvent(
    ctx: RequesterContext,
    params: StartShoppingEventParams,
  ): Promise<ShoppingEvent>;
  endShoppingEvent(
    ctx: RequesterContext,
    params: EndShoppingEventParams,
  ): Promise<ShoppingEvent>;
  getShoppingEventList(
    ctx: RequesterContext,
    params: GetShoppingEventListParams,
  ): Promise<GetShoppingEventListResult>;
  getShoppingEventById(
    ctx: RequesterContext,
    params: GetShoppingEventByIdParams,
  ): Promise<ShoppingEvent>;
}
