import type { ShoppingEvent } from '../../entities';

export interface GetShoppingEventByIdParams {
  shoppingEventId: string;
  groupId: string;
}

export interface GetShoppingEventById {
  execute(params: GetShoppingEventByIdParams): Promise<ShoppingEvent>;
}
