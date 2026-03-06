import type { ShoppingEvent } from '../../entities';

export interface EndShoppingEventParams {
  userId: string;
  shoppingEventId: string;
  groupId: string;
  totalPaid: number;
}

export interface EndShoppingEvent {
  execute(params: EndShoppingEventParams): Promise<ShoppingEvent>;
}
