import type { ShoppingEvent } from '../../entities';

export interface GetShoppingEventByIdParams {
  familyId: string;
  shoppingEventId: string;
}

export interface GetShoppingEventById {
  execute(params: GetShoppingEventByIdParams): Promise<ShoppingEvent>;
}
