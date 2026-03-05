import type { ShoppingEvent } from '../../entities';

export interface EndShoppingEventParams {
  shoppingEventId: string;
  groupId: string;
  totalPaid: number;
}

export interface EndShoppingEvent {
  execute(params: EndShoppingEventParams): Promise<ShoppingEvent>;
}
