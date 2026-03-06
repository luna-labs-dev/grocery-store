import type { ShoppingEvent } from '../../entities';

export interface GetShoppingEventByIdParams {
  userId: string;
  shoppingEventId: string;
  groupId: string;
}

export interface GetShoppingEventById {
  execute(params: GetShoppingEventByIdParams): Promise<ShoppingEvent>;
}
